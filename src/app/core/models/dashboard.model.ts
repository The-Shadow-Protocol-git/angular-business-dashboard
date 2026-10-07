import { Order } from './order.model';

export type RevenueRange = '6m' | '12m' | 'year';

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
