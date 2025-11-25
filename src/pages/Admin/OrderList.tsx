import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
export default function OrderList() {
  const { orders } = useData(); 
  const navigate = useNavigate();
  
  return (
    <div className="product-management"> 
      <div className="header-actions">
          <h1>Gestión de Órdenes</h1>
      </div>
      <table className="products-table"> 
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.cliente}</td>
              <td>S/ {o.total.toFixed(2)}</td>
              <td>{o.estado}</td>
              <td>{o.fecha}</td>
              <td className="action-buttons">
                <button
                  onClick={() => navigate(`/admin/ordenes/${o.id}`)}
                  className="admin-button"
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};