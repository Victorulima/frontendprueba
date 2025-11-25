import React from "react";
import { useCart } from "../context/GestionCarrito";
import { Link, useNavigate } from "react-router-dom";

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  zIndex: 50,
  transition: "opacity 0.25s ease",
};

const panelBase: React.CSSProperties = {
  position: "fixed",
  right: 0,
  top: 0,
  height: "100vh",
  width: 380,
  maxWidth: "90vw",
  background: "#f7efe0",
  borderLeft: "4px solid #6b4b2a",
  boxShadow: "-6px 0 18px rgba(0,0,0,0.12)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.28s ease",
};


export const CartSidebar: React.FC = () => {
  const { isOpen, closeCart, items, removeFromCart, increaseQty, decreaseQty, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0);
  const shipping = items.length > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <>
      {isOpen && <div onClick={closeCart} style={overlayStyle} />}
      <aside style={{ ...panelBase, transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>
        <div style={{ padding: 14, borderBottom: "1px solid #6b4b2a", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(90deg,#7b4f2a, #3f2a17)" }}>
          <div style={{ color: "#f7efe0", fontWeight: 800 }}>Tu Carrito</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => clearCart()} style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #5b4632", background: "#f1e0c8", cursor: "pointer" }}>Vaciar</button>
            <button onClick={closeCart} style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #5b4632", background: "#d87f00", color: "#fff", cursor: "pointer" }}>Cerrar</button>
          </div>
        </div>

        <div style={{ padding: 12, overflowY: "auto", flex: 1 }}>
          {items.length === 0 ? (
            <div style={{ color: "#5b4632" }}>El carrito está vacío. Agrega algún objeto fantástico desde la tienda.</div>
          ) : (
            items.map(it => (
              <div key={it.product.id} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "center", borderBottom: "1px dashed #6b4b2a", paddingBottom: 10 }}>
                <img src={it.product.image} alt={it.product.name} style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #6b4b2a" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{it.product.name}</div>
                  <div style={{ color: "#5b4632", fontSize: 13 }}>S/ {(it.product.price * it.quantity).toFixed(2)}</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => decreaseQty(it.product.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #5b4632", background: "#f1e0c8", cursor: "pointer" }}>-</button>
                    <div style={{ minWidth: 24, textAlign: "center" }}>{it.quantity}</div>
                    <button onClick={() => increaseQty(it.product.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid #5b4632", background: "#f1e0c8", cursor: "pointer" }}>+</button>
                    <button onClick={() => removeFromCart(it.product.id)} style={{ marginLeft: 8, color: "#8b1c1c", background: "transparent", border: "none", cursor: "pointer" }}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: 14, borderTop: "1px solid #6b4b2a", background: "#efe0c8" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div>Subtotal</div>
            <div>S/ {subtotal.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>Envío</div>
            <div>S/ {shipping.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginBottom: 12 }}>
            <div>Total</div>
            <div>S/ {total.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={items.length === 0}
              onClick={() => { closeCart(); navigate('/checkout'); }}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid #6b4b2a",
                background: items.length === 0 ? "#ccc" : "#7b4f2a",
                color: items.length === 0 ? "#666" : "#fff",
                cursor: items.length === 0 ? "not-allowed" : "pointer"
              }}
            >
              Ir al checkout
            </button>
            <Link to="/" style={{ padding: "10px 12px", borderRadius: 6, border: "1px solid #6b4b2a", background: "#f7efe0", textDecoration: "none", color: "#5b4632" }}>Seguir</Link>
          </div>
        </div>
      </aside>
    </>
  );
};
