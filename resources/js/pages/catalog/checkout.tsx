import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, CupSoda, Droplets, Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
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
        } catch {
            /* empty cart */
        }
    }, [cartParam]);

    const form = useForm({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        customer_notes: '',
        items: [] as CartItem[],
    });

    const getProduct = (id: number) => products.find((p) => p.id === id);

    const updateQty = (productId: number, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.product_id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            )
        );
    };

    const removeItem = (productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
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
            <Head title="Checkout Pemesanan - PT Qoha Jaya Berkah" />
            <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 flex flex-col justify-between">
                <div>
                    {/* Header */}
                    <header className="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.get('/')}
                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                                    title="Kembali ke Katalog"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div>
                                    <h1 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                                        Checkout Pemesanan
                                    </h1>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        Konfirmasi item dan data pengantaran
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-800 text-white">
                                <AppLogoIcon className="h-5 w-5 fill-current text-white" />
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                        {cartItems.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                <p className="text-sm text-slate-500 dark:text-zinc-400">
                                    Keranjang belanja Anda kosong.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => router.get('/')}
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Kembali ke Katalog</span>
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-12">
                                {/* Left Column: Order Items */}
                                <div className="space-y-4 lg:col-span-7">
                                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-zinc-800">
                                            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                                                Daftar Item ({cartItems.length})
                                            </h2>
                                            <button
                                                type="button"
                                                onClick={() => router.get('/')}
                                                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                                            >
                                                + Tambah Produk Lain
                                            </button>
                                        </div>

                                        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                            {cartItems.map((item) => {
                                                const product = getProduct(item.product_id);
                                                if (!product) return null;
                                                return (
                                                    <div key={item.product_id} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                                                            {product.image_path ? (
                                                                <img
                                                                    src={`/storage/${product.image_path}`}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : product.tank_type === 'gelas' ? (
                                                                <CupSoda className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                                                            ) : (
                                                                <Droplets className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                                                            )}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
                                                                {product.name}
                                                            </h3>
                                                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                                                {formatRupiah(product.price)} / {product.sell_unit}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-1.5">
                                                            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQty(item.product_id, -1)}
                                                                    className="flex h-6 w-6 items-center justify-center rounded bg-white text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-zinc-700 dark:text-zinc-200"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className="w-7 text-center text-xs font-bold text-slate-900 dark:text-zinc-100">
                                                                    {item.qty}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQty(item.product_id, 1)}
                                                                    className="flex h-6 w-6 items-center justify-center rounded bg-emerald-700 text-white shadow-xs hover:bg-emerald-800"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.product_id)}
                                                                className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                                                                title="Hapus item"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Customer Info & Confirmation */}
                                <div className="space-y-4 lg:col-span-5">
                                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                        <h2 className="mb-3.5 text-sm font-bold text-slate-900 dark:text-zinc-100">
                                            Informasi Pemesan
                                        </h2>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                                                    Nama Lengkap <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Bpk. Rahmat"
                                                    value={form.data.customer_name}
                                                    onChange={(e) => form.setData('customer_name', e.target.value)}
                                                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                                                    Nomor WhatsApp <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="tel"
                                                    placeholder="081234567890"
                                                    value={form.data.customer_phone}
                                                    onChange={(e) => form.setData('customer_phone', e.target.value)}
                                                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                                                    Alamat Pengiriman <span className="text-rose-500">*</span>
                                                </label>
                                                <textarea
                                                    placeholder="Jl. Mawar No. 10, Kelurahan, Kecamatan"
                                                    value={form.data.customer_address}
                                                    onChange={(e) => form.setData('customer_address', e.target.value)}
                                                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                    rows={3}
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
                                                    Catatan Tambahan (Opsional)
                                                </label>
                                                <textarea
                                                    placeholder="Patokan lokasi, jam pengantaran, dll."
                                                    value={form.data.customer_notes}
                                                    onChange={(e) => form.setData('customer_notes', e.target.value)}
                                                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Total & Submit */}
                                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                                        <div className="space-y-2 border-b border-slate-100 pb-3 text-xs text-slate-600 dark:border-zinc-800 dark:text-zinc-400">
                                            <div className="flex justify-between">
                                                <span>Subtotal Produk</span>
                                                <span className="font-semibold text-slate-900 dark:text-zinc-100">{formatRupiah(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Metode Pembayaran</span>
                                                <span className="font-semibold text-slate-900 dark:text-zinc-100">COD / Transfer saat konfirmasi</span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-baseline justify-between">
                                            <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">Total Pembayaran</span>
                                            <span className="text-xl font-bold text-emerald-800 dark:text-emerald-400">{formatRupiah(subtotal)}</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={form.processing || cartItems.length === 0}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 disabled:opacity-50 transition-colors"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            <span>{form.processing ? 'Memproses Pesanan...' : 'Kirim Pesanan Sekarang'}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <footer className="border-t border-slate-200 bg-white py-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto max-w-4xl px-4 text-center text-xs text-slate-500 dark:text-zinc-400">
                        &copy; {new Date().getFullYear()} PT Qoha Jaya Berkah.
                    </div>
                </footer>
            </div>
        </>
    );
}

Checkout.layout = null;
