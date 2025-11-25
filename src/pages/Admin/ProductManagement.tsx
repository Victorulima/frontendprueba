import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import { useData } from '../../context/DataContext'; 
import type { Product } from '../../data/mockData';

export const ProductManagement: React.FC = () => {
  
  const { products, categories, addProduct, updateProduct, toggleProductActive } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const resetForm = () => {
    setName(''); setCategory(''); setPrice(''); setDescription(''); setImage('');
    setCurrentProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setName(product.name);
    setCategory(product.category || '');
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setImage(product.image || '');
    setIsEditModalOpen(true);
  };
  
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ name, category, price: parseFloat(price), description, image });
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    updateProduct(currentProduct.id, { name, category, price: parseFloat(price), description, image });
    setIsEditModalOpen(false);
  };

  return (
    <div className="product-management">
      <div className="header-actions">
        <h1>Gestión de Productos</h1>
        <button className="admin-button success" onClick={openAddModal}>Agregar Producto</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={product.isActive === false ? 'product-inactive' : ''}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category || 'N/A'}</td>
              <td>S/ {product.price.toFixed(2)}</td>
              <td>{product.isActive === false ? 'Inactivo' : 'Activo'}</td>
              <td className="action-buttons">
                <button className="admin-button" onClick={() => openEditModal(product)}>Editar</button>
                <button 
                  className={`admin-button ${product.isActive === false ? 'success' : 'danger'}`}
                  onClick={() => toggleProductActive(product.id)}
                >
                  {product.isActive === false ? 'Activar' : 'Desactivar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group"><label>Nombre</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                </select>
              </div>
              <div className="form-group"><label>Precio</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" /></div>
              <div className="form-group"><label>Descripción</label><textarea value={description} onChange={e => setDescription(e.target.value)}></textarea></div>
              <div className="form-group"><label>URL de la Imagen</label><input type="text" value={image} onChange={e => setImage(e.target.value)} /></div>
              <div className="modal-actions">
                <button type="button" className="admin-button" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                <button type="submit" className="admin-button success">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {isEditModalOpen && currentProduct && (
         <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Producto</h2>
            <form onSubmit={handleEditProduct}>
              <div className="form-group"><label>Nombre</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(cat => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
                </select>
              </div>
              <div className="form-group"><label>Precio</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" /></div>
              <div className="form-group"><label>Descripción</label><textarea value={description} onChange={e => setDescription(e.target.value)}></textarea></div>
              <div className="form-group"><label>URL de la Imagen</label><input type="text" value={image} onChange={e => setImage(e.target.value)} /></div>
              <div className="modal-actions">
                <button type="button" className="admin-button" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className="admin-button success">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};