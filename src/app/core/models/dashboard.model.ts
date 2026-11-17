export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalTables: number;
  availableTables: number;
  reservedTables: number;
  occupiedTables: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  timestamp: Date;
}
