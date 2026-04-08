<?php

namespace App\Http\Controllers;

use App\Models\Cashflow;
use App\Models\Customer;
use App\Models\FinishedGoodsStock;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::query()
            ->with(['customer:id,name,phone', 'user:id,name'])
            ->when($request->search, function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('customer', fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%"));
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->source, function ($query, $source) {
                $query->where('source', $source);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => $request->only('search', 'status', 'source'),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['customer', 'user:id,name', 'items.product:id,name,image_path']);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,completed,cancelled',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        DB::transaction(function () use ($order, $validated, $oldStatus, $newStatus, $request) {
            $order->update([
                'status' => $newStatus,
                'admin_notes' => $validated['admin_notes'] ?? $order->admin_notes,
                'user_id' => $request->user()->id,
            ]);

            // When order is completed, deduct stock and create income cashflow
            if ($newStatus === Order::STATUS_COMPLETED && $oldStatus !== Order::STATUS_COMPLETED) {
                $this->deductStockForOrder($order);
                $this->createIncomeCashflow($order, $request->user()->id);
            }

            // If reverting from completed, reverse stock and cashflow
            if ($oldStatus === Order::STATUS_COMPLETED && $newStatus !== Order::STATUS_COMPLETED) {
                $this->reverseStockForOrder($order);
                $order->cashflows()->delete();
            }
        });

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    private function deductStockForOrder(Order $order): void
    {
        foreach ($order->items as $item) {
            $stock = FinishedGoodsStock::where('product_id', $item->product_id)->first();
            if ($stock) {
                $stock->decrement('stock_pcs', $item->qty_in_pcs);
            }
        }
    }

    private function reverseStockForOrder(Order $order): void
    {
        foreach ($order->items as $item) {
            $stock = FinishedGoodsStock::where('product_id', $item->product_id)->first();
            if ($stock) {
                $stock->increment('stock_pcs', $item->qty_in_pcs);
            }
        }
    }

    private function createIncomeCashflow(Order $order, int $userId): void
    {
        Cashflow::create([
            'type' => Cashflow::TYPE_INCOME,
            'category' => Cashflow::CATEGORY_SALE,
            'amount' => $order->total,
            'description' => "Penjualan #{$order->order_number} - {$order->customer->name}",
            'reference_id' => $order->id,
            'reference_type' => Order::class,
            'user_id' => $userId,
            'transaction_date' => now()->toDateString(),
        ]);
    }
}
