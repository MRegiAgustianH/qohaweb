<?php

namespace App\Http\Controllers;

use App\Models\Cashflow;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashflowController extends Controller
{
    public function index(Request $request)
    {
        $cashflows = Cashflow::query()
            ->with('user:id,name')
            ->when($request->type, fn($q, $type) => $q->where('type', $type))
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->when($request->date_from, fn($q, $date) => $q->whereDate('transaction_date', '>=', $date))
            ->when($request->date_to, fn($q, $date) => $q->whereDate('transaction_date', '<=', $date))
            ->when($request->search, fn($q, $s) => $q->where('description', 'like', "%{$s}%"))
            ->latest('transaction_date')
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        // Summary
        $query = Cashflow::query()
            ->when($request->date_from, fn($q, $date) => $q->whereDate('transaction_date', '>=', $date))
            ->when($request->date_to, fn($q, $date) => $q->whereDate('transaction_date', '<=', $date));

        $totalIncome = (clone $query)->where('type', 'income')->sum('amount');
        $totalExpense = (clone $query)->where('type', 'expense')->sum('amount');

        return Inertia::render('cashflow/index', [
            'cashflows' => $cashflows,
            'summary' => [
                'totalIncome' => (float) $totalIncome,
                'totalExpense' => (float) $totalExpense,
                'balance' => (float) ($totalIncome - $totalExpense),
            ],
            'filters' => $request->only('type', 'category', 'date_from', 'date_to', 'search'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense',
            'category' => 'required|in:sale,raw_water_purchase,salary,other',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:500',
            'transaction_date' => 'required|date',
        ]);

        Cashflow::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back()->with('success', 'Transaksi berhasil dicatat.');
    }
}
