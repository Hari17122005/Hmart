export enum Category {
  FRUITS = 'Fresh Fruit',
  VEGETABLES = 'Vegetables',
  DAIRY = 'Dairy & Eggs',
  BAKERY = 'Bakery',
  SNACKS = 'Snacks'
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; 
  image: string;
  images?: string[];
  unit: string;
  description?: string;
  inStock: boolean;
  rating?: number;
  badge?: string; // e.g., "Fresh", "New", "Sale"
  isHotDeal?: boolean;
  salePrice?: number;
  highlights?: string[];
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled';
  items: number;
}

export interface User {
  id: string;
  name: string;
  role: 'user' | 'admin';
  email: string;
  phone?: string;
  password?: string;
  savedAddresses?: string[];
  orders?: Order[];
  profileImage?: string;
}

export interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
}

export interface SideBanner {
  id: string;
  subTitle: string;
  title: string;
  cta: string;
  image: string;
  categoryLink: string;
  theme: 'yellow' | 'emerald';
}