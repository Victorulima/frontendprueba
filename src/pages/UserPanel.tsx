import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface BackendOrder {
  id: number;
  cliente: string | number;
  total: number;
  estado: string;
  fecha: string;
}

export const UserPanel: React.FC = () => {
  const API = "http://localhost:3000/api";
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // ------------------------- Cargar órdenes -------------------------
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;

      try {
        const resp = await fetch(`${API}/orders`);
        const data = await resp.json();

        // Filtrar por correo (el backend actual guarda "cliente": nombre)
        const filtered = data.filter(
          (o: BackendOrder) =>
            String(o.cliente).toLowerCase().includes(user.email.split("@")[0])
        );

        setOrders(filtered);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      }

      setLoading(false);
    };

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>No has iniciado sesión</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Mi Cuenta</h1>

      {/* ----------------------- DATOS DEL USUARIO ----------------------- */}
      <div
        style={{
          background: "#f7efe0",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #6b4b2a",
          marginBottom: 24,
        }}
      >
        <h2>Información del usuario</h2>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Correo:</strong> {user.email}</p>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            marginTop: 12,
            padding: "10px 16px",
            background: "#7b4f2a",
            color: "white",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* ----------------------- ÓRDENES ----------------------- */}
      <div
        style={{
          background: "#f7efe0",
          padding: 16,
          borderRadius: 8,
          border: "1px solid #6b4b2a",
        }}
      >
        <h2>Mis Órdenes</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : orders.length === 0 ? (
          <p>No tienes órdenes aún.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {orders.map((order) => (
              <li
                key={order.id}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  borderBottom: "1px dashed #6b4b2a",
                }}
              >
                <div><strong>ID:</strong> {order.id}</div>
                <div><strong>Total:</strong> S/ {order.total.toFixed(2)}</div>
                <div><strong>Estado:</strong> {order.estado}</div>
                <div><strong>Fecha:</strong> {order.fecha}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
