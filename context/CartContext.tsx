"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { CheckIcon } from "@/lib/icons";

export interface CartLine {
  productId: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity: number;
  stockCount: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  lastAdded: string | null;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "aurel-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [toastIdx, setToastIdx] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setLines(JSON.parse(raw) as CartLine[]);
      } catch {
        /* ignore */
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setLastAdded(product.name);
    setToastIdx((i) => i + 1);
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id
            ? {
                ...l,
                quantity: Math.min(l.quantity + quantity, product.stockCount),
              }
            : l
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          slug: product.slug,
          quantity: Math.min(quantity, product.stockCount),
          stockCount: product.stockCount,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(quantity, l.stockCount) }
              : l
          )
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.quantity * l.price, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      clear,
      lastAdded,
    };
  }, [
    lines,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQuantity,
    clear,
    lastAdded,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Toast mount point */}
      <ToastHost
        key={toastIdx}
        message={lastAdded ?? ""}
        onDone={() => setLastAdded(null)}
      />
    </CartContext.Provider>
  );
}

function ToastHost({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 animate-fade-up">
      <div className="glass-strong flex items-center gap-3 rounded-full border border-edge px-4 py-2.5 text-sm shadow-lift">
        <span className="grid size-6 place-items-center rounded-full bg-brand/20 text-brand-soft">
          <CheckIcon />
        </span>
        <span className="text-fg">{message} added to bag</span>
      </div>
    </div>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
