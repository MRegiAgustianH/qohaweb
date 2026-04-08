<?php

namespace App\Http\Controllers;

use App\Models\Cashflow;
use App\Models\RawWaterPurchase;
use App\Models\Supplier;
use App\Models\Tank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RawWaterPurchaseController extends Controller
{
    public function index(Request $request)
    {
        $purchases = RawWaterPurchase::query()
            ->with(['supplier:id,name', 'user:id,name'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('supplier', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $suppliers = Supplier::where('is_active', true)->get(['id', 'name', 'price_per_liter']);
        $mainTank = Tank::where('slug', 'utama')->first(['id', 'name', 'current_volume_liters', 'capacity_liters']);

        return Inertia::render('manufacturing/purchase', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'mainTank' => $mainTank,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'liters' => 'required|numeric|min:0.01',
            'price_per_liter' => 'required|numeric|min:0',
            'purchase_date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        $totalCost = $validated['liters'] * $validated['price_per_liter'];

        DB::transaction(function () use ($validated, $totalCost, $request) {
            // Create purchase record
            $purchase = RawWaterPurchase::create([
                ...$validated,
                'total_cost' => $totalCost,
                'user_id' => $request->user()->id,
            ]);

            // Add volume to main tank
            $mainTank = Tank::where('slug', 'utama')->firstOrFail();
            $mainTank->increment('current_volume_liters', $validated['liters']);

            // Create cashflow expense
            Cashflow::create([
                'type' => Cashflow::TYPE_EXPENSE,
                'category' => Cashflow::CATEGORY_RAW_WATER_PURCHASE,
                'amount' => $totalCost,
                'description' => "Pembelian air mentah {$validated['liters']}L dari " . Supplier::find($validated['supplier_id'])->name,
                'reference_id' => $purchase->id,
                'reference_type' => RawWaterPurchase::class,
                'user_id' => $request->user()->id,
                'transaction_date' => $validated['purchase_date'],
            ]);
        });

        return redirect()->back()->with('success', 'Pembelian air mentah berhasil dicatat.');
    }
}
