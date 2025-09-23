export interface User {
  id: number;
  name: string;
  email?: string;
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface Source {
  id: number;
  name: string;
  color?: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  sourceId: number;
  weight?: number;
  category?: Category;
  source?: Source;
}

export interface MovementType {
  id: number;
  name: string;
  color?: string;
  isIncome: boolean;
}

export interface Movement {
  id: number;
  userId: number;
  productId: number;
  typeId: number;
  amount: number;
  date?: string;
  product?: Product;
  type?: MovementType;
}