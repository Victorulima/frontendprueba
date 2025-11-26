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
  const API = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

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

  const [detailedItems, setDetailedItems] = useState<any[]>([]);

  // ================= Cargar productos del backend =================
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

  // ================= Cálculos =================
  const subtotal = detailedItems.reduce(
    (s, it) => s + (it.product?.price ?? 0) * it.quantity,
    0
  );
  const shippingCost = detailedItems.length > 0 ? 15 : 0;
  const total = subtotal + shippingCost;

  // ================= Enviar orden al backend =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return setErrors("Debes iniciar sesión para comprar.");
    if (detailedItems.length === 0) return setErrors("El carrito está vacío.");

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

  // ================== ESTILOS REUTILIZABLES ==================
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #c7b39b",
    marginBottom: 8,
  };

  const boxStyle: React.CSSProperties = {
    background: "#f7efe0",
    padding: 12,
    border: "1px solid #6b4b2a",
    borderRadius: 8,
  };

  return (
    <div style={{ maxWidth: 820, margin: "28px auto", padding: 12 }}>
      <h2 style={{ color: "#3f2a17" }}>Checkout</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>

        {/* ---------------------- DIRECCIÓN ---------------------- */}
        <div style={boxStyle}>
          <h3 style={{ marginBottom: 8 }}>Dirección de envío</h3>

          <input style={inputStyle} value={shipping.fullName}
            onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
            placeholder="Nombre completo"
          />

          <input style={inputStyle} value={shipping.address}
            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
            placeholder="Dirección"
          />

          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, marginBottom: 0 }} value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              placeholder="Ciudad"
            />
            <input style={{ ...inputStyle, width: 140, marginBottom: 0 }} value={shipping.postalCode}
              onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
              placeholder="Código postal"
            />
          </div>

          <input style={{ ...inputStyle, marginTop: 8 }} value={shipping.country}
            onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
            placeholder="País"
          />
        </div>

        {/* ---------------------- MÉTODO DE PAGO ---------------------- */}
        <div style={boxStyle}>
          <h3 style={{ marginBottom: 8 }}>Método de pago</h3>

          <label style={{ marginRight: 12 }}>
            <input type="radio" checked={paymentMethod === "qr"} onChange={() => setPaymentMethod("qr")} />
            {" "}Código QR
          </label>

          <label>
            <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
            {" "}Tarjeta
          </label>

          {/* UI bonita extra */}
          <div style={{ marginTop: 12 }}>
            {paymentMethod === "qr" ? (
              <div style={{ textAlign: "center", padding: 10, border: "1px dashed #6b4b2a", borderRadius: 6 }}>
                <div style={{ marginBottom: 8 }}>Escanea este QR para pagar</div>
                <img
                  src="https://placehold.co/200x200?text=QR"
                  alt="QR"
                  style={{ display: "inline-block" }}
                />
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                <input placeholder="Número de tarjeta" style={inputStyle} />
                <div style={{ display: "flex", gap: 8 }}>
                  <input placeholder="MM/AA" style={{ ...inputStyle, marginBottom: 0 }} />
                  <input placeholder="CVC" style={{ ...inputStyle, width: 120, marginBottom: 0 }} />
                </div>
                <input placeholder="Nombre en la tarjeta" style={inputStyle} />
              </div>
            )}
          </div>
        </div>

        {/* ---------------------- RESUMEN ---------------------- */}
        <div style={boxStyle}>
          <h3 style={{ marginBottom: 8 }}>Resumen de la orden</h3>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Subtotal</div><div>S/ {subtotal.toFixed(2)}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Envío</div><div>S/ {shippingCost.toFixed(2)}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginTop: 8 }}>
            <div>Total</div><div>S/ {total.toFixed(2)}</div>
          </div>
        </div>

        {errors && <div style={{ color: "#8b1c1c" }}>{errors}</div>}

        {/* ---------------------- BOTONES ---------------------- */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: 10,
              background: "#7b4f2a",
              color: "#fff",
              borderRadius: 8,
              border: "1px solid #613f23",
              cursor: "pointer",
            }}
          >
            Completar orden
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "1px solid #613f23",
              background: "#f7efe0",
              cursor: "pointer",
            }}
          >
            Volver
          </button>
        </div>

      </form>
    </div>
  );
};
