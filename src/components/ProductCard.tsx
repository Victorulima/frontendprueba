import React from "react";
import type { Product } from "../context/DataContext";
import { useCart } from "../context/GestionCarrito";
import { Link } from "react-router-dom";

const cardStyle: React.CSSProperties = { 
  background: "#f7efe0", 
  border: "1px solid #6b4b2a", 
  borderRadius: 8, 
  overflow: "hidden", 
  boxShadow: "2px 3px 8px rgba(0,0,0,0.12)", 
  display: "flex", 
  flexDirection: "column" 
};

const imgStyle: React.CSSProperties = { 
  width: "100%", 
  height: 160, 
  objectFit: "cover", 
  display: "block" 
};

const bodyStyle: React.CSSProperties = { 
  padding: 12, 
  display: "flex", 
  flexDirection: "column", 
  gap: 8, 
  flex: 1 
};

const buttonContainerStyle: React.CSSProperties = { 
  padding: "0 12px 12px" 
};

const buttonStyle: React.CSSProperties = { 
  width: "100%", 
  background: "#b8860b", 
  color: "#fff", 
  border: "1px solid #6b4b2a", 
  padding: "8px 10px", 
  borderRadius: 6, 
  cursor: "pointer", 
  boxShadow: "inset 0 -2px rgba(0,0,0,0.15)" 
};

export const ProductCard: React.FC<{ p: Product }> = ({ p }) => {
  const { addToCart } = useCart();

  return (
    <div style={cardStyle}>

      {/* LINK AL DETALLE DEL PRODUCTO */}
      <Link 
        to={`/product/${p.id}`} 
        style={{ 
          textDecoration: "none", 
          color: "inherit", 
          display: "flex", 
          flexDirection: "column", 
          flex: 1 
        }}
      >
        <img 
          src={p.image || `https://via.placeholder.com/300x300.png?text=${p.name.replace(/\s/g, "+")}`} 
          alt={p.name} 
          style={imgStyle} 
        />

        <div style={bodyStyle}>
          <div>
            <div style={{ fontWeight: 700 }}>{p.name}</div>
            <div style={{ color: "#5b4632", fontSize: 13, minHeight: "3em", marginTop: 4 }}>
              {p.description}
            </div>
          </div>

          <div style={{ marginTop: "auto", fontWeight: 700 }}>
            S/ {p.price.toFixed(2)}
          </div>
        </div>
      </Link>

      {/* BOTÓN AGREGAR AL CARRITO */}
      <div style={buttonContainerStyle}>
        <button 
          onClick={() => addToCart(p)} 
          style={buttonStyle}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};
