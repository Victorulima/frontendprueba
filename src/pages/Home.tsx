import React from "react";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from '../components/SearchBar';
import './home.css';
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {

  const { products, categories } = useData();

  // Evitar errores si aún no cargó el backend
  if (!products || products.length === 0) {
    return <p style={{ textAlign: "center", marginTop: 40 }}>Cargando productos...</p>;
  }

  // FILTROS DINÁMICOS DESDE BACKEND
  const bestSellers = products.filter(p => p.isBestSeller && p.isActive !== false).slice(0, 12);
  const newArrivals = products.filter(p => p.isNew && p.isActive !== false).slice(0, 6);
  const featuredCategories = categories.slice(0, 3);
  const newCategories = categories.slice(3, 6);

  return (
    <div className="home-page-final">
      
      {/* HERO */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Mercancía mística... garantizamos casi todo</h1>
          <p className="hero-subtitle">No nos hacemos responsables de efectos secundarios mágicos.</p>
        </div>
      </header>

      {/* SEARCH */}
      <SearchBar />

      <main className="home-container">

        {/* CATEGORÍAS DESTACADAS */}
        <section className="home-section">
          <h2 className="home-section-title">Categorías Destacadas</h2>

          <div className="category-grid">
            {featuredCategories.length > 0 ? (
              featuredCategories.map((cat, i) => (
                <Link to={`/search?category=${cat.name}`} key={i} className="category-panel-link">
                  <div className="category-panel">
                    <h3>{cat.name}</h3>
                  </div>
                </Link>
              ))
            ) : (
              <p>No hay categorías disponibles.</p>
            )}
          </div>
        </section>

        {/* MÁS VENDIDOS */}
        <section className="home-section">
          <h2 className="home-section-title">Los 12 Ítems Más Vendidos</h2>

          <div className="product-grid-home">
            {bestSellers.length > 0 ? (
              bestSellers.map(p => <ProductCard key={p.id} p={p} />)
            ) : (
              <p>No hay productos disponibles.</p>
            )}
          </div>
        </section>

        {/* BANNER */}
        <section className="ad-banner">
          <div className="ad-banner-content">
            <h2>¡Oferta Semanal del Gremio!</h2>
            <p>¡20% de descuento en todas las pociones y elixires! Usa el código: AVENTURA2025</p>
            <Link to="/search?query=pociones" className="ad-banner-button">Ver Pociones en Oferta</Link>
          </div>
        </section>

        {/* CATEGORÍAS NUEVAS + PRODUCTOS NUEVOS */}
        <div className="bottom-section">

          {/* NUEVAS CATEGORÍAS */}
          <section className="home-section">
            <h2 className="home-section-title">Categorías Nuevas</h2>
            <div className="category-grid">
              {newCategories.length > 0 ? (
                newCategories.map((cat, i) => (
                  <Link to={`/search?category=${cat.name}`} key={i} className="category-panel-link">
                    <div className="category-panel small">
                      <h3>{cat.name}</h3>
                    </div>
                  </Link>
                ))
              ) : (
                <p>No hay categorías recientes.</p>
              )}
            </div>
          </section>

          {/* PRODUCTOS NUEVOS */}
          <section className="home-section">
            <h2 className="home-section-title">6 Productos Nuevos</h2>

            <div className="product-grid-home">
              {newArrivals.length > 0 ? (
                newArrivals.map(p => <ProductCard key={p.id} p={p} />)
              ) : (
                <p>No hay productos nuevos disponibles.</p>
              )}
            </div>
          </section>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="footer-final">
        <div className="footer-links">
          <Link to="/about">Sobre Nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/terms">Términos y Condiciones</Link>
        </div>
        <p>&copy; 2025 Tienda de Objetos de Fantasía. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
};
