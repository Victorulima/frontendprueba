import React, { useState } from 'react';
import './CategoryManagement.css';
import { useData, type Category } from '../../context/DataContext';

export const CategoryManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const resetForm = () => {
    setName('');
    setDescription('');
    setCurrentCategory(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    
    if (currentCategory) {
      success = await updateCategory(currentCategory.id, { name, description });
    } else {
      success = await addCategory({ name, description });
    }

    if (success) {
      setIsModalOpen(false);
      resetForm();
    } else {
      alert("Error al guardar la categoría.");
    }
  };
  
  const handleDelete = async (categoryId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        const success = await deleteCategory(categoryId);
        if (!success) alert("Error al eliminar la categoría.");
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
                        <button type="button" className="admin-button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="admin-button success">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};