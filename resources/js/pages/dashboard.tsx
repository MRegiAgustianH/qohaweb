import { Head } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight, Droplets, Package, Receipt, ShoppingBag, TrendingUp } from 'lucide-react';
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

    const maxIncome = Math.max(...salesChart.map(d => d.income), 1);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 md:p-6 bg-slate-50/50 dark:bg-gray-900/40">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ringkasan operasional dan keuangan PT Qoha Jaya Berkah
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Pesanan Hari Ini"
                        value={stats.todayOrders.toString()}
                        subtitle="Total transaksi hari ini"
                        icon={<ShoppingBag className="h-5 w-5 text-slate-700 dark:text-slate-200" />}
                        iconBg="bg-slate-100 dark:bg-slate-800"
                    />
                    <StatCard
                        title="Pendapatan Hari Ini"
                        value={formatRupiah(stats.todayIncome)}
                        subtitle="Penerimaan penjualan"
                        icon={<Receipt className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />}
                        iconBg="bg-emerald-50 dark:bg-emerald-950/50"
                    />
                    <StatCard
                        title="Tangki Utama"
                        value={`${formatNumber(stats.mainTankVolume)} L`}
                        subtitle={`${tankPercentage}% dari ${formatNumber(stats.mainTankCapacity)} L`}
                        icon={<Droplets className="h-5 w-5 text-teal-700 dark:text-teal-400" />}
                        iconBg="bg-teal-50 dark:bg-teal-950/50"
                    />
                    <StatCard
                        title="Stok Rendah"
                        value={stats.lowStockCount.toString()}
                        subtitle={stats.lowStockCount > 0 ? 'Perlu tindakan restok' : 'Semua stok aman'}
                        icon={<Package className={`h-5 w-5 ${stats.lowStockCount > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`} />}
                        iconBg={stats.lowStockCount > 0 ? 'bg-amber-50 dark:bg-amber-950/50' : 'bg-slate-100 dark:bg-slate-800'}
                    />
                </div>

                {/* Monthly Summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Pemasukan Bulan Ini
                            </span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <ArrowUpRight className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                            {formatRupiah(monthly.income)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Pengeluaran Bulan Ini
                            </span>
                            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
                                <ArrowDownRight className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="mt-3 text-2xl font-bold tracking-tight text-rose-700 dark:text-rose-400">
                            {formatRupiah(monthly.expense)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Laba/Rugi Bulan Ini
                            </span>
                            <div className={`flex h-7 w-7 items-center justify-center rounded-md ${monthly.profit >= 0 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                                <TrendingUp className="h-4 w-4" />
                            </div>
                        </div>
                        <p className={`mt-3 text-2xl font-bold tracking-tight ${monthly.profit >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-amber-700 dark:text-amber-400'}`}>
                            {formatRupiah(monthly.profit)}
                        </p>
                    </div>
                </div>

                {/* Tank Gauges */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Volume Tangki</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Kapasitas dan ketersediaan air saat ini</p>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {tanks.map((tank) => {
                            const pct = tank.capacity_liters > 0
                                ? (tank.current_volume_liters / tank.capacity_liters) * 100
                                : 0;
                            const barColor = pct < 20 ? 'bg-rose-500' : pct < 50 ? 'bg-amber-500' : 'bg-emerald-600';
                            return (
                                <div key={tank.id} className="rounded-lg border border-gray-100 bg-gray-50/70 p-3.5 dark:border-gray-800/80 dark:bg-gray-900/60">
                                    <div className="flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
                                        <span className="font-semibold">{tank.name}</span>
                                        <span className="font-mono text-gray-600 dark:text-gray-400">{pct.toFixed(1)}%</span>
                                    </div>
                                    <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                                        <span>{formatNumber(tank.current_volume_liters)} L</span>
                                        <span>Kapasitas {formatNumber(tank.capacity_liters)} L</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sales Chart (Solid Clean Bars) */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Penjualan 7 Hari Terakhir</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Aktivitas omset harian</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-3 pt-4" style={{ height: '170px' }}>
                        {salesChart.map((day, i) => {
                            const heightPct = (day.income / maxIncome) * 100;
                            return (
                                <div key={i} className="group relative flex flex-1 flex-col items-center gap-2 h-full justify-end">
                                    <div className="text-[10px] font-medium text-gray-500 opacity-80 dark:text-gray-400">
                                        {day.income > 0 ? formatRupiah(day.income) : '-'}
                                    </div>
                                    <div className="w-full max-w-[48px] flex-1 flex items-end">
                                        <div
                                            className="w-full rounded-t-sm bg-emerald-700 group-hover:bg-emerald-800 dark:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors"
                                            style={{ height: `${Math.max(heightPct, 4)}%` }}
                                        />
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400">{day.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section: Recent Orders + Recent Production */}
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Recent Orders */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pesanan Terbaru</h3>
                            <span className="text-xs text-gray-400">{recentOrders.length} transaksi</span>
                        </div>
                        <div className="space-y-2.5">
                            {recentOrders.length === 0 && (
                                <p className="py-6 text-center text-sm text-gray-400">Belum ada pesanan.</p>
                            )}
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/40 p-3 dark:border-gray-800/70 dark:bg-gray-900/40">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{order.order_number}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {order.customer?.name || 'Pelanggan Umum'} • {formatDateTime(order.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatRupiah(order.total)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Production */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Produksi Terbaru</h3>
                            <span className="text-xs text-gray-400">{recentProductions.length} aktivitas</span>
                        </div>
                        <div className="space-y-2.5">
                            {recentProductions.length === 0 && (
                                <p className="py-6 text-center text-sm text-gray-400">Belum ada produksi.</p>
                            )}
                            {recentProductions.map((prod) => (
                                <div key={prod.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/40 p-3 dark:border-gray-800/70 dark:bg-gray-900/40">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{prod.product?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Oleh {prod.user?.name || 'Operator'} • {formatDateTime(prod.created_at)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">+{prod.qty_produced_pcs} pcs</p>
                                        {prod.qty_reject_pcs > 0 && (
                                            <p className="text-[10px] text-rose-500">Reject: {prod.qty_reject_pcs} pcs</p>
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
    iconBg,
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: React.ReactNode;
    iconBg: string;
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</span>
                <div className={`rounded-lg p-2 ${iconBg}`}>
                    {icon}
                </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</p>
            {subtitle && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
        </div>
    );
}
