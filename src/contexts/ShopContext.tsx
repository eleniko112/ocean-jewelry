import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, ShopState, Currency, Language, AuthUser } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface ShopContextType extends ShopState {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  toggleTheme: () => void;
  clearCart: () => void;
  addToRecentlyViewed: (productId: string) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  formatPrice: (price: number) => string;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

const CONVERSION_RATES = {
  '₾': 1,
  '$': 0.37,
  '€': 0.34
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ocean_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(p => {
            if (p && Array.isArray(p.images)) {
              return {
                ...p,
                images: p.images.map((img: string) => {
                  if (typeof img === 'string') {
                    // Replace any older paths like "/src/assets/images/..." or "src/assets/images/..." or "/assets/images/..."
                    return img
                      .replace(/^\/?src\/assets\/images\//, '/assets/images/')
                      .replace(/^\/?assets\/images\//, '/assets/images/');
                  }
                  return img;
                })
              };
            }
            return p;
          });
          // Update/override all initial products with the freshest details and correct paths from constants.ts!
          // We convert both IDs to strings to prevent comparison failure if one of them is stored as a number in older sessions.
          const merged = cleaned.map(p => {
            const initial = INITIAL_PRODUCTS.find(i => String(i.id) === String(p.id));
            if (initial) {
              return { ...initial, ...p };
            }
            return p;
          });
          INITIAL_PRODUCTS.forEach(initial => {
            if (!merged.some(p => String(p.id) === String(initial.id))) {
              merged.push(initial);
            }
          });
          return merged;
        }
      } catch (e) {
        // ignore and fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [state, setState] = useState<ShopState>(() => {
    const saved = localStorage.getItem('ocean_shop_state');
    const defaultState: ShopState = {
      cart: [],
      wishlist: [],
      currency: '₾',
      language: 'KA',
      theme: 'light',
      recentlyViewed: [],
      user: null
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const cart = parsed.cart || [];
        const wishlist = parsed.wishlist || [];
        const recentlyViewed = parsed.recentlyViewed || [];
        return { ...defaultState, ...parsed, cart, wishlist, recentlyViewed };
      } catch (e) {
        return defaultState;
      }
    }
    return defaultState;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem('ocean_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('ocean_shop_state', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const addToCart = useCallback((productId: string, quantity: number = 1) => {
    setState(prev => {
      if (!prev.user) {
        setIsAuthModalOpen(true);
        return prev;
      }
      const currentCart = prev.cart || [];
      const existing = currentCart.find(item => item.productId === productId);
      if (existing) {
        return {
          ...prev,
          cart: currentCart.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
          )
        };
      }
      return { ...prev, cart: [...currentCart, { productId, quantity }] };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.productId !== productId)
    }));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setProducts(currentProducts => {
      const product = currentProducts.find(p => p.id === productId);
      if (product && quantity > product.stock) return currentProducts;
      
      setState(prev => ({
        ...prev,
        cart: (prev.cart || []).map(item =>
          item.productId === productId ? { ...item, quantity } : item
        )
      }));
      return currentProducts;
    });
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setState(prev => {
      if (!prev.user) {
        setIsAuthModalOpen(true);
        return prev;
      }
      return {
        ...prev,
        wishlist: prev.wishlist.includes(productId)
          ? prev.wishlist.filter(id => id !== productId)
          : [...prev.wishlist, productId]
      };
    });
  }, []);

  const setCurrency = useCallback((currency: Currency) => setState(prev => ({ ...prev, currency })), []);
  const setLanguage = useCallback((language: Language) => setState(prev => ({ ...prev, language })), []);
  const toggleTheme = useCallback(() => setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' })), []);

  const clearCart = useCallback(() => setState(prev => ({ ...prev, cart: [] })), []);

  const addToRecentlyViewed = useCallback((productId: string) => {
    setState(prev => {
      const current = prev.recentlyViewed || [];
      const filtered = current.filter(id => id !== productId);
      const newList = [productId, ...filtered].slice(0, 10);
      return { ...prev, recentlyViewed: newList };
    });
  }, []);

  const setUser = useCallback((user: AuthUser | null) => setState(prev => ({ ...prev, user })), []);
  const logout = useCallback(() => setState(prev => ({ ...prev, user: null })), []);

  const formatPrice = useCallback((price: number) => {
    const rate = CONVERSION_RATES[state.currency];
    const converted = price * rate;
    return `${converted.toFixed(2)}${state.currency}`;
  }, [state.currency]);

  const contextValue = React.useMemo(() => ({
    ...state,
    products,
    setProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    setCurrency,
    setLanguage,
    toggleTheme,
    clearCart,
    addToRecentlyViewed,
    setUser,
    logout,
    isAuthModalOpen,
    setIsAuthModalOpen,
    formatPrice,
    isSoundEnabled,
    setIsSoundEnabled
  }), [
    state, 
    products, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    toggleWishlist, 
    setCurrency, 
    setLanguage, 
    toggleTheme, 
    clearCart, 
    addToRecentlyViewed, 
    setUser, 
    logout, 
    isAuthModalOpen, 
    formatPrice, 
    isSoundEnabled
  ]);

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
