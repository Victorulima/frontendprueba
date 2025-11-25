import React from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../../context/DataContext"; 

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { orders, cancelOrder } = useData(); 

  const orderData = orders.find((o) => o.id === Number(id));

  if (!orderData) {
    return <p className="p-6 text-red-500">Orden no encontrada</p>;
  }

  return (
    <div className="product-management"> 
      <div className="header-actions">
        <h1>Detalle de Orden #{orderData.id}</h1>
      </div>
      <div className="detail-card">
        <p><strong>Cliente:</strong> {orderData.cliente}</p>
        <p><strong>Total:</strong> S/ {orderData.total.toFixed(2)}</p>
        <p><strong>Fecha:</strong> {orderData.fecha}</p>
        <p><strong>Estado:</strong> {orderData.estado}</p>

        {orderData.estado !== "Cancelada" && (
          <button
            onClick={() => cancelOrder(orderData.id)} 
            className="admin-button danger mt-4"
          >
            Cancelar orden
          </button>
        )}

        <Link to="/admin/ordenes" className="back-link-admin">
          ← Volver al listado de órdenes
        </Link>
      </div>
    </div>
  );
};