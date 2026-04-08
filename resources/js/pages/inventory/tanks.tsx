import { Head, useForm } from '@inertiajs/react';
import { Droplets, Edit, X } from 'lucide-react';
import { useState } from 'react';
import { formatNumber } from '@/lib/format';
import type { Tank } from '@/types/models';

interface Props { tanks: Tank[]; }

export default function TanksPage({ tanks }: Props) {
    const [editing, setEditing] = useState<Tank | null>(null);

    return (
        <>
            <Head title="Tangki Air" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tangki Air</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pemantauan volume & pengaturan kapasitas tangki</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {tanks.map((tank) => {
                        const pct = tank.capacity_liters > 0 ? (tank.current_volume_liters / tank.capacity_liters) * 100 : 0;
                        const color = pct < 20 ? 'red' : pct < 50 ? 'yellow' : 'cyan';
                        const bgMap: Record<string, string> = { red: 'from-red-500 to-red-400', yellow: 'from-yellow-500 to-yellow-400', cyan: 'from-cyan-500 to-cyan-400' };
                        const textMap: Record<string, string> = { red: 'text-red-600 dark:text-red-400', yellow: 'text-yellow-600 dark:text-yellow-400', cyan: 'text-cyan-600 dark:text-cyan-400' };

                        return (
                            <div key={tank.id} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`rounded-lg p-2 ${color === 'cyan' ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' : color === 'yellow' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        <Droplets className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tank.name}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{tank.slug}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditing(tank)}
                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 transition"
                                        title="Edit kapasitas"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Visual Tank */}
                                <div className="relative mx-auto mb-4 h-40 w-24 rounded-b-2xl rounded-t-lg border-2 border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                                    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${bgMap[color]} transition-all duration-700 ease-out`} style={{ height: `${Math.min(pct, 100)}%` }}>
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 animate-pulse" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-lg font-bold ${textMap[color]} drop-shadow-sm`}>{pct.toFixed(0)}%</span>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatNumber(tank.current_volume_liters)} L</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">dari {formatNumber(tank.capacity_liters)} L</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Edit Modal */}
                {editing && <TankEditModal tank={editing} onClose={() => setEditing(null)} />}
            </div>
        </>
    );
}

TanksPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Tangki Air', href: '/inventory/tanks' }],
};

function TankEditModal({ tank, onClose }: { tank: Tank; onClose: () => void }) {
    const form = useForm({
        name: tank.name,
        capacity_liters: tank.capacity_liters.toString(),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/inventory/tanks/${tank.id}`, { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Edit Tangki</h2>
                    <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Tangki *</label>
                        <input
                            type="text"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            required
                        />
                        {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kapasitas (Liter) *</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={form.data.capacity_liters}
                            onChange={(e) => form.setData('capacity_liters', e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            required
                        />
                        {form.errors.capacity_liters && <p className="mt-1 text-xs text-red-500">{form.errors.capacity_liters}</p>}
                    </div>

                    {/* Info box */}
                    <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-700 dark:text-blue-400">
                            <strong>Volume saat ini:</strong> {formatNumber(tank.current_volume_liters)} Liter
                        </p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-500 mt-0.5">
                            Volume aktual hanya bisa diubah melalui menu Stock Opname.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                            Batal
                        </button>
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
