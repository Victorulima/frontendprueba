import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext"; 

export default function UserList() {
  const { users, toggleUserActive } = useData(); 
  const navigate = useNavigate();

  return (
    <div className="product-management"> 
      <div className="header-actions">
        <h1>Gestión de Usuarios</h1>
      </div>
      <table className="products-table"> 
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.activo ? "Activo" : "Inactivo"}</td>
              <td className="action-buttons">
                <button
                  onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                  className="admin-button"
                >
                  Ver Detalle
                </button>
                <button
                  onClick={() => toggleUserActive(u.id)} 
                  className={`admin-button ${u.activo ? "danger" : "success"}`}
                >
                  {u.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};