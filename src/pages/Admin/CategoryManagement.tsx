import React, { useState } from 'react';
import './CategoryManagement.css';
import { useData } from '../../context/DataContext'; 
import type { Category } from '../../data/mockData';

export const CategoryManagement: React.FC = () => {
 
  const { categories, addCategory, updateCategory, deleteCategory } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName(''); setDescription(''); setCurrentCategory(null);
  };

  const openModal = (category: Category | null) => {
    if (category) {
      setCurrentCategory(category);
      setName(category.name);
      setDescription(category.description);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCategory) {
      updateCategory(currentCategory.id, { name, description });
    } else {
      addCategory({ name, description });
    }
    closeModal();
  };
  
  const handleDelete = (categoryId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        deleteCategory(categoryId);
    }
  };

  return (
    <div className="category-management">
      <div className="header-actions">
        <h1>Gestión de Categorías</h1>
        <button className="admin-button success" onClick={() => openModal(null)}>Agregar Categoría</button>
      </div>

      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td className="action-buttons">
                <button className="admin-button" onClick={() => openModal(category)}>Editar</button>
                <button className="admin-button danger" onClick={() => handleDelete(category.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{currentCategory ? 'Editar' : 'Agregar'} Categoría</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-button" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="admin-button success">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};