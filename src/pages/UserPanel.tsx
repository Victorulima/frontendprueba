import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API =
  "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

interface Order {
  id: number;
  cliente: string;
  total: number;
  estado: string;
  fecha: string;
}

const UserPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/orders`);
        const data = await res.json();

        // Filtrar por correo o nombre de usuario
        const filtered = data.filter((o: Order) =>
          String(o.cliente)
            .toLowerCase()
            .includes(user.email.split("@")[0].toLowerCase())
        );

        setOrders(filtered);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      }

      setLoading(false);
    };

    fetchOrders();
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

      {/* ----------------------- Datos del Usuario ----------------------- */}
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
        <p>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p>
          <strong>Correo:</strong> {user.email}
        </p>

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

      {/* ----------------------- Órdenes ----------------------- */}
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
                <div>
                  <strong>ID:</strong> {order.id}
                </div>
                <div>
                  <strong>Total:</strong> S/ {order.total.toFixed(2)}
                </div>
                <div>
                  <strong>Estado:</strong> {order.estado}
                </div>
                <div>
                  <strong>Fecha:</strong> {order.fecha}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
