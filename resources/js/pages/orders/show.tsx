import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { formatDateTime, formatRupiah, getStatusColor, getStatusLabel } from '@/lib/format';
import type { Order } from '@/types/models';

interface Props { order: Order; }

export default function OrderShow({ order }: Props) {
    const form = useForm({ status: order.status, admin_notes: order.admin_notes || '' });

    const updateStatus = (newStatus: string) => {
        form.setData('status', newStatus);
        form.put(`/orders/${order.id}/status`, {
            data: { status: newStatus, admin_notes: form.data.admin_notes },
        });
    };

    const statusFlow = ['pending', 'processing', 'shipped', 'completed'];
    const canAdvance = statusFlow.indexOf(order.status) < statusFlow.length - 1 && order.status !== 'cancelled';
    const nextStatus = canAdvance ? statusFlow[statusFlow.indexOf(order.status) + 1] : null;

    const waLink = order.customer ? `https://wa.me/${order.customer.phone.replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${order.customer.name}, pesanan Anda #${order.order_number} sedang kami proses. Terima kasih!`)}` : '#';

    return (
        <>
            <Head title={`Pesanan ${order.order_number}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.get('/orders')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{order.order_number}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(order.created_at)}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Customer Info */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Pelanggan</h3>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.customer?.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer?.phone}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer?.address || '-'}</p>
                        <a href={waLink} target="_blank" rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition">
                            <MessageCircle className="h-3.5 w-3.5" /> Chat WhatsApp
                        </a>
                    </div>

                    {/* Order Details */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Detail</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Sumber:</span><span className="font-medium text-gray-900 dark:text-gray-100">{order.source === 'catalog' ? 'Katalog Publik' : 'POS'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Diproses oleh:</span><span className="text-gray-900 dark:text-gray-100">{order.user?.name || '-'}</span></div>
                            {order.customer_notes && (
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-500">Catatan Pelanggan:</p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{order.customer_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Update Status</h3>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Catatan Admin</label>
                            <textarea value={form.data.admin_notes} onChange={(e) => form.setData('admin_notes', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {nextStatus && (
                                <button onClick={() => updateStatus(nextStatus)} disabled={form.processing}
                                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                    → {getStatusLabel(nextStatus)}
                                </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                                <button onClick={() => { if (confirm('Batalkan pesanan ini?')) updateStatus('cancelled'); }} disabled={form.processing}
                                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50">
                                    Batalkan
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Item Pesanan</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Produk</th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Qty</th>
                                    <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Pcs</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Harga</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {order.items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.product?.name}</td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-600">{item.qty} {item.unit_sold}</td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-500">{item.qty_in_pcs} pcs</td>
                                        <td className="px-4 py-2 text-right text-sm text-gray-600">{formatRupiah(item.unit_price)}</td>
                                        <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-gray-100">{formatRupiah(item.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                                    <td colSpan={4} className="px-4 py-2 text-right text-sm text-gray-500">Subtotal</td>
                                    <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-gray-100">{formatRupiah(order.subtotal)}</td>
                                </tr>
                                {order.discount > 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-1 text-right text-sm text-gray-500">Diskon</td>
                                        <td className="px-4 py-1 text-right text-sm text-red-600">-{formatRupiah(order.discount)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={4} className="px-4 py-2 text-right text-sm font-bold text-gray-900 dark:text-gray-100">Total</td>
                                    <td className="px-4 py-2 text-right text-lg font-bold text-gray-900 dark:text-gray-100">{formatRupiah(order.total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pesanan', href: '/orders' }, { title: 'Detail', href: '#' }],
};
