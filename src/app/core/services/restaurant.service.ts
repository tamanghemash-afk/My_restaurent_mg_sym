import { Injectable, signal, computed } from '@angular/core';
import {
  MenuItem,
  Table,
  Order,
  OrderItem,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  CreateOrderDto,
  DashboardStats,
} from '../models';
import { TAX_RATE } from '../constants';

const MENU_KEY = 'aurum_menu';
const TABLES_KEY = 'aurum_tables';
const ORDERS_KEY = 'aurum_orders';

const DEFAULT_MENU: MenuItem[] = [
  { id: '1', name: 'Truffle Mushroom Risotto', category: 'Mains', price: 18.50, description: 'Arborio rice with black truffle and wild mushrooms', available: true },
  { id: '2', name: 'Artisan Burrata Salad', category: 'Appetizers', price: 12.00, description: 'Fresh burrata, heirloom tomatoes, basil pesto', available: true },
  { id: '3', name: 'Matcha Lava Cake', category: 'Desserts', price: 8.50, description: 'Warm matcha cake with white chocolate center', available: true },
  { id: '4', name: 'Sparkling Yuzu Cold Brew', category: 'Beverages', price: 5.50, description: 'Cold brew coffee with yuzu citrus', available: true },
];

const DEFAULT_TABLES: Table[] = [
  { id: 1, name: 'Table 1', capacity: 2, status: 'Available' },
  { id: 2, name: 'Table 2', capacity: 4, status: 'Available' },
  { id: 3, name: 'Table 3', capacity: 2, status: 'Available' },
  { id: 4, name: 'Table 4', capacity: 6, status: 'Available' },
  { id: 5, name: 'Table 5', capacity: 4, status: 'Available' },
  { id: 6, name: 'Table 6', capacity: 8, status: 'Available' },
];

