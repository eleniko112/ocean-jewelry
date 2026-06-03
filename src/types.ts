export type Category = 'necklace' | 'bracelet' | 'ring' | 'earrings';

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  category: Category;
  price: number;
  oldPrice?: number;
  description: string;
  descriptionEn?: string;
  materials: string[];
  materialsEn?: string[];
  images: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  keywords?: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export type Currency = '₾' | '$' | '€';
export type Language = 'KA' | 'EN';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface ShopState {
  cart: { productId: string; quantity: number }[];
  wishlist: string[];
  currency: Currency;
  language: Language;
  theme: 'light' | 'dark';
  recentlyViewed: string[];
  user: AuthUser | null;
}
