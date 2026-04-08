import { Head, router } from '@inertiajs/react';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime, formatRupiah, getStatusColor, getStatusLabel } from '@/lib/format';
import type { Order, PaginatedData } from '@/types/models';

interface Props {
    orders: PaginatedData<Order>;
    filters: { search?: string; status?: string; source?: string };
}

export default function OrdersIndex({ orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key: string, value: string) => {
        router.get('/orders', { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <>
            <Head title="Pesanan" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pesanan Masuk</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Kelola pesanan dari katalog publik dan POS</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <form onSubmit={(e) => { e.preventDefault(); applyFilter('search', search); }} className="relative flex-1 min-w-[200px] max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari no. pesanan, nama, WA..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                    </form>
                    <select value={filters.status || ''} onChange={(e) => applyFilter('status', e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="processing">Diproses</option>
                        <option value="shipped">Dikirim</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                    <select value={filters.source || ''} onChange={(e) => applyFilter('source', e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                        <option value="">Semua Sumber</option>
                        <option value="catalog">Katalog</option>
                        <option value="pos">POS</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">No. Pesanan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Pelanggan</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Sumber</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tanggal</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {orders.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Belum ada pesanan.</td></tr>
                            )}
                            {orders.data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition cursor-pointer" onClick={() => router.get(`/orders/${order.id}`)}>
                                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">{order.order_number}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{order.customer?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer?.phone}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.source === 'catalog' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                                            {order.source === 'catalog' ? 'Katalog' : 'POS'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>{getStatusLabel(order.status)}</span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-gray-100">{formatRupiah(order.total)}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{formatDateTime(order.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={(e) => { e.stopPropagation(); router.get(`/orders/${order.id}`); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {orders.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {orders.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'} ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

OrdersIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pesanan', href: '/orders' }],
};
