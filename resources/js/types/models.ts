// ============================================
// Shared TypeScript types for the Qoha ERP
// ============================================

export interface Supplier {
    id: number;
    name: string;
    phone: string | null;
    address: string | null;
    price_per_liter: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string | null;
    notes: string | null;
    orders_count?: number;
    created_at: string;
    updated_at: string;
    orders?: Order[];
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    price: number;
    sell_unit: 'Pcs' | 'Dus';
    pcs_per_unit: number;
    liters_per_pcs: number;
    tank_type: 'gelas' | 'botol' | 'galon';
    is_active: boolean;
    show_in_catalog: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    finished_goods_stock?: FinishedGoodsStock;
    materials?: Material[];
}

export interface Tank {
    id: number;
    name: string;
    slug: string;
    capacity_liters: number;
    current_volume_liters: number;
    created_at: string;
    updated_at: string;
}

export interface Material {
    id: number;
    name: string;
    unit: string;
    current_stock: number;
    products_count?: number;
    pivot?: {
        qty_needed: number;
    };
    created_at: string;
    updated_at: string;
}

export interface FinishedGoodsStock {
    id: number;
    product_id: number;
    stock_pcs: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}

export interface RawWaterPurchase {
    id: number;
    supplier_id: number;
    user_id: number;
    liters: number;
    price_per_liter: number;
    total_cost: number;
    notes: string | null;
    purchase_date: string;
    supplier?: Supplier;
    user?: { id: number; name: string };
    created_at: string;
}

export interface Filtration {
    id: number;
    user_id: number;
    source_tank_id: number;
    destination_tank_id: number;
    liters_transferred: number;
    notes: string | null;
    user?: { id: number; name: string };
    source_tank?: Tank;
    destination_tank?: Tank;
    created_at: string;
}

export interface Production {
    id: number;
    user_id: number;
    product_id: number;
    tank_id: number;
    qty_produced_pcs: number;
    qty_reject_pcs: number;
    liters_used: number;
    notes: string | null;
    product?: Product;
    tank?: Tank;
    user?: { id: number; name: string };
    created_at: string;
}

export interface Order {
    id: number;
    customer_id: number;
    user_id: number | null;
    order_number: string;
    source: 'catalog' | 'pos';
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    subtotal: number;
    discount: number;
    total: number;
    customer_notes: string | null;
    admin_notes: string | null;
    customer?: Customer;
    user?: { id: number; name: string };
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    unit_sold: 'Pcs' | 'Dus';
    qty: number;
    qty_in_pcs: number;
    unit_price: number;
    subtotal: number;
    product?: Product;
}

export interface Cashflow {
    id: number;
    type: 'income' | 'expense';
    category: 'sale' | 'raw_water_purchase' | 'salary' | 'other';
    amount: number;
    description: string;
    reference_id: number | null;
    reference_type: string | null;
    user_id: number | null;
    transaction_date: string;
    user?: { id: number; name: string };
    created_at: string;
}

export interface StockAdjustment {
    id: number;
    adjustable_type: 'tank' | 'material' | 'finished_good';
    adjustable_id: number;
    old_value: number;
    new_value: number;
    unit: string;
    reason: string;
    user_id: number;
    user?: { id: number; name: string };
    created_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}
