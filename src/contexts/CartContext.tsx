import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface CartItem {
  id: string;
  nom: string;
  prix: number;
  image_url: string;
  quantite: number;
  couleur?: string;
  pointure?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantite"> & { quantite?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantite: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CART_STORAGE_KEY = "safetypro_cart";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Données corrompues, on repart de zéro
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage plein ou indisponible
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  // Sauvegarder le panier à chaque changement
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, "quantite"> & { quantite?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.couleur === item.couleur && i.pointure === item.pointure);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.couleur === item.couleur && i.pointure === item.pointure
            ? { ...i, quantite: i.quantite + (item.quantite || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantite: item.quantite || 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantite: number) => {
    if (quantite <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantite } : i)));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const total = items.reduce((sum, i) => sum + i.prix * i.quantite, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantite, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};
