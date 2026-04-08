import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Eye, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '@/lib/format';
import type { Customer, PaginatedData } from '@/types/models';

interface Props {
    customers: PaginatedData<Customer>;
    filters: { search?: string };
}

export default function CustomersIndex({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [editing, setEditing] = useState<Customer | null>(null);

    return (
        <>
            <Head title="Pelanggan" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Pelanggan</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Database pelanggan (otomatis terkumpul dari pemesanan)</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.get('/customers', { search }, { preserveState: true }); }} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau no. WhatsApp..."
                            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                    </div>
                </form>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Nama</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">WhatsApp</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Alamat</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Pesanan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Bergabung</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {customers.data.length === 0 && (
                                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">Belum ada pelanggan.</td></tr>
                            )}
                            {customers.data.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</td>
                                    <td className="px-4 py-3">
                                        <a href={`https://wa.me/${customer.phone.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer"
                                            className="text-sm text-green-600 hover:underline dark:text-green-400">
                                            {customer.phone}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">{customer.address || '-'}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900 dark:text-gray-100">{customer.orders_count || 0}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{formatDateTime(customer.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => router.get(`/customers/${customer.id}`)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Eye className="h-4 w-4" /></button>
                                            <button onClick={() => setEditing(customer)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Edit className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {customers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {customers.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'} ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}

                {editing && <CustomerEditModal customer={editing} onClose={() => setEditing(null)} />}
            </div>
        </>
    );
}

CustomersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Pelanggan', href: '/customers' },
    ],
};

function CustomerEditModal({ customer, onClose }: { customer: Customer; onClose: () => void }) {
    const form = useForm({
        name: customer.name,
        phone: customer.phone,
        address: customer.address || '',
        notes: customer.notes || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/customers/${customer.id}`, { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Pelanggan</h2>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama *</label>
                        <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">No. WhatsApp *</label>
                        <input type="text" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</label>
                        <textarea value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
                        <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
