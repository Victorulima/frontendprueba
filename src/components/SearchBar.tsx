import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (query.trim()) {
      
      navigate(`/search?query=${query.trim()}`);
    }
  };

  return (
    <form className="search-bar-container" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Buscar espadas, pociones, armaduras..." 
        className="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="search-button">Buscar</button>
    </form>
  );
};