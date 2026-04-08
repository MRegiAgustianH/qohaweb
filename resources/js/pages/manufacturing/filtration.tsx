import { Head, useForm } from '@inertiajs/react';
import { ArrowRight, Filter } from 'lucide-react';
import { formatDateTime, formatNumber } from '@/lib/format';
import type { Filtration, PaginatedData, Tank } from '@/types/models';

interface Props {
    filtrations: PaginatedData<Filtration>;
    tanks: Tank[];
}

export default function FiltrationPage({ filtrations, tanks }: Props) {
    const mainTank = tanks.find(t => t.slug === 'utama');
    const specificTanks = tanks.filter(t => t.slug !== 'utama');
    const form = useForm({ source_tank_id: mainTank?.id?.toString() || '', destination_tank_id: '', liters_transferred: '', notes: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/manufacturing/filtration', { onSuccess: () => form.reset() });
    };

    return (
        <>
            <Head title="Filterisasi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Filterisasi</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transfer air dari Tangki Utama ke Tangki Spesifik</p>
                </div>

                {/* Tank Overview */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {tanks.map(t => {
                        const pct = t.capacity_liters > 0 ? (t.current_volume_liters / t.capacity_liters) * 100 : 0;
                        return (
                            <div key={t.id} className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-950">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <span>{t.name}</span><span>{pct.toFixed(1)}%</span>
                                </div>
                                <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div className={`h-2 rounded-full transition-all ${pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-yellow-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                </div>
                                <p className="mt-0.5 text-xs text-gray-500">{formatNumber(t.current_volume_liters)} / {formatNumber(t.capacity_liters)} L</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Input Filterisasi</h2>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tangki Asal *</label>
                                <select value={form.data.source_tank_id} onChange={(e) => form.setData('source_tank_id', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required>
                                    <option value="">-- Pilih --</option>
                                    {tanks.map(t => <option key={t.id} value={t.id}>{t.name} ({formatNumber(t.current_volume_liters)} L)</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tangki Tujuan *</label>
                                <select value={form.data.destination_tank_id} onChange={(e) => form.setData('destination_tank_id', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required>
                                    <option value="">-- Pilih --</option>
                                    {tanks.filter(t => t.id !== Number(form.data.source_tank_id)).map(t => <option key={t.id} value={t.id}>{t.name} ({formatNumber(t.current_volume_liters)} L)</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Volume Transfer (Liter) *</label>
                                <input type="number" step="0.01" value={form.data.liters_transferred} onChange={(e) => form.setData('liters_transferred', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                                {form.errors.liters_transferred && <p className="mt-1 text-xs text-red-500">{form.errors.liters_transferred}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
                                <textarea value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                            </div>
                            <button type="submit" disabled={form.processing} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                                {form.processing ? 'Memproses...' : 'Proses Filterisasi'}
                            </button>
                        </form>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Riwayat Filterisasi</h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {filtrations.data.length === 0 && <p className="text-sm text-gray-400">Belum ada filterisasi.</p>}
                            {filtrations.data.map((f) => (
                                <div key={f.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                                    <Filter className="h-4 w-4 text-blue-500 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-medium">{f.source_tank?.name}</span>
                                            <ArrowRight className="h-3 w-3 text-gray-400" />
                                            <span className="font-medium">{f.destination_tank?.name}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">{f.user?.name} • {formatDateTime(f.created_at)}</p>
                                    </div>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{formatNumber(f.liters_transferred)} L</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

FiltrationPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Filterisasi', href: '/manufacturing/filtration' }],
};
