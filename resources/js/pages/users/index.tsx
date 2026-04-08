import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { formatDateTime } from '@/lib/format';
import type { PaginatedData } from '@/types/models';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    roles: { id: number; name: string }[];
    created_at: string;
}

interface Role { id: number; name: string; }

interface Props {
    users: PaginatedData<User>;
    roles: Role[];
    filters: { search?: string };
}

export default function UsersIndex({ users, roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);

    return (
        <>
            <Head title="Kelola Pengguna" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kelola Pengguna</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Admin & Staff</p>
                    </div>
                    <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                        <Plus className="h-4 w-4" /> Tambah Pengguna
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.get('/users', { search }, { preserveState: true }); }} className="flex gap-2">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pengguna..." className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
                    </div>
                </form>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead><tr className="bg-gray-50 dark:bg-gray-900">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Nama</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Bergabung</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Aksi</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                                    <td className="px-4 py-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.phone || '-'}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.roles.map(r => (
                                            <span key={r.id} className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium mr-1 ${r.name === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                {r.name}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">{formatDateTime(user.created_at)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => { setEditing(user); setShowForm(true); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800"><Edit className="h-4 w-4" /></button>
                                            <button onClick={() => { if (confirm('Hapus pengguna ini?')) router.delete(`/users/${user.id}`); }} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"><Trash2 className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && <UserFormModal user={editing} roles={roles} onClose={() => { setShowForm(false); setEditing(null); }} />}
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Pengguna', href: '/users' }],
};

function UserFormModal({ user, roles, onClose }: { user: User | null; roles: Role[]; onClose: () => void }) {
    const isEditing = !!user;
    const form = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        role: user?.roles[0]?.name || 'staff',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) form.put(`/users/${user!.id}`, { onSuccess: onClose });
        else form.post('/users', { onSuccess: onClose });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
                <form onSubmit={submit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama *</label>
                        <input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                        <input type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telepon</label>
                        <input type="text" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role *</label>
                        <select value={form.data.role} onChange={(e) => form.setData('role', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password {isEditing ? '(kosongkan jika tidak diubah)' : '*'}</label>
                        <input type="password" value={form.data.password} onChange={(e) => form.setData('password', e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" {...(!isEditing && { required: true })} minLength={8} />
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
