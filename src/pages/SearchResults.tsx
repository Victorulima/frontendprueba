import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard, type Product } from '../components/ProductCard';
import './SearchResults.css'; // Asegúrate de tener estilos básicos

const API_URL = "https://tiendaapi-g7-bfczf8e8ckb4cqht.canadacentral-01.azurewebsites.net/api";

export const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Paginación y Filtros
  const searchTerm = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Construimos la URL con todos los filtros
        const query = new URLSearchParams({
          page: page.toString(),
          limit: '12',
          ...(searchTerm && { search: searchTerm }),
          ...(category && { category }),
          ...(sort && { sort })
        });

        const res = await fetch(`${API_URL}/products?${query.toString()}`);
        const data = await res.json();

        if (res.ok) {
          // El backend devuelve { products, totalPages, ... }
          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error("Error buscando productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]); // Se ejecuta cada vez que cambia la URL

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set('sort', e.target.value);
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  return (
    <div className="search-results-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div className="filters-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>{searchTerm ? `Resultados para "${searchTerm}"` : 'Catálogo'}</h1>
        <select value={sort} onChange={handleSortChange} style={{ padding: '5px' }}>
          <option value="">Ordenar por...</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="name_asc">Nombre: A-Z</option>
        </select>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {products.length > 0 ? (
              products.map(p => <ProductCard key={p.id} p={p} />)
            ) : (
              <p>No se encontraron productos.</p>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '40px' }}>
              <button 
                disabled={page <= 1} 
                onClick={() => handlePageChange(page - 1)}
                style={{ padding: '8px 16px' }}
              >
                Anterior
              </button>
              <span style={{ alignSelf: 'center' }}>Página {page} de {totalPages}</span>
              <button 
                disabled={page >= totalPages} 
                onClick={() => handlePageChange(page + 1)}
                style={{ padding: '8px 16px' }}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};