import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function Inventario() {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventario();
  }, []);

  async function loadInventario() {
    try {
      const response = await fetch(`${API_URL}/inventario`);
      const data = await response.json();
      setInventario(data);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  }

  const itemsBajos = inventario.filter(item => item.estado === 'Bajo');
  const totalItems = inventario.length;
  const stockAdecuado = inventario.filter(item => item.estado === 'Normal').length;
  const stockBajo = itemsBajos.length;
  const valorTotal = inventario.reduce((sum, item) => sum + (item.cantidad * 100), 0);

  const getEstadoClass = (estado) => {
    return `estado-badge estado-${estado.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <h2>Gestión de Inventario</h2>
        <p>Bodega MOBINEL - Actualizado hace 5 minutos</p>
      </div>

      <div className="inventario-stats">
        <div className="stat-card">
          <h3>📦 Items Totales</h3>
          <div className="stat-value">{totalItems}</div>
        </div>

        <div className="stat-card">
          <h3>✓ Stock Adecuado</h3>
          <div className="stat-value">{stockAdecuado}</div>
          <div className="stat-change">85%</div>
        </div>

        <div className="stat-card">
          <h3>⚠️ Stock Bajo</h3>
          <div className="stat-value">{stockBajo}</div>
        </div>

        <div className="stat-card">
          <h3>💰 Valor Total</h3>
          <div className="stat-value">${valorTotal.toLocaleString()}</div>
        </div>
      </div>

      <div className="inventario-table">
        <div className="section-header">
          <h3>Inventario Actual</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="filter-button">Todos</button>
            <button className="filter-button">Stock bajo</button>
            <button className="filter-button">Materiales</button>
            <button className="filter-button">Consumibles</button>
          </div>
        </div>

        <table className="pedidos-table">
          <thead>
            <tr>
              <th>Material / Item</th>
              <th>Cantidad</th>
              <th>Mínimo</th>
              <th>Disponibilidad</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map(item => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {item.material.includes('MDF') ? '📋' : 
                       item.material.includes('Barniz') ? '🎨' : 
                       item.material.includes('Lija') ? '⚙️' : '🔩'}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.material}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.codigo}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <strong>{item.cantidad} unidades</strong>
                </td>
                <td>{item.minimo} unidades</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '8px', 
                      background: '#e5e7eb', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${item.disponibilidad * 100}%`, 
                        height: '100%', 
                        background: item.disponibilidad > 0.5 ? '#10b981' : item.disponibilidad > 0.3 ? '#fbbf24' : '#ef4444',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {Math.round(item.disponibilidad * 100)}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={getEstadoClass(item.estado)}>
                    {item.estado}
                  </span>
                </td>
                <td>
                  {item.estado === 'Bajo' ? (
                    <button className="action-button" style={{ background: '#f59e0b' }}>
                      Solicitar pedido
                    </button>
                  ) : (
                    <button className="action-button secondary">
                      Ver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {itemsBajos.length > 0 && (
        <div className="alertas-stock">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            ⚠️ Alertas de Stock Bajo ({itemsBajos.length} ítems)
          </h3>
          
          {itemsBajos.map(item => (
            <div key={item.id} className="alerta-item">
              <div>
                <strong>{item.material}</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
                  está por debajo del mínimo ({item.cantidad}L de {item.minimo}L requeridos)
                </div>
              </div>
              <button className="action-button" style={{ background: '#f59e0b' }}>
                Solicitar pedido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
