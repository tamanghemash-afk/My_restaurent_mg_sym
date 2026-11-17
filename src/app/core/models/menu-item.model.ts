export interface MenuItem {
  id: string;
  name: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages';
  price: number;
  description?: string;
  image?: string;
  available: boolean;
}

export interface CreateMenuItemDto {
  name: string;
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Beverages';
  price: number;
  description?: string;
  image?: string;
  available?: boolean;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}
