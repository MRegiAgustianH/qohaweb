<?php

namespace App\Http\Controllers;

use App\Models\FinishedGoodsStock;
use App\Models\Material;
use App\Models\StockAdjustment;
use App\Models\Tank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function tanks()
    {
        $tanks = Tank::all();

        return Inertia::render('inventory/tanks', [
            'tanks' => $tanks,
        ]);
    }

    public function updateTank(Request $request, Tank $tank)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'capacity_liters' => 'required|numeric|min:1',
        ]);

        $tank->update($validated);

        return redirect()->back()->with('success', 'Tangki berhasil diperbarui.');
    }

    public function materials()
    {
        $materials = Material::all();

        return Inertia::render('inventory/materials', [
            'materials' => $materials,
        ]);
    }

    public function finishedGoods()
    {
        $stocks = FinishedGoodsStock::with('product:id,name,sell_unit,pcs_per_unit,price,image_path')
            ->get();

        return Inertia::render('inventory/finished-goods', [
            'stocks' => $stocks,
        ]);
    }

    public function stockAdjustment()
    {
        $tanks = Tank::all(['id', 'name', 'slug', 'current_volume_liters']);
        $materials = Material::all(['id', 'name', 'unit', 'current_stock']);
        $finishedGoods = FinishedGoodsStock::with('product:id,name,sell_unit,pcs_per_unit')
            ->get();

        $recentAdjustments = StockAdjustment::with('user:id,name')
            ->latest()
            ->take(20)
            ->get();

        return Inertia::render('inventory/stock-adjustment', [
            'tanks' => $tanks,
            'materials' => $materials,
            'finishedGoods' => $finishedGoods,
            'recentAdjustments' => $recentAdjustments,
        ]);
    }

    public function storeAdjustment(Request $request)
    {
        $validated = $request->validate([
            'adjustable_type' => 'required|in:tank,material,finished_good',
            'adjustable_id' => 'required|integer',
            'new_value' => 'required|numeric|min:0',
            'reason' => 'required|string|max:500',
        ]);

        $type = $validated['adjustable_type'];
        $id = $validated['adjustable_id'];
        $newValue = $validated['new_value'];

        // Determine old value and update
        switch ($type) {
            case 'tank':
                $tank = Tank::findOrFail($id);
                $oldValue = $tank->current_volume_liters;
                $unit = 'liter';
                $tank->update(['current_volume_liters' => $newValue]);
                break;

            case 'material':
                $material = Material::findOrFail($id);
                $oldValue = $material->current_stock;
                $unit = $material->unit;
                $material->update(['current_stock' => (int) $newValue]);
                break;

            case 'finished_good':
                $stock = FinishedGoodsStock::findOrFail($id);
                $oldValue = $stock->stock_pcs;
                $unit = 'pcs';
                $stock->update(['stock_pcs' => (int) $newValue]);
                break;
        }

        StockAdjustment::create([
            'adjustable_type' => $type,
            'adjustable_id' => $id,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'unit' => $unit,
            'reason' => $validated['reason'],
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Penyesuaian stok berhasil dicatat.');
    }
}
