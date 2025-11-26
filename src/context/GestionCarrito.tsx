import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "../data/productos";
import { useAuth } from "../context/AuthContext";

export interface CartItem {
  id?: number;         // ID del registro en BD
  userId: string;      // EMAIL → usado como ID
  productId: number;
  quantity: number;
  product: Product;
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

// ⬅⬅⬅ USA TU BACKEND REAL
const API = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

  const { user } = useAuth();
  const userKey = user?.email || null;

  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // ==========================================================
  // 🔵 CARGAR CARRITO DESDE BACKEND
  // ==========================================================
  useEffect(() => {
    if (!userKey) return;

    async function loadCart() {
      try {
        const res = await fetch(`${API}/cart/${userKey}`);
        const rawItems = await res.json();

        const prodRes = await fetch(`${API}/products`);
        const allProducts = await prodRes.json();

        const resolved = rawItems.map((item: CartItem) => ({
          ...item,
          product: allProducts.find((p: Product) => p.id === item.productId)
        }));

        setItems(resolved);

      } catch (err) {
        console.error("❌ ERROR CARGANDO CARRITO:", err);
      }
    }

    loadCart();
  }, [userKey]);


  // ==========================================================
  // 🔵 ABRIR / CERRAR
  // ==========================================================
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);


  // ==========================================================
  // 🔵 AGREGAR PRODUCTO
  // ==========================================================
  const addToCart = (product: Product, qty: number = 1) => {
    if (!userKey) return alert("Debes iniciar sesión");

    fetch(`${API}/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userKey,          // EMAIL
        productId: product.id,
        quantity: qty,
      }),
    });

    setItems(prev => {
      const exists = prev.find(i => i.productId === product.id);
      if (exists) {
        return prev.map(i =>
          i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { userId: userKey, productId: product.id, quantity: qty, product }];
    });

    setIsOpen(true);
  };


  // ==========================================================
  // 🔵 ELIMINAR PRODUCTO
  // ==========================================================
  const removeFromCart = (productId: number) => {
    if (!userKey) return;

    fetch(`${API}/cart/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userKey,
        productId,
      }),
    });

    setItems(prev => prev.filter(i => i.productId !== productId));
  };


  // ==========================================================
  // 🔵 AUMENTAR CANTIDAD
  // ==========================================================
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


  // ==========================================================
  // 🔵 DISMINUIR CANTIDAD
  // ==========================================================
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


  // ==========================================================
  // 🔵 LIMPIAR CARRITO
  // ==========================================================
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
