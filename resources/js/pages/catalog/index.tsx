import { Head, Link, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '@/lib/format';
import type { Product } from '@/types/models';

interface Props { products: Product[]; }

export default function CatalogIndex({ products }: Props) {
    const [cart, setCart] = useState<Record<number, number>>({});
    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

    const updateCart = (productId: number, delta: number) => {
        setCart(prev => {
            const newQty = Math.max(0, (prev[productId] || 0) + delta);
            if (newQty === 0) { const { [productId]: _, ...rest } = prev; return rest; }
            return { ...prev, [productId]: newQty };
        });
    };

    const goToCheckout = () => {
        const items = Object.entries(cart).map(([id, qty]) => ({ product_id: Number(id), qty }));
        router.get('/checkout', { cart: JSON.stringify(items) });
    };

    return (
        <>
            <Head title="Qoha Jaya Berkah - Air Mineral Berkualitas" />
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                {/* Header */}
                <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-xl dark:bg-gray-950/70">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                        <div>
                            <h1 className="text-xl font-bold text-green-800 dark:text-green-400">💧 Qoha Jaya Berkah</h1>
                            <p className="text-xs text-gray-500">Air Mineral Berkualitas</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {cartCount > 0 && (
                                <button onClick={goToCheckout}
                                    className="relative inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-green-700/30 hover:bg-green-800 transition">
                                    <ShoppingCart className="h-4 w-4" />
                                    Pesan ({cartCount})
                                </button>
                            )}
                            <Link href="/login" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">
                                Login
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="mx-auto max-w-6xl px-4 py-16 text-center">
                    <div className="mx-auto max-w-2xl">
                        <span className="inline-block rounded-full bg-green-100 px-4 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-4">
                            🏭 Diproduksi Langsung
                        </span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                            Air Mineral{' '}
                            <span className="bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                                Segar & Bersih
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                            Langsung dari sumber, diproses dengan teknologi filterisasi modern. 
                            Pilih produk dan pesan langsung melalui WhatsApp.
                        </p>
                    </div>
                </section>

                {/* Products */}
                <section className="mx-auto max-w-6xl px-4 pb-20">
                    <h3 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">Produk Kami</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                            const qty = cart[product.id] || 0;
                            const stock = product.finished_goods_stock?.stock_pcs ?? 0;
                            const inStock = stock > 0;

                            return (
                                <div key={product.id} className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 dark:border-gray-800 dark:bg-gray-950">
                                    {product.image_path ? (
                                        <img src={`/storage/${product.image_path}`} alt={product.name} className="h-48 w-full object-cover bg-gray-100 group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 text-6xl dark:from-green-900/30 dark:to-emerald-900/30">💧</div>
                                    )}
                                    <div className="p-5">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">{product.name}</h4>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description || 'Air mineral berkualitas tinggi.'}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div>
                                                <p className="text-xl font-bold text-green-700 dark:text-green-400">{formatRupiah(product.price)}</p>
                                                <p className="text-xs text-gray-500">per {product.sell_unit}</p>
                                            </div>
                                            {inStock ? (
                                                qty === 0 ? (
                                                    <button onClick={() => updateCart(product.id, 1)}
                                                        className="rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 transition shadow-md shadow-green-700/20">
                                                        + Keranjang
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => updateCart(product.id, -1)} className="rounded-full bg-gray-100 p-1.5 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"><Minus className="h-4 w-4" /></button>
                                                        <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-gray-100">{qty}</span>
                                                        <button onClick={() => updateCart(product.id, 1)} className="rounded-full bg-green-700 p-1.5 text-white hover:bg-green-800"><Plus className="h-4 w-4" /></button>
                                                    </div>
                                                )
                                            ) : (
                                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">Habis</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white/50 py-8 dark:border-gray-800 dark:bg-gray-950/50">
                    <div className="mx-auto max-w-6xl px-4 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} PT Qoha Jaya Berkah. Semua hak dilindungi.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}

// No layout wrapper - public page uses its own layout
CatalogIndex.layout = null;
