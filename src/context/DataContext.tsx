import React, { createContext, useContext, useState, useEffect } from "react";

const API = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

// =================== INTERFACES ===================

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
  id: number;
  name: string;
  description: string;
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

// ================== CONTEXT TYPE ==================

interface DataContextType {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];

  addOrder: (order: Order) => void;

  addCategory: (cat: Partial<Category>) => void;
  updateCategory: (id: number, data: Partial<Category>) => void;
  deleteCategory: (id: number) => void;

  addProduct: (p: Partial<Product>) => void;
  updateProduct: (id: number, data: Partial<Product>) => void;
  toggleProductActive: (id: number) => void;

  addUser: (u: Partial<User>) => void;
  toggleUserActive: (id: number) => void;

  cancelOrder: (id: number) => void;
}


// ================ CREATE CONTEXT ==================

const DataContext = createContext<DataContextType | undefined>(undefined);

// ================ PROVIDER ========================

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // -------- LOAD FROM BACKEND --------

  useEffect(() => {
    async function loadBackendData() {
      try {
        console.log("Cargando desde backend:", API);

        const [pRes, uRes] = await Promise.all([
          fetch(`${API}/products`),
          fetch(`${API}/users`)
        ]);

        const productsData = await pRes.json();
        const usersData = await uRes.json();

        setProducts(productsData);
        setUsers(usersData);

        // Categorías únicas correctas
        const uniqueCategories: Category[] = Array.from(
          new Set(productsData.map((p: Product) => p.category))
        ).map((name, idx) => ({
          id: idx + 1,
          name: String(name),
          description: ""
        }));

        setCategories(uniqueCategories);

      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    }

    loadBackendData();
  }, []);

  // ========== MÉTODOS (DEJADOS VACÍOS PARA TSX) ==========
  const addOrder = (o: Order) => setOrders(prev => [...prev, o]);

  const addCategory = () => {};
  const updateCategory = () => {};
  const deleteCategory = () => {};

  const addProduct = () => {};
  const updateProduct = () => {};
  const toggleProductActive = () => {};

  const addUser = () => {};
  const toggleUserActive = () => {};

  const cancelOrder = () => {};

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        users,
        orders,
        addOrder,

        addCategory,
        updateCategory,
        deleteCategory,

        addProduct,
        updateProduct,
        toggleProductActive,

        addUser,
        toggleUserActive,

        cancelOrder
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// ================ CUSTOM HOOK ======================

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de un DataProvider");
  return ctx;
};
