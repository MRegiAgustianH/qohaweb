import { Head, useForm } from '@inertiajs/react';
import { ArrowDownUp } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { FinishedGoodsStock, Material, StockAdjustment, Tank } from '@/types/models';

interface Props {
    tanks: Tank[];
    materials: Material[];
    finishedGoods: FinishedGoodsStock[];
    recentAdjustments: StockAdjustment[];
}

export default function StockAdjustmentPage({ tanks, materials, finishedGoods, recentAdjustments }: Props) {
    const [type, setType] = useState<'tank' | 'material' | 'finished_good'>('tank');
    const form = useForm({ adjustable_type: 'tank', adjustable_id: '', new_value: '', reason: '' });

    const items = type === 'tank' ? tanks.map(t => ({ id: t.id, label: t.name, current: t.current_volume_liters, unit: 'liter' }))
        : type === 'material' ? materials.map(m => ({ id: m.id, label: m.name, current: m.current_stock, unit: m.unit }))
        : finishedGoods.map(f => ({ id: f.id, label: f.product?.name || '-', current: f.stock_pcs, unit: 'pcs' }));

    const selectedItem = items.find(i => i.id === Number(form.data.adjustable_id));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({ ...data, adjustable_type: type }));
        form.post('/inventory/stock-adjustment', {
            onSuccess: () => form.reset(),
            data: { ...form.data, adjustable_type: type },
        });
    };

    return (
        <>
            <Head title="Stock Opname" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Stock Opname</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Penyesuaian stok jika ada selisih fisik vs sistem</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Input Penyesuaian</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jenis</label>
                                <div className="flex gap-2">
                                    {(['tank', 'material', 'finished_good'] as const).map((t) => (
                                        <button key={t} type="button" onClick={() => { setType(t); form.setData('adjustable_id', ''); }}
                                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${type === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
                                            {t === 'tank' ? 'Tangki' : t === 'material' ? 'Material' : 'Barang Jadi'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilih Item *</label>
                                <select value={form.data.adjustable_id} onChange={(e) => form.setData('adjustable_id', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required>
                                    <option value="">-- Pilih --</option>
                                    {items.map((item) => (
                                        <option key={item.id} value={item.id}>{item.label} (saat ini: {formatNumber(item.current)} {item.unit})</option>
                                    ))}
                                </select>
                            </div>
                            {selectedItem && (
                                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">Stok sistem saat ini: <strong>{formatNumber(selectedItem.current)} {selectedItem.unit}</strong></p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nilai Aktual (fisik) *</label>
                                <input type="number" step="0.01" min="0" value={form.data.new_value} onChange={(e) => form.setData('new_value', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alasan Penyesuaian *</label>
                                <textarea value={form.data.reason} onChange={(e) => form.setData('reason', e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} required />
                            </div>
                            <button type="submit" disabled={form.processing} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                {form.processing ? 'Menyimpan...' : 'Simpan Penyesuaian'}
                            </button>
                        </form>
                    </div>

                    {/* History */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Riwayat Penyesuaian</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {recentAdjustments.length === 0 && <p className="text-sm text-gray-400">Belum ada penyesuaian.</p>}
                            {recentAdjustments.map((adj) => (
                                <div key={adj.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                                    <ArrowDownUp className="mt-0.5 h-4 w-4 text-gray-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-gray-100">{adj.reason}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {adj.adjustable_type} #{adj.adjustable_id}: {formatNumber(adj.old_value)} → {formatNumber(adj.new_value)} {adj.unit}
                                        </p>
                                        <p className="text-[10px] text-gray-400">{adj.user?.name} • {formatDateTime(adj.created_at)}</p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${(adj.new_value - adj.old_value) >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {(adj.new_value - adj.old_value) >= 0 ? '+' : ''}{formatNumber(adj.new_value - adj.old_value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

StockAdjustmentPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Stock Opname', href: '/inventory/stock-adjustment' }],
};
