import { useState, useEffect } from 'react';
import { TrendingUp, Clock, CheckCircle, Zap, Eye, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    pedidosHoy: 0,
    enProceso: 0,
    completados: 0,
    eficiencia: 0
  });
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener estadísticas
      const statsRes = await fetch('/api/dashboard/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Obtener pedidos
      const pedidosRes = await fetch('/api/pedidos');
      const pedidosData = await pedidosRes.json();
      setPedidos(pedidosData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      'completado': 'completado',
      'en_proceso': 'en-proceso',
      'pendiente': 'pendiente'
    };
    return classes[estado] || 'pendiente';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      'completado': 'Completado',
      'en_proceso': 'En proceso',
      'pendiente': 'Pendiente'
    };
    return labels[estado] || 'Pendiente';
  };

  const handleVerPedido = (pedidoId) => {
    navigate(`/chat?pedido=${pedidoId}`);
  };

  const handleMonitorear = (pedidoId) => {
    navigate(`/chat?pedido=${pedidoId}`);
  };

  const handleIniciar = (pedidoId) => {
    navigate(`/chat?pedido=${pedidoId}`);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '28px', fontWeight: '700' }}>Dashboard</h1>
      <p style={{ marginBottom: '24px', color: '#6b7280' }}>
        Hoy tienes {stats.pedidosHoy} pedidos asignados
      </p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Pedidos Hoy</div>
          <div className="stat-value">{stats.pedidosHoy}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>+2 vs ayer</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">En Proceso</div>
          <div className="stat-value">{stats.enProceso}</div>
          <div className="stat-change neutral">
            <Clock size={16} />
            <span>Corte activo</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Completados</div>
          <div className="stat-value">{stats.completados}</div>
          <div className="stat-change positive">
            <CheckCircle size={16} />
            <span>100%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Eficiencia</div>
          <div className="stat-value">{stats.eficiencia}%</div>
          <div className="stat-change positive">
            <Zap size={16} />
            <span>+3%</span>
          </div>
        </div>
      </div>

      {/* Pedidos Table */}
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Pedidos de Hoy</h2>
          <button className="filter-btn">
            <span>📊</span>
            Filtrar por estado
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente / Producto</th>
              <th>Material</th>
              <th>Dimensiones</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>
                  <span className="pedido-id">{pedido.numero_pedido}</span>
                </td>
                <td>
                  <div>
                    <div style={{ fontWeight: 600 }}>{pedido.cliente_nombre}</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>{pedido.producto}</div>
                  </div>
                </td>
                <td>{pedido.material}</td>
                <td>{pedido.dimensiones}</td>
                <td>
                  <span className={`badge ${getEstadoBadgeClass(pedido.estado)}`}>
                    {getEstadoLabel(pedido.estado)}
                  </span>
                </td>
                <td>
                  {pedido.estado === 'completado' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleVerPedido(pedido.id)}
                    >
                      <Eye size={16} />
                      Ver
                    </button>
                  )}
                  {pedido.estado === 'en_proceso' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleMonitorear(pedido.id)}
                    >
                      <Clock size={16} />
                      Monitorear
                    </button>
                  )}
                  {pedido.estado === 'pendiente' && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleIniciar(pedido.id)}
                    >
                      <Play size={16} />
                      Iniciar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
