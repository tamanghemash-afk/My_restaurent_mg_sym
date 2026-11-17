export interface Table {
  id: number;
  name: string;
  capacity: number;
  status: 'Available' | 'Reserved' | 'Occupied';
  currentOrderId?: string;
}
