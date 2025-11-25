import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/GestionCarrito";
import { AuthProvider, useAuth } from "./context/AuthContext"; 
import { DataProvider } from './context/DataContext';


import { CartSidebar } from "./components/CarritoSidebar";
import { Home } from "./pages/Home";
import { Checkout } from "./pages/Checkout";
import { OrderComplete } from "./pages/OrderComplete";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { UserPanel } from "./pages/UserPanel";
import { RecoverPassword } from "./pages/RecoverPassword";
import { SearchResults } from './pages/SearchResults';
import { ProductDetail } from './pages/ProductDetail';
import { AdminLayout } from "./pages/Admin/AdminLayout";
import { Dashboard } from "./pages/Admin/Dashboard";
import { ProductManagement } from "./pages/Admin/ProductManagement";
import { CategoryManagement } from "./pages/Admin/CategoryManagement";
import UserList from "./pages/Admin/UserList";
import UserDetail from "./pages/Admin/UserDetail";
import OrderList from "./pages/Admin/OrderList";
import OrderDetail from "./pages/Admin/OrderDetail";



const AppHeader: React.FC = () => {
    const { user, logout } = useAuth(); 

    const headerStyle: React.CSSProperties = {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 24px", background: "linear-gradient(90deg,#5b3f2a,#3a2412)",
        color: "#f7efe0", position: "sticky", top: 0, zIndex: 1000
    };
    const headerLinkStyle: React.CSSProperties = {
        color: "#f7efe0", textDecoration: "none", padding: "8px 12px", borderRadius: 6,
        background: "rgba(255,255,255,0.04)", transition: "background 0.2s"
    };

    return (
        <header style={headerStyle}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link to="/" style={{ color: '#f7efe0', textDecoration: 'none', fontWeight: 900, fontSize: 18 }}>Tienda de Objetos de Fantasía</Link>
            </div>
            <nav style={{ display: "flex", gap: 10 }}>
                <Link to="/" style={headerLinkStyle}>Tienda</Link>
                <Link to="/checkout" style={headerLinkStyle}>Checkout</Link>
                
                
                {user ? (
                    <>
                        <Link to="/panel" style={headerLinkStyle}>Mi Panel</Link>
                        <button onClick={logout} style={{...headerLinkStyle, border: 'none', cursor: 'pointer'}}>Salir</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={headerLinkStyle}>Login</Link>
                        <Link to="/register" style={headerLinkStyle}>Register</Link>
                    </>
                )}
                
                <Link to="/admin" style={headerLinkStyle}>Admin</Link>
            </nav>
        </header>
    );
};


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <DataProvider>
            <div style={{ minHeight: "100vh", background: "#efe6d1" }}>
              <AppHeader /> 
              <CartSidebar />
              <main>
                <Routes>
                  
                  <Route path="/" element={<Home />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-complete" element={<OrderComplete />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/panel" element={<UserPanel />} />
                  <Route path="/recover" element={<RecoverPassword />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="usuarios" element={<UserList />} />
                    <Route path="usuarios/:id" element={<UserDetail />} />
                    <Route path="ordenes" element={<OrderList />} />
                    <Route path="ordenes/:id" element={<OrderDetail />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </DataProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}