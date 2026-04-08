<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\FinishedGoodsStock;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CatalogController extends Controller
{
    /**
     * Public product catalog (no auth required).
     */
    public function index()
    {
        $products = Product::where('is_active', true)
            ->where('show_in_catalog', true)
            ->with('finishedGoodsStock')
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'description', 'image_path', 'price', 'sell_unit', 'pcs_per_unit']);

        return Inertia::render('catalog/index', [
            'products' => $products,
        ]);
    }

    /**
     * Checkout page.
     */
    public function checkout(Request $request)
    {
        $products = Product::where('is_active', true)
            ->where('show_in_catalog', true)
            ->with('finishedGoodsStock')
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'price', 'sell_unit', 'pcs_per_unit', 'image_path']);

        return Inertia::render('catalog/checkout', [
            'products' => $products,
            'cart' => $request->query('cart', []),
        ]);
    }

    /**
     * Process public checkout (guest, no auth).
     */
    public function processCheckout(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:1000',
            'customer_notes' => 'nullable|string|max:1000',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($validated) {
            // Smart customer tracking by WhatsApp
            $customer = Customer::findOrCreateByPhone($validated['customer_phone'], [
                'name' => $validated['customer_name'],
                'address' => $validated['customer_address'],
            ]);

            // Update address if changed
            if ($customer->address !== $validated['customer_address']) {
                $customer->update(['address' => $validated['customer_address']]);
            }

            // Calculate order items
            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $qtyInPcs = $item['qty'] * $product->pcs_per_unit;
                $itemSubtotal = $item['qty'] * $product->price;

                $orderItems[] = [
                    'product_id' => $product->id,
                    'unit_sold' => $product->sell_unit,
                    'qty' => $item['qty'],
                    'qty_in_pcs' => $qtyInPcs,
                    'unit_price' => $product->price,
                    'subtotal' => $itemSubtotal,
                ];

                $subtotal += $itemSubtotal;
            }

            // Create order
            $order = Order::create([
                'customer_id' => $customer->id,
                'order_number' => Order::generateOrderNumber(),
                'source' => Order::SOURCE_CATALOG,
                'status' => Order::STATUS_PENDING,
                'subtotal' => $subtotal,
                'discount' => 0,
                'total' => $subtotal,
                'customer_notes' => $validated['customer_notes'] ?? null,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            return $order;
        });

        return Inertia::render('catalog/success', [
            'order' => $order->load('items.product:id,name'),
            'orderNumber' => $order->order_number,
        ]);
    }
}
