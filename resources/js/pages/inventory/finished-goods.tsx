import { Head } from '@inertiajs/react';
import { PackageOpen } from 'lucide-react';
import { formatRupiah } from '@/lib/format';
import type { FinishedGoodsStock } from '@/types/models';

interface Props { stocks: FinishedGoodsStock[]; }

export default function FinishedGoods({ stocks }: Props) {
    return (
        <>
            <Head title="Barang Jadi" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gudang Barang Jadi</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stok produk siap jual</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {stocks.map((s) => {
                        const product = s.product;
                        if (!product) return null;
                        const displayQty = product.sell_unit === 'Dus' && product.pcs_per_unit > 1
                            ? `${Math.floor(s.stock_pcs / product.pcs_per_unit)} Dus + ${s.stock_pcs % product.pcs_per_unit} Pcs`
                            : `${s.stock_pcs} Pcs`;

                        return (
                            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                                <div className="flex items-start gap-3">
                                    {product.image_path ? (
                                        <img src={`/storage/${product.image_path}`} alt={product.name} className="h-14 w-14 rounded-lg object-cover" />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                            <PackageOpen className="h-6 w-6" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{product.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatRupiah(product.price)} / {product.sell_unit}</p>
                                        <div className="mt-2">
                                            <p className={`text-xl font-bold ${s.stock_pcs < 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>{s.stock_pcs} pcs</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{displayQty}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

FinishedGoods.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Barang Jadi', href: '/inventory/finished-goods' }],
};
