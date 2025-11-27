import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css'; 

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Redirige a la página de búsqueda con el parámetro 'search'
      navigate(`/search?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Buscar artefactos..." 
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-button">Buscar</button>
    </form>
  );
};