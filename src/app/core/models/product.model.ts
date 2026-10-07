export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: ProductStatus;
}

export type ProductWriteRequest = Omit<Product, 'id'>;
