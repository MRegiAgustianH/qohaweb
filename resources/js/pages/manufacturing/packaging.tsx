import { Head, useForm } from '@inertiajs/react';
import { Factory } from 'lucide-react';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { PaginatedData, Product, Production, Tank } from '@/types/models';

interface Props {
    productions: PaginatedData<Production>;
    products: Product[];
    tanks: Tank[];
}

export default function PackagingPage({ productions, products, tanks }: Props) {
    const form = useForm({ product_id: '', qty_produced_pcs: '', qty_reject_pcs: '0', notes: '' });

    const selectedProduct = products.find(p => p.id === Number(form.data.product_id));
    const tank = tanks.find(t => t.slug === selectedProduct?.tank_type);
    const totalPcs = (Number(form.data.qty_produced_pcs) || 0) + (Number(form.data.qty_reject_pcs) || 0);
    const litersNeeded = totalPcs * (selectedProduct?.liters_per_pcs || 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/manufacturing/packaging', { onSuccess: () => form.reset() });
    };

    return (
        <>
            <Head title="Pengemasan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Pengemasan / Produksi</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mengemas air dari tangki menjadi produk jadi</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Input Produksi</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Produk *</label>
                                <select value={form.data.product_id} onChange={(e) => form.setData('product_id', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required>
                                    <option value="">-- Pilih Produk --</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name} (Tangki {p.tank_type})</option>)}
                                </select>
                            </div>

                            {selectedProduct && tank && (
                                <div className="rounded-lg bg-blue-50 p-3 space-y-1 dark:bg-blue-900/20">
                                    <p className="text-xs text-blue-700 dark:text-blue-400">
                                        <strong>Tangki {tank.name}:</strong> {formatNumber(tank.current_volume_liters)} L tersedia
                                    </p>
                                    <p className="text-xs text-blue-700 dark:text-blue-400">
                                        <strong>Kebutuhan air per pcs:</strong> {selectedProduct.liters_per_pcs} L
                                    </p>
                                    {selectedProduct.materials && selectedProduct.materials.length > 0 && (
                                        <p className="text-xs text-blue-700 dark:text-blue-400">
                                            <strong>Material:</strong> {selectedProduct.materials.map(m => m.name).join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty Produksi (Pcs) *</label>
                                    <input type="number" min="1" value={form.data.qty_produced_pcs} onChange={(e) => form.setData('qty_produced_pcs', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Qty Reject (Pcs)</label>
                                    <input type="number" min="0" value={form.data.qty_reject_pcs} onChange={(e) => form.setData('qty_reject_pcs', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                                </div>
                            </div>

                            {totalPcs > 0 && selectedProduct && (
                                <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        Total air digunakan: <strong>{formatNumber(litersNeeded, 2)} L</strong> ({totalPcs} pcs × {selectedProduct.liters_per_pcs} L)
                                    </p>
                                </div>
                            )}

                            {form.errors.qty_produced_pcs && <p className="text-xs text-red-500">{form.errors.qty_produced_pcs}</p>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
                                <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                            </div>

                            <button type="submit" disabled={form.processing} className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                                {form.processing ? 'Memproses...' : 'Catat Produksi'}
                            </button>
                        </form>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Riwayat Produksi</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {productions.data.length === 0 && <p className="text-sm text-gray-400">Belum ada produksi.</p>}
                            {productions.data.map((p) => (
                                <div key={p.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                                    <Factory className="mt-0.5 h-4 w-4 text-green-500 shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{p.product?.name}</p>
                                        <p className="text-xs text-gray-500">Tangki: {p.tank?.name} • Air: {formatNumber(p.liters_used)} L</p>
                                        <p className="text-[10px] text-gray-400">{p.user?.name} • {formatDateTime(p.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600 dark:text-green-400">+{p.qty_produced_pcs} pcs</p>
                                        {p.qty_reject_pcs > 0 && <p className="text-[10px] text-red-500">Reject: {p.qty_reject_pcs}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

PackagingPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pengemasan', href: '/manufacturing/packaging' }],
};
