import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    CircleDollarSign,
    ClipboardList,
    Droplets,
    Factory,
    Filter,
    LayoutGrid,
    Package,
    PackageOpen,
    Receipt,
    ShoppingCart,
    Truck,
    Users,
    Building2,
    Warehouse,
    Settings,
    ShieldCheck,
    UserCog,
    FileSpreadsheet,
    Layers,
    ArrowDownUp,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const masterDataItems: NavItem[] = [
    {
        title: 'Supplier',
        href: '/suppliers',
        icon: Building2,
    },
    {
        title: 'Pelanggan',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Produk',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Material',
        href: '/materials',
        icon: Layers,
    },
];

const inventoryItems: NavItem[] = [
    {
        title: 'Tangki Air',
        href: '/inventory/tanks',
        icon: Droplets,
    },
    {
        title: 'Material Kemasan',
        href: '/inventory/materials',
        icon: Box,
    },
    {
        title: 'Barang Jadi',
        href: '/inventory/finished-goods',
        icon: PackageOpen,
    },
    {
        title: 'Stock Opname',
        href: '/inventory/stock-adjustment',
        icon: ArrowDownUp,
    },
];

const manufacturingItems: NavItem[] = [
    {
        title: 'Pembelian Air',
        href: '/manufacturing/purchase',
        icon: Truck,
    },
    {
        title: 'Filterisasi',
        href: '/manufacturing/filtration',
        icon: Filter,
    },
    {
        title: 'Pengemasan',
        href: '/manufacturing/packaging',
        icon: Factory,
    },
];

const salesItems: NavItem[] = [
    {
        title: 'Pesanan Masuk',
        href: '/orders',
        icon: ClipboardList,
    },
    {
        title: 'Kasir (POS)',
        href: '/pos',
        icon: ShoppingCart,
    },
];

const financeItems: NavItem[] = [
    {
        title: 'Arus Kas',
        href: '/cashflow',
        icon: CircleDollarSign,
    },
];

const adminItems: NavItem[] = [
    {
        title: 'Kelola Pengguna',
        href: '/users',
        icon: UserCog,
    },
    {
        title: 'Role & Perizinan',
        href: '/roles',
        icon: ShieldCheck,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />

                <SidebarGroup>
                    <SidebarGroupLabel>Master Data</SidebarGroupLabel>
                    <NavMain items={masterDataItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Inventori</SidebarGroupLabel>
                    <NavMain items={inventoryItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Manufaktur</SidebarGroupLabel>
                    <NavMain items={manufacturingItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Penjualan</SidebarGroupLabel>
                    <NavMain items={salesItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Keuangan</SidebarGroupLabel>
                    <NavMain items={financeItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <NavMain items={adminItems} />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
