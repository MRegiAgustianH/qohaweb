<?php

namespace App\Http\Controllers;

use App\Models\FinishedGoodsStock;
use App\Models\Material;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->with(['finishedGoodsStock', 'materials'])
            ->orderBy('sort_order')
            ->paginate(15)
            ->withQueryString();

        $materials = Material::all(['id', 'name', 'unit']);

        return Inertia::render('products/index', [
            'products' => $products,
            'materials' => $materials,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0',
            'sell_unit' => 'required|in:Pcs,Dus',
            'pcs_per_unit' => 'required|integer|min:1',
            'liters_per_pcs' => 'required|numeric|min:0',
            'tank_type' => 'required|in:gelas,botol,galon',
            'is_active' => 'boolean',
            'show_in_catalog' => 'boolean',
            'sort_order' => 'integer|min:0',
            'image' => 'nullable|image|max:2048',
            'materials' => 'nullable|array',
            'materials.*.id' => 'exists:materials,id',
            'materials.*.qty_needed' => 'integer|min:1',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        unset($validated['image'], $validated['materials']);

        $product = Product::create($validated);

        // Create finished goods stock
        FinishedGoodsStock::create([
            'product_id' => $product->id,
            'stock_pcs' => 0,
        ]);

        // Sync materials
        if ($request->has('materials')) {
            $materialsData = collect($request->materials)->mapWithKeys(function ($item) {
                return [$item['id'] => ['qty_needed' => $item['qty_needed']]];
            })->all();
            $product->materials()->sync($materialsData);
        }

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan.');
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'price' => 'required|numeric|min:0',
            'sell_unit' => 'required|in:Pcs,Dus',
            'pcs_per_unit' => 'required|integer|min:1',
            'liters_per_pcs' => 'required|numeric|min:0',
            'tank_type' => 'required|in:gelas,botol,galon',
            'is_active' => 'boolean',
            'show_in_catalog' => 'boolean',
            'sort_order' => 'integer|min:0',
            'image' => 'nullable|image|max:2048',
            'materials' => 'nullable|array',
            'materials.*.id' => 'exists:materials,id',
            'materials.*.qty_needed' => 'integer|min:1',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('products', 'public');
        }

        unset($validated['image'], $validated['materials']);

        $product->update($validated);

        // Sync materials
        if ($request->has('materials')) {
            $materialsData = collect($request->materials)->mapWithKeys(function ($item) {
                return [$item['id'] => ['qty_needed' => $item['qty_needed']]];
            })->all();
            $product->materials()->sync($materialsData);
        }

        return redirect()->back()->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        if ($product->orderItems()->exists() || $product->productions()->exists()) {
            return redirect()->back()->with('error', 'Produk tidak bisa dihapus karena memiliki riwayat transaksi.');
        }

        $product->finishedGoodsStock?->delete();
        $product->materials()->detach();
        $product->delete();

        return redirect()->back()->with('success', 'Produk berhasil dihapus.');
    }
}
