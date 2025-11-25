import { useParams, Link } from "react-router-dom";
import { users, orders } from "../../data/mockData";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const user = users.find((u) => u.id === Number(id));

  if (!user) {
    return <p className="p-6 text-red-500">Usuario no encontrado</p>;
  }

  const userOrders = orders.filter((o) => o.cliente === user.nombre);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Detalle de Usuario #{user.id}
      </h2>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Correo:</strong> {user.correo}</p>
      <p><strong>Estado:</strong> {user.activo ? "Activo" : "Inactivo"}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Órdenes del usuario:</h3>
      {userOrders.length === 0 ? (
        <p>Sin órdenes registradas.</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-blue-200">
              <th className="p-2">ID</th>
              <th className="p-2">Total</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.map((o) => (
              <tr key={o.id} className="border-b">
                <td className="p-2">{o.id}</td>
                <td className="p-2">${o.total}</td>
                <td className="p-2">{o.estado}</td>
                <td className="p-2">{o.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/admin/usuarios" className="text-blue-600 underline mt-4 block">
        ← Volver al listado
      </Link>
    </div>
  );
};
