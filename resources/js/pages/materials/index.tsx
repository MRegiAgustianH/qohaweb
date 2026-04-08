import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Material, PaginatedData } from '@/types/models';

interface Props {
    materials: PaginatedData<Material>;
    filters: { search?: string };
}

export default function MaterialsIndex({ materials, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Material | null>(null);

    return (
        <>
            <Head title="Material" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Material</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Material kemasan untuk produksi</p>
                    </div>
                    <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                        <Plus className="h-4 w-4" /> Tambah Material
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.get('/materials', { search }, { preserveState: true }); }} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari material..." className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                    </div>
                </form>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Nama Material</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Satuan</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Stok Saat Ini</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Terhubung Produk</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {materials.data.length === 0 && (
                                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Belum ada material.</td></tr>
                            )}
                            {materials.data.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{material.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{material.unit}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-sm font-bold ${material.current_stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                            {material.current_stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">{material.products_count || 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => { setEditing(material); setShowForm(true); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => { if (confirm('Hapus material ini?')) router.delete(`/materials/${material.id}`); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && <MaterialFormModal material={editing} onClose={() => { setShowForm(false); setEditing(null); }} />}
            </div>
        </>
    );
}

MaterialsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Material', href: '/materials' }],
};

function MaterialFormModal({ material, onClose }: { material: Material | null; onClose: () => void }) {
    const isEditing = !!material;
    const form = useForm({
        name: material?.name || '',
        unit: material?.unit || 'pcs',
        current_stock: material?.current_stock?.toString() || '0',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) form.put(`/materials/${material!.id}`, { onSuccess: onClose });
        else form.post('/materials', { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Material' : 'Tambah Material'}</h2>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Material *</label>
                        <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Satuan *</label>
                        <input type="text" value={form.data.unit} onChange={(e) => form.setData('unit', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    {!isEditing && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stok Awal</label>
                            <input type="number" min="0" value={form.data.current_stock} onChange={(e) => form.setData('current_stock', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                        </div>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300">Batal</button>
                        <button type="submit" disabled={form.processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{form.processing ? 'Menyimpan...' : 'Simpan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
