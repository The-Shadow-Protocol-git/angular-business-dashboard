export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type CustomerStatus = 'active' | 'inactive';
export type ProductStatus = 'active' | 'inactive';
export type RevenueRange = '6m' | '12m' | 'year';

export interface CustomerReference {
  id: string;
  name: string;
  email: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customer: CustomerReference;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
}

export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  customers: number;
  customersChange: number;
  conversionRate: number;
  conversionChange: number;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenue: Record<RevenueRange, RevenuePoint[]>;
  recentOrders: Order[];
}

export type EntityType = 'orders' | 'customers' | 'products';

export interface ManagedRow {
  id: string;
  primary: string;
  secondary: string;
  value: number;
  status: string;
  date: string;
  inventory?: number;
}

export interface OrderDraft {
  customerId: string;
  total: number;
  status: OrderStatus;
  items?: OrderItem[];
}

export interface CustomerDraft {
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
}

export interface ProductDraft {
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
}
