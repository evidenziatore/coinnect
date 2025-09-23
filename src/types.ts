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

export interface Source {
  id: number;
  name: string;
  color?: string;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  source_id: number;
  weight?: number;
  category?: Category;
  source?: Source;
}

export interface MovementType {
  id: number;
  name: string;
  color?: string;
  is_income: boolean;
}

export interface Movement {
  id: number;
  user_id: number;
  product_id: number;
  type_id: number;
  amount: number;
  date?: string;
  product?: Product;
  type?: MovementType;
}