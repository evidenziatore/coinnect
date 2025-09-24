export interface User {
  id: number
  name: string
  email?: string
  created_at?: string
}

export interface Category {
  id: number
  name: string
  color?: string
}

export interface Source {
  id: number
  name: string
  color?: string
}

export interface Product {
  id: number
  name: string
  color?: string
}

export interface Movement {
  id: number
  user_id: number
  product_id: number
  category_id: number
  source_id: number
  weight?: number
  price?: number
  date?: string

  user?: User;
  product?: Product;
  category?: Category;
  source?: Source;
}