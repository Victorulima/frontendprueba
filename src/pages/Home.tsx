import React, { useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from '../components/SearchBar';
import './Home.css';
import { Link } from "react-router-dom";

// --- INTERFACES ---
// Definimos la estructura de los datos que vienen del backend
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isBestSeller?: boolean;
  isNew?: boolean;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

// URL DE TU BACKEND (La que me pasaste)
const API_URL = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

export const Home: React.FC = () => {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [newCategories, setNewCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Obtener PRODUCTOS filtrados desde el backend
        // Nota: Asume que tu backend acepta estos filtros en la URL como configuramos
        const bestSellersRes = await fetch(`${API_URL}/products?isBestSeller=true&limit=12`);
        const newArrivalsRes = await fetch(`${API_URL}/products?isNew=true&limit=6`);
        
        // 2. Obtener CATEGORÍAS
        const categoriesRes = await fetch(`${API_URL}/categories`);

        if (bestSellersRes.ok && newArrivalsRes.ok && categoriesRes.ok) {
          // Procesar respuestas (algunos backends devuelven { products: [...] } y otros solo [...])
          const bestSellersData = await bestSellersRes.json();
          const newArrivalsData = await newArrivalsRes.json();
          const categoriesData = await categoriesRes.json();

          // Ajuste por si tu backend devuelve un objeto con paginación { products: [], total... }
          const bestList = bestSellersData.products || bestSellersData; 
          const newList = newArrivalsData.products || newArrivalsData;

          setBestSellers(bestList);
          setNewArrivals(newList);

          // Dividimos las categorías para el diseño (3 destacadas, 3 nuevas)
          if (Array.isArray(categoriesData)) {
            setFeaturedCategories(categoriesData.slice(0, 3));
            setNewCategories(categoriesData.slice(3, 6));
          }
        } else {
          console.error("Error en la respuesta del servidor");
        }
      } catch (error) {
        console.error("Error conectando al backend:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="home-page-final">
      {/* --- BANNER --- */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Forja tu Destino</h1>
          <p className="hero-subtitle">Encuentra artefactos y pociones para tu próxima aventura.</p>
        </div>
      </header>
      
      <SearchBar />

      <main className="home-container">
        
        {/* --- CATEGORÍAS DESTACADAS --- */}
        <section className="home-section">
          <h2 className="home-section-title">Categorías Destacadas</h2>
          {loading ? <p>Cargando categorías...</p> : (
            <div className="category-grid">
              {featuredCategories.map(cat => (
                <Link to={`/search?category=${cat.name}`} key={cat.id} className="category-panel-link">
                  <div className="category-panel"><h3>{cat.name}</h3></div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* --- MÁS VENDIDOS --- */}
        <section className="home-section">
          <h2 className="home-section-title">Los 12 Ítems Más Vendidos</h2>
          <div className="product-grid-home">
            {loading ? <p>Cargando productos...</p> : (
              bestSellers.map(p => <ProductCard key={p.id} p={p} />)
            )}
            {!loading && bestSellers.length === 0 && <p>No se encontraron productos destacados.</p>}
          </div>
        </section>

        {/* --- BANNER PUBLICIDAD --- */}
        <section className="ad-banner">
            <div className="ad-banner-content">
                <h2>¡Oferta de la Semana!</h2>
                <p>20% de descuento en todas las pociones. ¡Solo hasta el viernes!</p>
                <Link to="/search?category=Pociones" className="ad-banner-button">Ver Ofertas</Link>
            </div>
        </section>

        <div className="bottom-section">
            {/* --- CATEGORÍAS NUEVAS --- */}
            <section className="home-section">
                <h2 className="home-section-title">Categorías Nuevas</h2>
                <div className="category-grid">
                    {newCategories.map(cat => (
                    <Link to={`/search?category=${cat.name}`} key={cat.id} className="category-panel-link">
                        <div className="category-panel small"><h3>{cat.name}</h3></div>
                    </Link>
                    ))}
                </div>
            </section>
            
            {/* --- PRODUCTOS NUEVOS --- */}
            <section className="home-section">
                <h2 className="home-section-title">6 Productos Nuevos</h2>
                <div className="product-grid-home">
                   {loading ? <p>Cargando novedades...</p> : (
                      newArrivals.map(p => <ProductCard key={p.id} p={p} />)
                    )}
                </div>
            </section>
        </div>
      </main>

      <footer className="footer-final">
        <div className="footer-links">
          <Link to="/">Sobre Nosotros</Link>
          <Link to="/">Contacto</Link>
          <Link to="/">Términos y Condiciones</Link>
        </div>
        <p>&copy; 2025 Tienda de Objetos de Fantasía. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};