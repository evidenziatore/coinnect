export interface User {
  id: number;
  name: string;
  email?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  color?: string;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  weight?: number;
  category?: Category;
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