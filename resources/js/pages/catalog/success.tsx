import { Head, Link } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import type { Order } from '@/types/models';

interface Props {
    order: Order;
    orderNumber: string;
}

export default function OrderSuccess({ order, orderNumber }: Props) {
    const waNumber = '6281234567890'; // Replace with actual admin WA
    const waMessage = encodeURIComponent(
        `Halo, saya baru saja memesan melalui website.\n\nNo. Pesanan: ${orderNumber}\nTotal: ${formatRupiah(order.total)}\n\nMohon konfirmasi pesanan saya. Terima kasih!`
    );

    return (
        <>
            <Head title="Pesanan Berhasil" />
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-800 dark:bg-gray-950">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pesanan Terkirim!</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Terima kasih, pesanan Anda sedang kami proses.</p>

                    <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                        <p className="text-xs text-gray-500">No. Pesanan</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">{orderNumber}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Total: <strong>{formatRupiah(order.total)}</strong></p>
                    </div>

                    {order.items && (
                        <div className="mt-4 space-y-1 text-left">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>{item.product?.name} × {item.qty}</span>
                                    <span>{formatRupiah(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        <a href={`https://wa.me/${waNumber}?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
                            className="block w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white hover:bg-green-700 transition">
                            💬 Konfirmasi via WhatsApp
                        </a>
                        <Link href="/" className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 transition">
                            Kembali ke Katalog
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderSuccess.layout = null;
