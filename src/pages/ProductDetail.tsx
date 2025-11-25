import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/GestionCarrito";
import type { Product } from "../context/DataContext";

export const ProductDetail: React.FC = () => {
  const API = "http://localhost:3000/api";
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------- Cargar producto ----------------------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resp = await fetch(`${API}/products/${id}`);
        if (!resp.ok) throw new Error("Producto no encontrado");
        const data = await resp.json();
        setProduct(data);
      } catch (err) {
        console.error("Error cargando producto:", err);
      }
      setLoading(false);
    };

    loadProduct();
  }, [id]);

  // ---------------------- Render loading ----------------------
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Cargando producto...</h2>
      </div>
    );
  }

  // ---------------------- Render error ----------------------
  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Producto no encontrado</h2>
      </div>
    );
  }

  // ---------------------- Render producto ----------------------
  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        
        {/* Imagen */}
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: 360,
            height: 360,
            objectFit: "cover",
            borderRadius: 8,
            border: "2px solid #6b4b2a",
          }}
        />

        {/* Información */}
        <div style={{ flex: 1 }}>
          <h1 style={{ marginBottom: 12 }}>{product.name}</h1>

          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            S/ {product.price.toFixed(2)}
          </div>

          <p style={{ lineHeight: "1.5", marginBottom: 20 }}>
            {product.description}
          </p>

          <button
            onClick={() => addToCart(product)}
            style={{
              padding: "12px 20px",
              background: "#7b4f2a",
              color: "#fff",
              border: "1px solid #613f23",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};
