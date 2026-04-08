import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatRupiah } from '@/lib/format';
import type { Product } from '@/types/models';

interface Props {
    products: Product[];
    cart: string;
}

interface CartItem {
    product_id: number;
    qty: number;
}

export default function Checkout({ products, cart: cartParam }: Props) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const parsed = typeof cartParam === 'string' ? JSON.parse(cartParam) : cartParam;
            if (Array.isArray(parsed)) setCartItems(parsed);
        } catch { /* empty cart */ }
    }, [cartParam]);

    const form = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        customer_notes: '',
        items: [] as CartItem[],
    });

    const getProduct = (id: number) => products.find(p => p.id === id);

    const updateQty = (productId: number, delta: number) => {
        setCartItems(prev => prev.map(item =>
            item.product_id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ));
    };

    const removeItem = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.product_id !== productId));
    };

    const subtotal = cartItems.reduce((sum, item) => {
        const product = getProduct(item.product_id);
        return sum + (product?.price || 0) * item.qty;
    }, 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cartItems.length === 0) return;

        form.transform((data) => ({
            ...data,
            items: cartItems,
        }));

        form.post('/checkout');
    };

    return (
        <>
            <Head title="Checkout - Qoha Jaya Berkah" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <header className="border-b border-gray-200 bg-white/70 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/70">
                    <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
                        <button onClick={() => router.get('/')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Checkout</h1>
                    </div>
                </header>

                <div className="mx-auto max-w-3xl px-4 py-8">
                    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-5">
                        {/* Cart Items */}
                        <div className="lg:col-span-3 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Pesanan Anda</h2>
                            {cartItems.length === 0 && (
                                <p className="text-sm text-gray-400 py-8 text-center">Keranjang kosong. <button type="button" onClick={() => router.get('/')} className="text-green-700 hover:underline">Kembali ke katalog</button></p>
                            )}
                            {cartItems.map((item) => {
                                const product = getProduct(item.product_id);
                                if (!product) return null;
                                return (
                                    <div key={item.product_id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
                                        {product.image_path ? (
                                            <img src={`/storage/${product.image_path}`} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
                                        ) : (
                                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 text-2xl dark:bg-green-900/30">💧</div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                                            <p className="text-sm text-green-700 dark:text-green-400">{formatRupiah(product.price)}/{product.sell_unit}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => updateQty(item.product_id, -1)} className="rounded-full bg-gray-100 p-1 dark:bg-gray-800"><Minus className="h-4 w-4" /></button>
                                            <span className="w-8 text-center text-sm font-bold">{item.qty}</span>
                                            <button type="button" onClick={() => updateQty(item.product_id, 1)} className="rounded-full bg-green-700 p-1 text-white hover:bg-green-800"><Plus className="h-4 w-4" /></button>
                                            <button type="button" onClick={() => removeItem(item.product_id)} className="ml-1 rounded p-1 text-red-400 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Customer Form + Summary */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Data Pemesan</h3>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Nama Lengkap *" value={form.data.customer_name} onChange={(e) => form.setData('customer_name', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                                    <input type="text" placeholder="No. WhatsApp (08xxx) *" value={form.data.customer_phone} onChange={(e) => form.setData('customer_phone', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                                    <textarea placeholder="Alamat Lengkap *" value={form.data.customer_address} onChange={(e) => form.setData('customer_address', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={3} required />
                                    <textarea placeholder="Catatan (opsional)" value={form.data.customer_notes} onChange={(e) => form.setData('customer_notes', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                                </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-gray-100">
                                    <span>Total</span>
                                    <span className="text-green-700 dark:text-green-400">{formatRupiah(subtotal)}</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Pembayaran dilakukan saat barang diantar/diambil.</p>
                                <button type="submit" disabled={form.processing || cartItems.length === 0}
                                    className="mt-4 w-full rounded-lg bg-green-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-700/30 hover:bg-green-800 disabled:opacity-50 transition">
                                    {form.processing ? 'Memproses...' : 'Kirim Pesanan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

Checkout.layout = null;
