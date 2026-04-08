<?php

namespace App\Http\Controllers;

use App\Models\FinishedGoodsStock;
use App\Models\Product;
use App\Models\Production;
use App\Models\Tank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductionController extends Controller
{
    public function index(Request $request)
    {
        $productions = Production::query()
            ->with(['product:id,name,sell_unit,pcs_per_unit', 'tank:id,name', 'user:id,name'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $products = Product::where('is_active', true)
            ->with('materials:id,name')
            ->get(['id', 'name', 'sell_unit', 'pcs_per_unit', 'liters_per_pcs', 'tank_type']);

        $tanks = Tank::where('slug', '!=', 'utama')
            ->get(['id', 'name', 'slug', 'current_volume_liters']);

        return Inertia::render('manufacturing/packaging', [
            'productions' => $productions,
            'products' => $products,
            'tanks' => $tanks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'qty_produced_pcs' => 'required|integer|min:1',
            'qty_reject_pcs' => 'integer|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $product = Product::with('materials')->findOrFail($validated['product_id']);
        $tank = Tank::where('slug', $product->tank_type)->firstOrFail();

        $totalPcs = $validated['qty_produced_pcs'] + ($validated['qty_reject_pcs'] ?? 0);
        $litersNeeded = $totalPcs * $product->liters_per_pcs;

        // Validate tank volume
        if ($tank->current_volume_liters < $litersNeeded) {
            return redirect()->back()->withErrors([
                'qty_produced_pcs' => "Volume {$tank->name} tidak mencukupi. Dibutuhkan: {$litersNeeded}L, Tersedia: {$tank->current_volume_liters}L",
            ]);
        }

        // Validate material stock
        foreach ($product->materials as $material) {
            $needed = $totalPcs * $material->pivot->qty_needed;
            if ($material->current_stock < $needed) {
                return redirect()->back()->withErrors([
                    'qty_produced_pcs' => "Stok {$material->name} tidak mencukupi. Dibutuhkan: {$needed}, Tersedia: {$material->current_stock}",
                ]);
            }
        }

        DB::transaction(function () use ($validated, $product, $tank, $totalPcs, $litersNeeded, $request) {
            // Create production record
            Production::create([
                ...$validated,
                'user_id' => $request->user()->id,
                'tank_id' => $tank->id,
                'liters_used' => $litersNeeded,
            ]);

            // Deduct tank volume
            $tank->decrement('current_volume_liters', $litersNeeded);

            // Deduct materials
            foreach ($product->materials as $material) {
                $needed = $totalPcs * $material->pivot->qty_needed;
                $material->decrement('current_stock', $needed);
            }

            // Add finished goods (only produced, not reject)
            $stock = FinishedGoodsStock::firstOrCreate(
                ['product_id' => $product->id],
                ['stock_pcs' => 0]
            );
            $stock->increment('stock_pcs', $validated['qty_produced_pcs']);
        });

        return redirect()->back()->with('success', 'Produksi berhasil dicatat.');
    }
}
