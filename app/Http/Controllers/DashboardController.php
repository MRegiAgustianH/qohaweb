<?php

namespace App\Http\Controllers;

use App\Models\Cashflow;
use App\Models\Customer;
use App\Models\FinishedGoodsStock;
use App\Models\Order;
use App\Models\Production;
use App\Models\Tank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
        $startOfMonth = now()->startOfMonth()->toDateString();

        // Stat cards
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $todayIncome = Cashflow::where('type', 'income')
            ->whereDate('transaction_date', $today)
            ->sum('amount');

        $mainTank = Tank::where('slug', 'utama')->first();

        $lowStockProducts = FinishedGoodsStock::where('stock_pcs', '<', 10)
            ->with('product:id,name,sell_unit,pcs_per_unit')
            ->get();

        // Recent orders
        $recentOrders = Order::with('customer:id,name,phone')
            ->latest()
            ->take(5)
            ->get(['id', 'order_number', 'customer_id', 'source', 'status', 'total', 'created_at']);

        // Recent productions
        $recentProductions = Production::with(['product:id,name', 'user:id,name'])
            ->latest()
            ->take(5)
            ->get(['id', 'product_id', 'user_id', 'qty_produced_pcs', 'qty_reject_pcs', 'created_at']);

        // Sales chart data (last 7 days)
        $salesChart = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo);
            $income = Cashflow::where('type', 'income')
                ->whereDate('transaction_date', $date->toDateString())
                ->sum('amount');
            return [
                'date' => $date->format('d M'),
                'income' => (float) $income,
            ];
        });

        // Tank volumes
        $tanks = Tank::all(['id', 'name', 'slug', 'capacity_liters', 'current_volume_liters']);

        // Monthly summary
        $monthlyIncome = Cashflow::where('type', 'income')
            ->whereDate('transaction_date', '>=', $startOfMonth)
            ->sum('amount');
        $monthlyExpense = Cashflow::where('type', 'expense')
            ->whereDate('transaction_date', '>=', $startOfMonth)
            ->sum('amount');

        return Inertia::render('dashboard', [
            'stats' => [
                'todayOrders' => $todayOrders,
                'todayIncome' => (float) $todayIncome,
                'mainTankVolume' => $mainTank ? (float) $mainTank->current_volume_liters : 0,
                'mainTankCapacity' => $mainTank ? (float) $mainTank->capacity_liters : 0,
                'lowStockCount' => $lowStockProducts->count(),
            ],
            'recentOrders' => $recentOrders,
            'recentProductions' => $recentProductions,
            'salesChart' => $salesChart,
            'tanks' => $tanks,
            'monthly' => [
                'income' => (float) $monthlyIncome,
                'expense' => (float) $monthlyExpense,
                'profit' => (float) ($monthlyIncome - $monthlyExpense),
            ],
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
