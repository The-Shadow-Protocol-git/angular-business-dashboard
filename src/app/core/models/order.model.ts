export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderCustomer {
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
  customer: OrderCustomer;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderWriteRequest {
  customerId: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}
