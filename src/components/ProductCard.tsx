import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/GestionCarrito";

// Define la interfaz aquí o impórtala si ya la tienes en otro lado
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isActive: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
}

export const ProductCard: React.FC<{ p: Product }> = ({ p }) => {
  const { addToCart } = useCart();
  
  // Imagen por defecto si viene vacía
  const imgUrl = p.image && p.image.startsWith('http') 
    ? p.image 
    : `https://via.placeholder.com/300?text=${p.name.replace(/ /g, '+')}`;

  return (
    <div className="product-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img 
          src={imgUrl} 
          alt={p.name} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
        />
        <div style={{ padding: '1rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{p.name}</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>
            {p.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#b8860b' }}>
              S/ {p.price}
            </span>
          </div>
        </div>
      </Link>
      <div style={{ padding: '0 1rem 1rem' }}>
        <button 
          onClick={() => addToCart(p)}
          style={{ 
            width: '100%', padding: '10px', background: '#3f2a17', 
            color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' 
          }}
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};