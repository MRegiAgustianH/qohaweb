import { Head } from '@inertiajs/react';
import { Droplets, Package, Receipt, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import { formatRupiah, formatNumber, formatDateTime, getStatusColor, getStatusLabel } from '@/lib/format';
import type { Order, Production, Tank } from '@/types/models';

interface DashboardProps {
    stats: {
        todayOrders: number;
        todayIncome: number;
        mainTankVolume: number;
        mainTankCapacity: number;
        lowStockCount: number;
    };
    recentOrders: Order[];
    recentProductions: Production[];
    salesChart: { date: string; income: number }[];
    tanks: Tank[];
    monthly: {
        income: number;
        expense: number;
        profit: number;
    };
    lowStockProducts: { id: number; stock_pcs: number; product: { id: number; name: string } }[];
}

export default function Dashboard({
    stats,
    recentOrders,
    recentProductions,
    salesChart,
    tanks,
    monthly,
    lowStockProducts,
}: DashboardProps) {
    const tankPercentage = stats.mainTankCapacity > 0
        ? ((stats.mainTankVolume / stats.mainTankCapacity) * 100).toFixed(1)
        : '0';

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Ringkasan operasional PT Qoha Jaya Berkah
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Pesanan Hari Ini"
                        value={stats.todayOrders.toString()}
                        icon={<ShoppingCart className="h-5 w-5" />}
                        color="blue"
                    />
                    <StatCard
                        title="Pendapatan Hari Ini"
                        value={formatRupiah(stats.todayIncome)}
                        icon={<Receipt className="h-5 w-5" />}
                        color="green"
                    />
                    <StatCard
                        title="Tangki Utama"
                        value={`${formatNumber(stats.mainTankVolume)} L`}
                        subtitle={`${tankPercentage}% dari ${formatNumber(stats.mainTankCapacity)} L`}
                        icon={<Droplets className="h-5 w-5" />}
                        color="cyan"
                    />
                    <StatCard
                        title="Stok Rendah"
                        value={stats.lowStockCount.toString()}
                        subtitle={stats.lowStockCount > 0 ? 'Produk perlu restok' : 'Semua stok aman'}
                        icon={<Package className="h-5 w-5" />}
                        color={stats.lowStockCount > 0 ? 'red' : 'green'}
                    />
                </div>

                {/* Monthly Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800/50 dark:bg-green-950/30">
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <TrendingUp className="h-4 w-4" />
                            Pemasukan Bulan Ini
                        </div>
                        <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-300">
                            {formatRupiah(monthly.income)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800/50 dark:bg-red-950/30">
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <TrendingDown className="h-4 w-4" />
                            Pengeluaran Bulan Ini
                        </div>
                        <p className="mt-1 text-xl font-bold text-red-700 dark:text-red-300">
                            {formatRupiah(monthly.expense)}
                        </p>
                    </div>
                    <div className={`rounded-xl border p-4 ${monthly.profit >= 0 ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/30' : 'border-orange-200 bg-orange-50 dark:border-orange-800/50 dark:bg-orange-950/30'}`}>
                        <div className={`flex items-center gap-2 text-sm ${monthly.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            {monthly.profit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                            Laba/Rugi Bulan Ini
                        </div>
                        <p className={`mt-1 text-xl font-bold ${monthly.profit >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'}`}>
                            {formatRupiah(monthly.profit)}
                        </p>
                    </div>
                </div>

                {/* Tank Gauges */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Volume Tangki</h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {tanks.map((tank) => {
                            const pct = tank.capacity_liters > 0
                                ? (tank.current_volume_liters / tank.capacity_liters) * 100
                                : 0;
                            const barColor = pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-yellow-500' : 'bg-cyan-500';
                            return (
                                <div key={tank.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                        <span>{tank.name}</span>
                                        <span>{pct.toFixed(1)}%</span>
                                    </div>
                                    <div className="mt-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {formatNumber(tank.current_volume_liters)} / {formatNumber(tank.capacity_liters)} L
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sales Chart (Simple Bar) */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Penjualan 7 Hari Terakhir</h3>
                    <div className="flex items-end gap-2" style={{ height: '160px' }}>
                        {salesChart.map((day, i) => {
                            const maxIncome = Math.max(...salesChart.map(d => d.income), 1);
                            const heightPct = (day.income / maxIncome) * 100;
                            return (
                                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                        {day.income > 0 ? formatRupiah(day.income) : ''}
                                    </span>
                                    <div className="w-full flex-1 flex items-end">
                                        <div
                                            className="w-full rounded-t bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-500"
                                            style={{ height: `${Math.max(heightPct, 2)}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{day.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section: Recent Orders + Low Stock */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Pesanan Terbaru</h3>
                        <div className="space-y-3">
                            {recentOrders.length === 0 && (
                                <p className="text-sm text-gray-400">Belum ada pesanan.</p>
                            )}
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.order_number}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer?.name} • {formatDateTime(order.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <p className="mt-0.5 text-sm font-medium text-gray-900 dark:text-gray-100">{formatRupiah(order.total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alert / Recent Production */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
                        <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Produksi Terbaru</h3>
                        <div className="space-y-3">
                            {recentProductions.length === 0 && (
                                <p className="text-sm text-gray-400">Belum ada produksi.</p>
                            )}
                            {recentProductions.map((prod) => (
                                <div key={prod.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{prod.product?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Oleh {prod.user?.name} • {formatDateTime(prod.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600 dark:text-green-400">+{prod.qty_produced_pcs} pcs</p>
                                        {prod.qty_reject_pcs > 0 && (
                                            <p className="text-[10px] text-red-500">Reject: {prod.qty_reject_pcs}</p>
                                        )}
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

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};

/* ---- Stat Card Component ---- */
function StatCard({
    title,
    value,
    subtitle,
    icon,
    color,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        cyan: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
        red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
        yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <div className={`rounded-lg p-2 ${colorMap[color] || colorMap.blue}`}>
                    {icon}
                </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {subtitle && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
        </div>
    );
}
