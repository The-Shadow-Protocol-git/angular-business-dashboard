import { Customer, DashboardData, Order, Product } from '../models/business.models';

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUS-2048', name: 'Olivia Rhye', email: 'olivia@example.com', phone: '+1 415 555 0184', status: 'active', createdAt: '2026-09-28T10:00:00Z' },
  { id: 'CUS-2047', name: 'Phoenix Baker', email: 'phoenix@example.com', phone: '+1 415 555 0142', status: 'active', createdAt: '2026-09-25T10:00:00Z' },
  { id: 'CUS-2046', name: 'Lana Steiner', email: 'lana@example.com', phone: '+1 415 555 0168', status: 'active', createdAt: '2026-09-21T10:00:00Z' },
  { id: 'CUS-2045', name: 'Demi Wilkinson', email: 'demi@example.com', phone: '+1 415 555 0109', status: 'inactive', createdAt: '2026-09-18T10:00:00Z' },
  { id: 'CUS-2044', name: 'Candice Wu', email: 'candice@example.com', phone: '+1 415 555 0112', status: 'active', createdAt: '2026-09-15T10:00:00Z' },
  { id: 'CUS-2043', name: 'Natali Craig', email: 'natali@example.com', phone: '+1 415 555 0133', status: 'active', createdAt: '2026-09-12T10:00:00Z' },
  { id: 'CUS-2042', name: 'Drew Cano', email: 'drew@example.com', phone: '+1 415 555 0173', status: 'active', createdAt: '2026-09-08T10:00:00Z' },
  { id: 'CUS-2041', name: 'Orlando Diggs', email: 'orlando@example.com', phone: '+1 415 555 0187', status: 'active', createdAt: '2026-09-03T10:00:00Z' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'PRD-3201', name: 'Wireless Headphones', sku: 'AUD-001', price: 129, stock: 48, category: 'Electronics', status: 'active' },
  { id: 'PRD-3202', name: 'Everyday Backpack', sku: 'BAG-014', price: 84, stock: 12, category: 'Accessories', status: 'active' },
  { id: 'PRD-3203', name: 'Ceramic Desk Set', sku: 'HOM-022', price: 56, stock: 0, category: 'Home', status: 'inactive' },
  { id: 'PRD-3204', name: 'Trail Running Shoes', sku: 'APP-108', price: 145, stock: 27, category: 'Apparel', status: 'active' },
  { id: 'PRD-3205', name: 'Insulated Water Bottle', sku: 'OUT-044', price: 32, stock: 86, category: 'Outdoor', status: 'active' },
  { id: 'PRD-3206', name: 'Minimalist Watch', sku: 'ACC-031', price: 210, stock: 8, category: 'Accessories', status: 'active' },
  { id: 'PRD-3207', name: 'Linen Throw', sku: 'HOM-036', price: 72, stock: 19, category: 'Home', status: 'active' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1024', customer: { id: 'CUS-2048', name: 'Olivia Rhye', email: 'olivia@example.com' }, total: 249, status: 'completed', createdAt: '2026-10-07T09:20:00Z', items: [{ productId: 'PRD-3201', productName: 'Wireless Headphones', quantity: 1, unitPrice: 129 }, { productId: 'PRD-3202', productName: 'Everyday Backpack', quantity: 1, unitPrice: 84 }, { productId: 'PRD-3205', productName: 'Insulated Water Bottle', quantity: 1, unitPrice: 32 }] },
  { id: 'ORD-1023', customer: { id: 'CUS-2047', name: 'Phoenix Baker', email: 'phoenix@example.com' }, total: 480, status: 'pending', createdAt: '2026-10-06T15:10:00Z', items: [{ productId: 'PRD-3206', productName: 'Minimalist Watch', quantity: 2, unitPrice: 210 }, { productId: 'PRD-3205', productName: 'Insulated Water Bottle', quantity: 2, unitPrice: 30 }] },
  { id: 'ORD-1022', customer: { id: 'CUS-2046', name: 'Lana Steiner', email: 'lana@example.com' }, total: 125, status: 'processing', createdAt: '2026-10-06T11:45:00Z', items: [{ productId: 'PRD-3201', productName: 'Wireless Headphones', quantity: 1, unitPrice: 125 }] },
  { id: 'ORD-1021', customer: { id: 'CUS-2045', name: 'Demi Wilkinson', email: 'demi@example.com' }, total: 760, status: 'cancelled', createdAt: '2026-10-05T14:00:00Z', items: [{ productId: 'PRD-3206', productName: 'Minimalist Watch', quantity: 3, unitPrice: 210 }, { productId: 'PRD-3204', productName: 'Trail Running Shoes', quantity: 1, unitPrice: 130 }] },
  { id: 'ORD-1020', customer: { id: 'CUS-2044', name: 'Candice Wu', email: 'candice@example.com' }, total: 145, status: 'completed', createdAt: '2026-10-04T16:25:00Z', items: [{ productId: 'PRD-3204', productName: 'Trail Running Shoes', quantity: 1, unitPrice: 145 }] },
  { id: 'ORD-1019', customer: { id: 'CUS-2043', name: 'Natali Craig', email: 'natali@example.com' }, total: 214, status: 'completed', createdAt: '2026-10-03T12:30:00Z', items: [{ productId: 'PRD-3202', productName: 'Everyday Backpack', quantity: 1, unitPrice: 84 }, { productId: 'PRD-3207', productName: 'Linen Throw', quantity: 1, unitPrice: 72 }, { productId: 'PRD-3205', productName: 'Insulated Water Bottle', quantity: 1, unitPrice: 32 }] },
  { id: 'ORD-1018', customer: { id: 'CUS-2042', name: 'Drew Cano', email: 'drew@example.com' }, total: 56, status: 'pending', createdAt: '2026-10-02T08:40:00Z', items: [{ productId: 'PRD-3203', productName: 'Ceramic Desk Set', quantity: 1, unitPrice: 56 }] },
  { id: 'ORD-1017', customer: { id: 'CUS-2041', name: 'Orlando Diggs', email: 'orlando@example.com' }, total: 177, status: 'completed', createdAt: '2026-10-01T17:05:00Z', items: [{ productId: 'PRD-3201', productName: 'Wireless Headphones', quantity: 1, unitPrice: 129 }, { productId: 'PRD-3205', productName: 'Insulated Water Bottle', quantity: 1, unitPrice: 32 }] },
];

const labels6 = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const values6 = [18200, 21400, 19800, 26700, 23900, 31200];
const labels12 = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', ...labels6];
const values12 = [15300, 22400, 19100, 20800, 17600, 24600, ...values6];

export const MOCK_DASHBOARD: DashboardData = {
  stats: { revenue: 24500, revenueChange: 12.5, orders: 1248, ordersChange: 8.2, customers: 856, customersChange: 5.4, conversionRate: 4.8, conversionChange: 1.2 },
  revenue: {
    '6m': labels6.map((label, index) => ({ label, value: values6[index] })),
    '12m': labels12.map((label, index) => ({ label, value: values12[index] })),
    year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((label, index) => ({ label, value: [19100, 20800, 17600, 24600, ...values6][index] })),
  },
  recentOrders: MOCK_ORDERS.slice(0, 4),
};
