import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

export default function ControlCalidad() {
  const { pedidoId } = useParams();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [observaciones, setObservaciones] = useState('');
  const [verificaciones, setVerificaciones] = useState({
    superficie: true,
    bordes: true,
    acabado: true,
    color: true,
    burbujas: false,
    fotos: false
  });

  const mediciones = {
    largo: { valor: 200.2, esperado: 200, tolerancia: 0.3 },
    ancho: { valor: 59.8, esperado: 60, tolerancia: 0.3 },
    espesor: { valor: 18.1, esperado: 18, tolerancia: 0.3 },
    escuadra: { valor: 89.8, esperado: 90, tolerancia: 0.3 }
  };

  useEffect(() => {
    loadPedido();
  }, [pedidoId]);

  async function loadPedido() {
    try {
      const response = await fetch(`${API_URL}/pedidos/${pedidoId}`);
      const data = await response.json();
      setPedido(data);
    } catch (error) {
      console.error('Error cargando pedido:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleVerificacionChange = (key) => {
    setVerificaciones(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const aprobarYContinuar = async () => {
    try {
      // Guardar control de calidad
      await fetch(`${API_URL}/calidad`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedidoId,
          verificaciones: JSON.stringify(verificaciones),
          mediciones: JSON.stringify(mediciones),
          observaciones
        })
      });

      // Actualizar estado del pedido
      await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'completado' })
      });

      alert('¡Control de calidad aprobado! Pedido marcado como completado.');
      navigate('/');
    } catch (error) {
      console.error('Error guardando control de calidad:', error);
      alert('Error al guardar. Verifica que el backend esté corriendo.');
    }
  };

  const rechazarPieza = async () => {
    if (confirm('¿Estás seguro de que deseas rechazar esta pieza?')) {
      await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'pendiente' })
      });
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="calidad-container">
      <div className="calidad-header">
        <div>
          <h2>Control de Calidad</h2>
          <p>Pedido #{pedido?.numero} - {pedido?.producto}</p>
        </div>
      </div>

      <div style={{ 
        background: '#d1fae5', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '3rem' }}>✓</div>
        <div>
          <h3 style={{ marginBottom: '0.25rem', color: '#065f46' }}>Proceso de producción completado</h3>
          <p style={{ color: '#047857', fontSize: '0.875rem' }}>
            Finalizado: {new Date().toLocaleString('es-ES')}
          </p>
        </div>
      </div>

      <div className="verificacion-list">
        <h3 style={{ marginBottom: '1rem' }}>Inspección Visual</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Lista de verificación
        </p>

        {Object.entries(verificaciones).map(([key, value]) => {
          const labels = {
            superficie: 'Superficie libre de imperfecciones',
            bordes: 'Bordes correctamente lijados',
            acabado: 'Acabado uniforme en toda la pieza',
            color: 'Color según especificación',
            burbujas: 'Ausencia de burbujas o grietas',
            fotos: 'Fotografías documentadas'
          };

          return (
            <div key={key} className="verificacion-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={value}
                  onChange={() => handleVerificacionChange(key)}
                />
                <span>{labels[key]}</span>
              </div>
              <span className={value ? 'estado-badge estado-completado' : 'estado-badge estado-pendiente'}>
                {value ? 'Aprobado' : 'Pendiente'}
              </span>
            </div>
          );
        })}
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Mediciones de Precisión</h3>

      <div className="mediciones-grid">
        {Object.entries(mediciones).map(([key, data]) => {
          const labels = {
            largo: 'Largo Total',
            ancho: 'Ancho Total',
            espesor: 'Espesor',
            escuadra: 'Escuadra'
          };

          const dentroDeTol = Math.abs(data.valor - data.esperado) <= data.tolerancia;

          return (
            <div key={key} className="medicion-card">
              <h4 style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {labels[key]}
              </h4>
              <div className="medicion-value">{data.valor} {key === 'escuadra' ? '°' : 'cm'}</div>
              <div className="medicion-rango">
                Esperado: {data.esperado} {key === 'escuadra' ? '°' : 'cm'} ± {data.tolerancia} {key === 'escuadra' ? '°' : 'cm'}
              </div>
              <span className={`tolerancia-badge ${dentroDeTol ? 'dentro-tolerancia' : 'estado-bajo'}`}>
                {dentroDeTol ? '✓ Dentro de tolerancia' : '⚠️ Fuera de tolerancia'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="observaciones">
        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          ⚠️ Observaciones
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '1rem' }}>
          Pequeña marca de lija en esquina superior derecha - no afecta funcionalidad
        </p>
        <textarea
          placeholder="Añadir observaciones adicionales..."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div className="calidad-actions">
        <button className="button-secondary" onClick={() => navigate('/')}>
          Enviar a cliente
        </button>
        <button className="button-secondary">
          📊 Generar reporte
        </button>
        <button className="button-danger" onClick={rechazarPieza}>
          ✕ Rechazar pieza
        </button>
        <button className="button-primary" onClick={aprobarYContinuar}>
          ✓ Aprobar y continuar
        </button>
      </div>
    </div>
  );
}