const DEFAULT_ORDERS: Order[] = [];

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private menu = signal<MenuItem[]>(loadFromStorage(MENU_KEY, DEFAULT_MENU));
  private tables = signal<Table[]>(loadFromStorage(TABLES_KEY, DEFAULT_TABLES));
  private orders = signal<Order[]>(loadFromStorage(ORDERS_KEY, DEFAULT_ORDERS));

  readonly menuItems = computed(() => this.menu());
  readonly allTables = computed(() => this.tables());
  readonly allOrders = computed(() => this.orders());

  readonly availableTables = computed(() => this.tables().filter(t => t.status === 'Available'));
  readonly reservedTables = computed(() => this.tables().filter(t => t.status === 'Reserved'));
  readonly occupiedTables = computed(() => this.tables().filter(t => t.status === 'Occupied'));

  readonly activeOrders = computed(() => this.orders().filter(o => o.status === 'Active'));
  readonly completedOrders = computed(() => this.orders().filter(o => o.status === 'Completed'));

  readonly dashboardStats = computed<DashboardStats>(() => {
    const tables = this.tables();
    const orders = this.orders();
    const completed = orders.filter(o => o.status === 'Completed');
    return {
      totalOrders: orders.length,
      activeOrders: orders.filter(o => o.status === 'Active').length,
      completedOrders: completed.length,
      totalRevenue: completed.reduce((sum, o) => sum + o.total, 0),
      totalTables: tables.length,
      availableTables: tables.filter(t => t.status === 'Available').length,
      reservedTables: tables.filter(t => t.status === 'Reserved').length,
      occupiedTables: tables.filter(t => t.status === 'Occupied').length,
    };
  });

  getMenuItem(id: string): MenuItem | undefined {
    return this.menu().find(i => i.id === id);
  }

  getTable(id: number): Table | undefined {
    return this.tables().find(t => t.id === id);
  }

  getOrder(id: string): Order | undefined {
    return this.orders().find(o => o.id === id);
  }

  getActiveOrderForTable(tableId: number): Order | undefined {
    return this.orders().find(o => o.tableId === tableId && o.status === 'Active');
  }

  addMenuItem(dto: CreateMenuItemDto): MenuItem {
    const item: MenuItem = {
      id: crypto.randomUUID(),
      ...dto,
      available: dto.available ?? true,
    };
    this.menu.update(prev => [...prev, item]);
    saveToStorage(MENU_KEY, this.menu());
    return item;
  }

  updateMenuItem(id: string, dto: UpdateMenuItemDto): MenuItem | null {
    const item = this.getMenuItem(id);
    if (!item) return null;
    const updated = { ...item, ...dto };
    this.menu.update(prev => prev.map(i => (i.id === id ? updated : i)));
    saveToStorage(MENU_KEY, this.menu());
    return updated;
  }

  removeMenuItem(id: string): boolean {
    const exists = this.getMenuItem(id);
    if (!exists) return false;
    this.menu.update(prev => prev.filter(i => i.id !== id));
    saveToStorage(MENU_KEY, this.menu());
    return true;
  }

  toggleMenuItemAvailability(id: string): MenuItem | null {
    const item = this.getMenuItem(id);
    if (!item) return null;
    return this.updateMenuItem(id, { available: !item.available });
  }

  updateTableStatus(tableId: number, status: Table['status']): Table | null {
    const table = this.getTable(tableId);
    if (!table) return null;
    const updated = { ...table, status };
    this.tables.update(prev => prev.map(t => (t.id === tableId ? updated : t)));
    saveToStorage(TABLES_KEY, this.tables());
    return updated;
  }

  addTable(capacity: number, status: Table['status'] = 'Available'): Table | null {
    const nextId = Math.max(...this.tables().map(t => t.id), 0) + 1;
    const table: Table = {
      id: nextId,
      name: `Table ${nextId}`,
      capacity,
      status,
    };
    this.tables.update(prev => [...prev, table]);
    saveToStorage(TABLES_KEY, this.tables());
    return table;
  }

  placeOrder(dto: CreateOrderDto, servedBy?: string): Order | null {
    const table = this.getTable(dto.tableId);
    if (!table) return null;

    const orderItems: OrderItem[] = dto.items.map(itemDto => {
      const menuItem = this.getMenuItem(itemDto.menuItemId);
      if (!menuItem) throw new Error(`Menu item ${itemDto.menuItemId} not found`);
      return {
        id: crypto.randomUUID(),
        menuItemId: itemDto.menuItemId,
        menuItem,
        quantity: itemDto.quantity,
        priceAtOrder: menuItem.price,
        notes: itemDto.notes,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const order: Order = {
      id: crypto.randomUUID(),
      tableId: dto.tableId,
      tableNumber: table.id,
      items: orderItems,
      status: 'Active',
      subtotal,
      tax,
      total,
      createdAt: new Date(),
      servedBy,
    };

    this.orders.update(prev => [...prev, order]);
    this.updateTableStatus(dto.tableId, 'Occupied');
    saveToStorage(ORDERS_KEY, this.orders());
    return order;
  }

  completeOrder(orderId: string): Order | null {
    const order = this.getOrder(orderId);
    if (!order || order.status !== 'Active') return null;
    const updated: Order = { ...order, status: 'Completed', completedAt: new Date() };
    this.orders.update((prev: Order[]) => prev.map(o => (o.id === orderId ? updated : o)));
    this.updateTableStatus(order.tableId, 'Available');
    saveToStorage(ORDERS_KEY, this.orders());
    return updated;
  }

  cancelOrder(orderId: string): Order | null {
    const order = this.getOrder(orderId);
    if (!order || order.status !== 'Active') return null;
    const updated: Order = { ...order, status: 'Cancelled' };
    this.orders.update((prev: Order[]) => prev.map(o => (o.id === orderId ? updated : o)));
    this.updateTableStatus(order.tableId, 'Available');
    saveToStorage(ORDERS_KEY, this.orders());
    return updated;
  }

  addOrderItem(orderId: string, menuItemId: string, quantity: number): Order | null {
    const order = this.getOrder(orderId);
    if (!order || order.status !== 'Active') return null;
    const menuItem = this.getMenuItem(menuItemId);
    if (!menuItem) return null;

    const existing = order.items.find(i => i.menuItemId === menuItemId);
    let updatedItems: OrderItem[];
    if (existing) {
      updatedItems = order.items.map(i =>
        i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updatedItems = [
        ...order.items,
        {
          id: crypto.randomUUID(),
          menuItemId,
          menuItem,
          quantity,
          priceAtOrder: menuItem.price,
        },
      ];
    }

    const subtotal = updatedItems.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const updated = { ...order, items: updatedItems, subtotal, tax, total };
    this.orders.update(prev => prev.map(o => (o.id === orderId ? updated : o)));
    saveToStorage(ORDERS_KEY, this.orders());
    return updated;
  }

  removeOrderItem(orderId: string, itemId: string): Order | null {
    const order = this.getOrder(orderId);
    if (!order || order.status !== 'Active') return null;
    const updatedItems = order.items.filter(i => i.id !== itemId);
    const subtotal = updatedItems.reduce((sum, i) => sum + i.priceAtOrder * i.quantity, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;
    const updated = { ...order, items: updatedItems, subtotal, tax, total };
    this.orders.update(prev => prev.map(o => (o.id === orderId ? updated : o)));
    saveToStorage(ORDERS_KEY, this.orders());
    return updated;
  }
}
