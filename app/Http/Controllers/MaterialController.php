<?php

namespace App\Http\Controllers;

use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $materials = Material::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->withCount('products')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('materials/index', [
            'materials' => $materials,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:materials,name',
            'unit' => 'required|string|max:20',
            'current_stock' => 'integer|min:0',
        ]);

        Material::create($validated);

        return redirect()->back()->with('success', 'Material berhasil ditambahkan.');
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:materials,name,' . $material->id,
            'unit' => 'required|string|max:20',
        ]);

        $material->update($validated);

        return redirect()->back()->with('success', 'Material berhasil diperbarui.');
    }

    public function destroy(Material $material)
    {
        if ($material->products()->exists()) {
            return redirect()->back()->with('error', 'Material tidak bisa dihapus karena terhubung dengan produk.');
        }

        $material->delete();

        return redirect()->back()->with('success', 'Material berhasil dihapus.');
    }
}
