import { Head } from '@inertiajs/react';
import { formatRupiah, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/format';
import type { Customer } from '@/types/models';

interface Props {
    customer: Customer;
}

export default function CustomerShow({ customer }: Props) {
    return (
        <>
            <Head title={`Pelanggan - ${customer.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{customer.name}</h1>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>📱 <a href={`https://wa.me/${customer.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline dark:text-green-400">{customer.phone}</a></span>
                        {customer.address && <span>📍 {customer.address}</span>}
                    </div>
                    {customer.notes && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Catatan: {customer.notes}</p>}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Riwayat Pesanan</h2>
                    {(!customer.orders || customer.orders.length === 0) ? (
                        <p className="text-sm text-gray-400">Belum ada pesanan.</p>
                    ) : (
                        <div className="space-y-3">
                            {customer.orders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.order_number}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(order.created_at)} • {order.source === 'catalog' ? 'Katalog' : 'POS'}</p>
                                        {order.items && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {order.items.map((item) => (
                                                    <span key={item.id} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                        {item.product?.name} × {item.qty}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <p className="mt-1 text-sm font-bold text-gray-900 dark:text-gray-100">{formatRupiah(order.total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

CustomerShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pelanggan', href: '/customers' },
        { title: 'Detail', href: '#' },
    ],
};
