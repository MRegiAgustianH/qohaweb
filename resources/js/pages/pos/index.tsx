import { Head, useForm } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '@/lib/format';
import type { Customer, Product } from '@/types/models';

interface Props {
    products: Product[];
    customers: Customer[];
}

interface CartItem {
    product_id: number;
    name: string;
    price: number;
    sell_unit: string;
    qty: number;
    unit_sold: string;
    stock: number;
}

export default function PosPage({ products, customers }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('new');
    const [selectedCustomerId, setSelectedCustomerId] = useState('');

    const form = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        discount: '0',
        items: [] as { product_id: number; qty: number; unit_sold: string }[],
        notes: '',
    });

    const addToCart = (product: Product) => {
        const existing = cart.find(c => c.product_id === product.id);
        if (existing) {
            setCart(cart.map(c => c.product_id === product.id ? { ...c, qty: c.qty + 1 } : c));
        } else {
            setCart([...cart, {
                product_id: product.id,
                name: product.name,
                price: product.price,
                sell_unit: product.sell_unit,
                qty: 1,
                unit_sold: product.sell_unit,
                stock: product.finished_goods_stock?.stock_pcs || 0,
            }]);
        }
    };

    const updateQty = (productId: number, delta: number) => {
        setCart(cart.map(c => {
            if (c.product_id === productId) {
                const newQty = Math.max(1, c.qty + delta);
                return { ...c, qty: newQty };
            }
            return c;
        }));
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(c => c.product_id !== productId));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Number(form.data.discount) || 0;
    const total = subtotal - discount;

    const selectExistingCustomer = (id: string) => {
        setSelectedCustomerId(id);
        const c = customers.find(c => c.id === Number(id));
        if (c) {
            form.setData({ ...form.data, customer_name: c.name, customer_phone: c.phone, customer_address: c.address || '' });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        form.transform((data) => ({
            ...data,
            items: cart.map(c => ({ product_id: c.product_id, qty: c.qty, unit_sold: c.unit_sold })),
        }));

        form.post('/pos', {
            onSuccess: () => {
                setCart([]);
                form.reset();
            },
        });
    };

    return (
        <>
            <Head title="Kasir (POS)" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6 lg:flex-row">
                {/* Product Grid */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Kasir (POS)</h1>
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => (
                            <button key={product.id} onClick={() => addToCart(product)}
                                className="group rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-700">
                                {product.image_path ? (
                                    <img src={`/storage/${product.image_path}`} alt={product.name} className="mb-2 h-20 w-full rounded-lg object-cover" />
                                ) : (
                                    <div className="mb-2 flex h-20 items-center justify-center rounded-lg bg-gray-100 text-2xl dark:bg-gray-800">📦</div>
                                )}
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-100 truncate">{product.name}</p>
                                <p className="text-xs text-gray-500">{formatRupiah(product.price)}/{product.sell_unit}</p>
                                <p className="text-[10px] text-gray-400">Stok: {product.finished_goods_stock?.stock_pcs || 0} pcs</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cart Panel */}
                <div className="w-full lg:w-[400px] shrink-0">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950 sticky top-4">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Keranjang</h2>
                            <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{cart.length}</span>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-2 max-h-[200px] overflow-y-auto mb-4">
                            {cart.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Keranjang kosong</p>}
                            {cart.map((item) => (
                                <div key={item.product_id} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2 dark:border-gray-800">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">{formatRupiah(item.price * item.qty)}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => updateQty(item.product_id, -1)} className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><Minus className="h-3.5 w-3.5" /></button>
                                        <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{item.qty}</span>
                                        <button onClick={() => updateQty(item.product_id, 1)} className="rounded p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><Plus className="h-3.5 w-3.5" /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.product_id)} className="rounded p-0.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><X className="h-3.5 w-3.5" /></button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={submit} className="space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
                            {/* Customer */}
                            <div className="flex gap-2">
                                {(['existing', 'new'] as const).map((m) => (
                                    <button key={m} type="button" onClick={() => setCustomerMode(m)}
                                        className={`flex-1 rounded-lg px-2 py-1 text-xs font-medium transition ${customerMode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                                        {m === 'existing' ? 'Pelanggan Lama' : 'Pelanggan Baru'}
                                    </button>
                                ))}
                            </div>

                            {customerMode === 'existing' ? (
                                <select value={selectedCustomerId} onChange={(e) => selectExistingCustomer(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                                    <option value="">-- Pilih Pelanggan --</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                </select>
                            ) : null}

                            <input type="text" placeholder="Nama *" value={form.data.customer_name} onChange={(e) => form.setData('customer_name', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                            <input type="text" placeholder="No. WhatsApp *" value={form.data.customer_phone} onChange={(e) => form.setData('customer_phone', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                            <input type="text" placeholder="Alamat" value={form.data.customer_address} onChange={(e) => form.setData('customer_address', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />

                            <div>
                                <label className="text-xs text-gray-500">Diskon (Rp)</label>
                                <input type="number" min="0" value={form.data.discount} onChange={(e) => form.setData('discount', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                            </div>

                            {/* Totals */}
                            <div className="rounded-lg bg-gray-50 p-3 space-y-1 dark:bg-gray-900">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span><span>{formatRupiah(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Diskon</span><span>-{formatRupiah(discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700 pt-1">
                                    <span>Total</span><span>{formatRupiah(total)}</span>
                                </div>
                            </div>

                            {form.errors.items && <p className="text-xs text-red-500">{form.errors.items}</p>}

                            <button type="submit" disabled={form.processing || cart.length === 0}
                                className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                                {form.processing ? 'Memproses...' : `Bayar ${formatRupiah(total)}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

PosPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Kasir (POS)', href: '/pos' }],
};
