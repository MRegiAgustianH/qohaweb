import { Head, router, useForm } from '@inertiajs/react';
import { ArrowDownCircle, ArrowUpCircle, Plus, Search, Wallet } from 'lucide-react';
import { useState } from 'react';
import { formatDate, formatRupiah } from '@/lib/format';
import type { Cashflow, PaginatedData } from '@/types/models';

interface Props {
    cashflows: PaginatedData<Cashflow>;
    summary: { totalIncome: number; totalExpense: number; balance: number };
    filters: { type?: string; category?: string; date_from?: string; date_to?: string; search?: string };
}

export default function CashflowIndex({ cashflows, summary, filters }: Props) {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Head title="Arus Kas" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Arus Kas</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Log semua transaksi masuk dan keluar</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                        <Plus className="h-4 w-4" /> Catat Manual
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/50 dark:bg-green-950/30">
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <ArrowDownCircle className="h-4 w-4" /> Pemasukan
                        </div>
                        <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-300">{formatRupiah(summary.totalIncome)}</p>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/30">
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <ArrowUpCircle className="h-4 w-4" /> Pengeluaran
                        </div>
                        <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300">{formatRupiah(summary.totalExpense)}</p>
                    </div>
                    <div className={`rounded-xl border p-4 ${summary.balance >= 0 ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/30' : 'border-orange-200 bg-orange-50 dark:border-orange-800/50 dark:bg-orange-950/30'}`}>
                        <div className={`flex items-center gap-2 text-sm ${summary.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            <Wallet className="h-4 w-4" /> Saldo
                        </div>
                        <p className={`mt-1 text-xl font-bold ${summary.balance >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'}`}>{formatRupiah(summary.balance)}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <select value={filters.type || ''} onChange={(e) => router.get('/cashflow', { ...filters, type: e.target.value || undefined }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                        <option value="">Semua Tipe</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                    </select>
                    <select value={filters.category || ''} onChange={(e) => router.get('/cashflow', { ...filters, category: e.target.value || undefined }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
                        <option value="">Semua Kategori</option>
                        <option value="sale">Penjualan</option>
                        <option value="raw_water_purchase">Pembelian Air</option>
                        <option value="salary">Gaji</option>
                        <option value="other">Lainnya</option>
                    </select>
                    <input type="date" value={filters.date_from || ''} onChange={(e) => router.get('/cashflow', { ...filters, date_from: e.target.value || undefined }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                    <input type="date" value={filters.date_to || ''} onChange={(e) => router.get('/cashflow', { ...filters, date_to: e.target.value || undefined }, { preserveState: true })}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Deskripsi</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500">Kategori</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Jumlah</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Oleh</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {cashflows.data.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Belum ada transaksi.</td></tr>
                            )}
                            {cashflows.data.map((cf) => {
                                const categoryLabels: Record<string, string> = { sale: 'Penjualan', raw_water_purchase: 'Beli Air', salary: 'Gaji', other: 'Lainnya' };
                                return (
                                    <tr key={cf.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatDate(cf.transaction_date)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{cf.description}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">{categoryLabels[cf.category] || cf.category}</span>
                                        </td>
                                        <td className={`px-4 py-3 text-right text-sm font-bold ${cf.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {cf.type === 'income' ? '+' : '-'}{formatRupiah(cf.amount)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{cf.user?.name || 'Sistem'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {cashflows.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {cashflows.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'} ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}

                {showForm && <CashflowFormModal onClose={() => setShowForm(false)} />}
            </div>
        </>
    );
}

CashflowIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Arus Kas', href: '/cashflow' }],
};

function CashflowFormModal({ onClose }: { onClose: () => void }) {
    const form = useForm({ type: 'expense', category: 'other', amount: '', description: '', transaction_date: new Date().toISOString().split('T')[0] });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/cashflow', { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Catat Transaksi Manual</h2>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipe *</label>
                            <select value={form.data.type} onChange={(e) => form.setData('type', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori *</label>
                            <select value={form.data.category} onChange={(e) => form.setData('category', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                                <option value="salary">Gaji Karyawan</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp) *</label>
                        <input type="number" min="1" value={form.data.amount} onChange={(e) => form.setData('amount', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi *</label>
                        <input type="text" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal *</label>
                        <input type="date" value={form.data.transaction_date} onChange={(e) => form.setData('transaction_date', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
