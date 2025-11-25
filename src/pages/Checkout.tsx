import React, { useState, useEffect } from "react";
import { useCart } from "../context/GestionCarrito";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Product } from "../data/productos";

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const Checkout: React.FC = () => {
  const API = "http://localhost:3000/api";

  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"qr" | "card">("qr");
  const [shipping, setShipping] = useState<ShippingData>({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<string | null>(null);

  // ITEMS ENRIQUECIDOS CON PRODUCTO REAL DEL BACKEND
  const [detailedItems, setDetailedItems] = useState<any[]>([]);

  // =============== CARGAR PRODUCTOS DEL BACKEND ===============
  useEffect(() => {
    async function cargar() {
      const resp = await fetch(`${API}/products`);
      const products: Product[] = await resp.json();

      const enriched = items.map((it) => {
        const fullProduct = products.find((p) => p.id === it.productId) || it.product || null;
        return { ...it, product: fullProduct };
      });

      setDetailedItems(enriched);
    }

    cargar();
  }, [items]);

  // =============== CALCULOS ===============
  const subtotal = detailedItems.reduce(
    (s, it) => s + (it.product?.price ?? 0) * it.quantity,
    0
  );
  const shippingCost = detailedItems.length > 0 ? 15 : 0;
  const total = subtotal + shippingCost;

  // =============== ENVIAR ORDEN AL BACKEND ===============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setErrors("Debes iniciar sesión para comprar.");
      return;
    }

    if (detailedItems.length === 0) {
      setErrors("El carrito está vacío.");
      return;
    }

    const resp = await fetch(`${API}/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        items: detailedItems,
        total,
        shipping: shippingCost,
        paymentMethod,
      }),
    });

    const data = await resp.json();

    if (!data.success) {
      setErrors("Hubo un error al crear la orden.");
      return;
    }

    const order = {
      id: data.orderId,
      items: detailedItems,
      totals: { subtotal, shipping: shippingCost, total },
    };

    clearCart();
    navigate("/order-complete", { state: { order } });
  };

  return (
    <div style={{ maxWidth: 820, margin: "28px auto", padding: 12 }}>
      <h2 style={{ color: "#3f2a17" }}>Checkout</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        {/* ---------------------- DIRECCIÓN ---------------------- */}
        <div style={{ background: "#f7efe0", padding: 12, borderRadius: 8 }}>
          <h3>Dirección de envío</h3>
          <input value={shipping.fullName} onChange={(e) =>
            setShipping({ ...shipping, fullName: e.target.value })
          } placeholder="Nombre completo" />

          <input value={shipping.address} onChange={(e) =>
            setShipping({ ...shipping, address: e.target.value })
          } placeholder="Dirección" />

          <input value={shipping.city} onChange={(e) =>
            setShipping({ ...shipping, city: e.target.value })
          } placeholder="Ciudad" />

          <input value={shipping.postalCode} onChange={(e) =>
            setShipping({ ...shipping, postalCode: e.target.value })
          } placeholder="Código postal" />

          <input value={shipping.country} onChange={(e) =>
            setShipping({ ...shipping, country: e.target.value })
          } placeholder="País" />
        </div>

        {/* ---------------------- PAGO ---------------------- */}
        <div style={{ background: "#f7efe0", padding: 12, borderRadius: 8 }}>
          <h3>Método de pago</h3>

          <label>
            <input type="radio" checked={paymentMethod === "qr"} onChange={() => setPaymentMethod("qr")} />
            Código QR
          </label>

          <label>
            <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
            Tarjeta
          </label>
        </div>

        {/* ---------------------- RESUMEN ---------------------- */}
        <div style={{ background: "#f7efe0", padding: 12, borderRadius: 8 }}>
          <h3>Resumen de la orden</h3>
          <div>Subtotal: S/ {subtotal.toFixed(2)}</div>
          <div>Envío: S/ {shippingCost.toFixed(2)}</div>
          <div>Total: S/ {total.toFixed(2)}</div>
        </div>

        {errors && <div style={{ color: "red" }}>{errors}</div>}

        <button type="submit" style={{ background: "#7b4f2a", color: "#fff", padding: 10 }}>
          Completar orden
        </button>
      </form>
    </div>
  );
};
