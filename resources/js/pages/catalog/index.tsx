import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    CupSoda,
    Droplets,
    LogIn,
    Minus,
    Package,
    Plus,
    Search,
    ShoppingBag,
    ShoppingCart,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { formatRupiah } from '@/lib/format';
import type { Product } from '@/types/models';

interface Props {
    products: Product[];
}

export default function CatalogIndex({ products }: Props) {
    const [cart, setCart] = useState<Record<number, number>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'galon' | 'botol' | 'gelas'>('all');

    const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

    const subtotal = useMemo(() => {
        return Object.entries(cart).reduce((sum, [id, qty]) => {
            const product = products.find((p) => p.id === Number(id));
            return sum + (product?.price || 0) * qty;
        }, 0);
    }, [cart, products]);

    const updateCart = (productId: number, delta: number) => {
        setCart((prev) => {
            const current = prev[productId] || 0;
            const newQty = Math.max(0, current + delta);
            if (newQty === 0) {
                const { [productId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [productId]: newQty };
        });
    };

    const goToCheckout = () => {
        const items = Object.entries(cart).map(([id, qty]) => ({
            product_id: Number(id),
            qty,
        }));
        router.get('/checkout', { cart: JSON.stringify(items) });
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory =
                selectedCategory === 'all' ||
                product.tank_type === selectedCategory ||
                product.name.toLowerCase().includes(selectedCategory);

            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <>
            <Head title="Katalog Produk - PT Qoha Jaya Berkah" />
            <div className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-zinc-950 dark:text-zinc-100 flex flex-col justify-between">
                <div>
                    {/* Top Navigation */}
                    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
                        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white shadow-xs">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-white" />
                                </div>
                                <div>
                                    <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-zinc-100">
                                        PT Qoha Jaya Berkah
                                    </h1>
                                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                                        Air Minum Dalam Kemasan
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {totalQty > 0 && (
                                    <button
                                        onClick={goToCheckout}
                                        className="relative inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        <span>Keranjang ({totalQty})</span>
                                    </button>
                                )}
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700/70 transition-colors"
                                >
                                    <LogIn className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
                                    <span>Login Admin</span>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Catalog Header Section (Clean & Minimalist) */}
                    <section className="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-zinc-100">
                                    Katalog Produk
                                </h2>
                                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                                    Pemesanan air mineral resmi PT Qoha Jaya Berkah. Silakan pilih produk dan tentukan jumlah pesanan Anda.
                                </p>
                            </div>

                            {/* Filter and Search Bar */}
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('all')}
                                        className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                            selectedCategory === 'all'
                                                ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                        }`}
                                    >
                                        Semua Produk
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('galon')}
                                        className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                            selectedCategory === 'galon'
                                                ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                        }`}
                                    >
                                        Galon
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('botol')}
                                        className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                            selectedCategory === 'botol'
                                                ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                        }`}
                                    >
                                        Botol
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory('gelas')}
                                        className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                            selectedCategory === 'gelas'
                                                ? 'bg-emerald-800 text-white dark:bg-emerald-700'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                                        }`}
                                    >
                                        Gelas
                                    </button>
                                </div>

                                <div className="relative w-full sm:w-64">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari produk..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full rounded-md border border-slate-300 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Products Grid */}
                    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                        {filteredProducts.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-zinc-800 dark:bg-zinc-900">
                                <Package className="mx-auto h-10 w-10 text-slate-300 dark:text-zinc-600" />
                                <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                                    Produk tidak ditemukan
                                </h3>
                                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                    Coba ubah kata kunci pencarian atau kategori filter.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredProducts.map((product) => {
                                    const qty = cart[product.id] || 0;
                                    const stockPcs = product.finished_goods_stock?.stock_pcs ?? 0;
                                    const inStock = stockPcs > 0;

                                    return (
                                        <div
                                            key={product.id}
                                            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white shadow-xs transition hover:border-slate-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                                        >
                                            {/* Product Image / Illustration */}
                                            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-t-xl bg-slate-100/70 border-b border-slate-100 dark:bg-zinc-800/50 dark:border-zinc-800">
                                                {product.image_path ? (
                                                    <img
                                                        src={`/storage/${product.image_path}`}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ProductPlaceholder tankType={product.tank_type} name={product.name} />
                                                )}
                                                <div className="absolute right-3 top-3">
                                                    {inStock ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                                                            Tersedia
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                                                            Stok Habis
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex flex-1 flex-col justify-between p-5">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                                                            {product.name}
                                                        </h3>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                                        {product.description || `Kemasan ${product.sell_unit} air mineral PT Qoha Jaya Berkah.`}
                                                    </p>
                                                </div>

                                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-zinc-800">
                                                    <div>
                                                        <div className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                                                            {formatRupiah(product.price)}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                                                            per {product.sell_unit} {product.pcs_per_unit > 1 ? `(${product.pcs_per_unit} pcs)` : ''}
                                                        </div>
                                                    </div>

                                                    {inStock ? (
                                                        qty === 0 ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => updateCart(product.id, 1)}
                                                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                                <span>Tambah</span>
                                                            </button>
                                                        ) : (
                                                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateCart(product.id, -1)}
                                                                    className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-slate-700 shadow-xs hover:bg-slate-100 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
                                                                >
                                                                    <Minus className="h-3.5 w-3.5" />
                                                                </button>
                                                                <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-zinc-100">
                                                                    {qty}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateCart(product.id, 1)}
                                                                    className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-700 text-white shadow-xs hover:bg-emerald-800"
                                                                >
                                                                    <Plus className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        )
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            disabled
                                                            className="cursor-not-allowed rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-medium text-slate-400 dark:bg-zinc-800 dark:text-zinc-500"
                                                        >
                                                            Habis
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>

                {/* Bottom Cart Drawer / Floating Bar */}
                {totalQty > 0 && (
                    <div className="sticky bottom-4 z-40 mx-auto w-full max-w-4xl px-4">
                        <div className="flex items-center justify-between rounded-xl border border-emerald-900/10 bg-emerald-900 p-4 text-white shadow-lg dark:bg-emerald-950 dark:border-emerald-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-800 text-white">
                                    <ShoppingBag className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-xs text-emerald-200 font-medium">
                                        Total Pesanan ({totalQty} item)
                                    </div>
                                    <div className="text-lg font-bold">
                                        {formatRupiah(subtotal)}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={goToCheckout}
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 shadow-sm hover:bg-emerald-50 transition-colors"
                            >
                                <span>Lanjut ke Checkout</span>
                                <CheckCircle2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Clean Professional Footer */}
                <footer className="mt-16 border-t border-slate-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:text-left sm:px-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                                PT Qoha Jaya Berkah
                            </span>
                            <span className="text-slate-300 dark:text-zinc-700">•</span>
                            <span className="text-xs text-slate-500 dark:text-zinc-400">
                                Produsen Air Minum Berkualitas
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                            &copy; {new Date().getFullYear()} PT Qoha Jaya Berkah. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

function ProductPlaceholder({ tankType, name }: { tankType?: string; name: string }) {
    const isGallon = tankType === 'galon' || name.toLowerCase().includes('galon');
    const isCup = tankType === 'gelas' || name.toLowerCase().includes('gelas');

    return (
        <div className="flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-zinc-500">
            {isGallon ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-zinc-700/50">
                    <Droplets className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
                </div>
            ) : isCup ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-zinc-700/50">
                    <CupSoda className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
                </div>
            ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200/60 dark:bg-zinc-700/50">
                    <Droplets className="h-8 w-8 text-emerald-700 dark:text-emerald-400" />
                </div>
            )}
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                {isGallon ? 'Galon 19L' : isCup ? 'Dus Gelas' : 'Dus Botol'}
            </span>
        </div>
    );
}

CatalogIndex.layout = null;
