import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../data/productos";
import { useAuth } from "../context/AuthContext";

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQty: (productId: number) => void;
  decreaseQty: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API = "http://localhost:3000/api";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

  const { user } = useAuth();
  const userKey = user?.email;   // ← AQUÍ USAMOS EMAIL COMO ID

  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // ============================
  // CARGAR CARRITO POR EMAIL
  // ============================
  useEffect(() => {
  if (!userKey) return;

  async function loadCart() {
    try {
      const res = await fetch(`${API}/cart/${userKey}`);
      const rawItems = await res.json();

      // traer TODOS los productos
      const prodRes = await fetch(`${API}/products`);
      const allProducts = await prodRes.json();

      // unir carrito + productos
      const resolved = rawItems.map((item: CartItem) => ({
        ...item,
        product: allProducts.find((p: Product) => p.id === item.productId)
      }));

      setItems(resolved);

    } catch (err) {
      console.error("ERROR CART:", err);
    }
  }

  loadCart();
}, [userKey]);


  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // ============================
  // ADD TO CART
  // ============================
  const addToCart = (p: Product, qty: number = 1) => {
    if (!userKey) return alert("Inicia sesión primero");

    fetch(`${API}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userKey,
        productId: p.id,
        quantity: qty,
      }),
    });

    setItems(prev => {
      const exists = prev.find(i => i.productId === p.id);
      if (exists) {
        return prev.map(i =>
          i.productId === p.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { productId: p.id, quantity: qty, product: p }];
    });

    setIsOpen(true);
  };

  // ============================
  // REMOVE FROM CART
  // ============================
  const removeFromCart = (productId: number) => {
    if (!userKey) return;

    fetch(`${API}/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: userKey, productId }),
    });

    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  // ============================
  // INCREASE QTY
  // ============================
  const increaseQty = (productId: number) => {
    if (!userKey) return;

    fetch(`${API}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userKey,
        productId,
        quantity: 1,
      }),
    });

    setItems(prev =>
      prev.map(i =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // ============================
  // DECREASE QTY
  // ============================
  const decreaseQty = (productId: number) => {
    if (!userKey) return;

    fetch(`${API}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userKey,
        productId,
        quantity: -1,
      }),
    });

    setItems(prev =>
      prev.flatMap(i =>
        i.productId === productId
          ? i.quantity > 1
            ? [{ ...i, quantity: i.quantity - 1 }]
            : []
          : [i]
      )
    );
  };

  // ============================
  // CLEAR CART
  // ============================
  const clearCart = () => {
    if (!userKey) return;

    fetch(`${API}/cart/clear/${userKey}`, { method: "DELETE" });
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};
