import { Head, useForm } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';

interface Permission { id: number; name: string; }
interface Role { id: number; name: string; permissions: Permission[]; }
interface Props {
    roles: Role[];
    permissions: Record<string, Permission[]>;
}

export default function RolesPage({ roles, permissions }: Props) {
    return (
        <>
            <Head title="Role & Perizinan" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Role & Perizinan</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Atur akses setiap role</p>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    {roles.map((role) => (
                        <RoleCard key={role.id} role={role} permissions={permissions} />
                    ))}
                </div>
            </div>
        </>
    );
}

RolesPage.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Role & Perizinan', href: '/roles' }],
};

function RoleCard({ role, permissions }: { role: Role; permissions: Record<string, Permission[]> }) {
    const form = useForm({
        permissions: role.permissions.map(p => p.name),
    });

    const isChecked = (name: string) => form.data.permissions.includes(name);

    const toggle = (name: string) => {
        const updated = isChecked(name)
            ? form.data.permissions.filter(p => p !== name)
            : [...form.data.permissions, name];
        form.setData('permissions', updated);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/roles/${role.id}`);
    };

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

    const moduleLabels: Record<string, string> = {
        master_data: '📋 Master Data',
        inventory: '📦 Inventori',
        manufacturing: '🏭 Manufaktur',
        sales: '🛒 Penjualan',
        finance: '💰 Keuangan',
        admin: '⚙️ Admin',
    };

    return (
        <form onSubmit={submit} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-3 mb-4">
                <div className={`rounded-lg p-2 ${role.name === 'admin' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize">{role.name}</h3>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(permissions).map(([module, perms]) => (
                    <div key={module}>
                        <p className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{moduleLabels[module] || capitalize(module)}</p>
                        <div className="space-y-1">
                            {perms.map((perm) => {
                                const shortName = perm.name.split('.').slice(1).join('.').replace(/_/g, ' ');
                                return (
                                    <label key={perm.id} className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer">
                                        <input type="checkbox" checked={isChecked(perm.name)} onChange={() => toggle(perm.name)}
                                            className="rounded border-gray-300 text-blue-600 dark:border-gray-700" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{shortName}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <button type="submit" disabled={form.processing}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition">
                {form.processing ? 'Menyimpan...' : 'Simpan Perizinan'}
            </button>
        </form>
    );
}
