import React, { createContext, useContext, useState, useEffect } from "react";

const API = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadBackendData() {
      try {
        console.log("🔵 Cargando desde backend:", API);

        const [pRes, uRes] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/users`)
        ]);

        if (!pRes.ok) throw new Error("Error al obtener productos");
        if (!uRes.ok) throw new Error("Error al obtener usuarios");

        const productsData = await pRes.json();
        const usersData = await uRes.json();

        console.log("🟢 Productos recibidos:", productsData.length);
        console.log("🟢 Usuarios recibidos:", usersData.length);

        setProducts(productsData);
        setUsers(usersData);

        // categorías dinámicas
        const uniqueCategories = [
          ...new Set(productsData.map((p: Product) => p.category))
        ].map(name => ({ name }));

        setCategories(uniqueCategories);

      } catch (err) {
        console.error("🔴 Error cargando datos del backend:", err);
      } finally {
        setLoaded(true);
      }
    }

    loadBackendData();
  }, []);

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
  if (!ctx) throw new Error("useData debe usarse dentro de un DataProvider");
  return ctx;
};
