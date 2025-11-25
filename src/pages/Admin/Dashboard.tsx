import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext'; 
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  
  const { orders, users } = useData();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  
  const summary = useMemo(() => {
    let ordersToSummarize = orders;
    
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    if (startDate && endDate) {
      
      ordersToSummarize = orders.filter(order => order.fecha >= startDate && order.fecha <= endDate);
    } else {
      
      ordersToSummarize = orders.filter(order => order.fecha === todayString);
    }

    return {
      totalOrders: ordersToSummarize.length,
      newUsers: (startDate || endDate) ? 'N/A' : users.length, 
      totalRevenue: ordersToSummarize.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders, users, startDate, endDate]);

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Panel de Administrador</h1>
      <p className="admin-subtitle">Resumen de la tienda</p>
      
      <div className="summary-cards">
        <div className="card">
          <h3 className="card-title">Órdenes</h3>
          
          <p className="card-value">{summary.totalOrders}</p>
        </div>
        <div className="card">
          <h3 className="card-title">Usuarios Nuevos</h3>
          <p className="card-value">{summary.newUsers}</p>
        </div>
        <div className="card">
          <h3 className="card-title">Ingresos Totales</h3>
          <p className="card-value">S/ {summary.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title-admin">Seleccionar Período</h2>
        <form className="period-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="start-date">Desde:</label>
            <input 
              type="date" 
              id="start-date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Hasta:</label>
            <input 
              type="date" 
              id="end-date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          
        </form>
      </div>
    </div>
  );
};