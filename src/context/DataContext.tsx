import React, { createContext, useState, useContext, useEffect } from 'react';

const API_URL = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isActive: boolean;
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

interface DataContextType {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];
  
  addProduct: (data: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (id: number, data: Partial<Product>) => Promise<boolean>;
  toggleProductActive: (id: number, currentStatus: boolean) => Promise<boolean>;
  
  addCategory: (data: Omit<Category, 'id'>) => Promise<boolean>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<boolean>;
  deleteCategory: (id: number) => Promise<boolean>;
  
  addOrder: (order: any) => void;
  addUser: (user: any) => void;
  toggleUserActive: (id: number) => void;
  cancelOrder: (id: number) => void;
  
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const refreshData = async () => {
    try {
      const [prodRes, catRes, userRes, orderRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`).catch(() => null),
        fetch(`${API_URL}/users`),
        fetch(`${API_URL}/orders`)
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes && catRes.ok) setCategories(await catRes.json());
      if (userRes.ok) setUsers(await userRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addProduct = async (data: Omit<Product, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { refreshData(); return true; }
    } catch (e) { console.error(e); }
    return false;
  };

  const updateProduct = async (id: number, data: Partial<Product>) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { refreshData(); return true; }
    } catch (e) { console.error(e); }
    return false;
  };

  const toggleProductActive = async (id: number, currentStatus: boolean) => {
    return updateProduct(id, { isActive: !currentStatus });
  };

  const addCategory = async (data: Omit<Category, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { refreshData(); return true; }
    } catch (e) { console.error(e); }
    return false;
  };

  const updateCategory = async (id: number, data: Partial<Category>) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { refreshData(); return true; }
    } catch (e) { console.error(e); }
    return false;
  };

  const deleteCategory = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
      if (res.ok) { refreshData(); return true; }
    } catch (e) { console.error(e); }
    return false;
  };

  const addOrder = () => {};
  const addUser = () => {};
  const toggleUserActive = () => {};
  const cancelOrder = () => {};

  return (
    <DataContext.Provider value={{ 
      products, categories, users, orders,
      addProduct, updateProduct, toggleProductActive,
      addCategory, updateCategory, deleteCategory,
      addOrder, addUser, toggleUserActive, cancelOrder,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData debe usarse dentro de DataProvider");
  return context;
};