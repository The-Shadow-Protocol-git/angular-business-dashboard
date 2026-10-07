export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string;
}

export type CustomerWriteRequest = Omit<Customer, 'id' | 'createdAt'>;
