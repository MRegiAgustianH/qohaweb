import { Head } from '@inertiajs/react';
import { Box } from 'lucide-react';
import type { Material } from '@/types/models';

interface Props { materials: Material[]; }

export default function InventoryMaterials({ materials }: Props) {
    return (
        <>
            <Head title="Stok Material" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gudang Material Kemasan</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stok material untuk kebutuhan produksi</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {materials.map((m) => (
                        <div key={m.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                        <Box className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{m.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{m.unit}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-2xl font-bold ${m.current_stock < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {m.current_stock}
                                    </p>
                                    {m.current_stock < 10 && <p className="text-[10px] text-red-500">Stok rendah!</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

InventoryMaterials.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Material Kemasan', href: '/inventory/materials' }],
};
