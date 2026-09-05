import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { formatRupiah } from '@/lib/format';
import type { Order } from '@/types/models';

interface Props {
    order: Order;
    orderNumber: string;
}

export default function OrderSuccess({ order, orderNumber }: Props) {
    const waNumber = '6281234567890';
    const waMessage = encodeURIComponent(
        `Halo PT Qoha Jaya Berkah, saya ingin konfirmasi pesanan saya.\n\nNomor Pesanan: ${orderNumber}\nTotal: ${formatRupiah(order.total)}\n\nMohon informasi ketersediaan pengiriman. Terima kasih.`
    );

    return (
        <>
            <Head title="Pesanan Berhasil - PT Qoha Jaya Berkah" />
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
                <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <CheckCircle2 className="h-7 w-7" />
                    </div>

                    <div className="mt-4 text-center">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
                            Pesanan Berhasil Dibuat
                        </h1>
                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            Terima kasih. Pesanan Anda telah tercatat dalam sistem kami.
                        </p>
                    </div>

                    {/* Order Reference Card */}
                    <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50/80 p-4 dark:border-zinc-800/80 dark:bg-zinc-800/50">
                        <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 dark:border-zinc-700/60">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">Nomor Pesanan</span>
                            <span className="font-mono text-sm font-bold text-emerald-800 dark:text-emerald-400">
                                {orderNumber}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2.5">
                            <span className="text-xs text-slate-500 dark:text-zinc-400">Total Pembayaran</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                                {formatRupiah(order.total)}
                            </span>
                        </div>
                    </div>

                    {/* Order Items Summary */}
                    {order.items && order.items.length > 0 && (
                        <div className="mt-4 space-y-2 rounded-lg border border-slate-100 p-3.5 dark:border-zinc-800">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                                Rincian Item
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between py-2 text-xs">
                                        <span className="text-slate-700 dark:text-zinc-300">
                                            {item.product?.name || 'Produk'} × {item.qty}
                                        </span>
                                        <span className="font-medium text-slate-900 dark:text-zinc-100">
                                            {formatRupiah(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 space-y-2.5">
                        <a
                            href={`https://wa.me/${waNumber}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span>Konfirmasi via WhatsApp</span>
                        </a>

                        <Link
                            href="/"
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700/60 transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4 text-slate-400" />
                            <span>Kembali ke Katalog</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderSuccess.layout = null;
