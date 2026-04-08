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

class PosController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)
            ->with('finishedGoodsStock')
            ->orderBy('sort_order')
            ->get(['id', 'name', 'price', 'sell_unit', 'pcs_per_unit', 'image_path']);

        $customers = Customer::orderBy('name')->get(['id', 'name', 'phone', 'address']);

        return Inertia::render('pos/index', [
            'products' => $products,
            'customers' => $customers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'nullable|string|max:1000',
            'discount' => 'numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.unit_sold' => 'required|in:Pcs,Dus',
            'notes' => 'nullable|string|max:1000',
        ]);

        // Validate stock availability
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $pcsPerUnit = $item['unit_sold'] === 'Dus' ? $product->pcs_per_unit : 1;
            $totalPcs = $item['qty'] * $pcsPerUnit;

            $stock = FinishedGoodsStock::where('product_id', $item['product_id'])->first();
            if (!$stock || $stock->stock_pcs < $totalPcs) {
                return redirect()->back()->withErrors([
                    'items' => "Stok {$product->name} tidak mencukupi. Dibutuhkan: {$totalPcs} pcs, Tersedia: " . ($stock?->stock_pcs ?? 0) . " pcs",
                ]);
            }
        }

        DB::transaction(function () use ($validated, $request) {
            // Find or create customer
            $customer = Customer::findOrCreateByPhone($validated['customer_phone'], [
                'name' => $validated['customer_name'],
                'address' => $validated['customer_address'] ?? null,
            ]);

            // Calculate totals
            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $pcsPerUnit = $item['unit_sold'] === 'Dus' ? $product->pcs_per_unit : 1;
                $totalPcs = $item['qty'] * $pcsPerUnit;
                $unitPrice = $product->price;
                $itemSubtotal = $item['qty'] * $unitPrice;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'unit_sold' => $item['unit_sold'],
                    'qty' => $item['qty'],
                    'qty_in_pcs' => $totalPcs,
                    'unit_price' => $unitPrice,
                    'subtotal' => $itemSubtotal,
                ];

                $subtotal += $itemSubtotal;
            }

            $discount = $validated['discount'] ?? 0;
            $total = $subtotal - $discount;

            // Create order
            $order = Order::create([
                'customer_id' => $customer->id,
                'user_id' => $request->user()->id,
                'order_number' => Order::generateOrderNumber(),
                'source' => Order::SOURCE_POS,
                'status' => Order::STATUS_COMPLETED,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'customer_notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            // Deduct stock (POS is immediately completed)
            foreach ($orderItems as $item) {
                $stock = FinishedGoodsStock::where('product_id', $item['product_id'])->first();
                $stock->decrement('stock_pcs', $item['qty_in_pcs']);
            }

            // Create income cashflow
            Cashflow::create([
                'type' => Cashflow::TYPE_INCOME,
                'category' => Cashflow::CATEGORY_SALE,
                'amount' => $total,
                'description' => "POS #{$order->order_number} - {$customer->name}",
                'reference_id' => $order->id,
                'reference_type' => Order::class,
                'user_id' => $request->user()->id,
                'transaction_date' => now()->toDateString(),
            ]);
        });

        return redirect()->back()->with('success', 'Transaksi POS berhasil dicatat.');
    }
}
