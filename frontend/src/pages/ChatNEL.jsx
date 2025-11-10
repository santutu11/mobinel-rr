import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

export default function ChatNEL() {
  const { pedidoId } = useParams();
  const [pedido, setPedido] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [pedidoId]);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function loadData() {
    try {
      const [pedidoRes, mensajesRes] = await Promise.all([
        fetch(`${API_URL}/pedidos/${pedidoId}`),
        fetch(`${API_URL}/mensajes/${pedidoId}`)
      ]);

      const pedidoData = await pedidoRes.json();
      const mensajesData = await mensajesRes.json();

      setPedido(pedidoData);
      setMensajes(mensajesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function enviarMensaje(e) {
    e.preventDefault();
    if (!mensaje.trim() || enviando) return;

    const textoMensaje = mensaje;
    setMensaje('');
    setEnviando(true);

    // Agregar mensaje del usuario inmediatamente
    const nuevoMensajeUsuario = {
      id: Date.now(),
      rol: 'user',
      contenido: textoMensaje,
      fecha: new Date().toISOString()
    };
    setMensajes(prev => [...prev, nuevoMensajeUsuario]);

    try {
      const response = await fetch(`${API_URL}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedidoId,
          contenido: textoMensaje
        })
      });

      const data = await response.json();

      // Agregar respuesta de NEL
      const mensajeNEL = {
        id: Date.now() + 1,
        rol: 'assistant',
        contenido: data.respuesta,
        fecha: new Date().toISOString()
      };
      setMensajes(prev => [...prev, mensajeNEL]);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar mensaje. Verifica que el backend esté corriendo.');
    } finally {
      setEnviando(false);
    }
  }

  async function iniciarProceso() {
    const respuesta = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'en_proceso' })
    });
    const data = await respuesta.json();
    setPedido(data);
    
    // Agregar mensaje automático
    const mensajeAuto = {
      id: Date.now(),
      rol: 'assistant',
      contenido: `Proceso iniciado para el pedido #${data.numero}. Estoy analizando los parámetros y preparando la máquina CNC. ¿Hay algo específico que quieras ajustar?`,
      fecha: new Date().toISOString()
    };
    setMensajes(prev => [...prev, mensajeAuto]);
  }

  async function ajustarParametros() {
    setMensaje('¿Cuáles son los parámetros óptimos para este corte?');
  }

  const formatTime = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>PEDIDO ACTUAL</h3>
        
        <div className="pedido-info">
          <h4>ID del Pedido</h4>
          <p className="pedido-numero">#{pedido.numero}</p>
        </div>

        <div className="pedido-info">
          <h4>Cliente</h4>
          <p>{pedido.cliente}</p>
        </div>

        <div className="pedido-info">
          <h4>Producto</h4>
          <p>{pedido.producto}</p>
        </div>

        <div className="pedido-info">
          <h4>Material</h4>
          <p>{pedido.material}</p>
        </div>

        <div className="acciones-rapidas">
          <h4>Acciones Rápidas</h4>
          
          <div className="accion-item" onClick={() => setMensaje('¿Cuál es el estado actual del proceso?')}>
            <span className="accion-icon">📊</span>
            <span>Ver estado del proceso</span>
          </div>

          <div className="accion-item" onClick={() => setMensaje('Muéstrame el checklist de calidad')}>
            <span className="accion-icon">📋</span>
            <span>Checklist calidad</span>
          </div>

          <div className="accion-item" onClick={ajustarParametros}>
            <span className="accion-icon">⚙️</span>
            <span>Ajustar parámetros</span>
          </div>

          <div className="accion-item" onClick={() => setMensaje('¿Cuánto material necesito?')}>
            <span className="accion-icon">🏷️</span>
            <span>Configurar pintura</span>
          </div>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-avatar" style={{ background: 'white', color: '#7c3aed' }}>N</div>
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>NEL</h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>Asistente de Producción IA</p>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem' }}>
            ● Sistema activo
          </div>
        </div>

        <div className="chat-messages">
          {mensajes.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              <p>¡Hola! Soy NEL, tu asistente de producción.</p>
              <p>Estoy listo para ayudarte con el pedido #{pedido.numero}</p>
            </div>
          ) : (
            mensajes.map(msg => (
              <div key={msg.id} className={`message ${msg.rol}`}>
                <div className="message-info">
                  <strong>{msg.rol === 'user' ? 'Anthony Ramírez' : 'NEL'}</strong>
                  <span>{formatTime(msg.fecha)}</span>
                </div>
                <div className="message-content">{msg.contenido}</div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {pedido.estado === 'pendiente' && (
          <div style={{ padding: '1rem', background: '#fef3c7', borderTop: '1px solid #fbbf24', textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#92400e' }}>
              Este pedido está pendiente. ¿Deseas iniciar el proceso?
            </p>
            <button className="action-button" onClick={iniciarProceso}>
              ✓ Iniciar proceso
            </button>
            <button className="action-button secondary" style={{ marginLeft: '1rem' }} onClick={ajustarParametros}>
              ⚙️ Ajustar parámetros
            </button>
          </div>
        )}

        <form onSubmit={enviarMensaje} className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Escribe tu pregunta o comando para NEL..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            disabled={enviando}
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={enviando || !mensaje.trim()}
          >
            {enviando ? 'Enviando...' : 'Enviar →'}
          </button>
        </form>
      </div>
    </div>
  );
}
