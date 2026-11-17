import { MenuItem } from './menu-item.model';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  priceAtOrder: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId: number;
  tableNumber: number;
  items: OrderItem[];
  status: 'Active' | 'Completed' | 'Cancelled';
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  completedAt?: Date;
  servedBy?: string;
}

export interface CreateOrderDto {
  tableId: number;
  items: { menuItemId: string; quantity: number; notes?: string }[];
}
