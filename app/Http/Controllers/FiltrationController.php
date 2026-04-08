<?php

namespace App\Http\Controllers;

use App\Models\Filtration;
use App\Models\Tank;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FiltrationController extends Controller
{
    public function index(Request $request)
    {
        $filtrations = Filtration::query()
            ->with(['user:id,name', 'sourceTank:id,name', 'destinationTank:id,name'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $tanks = Tank::all(['id', 'name', 'slug', 'current_volume_liters', 'capacity_liters']);

        return Inertia::render('manufacturing/filtration', [
            'filtrations' => $filtrations,
            'tanks' => $tanks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_tank_id' => 'required|exists:tanks,id',
            'destination_tank_id' => 'required|exists:tanks,id|different:source_tank_id',
            'liters_transferred' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:1000',
        ]);

        $sourceTank = Tank::findOrFail($validated['source_tank_id']);
        $destinationTank = Tank::findOrFail($validated['destination_tank_id']);

        // Validate source has enough volume
        if ($sourceTank->current_volume_liters < $validated['liters_transferred']) {
            return redirect()->back()->withErrors([
                'liters_transferred' => "Volume di {$sourceTank->name} tidak mencukupi. Tersedia: {$sourceTank->current_volume_liters}L",
            ]);
        }

        // Validate destination capacity
        $remainingCapacity = $destinationTank->capacity_liters - $destinationTank->current_volume_liters;
        if ($validated['liters_transferred'] > $remainingCapacity) {
            return redirect()->back()->withErrors([
                'liters_transferred' => "Kapasitas {$destinationTank->name} tidak cukup. Sisa kapasitas: {$remainingCapacity}L",
            ]);
        }

        DB::transaction(function () use ($validated, $sourceTank, $destinationTank, $request) {
            Filtration::create([
                ...$validated,
                'user_id' => $request->user()->id,
            ]);

            $sourceTank->decrement('current_volume_liters', $validated['liters_transferred']);
            $destinationTank->increment('current_volume_liters', $validated['liters_transferred']);
        });

        return redirect()->back()->with('success', 'Filterisasi berhasil dicatat.');
    }
}
