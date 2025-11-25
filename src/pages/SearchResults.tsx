import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../context/DataContext";
import "./SearchResults.css";

export const SearchResults: React.FC = () => {
  const API = "http://localhost:3000/api/products";
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // leer parámetros de la URL ?query=...&category=...
  const params = new URLSearchParams(location.search);
  const query = params.get("query")?.toLowerCase() || "";
  const category = params.get("category")?.toLowerCase() || "";

  // ------------ Cargar productos del backend ------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const resp = await fetch(API);
        const data = await resp.json();
        setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  // ------------ Aplicar filtros por query / categoría ------------
  useEffect(() => {
    let result = products;

    if (query) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (category) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category
      );
    }

    setFiltered(result);
  }, [products, query, category]);

  // ------------ Render ------------
  return (
    <div className="search-page">
      <h2 className="search-title">Resultados de búsqueda</h2>

      {loading && <p>Cargando productos...</p>}

      {!loading && filtered.length === 0 && (
        <p>No se encontraron productos.</p>
      )}

      <div className="search-results-grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
};
