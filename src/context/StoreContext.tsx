'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface WishlistItem {
  id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
}

interface StoreContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    name: string;
    image: string;
    price: number;
  } | null>(null);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Load state on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('sita_seta_cart');
    const savedWishlist = localStorage.getItem('sita_seta_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sita_seta_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sita_seta_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setNotification({
      show: true,
      name: item.name,
      image: item.image,
      price: item.price,
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id, size);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: string) => wishlist.some((i) => i.id === id);

  const locale = typeof window !== 'undefined' ? (window.location.pathname.startsWith('/it') ? 'it' : 'en') : 'en';

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
      {notification && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto max-w-sm md:w-96 z-50 bg-white/95 backdrop-blur-md border border-[#232B28]/10 rounded-2xl p-4 shadow-xl flex gap-4 animate-in slide-in-from-bottom md:slide-in-from-right fade-in duration-300">
          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 border border-[#232B28]/5">
            <img src={notification.image} alt={notification.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-between flex-grow font-sans">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>{locale === 'it' ? 'Aggiunto al carrello' : 'Added to cart'}</span>
              </div>
              <h4 className="font-serif text-sm font-bold text-[#232B28] leading-snug mt-1 line-clamp-1">
                {notification.name}
              </h4>
              <p className="text-xs text-[#B35C37] font-semibold mt-0.5">€{notification.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between border-t border-[#232B28]/5 pt-2 mt-2">
              <button 
                onClick={() => setNotification(null)}
                className="text-[10px] uppercase font-bold text-[#232B28]/60 hover:text-[#232B28] transition-colors cursor-pointer"
              >
                {locale === 'it' ? 'Chiudi' : 'Dismiss'}
              </button>
              <a 
                href={`/${locale}/cart`} 
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#B35C37] hover:bg-[#B35C37]/90 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                {locale === 'it' ? 'Vedi Carrello' : 'View Cart'}
              </a>
            </div>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
