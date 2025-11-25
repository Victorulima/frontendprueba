import React, { createContext, useContext, useState, useEffect } from "react";

const API = "http://localhost:3000/api";

// ==== TIPOS ====
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isActive?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface Category {
  name: string;
}

export interface User {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
}

export interface Order {
  id: number;
  cliente: string;
  total: number;
  estado: string;
  fecha: string;
}

interface DataContextType {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];
  addOrder: (order: Order) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // ======== CARGA INICIAL DESDE BACKEND ========
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [pRes, uRes] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/users`)
        ]);

        const productsData = await pRes.json();
        const usersData = await uRes.json();

        setProducts(productsData);
        setUsers(usersData);

        // Categorías generadas desde productos (no existen en backend todavía)
        const uniqueCategories = Array.from(new Set(productsData.map((p: Product) => p.category)))
          .map(name => ({ name }));

        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Error cargando datos del backend:", err);
      }
    }

    loadBackendData();
  }, []);

  // ======= AGREGAR ORDEN LOCAL (Checkout) =======
  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  return (
    <DataContext.Provider value={{ products, categories, users, orders, addOrder }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe ser usado dentro de un DataProvider");
  return ctx;
};
