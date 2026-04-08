import { Head, useForm } from '@inertiajs/react';
import { Truck } from 'lucide-react';
import { formatDateTime, formatNumber, formatRupiah } from '@/lib/format';
import type { PaginatedData, RawWaterPurchase, Supplier, Tank } from '@/types/models';

interface Props {
    purchases: PaginatedData<RawWaterPurchase>;
    suppliers: Supplier[];
    mainTank: Tank;
    filters: { search?: string };
}

export default function PurchasePage({ purchases, suppliers, mainTank }: Props) {
    const form = useForm({ supplier_id: '', liters: '', price_per_liter: '', purchase_date: new Date().toISOString().split('T')[0], notes: '' });

    const selectedSupplier = suppliers.find(s => s.id === Number(form.data.supplier_id));
    const totalCost = (Number(form.data.liters) || 0) * (Number(form.data.price_per_liter) || 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/manufacturing/purchase', { onSuccess: () => form.reset() });
    };

    return (
        <>
            <Head title="Pembelian Air Mentah" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pembelian Air Mentah</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Input pembelian dari supplier → menambah Tangki Utama & mencatat pengeluaran</p>
                </div>

                {/* Tank Status */}
                <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800/50 dark:bg-cyan-950/30">
                    <p className="text-sm text-cyan-700 dark:text-cyan-400">
                        <strong>Tangki Utama:</strong> {formatNumber(mainTank.current_volume_liters)} / {formatNumber(mainTank.capacity_liters)} Liter
                        ({mainTank.capacity_liters > 0 ? ((mainTank.current_volume_liters / mainTank.capacity_liters) * 100).toFixed(1) : 0}%)
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Input Pembelian</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier *</label>
                                <select value={form.data.supplier_id} onChange={(e) => {
                                    form.setData('supplier_id', e.target.value);
                                    const s = suppliers.find(s => s.id === Number(e.target.value));
                                    if (s) form.setData('price_per_liter', s.price_per_liter.toString());
                                }} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required>
                                    <option value="">-- Pilih Supplier --</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({formatRupiah(s.price_per_liter)}/L)</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Liter) *</label>
                                    <input type="number" step="0.01" value={form.data.liters} onChange={(e) => form.setData('liters', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga/Liter *</label>
                                    <input type="number" step="0.01" value={form.data.price_per_liter} onChange={(e) => form.setData('price_per_liter', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                                </div>
                            </div>
                            {totalCost > 0 && (
                                <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">Total Biaya: <strong>{formatRupiah(totalCost)}</strong></p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Pembelian *</label>
                                <input type="date" value={form.data.purchase_date} onChange={(e) => form.setData('purchase_date', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
                                <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                            </div>
                            <button type="submit" disabled={form.processing} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                {form.processing ? 'Menyimpan...' : 'Catat Pembelian'}
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Riwayat Pembelian</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {purchases.data.length === 0 && <p className="text-sm text-gray-400">Belum ada pembelian.</p>}
                            {purchases.data.map((p) => (
                                <div key={p.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                                    <Truck className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.supplier?.name}</p>
                                        <p className="text-xs text-gray-500">{formatNumber(p.liters)} L × {formatRupiah(p.price_per_liter)}</p>
                                        <p className="text-[10px] text-gray-400">{p.user?.name} • {formatDateTime(p.created_at)}</p>
                                    </div>
                                    <p className="text-sm font-bold text-red-600 dark:text-red-400">-{formatRupiah(p.total_cost)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PurchasePage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pembelian Air', href: '/manufacturing/purchase' }],
};
