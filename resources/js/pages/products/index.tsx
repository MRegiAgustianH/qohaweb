import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatRupiah } from '@/lib/format';
import type { Material, PaginatedData, Product } from '@/types/models';

interface Props {
    products: PaginatedData<Product>;
    materials: Material[];
    filters: { search?: string };
}

export default function ProductsIndex({ products, materials, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    return (
        <>
            <Head title="Produk" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Produk</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Produk jadi dan satuan berjenjang</p>
                    </div>
                    <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                        <Plus className="h-4 w-4" /> Tambah Produk
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.get('/products', { search }, { preserveState: true }); }} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produk..." className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                    </div>
                </form>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Produk</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Harga</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Satuan</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tangki</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Stok (Pcs)</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {products.data.length === 0 && (
                                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Belum ada produk.</td></tr>
                            )}
                            {products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {product.image_path ? (
                                                <img src={`/storage/${product.image_path}`} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-gray-800">📦</div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{product.liters_per_pcs}L/pcs</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{formatRupiah(product.price)}/{product.sell_unit}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                        {product.sell_unit === 'Dus' ? `1 Dus = ${product.pcs_per_unit} Pcs` : 'Per Pcs'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">{product.tank_type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-gray-100">{product.finished_goods_stock?.stock_pcs ?? 0}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>
                                            {product.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => { setEditing(product); setShowForm(true); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => { if (confirm('Hapus produk ini?')) router.delete(`/products/${product.id}`); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {products.links.map((link, i) => (
                            <button key={i} disabled={!link.url} onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`rounded-lg px-3 py-1 text-sm transition ${link.active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'} ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}

                {showForm && <ProductFormModal product={editing} materials={materials} onClose={() => { setShowForm(false); setEditing(null); }} />}
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Produk', href: '/products' }],
};

function ProductFormModal({ product, materials, onClose }: { product: Product | null; materials: Material[]; onClose: () => void }) {
    const isEditing = !!product;
    const form = useForm({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price?.toString() || '',
        sell_unit: product?.sell_unit || 'Pcs',
        pcs_per_unit: product?.pcs_per_unit?.toString() || '1',
        liters_per_pcs: product?.liters_per_pcs?.toString() || '',
        tank_type: product?.tank_type || 'galon',
        is_active: product?.is_active ?? true,
        show_in_catalog: product?.show_in_catalog ?? true,
        sort_order: product?.sort_order?.toString() || '0',
        image: null as File | null,
        materials: (product?.materials || []).map((m) => ({ id: m.id, qty_needed: m.pivot?.qty_needed || 1 })),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form.data).forEach(([key, val]) => {
            if (key === 'image' && val) formData.append(key, val);
            else if (key === 'materials') formData.append(key, JSON.stringify(val));
            else if (val !== null) formData.append(key, String(val));
        });

        if (isEditing) {
            router.post(`/products/${product!.id}`, { ...form.data, _method: 'put' }, { onSuccess: onClose });
        } else {
            router.post('/products', form.data, { onSuccess: onClose });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Produk' : 'Tambah Produk'}</h2>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk *</label>
                        <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
                        <textarea value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" rows={2} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga (Rp) *</label>
                            <input type="number" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Satuan Jual *</label>
                            <select value={form.data.sell_unit} onChange={(e) => form.setData('sell_unit', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                                <option value="Pcs">Pcs</option>
                                <option value="Dus">Dus</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pcs/Unit</label>
                            <input type="number" min="1" value={form.data.pcs_per_unit} onChange={(e) => form.setData('pcs_per_unit', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Liter/Pcs</label>
                            <input type="number" step="0.0001" value={form.data.liters_per_pcs} onChange={(e) => form.setData('liters_per_pcs', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tangki</label>
                            <select value={form.data.tank_type} onChange={(e) => form.setData('tank_type', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                                <option value="galon">Galon</option>
                                <option value="gelas">Gelas</option>
                                <option value="botol">Botol</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar Produk</label>
                        <input type="file" accept="image/*" onChange={(e) => form.setData('image', e.target.files?.[0] || null)} className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" checked={form.data.is_active} onChange={(e) => form.setData('is_active', e.target.checked)} className="rounded border-gray-300 dark:border-gray-700" /> Aktif
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input type="checkbox" checked={form.data.show_in_catalog} onChange={(e) => form.setData('show_in_catalog', e.target.checked)} className="rounded border-gray-300 dark:border-gray-700" /> Tampil di Katalog
                        </label>
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
