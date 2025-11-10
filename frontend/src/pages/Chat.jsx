import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Chat() {
  const { pedidoNumero } = useParams()
  const [pedido, setPedido] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pedidoNumero) {
      fetch(`http://localhost:3000/api/pedidos/${pedidoNumero}`)
        .then(r => r.json())
        .then(setPedido)
    }
  }, [pedidoNumero])

  const enviar = async () => {
    if (!input.trim()) return
    const msg = input
    setInput('')
    setLoading(true)
    setMensajes(prev => [...prev, { rol: 'user', contenido: msg, fecha: new Date() }])
    
    try {
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: msg, pedidoNumero: pedidoNumero || '' })
      })
      const data = await res.json()
      setMensajes(prev => [...prev, { rol: 'assistant', contenido: data.respuesta, fecha: new Date() }])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: pedido ? '300px 1fr' : '1fr', gap: '2rem', height: 'calc(100vh - 250px)' }}>
      {pedido && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1rem' }}>PEDIDO ACTUAL</h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>ID del Pedido</div>
            <div style={{ fontWeight: 600 }}>#{pedido.numero}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Cliente</div>
            <div style={{ fontWeight: 600 }}>{pedido.cliente}</div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Producto</div>
            <div style={{ fontWeight: 600 }}>{pedido.producto}</div>
          </div>
        </div>
      )}
      
      <div style={{ background: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🤖</div>
            <div>
              <h2 style={{ fontSize: '18px' }}>NEL</h2>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>Asistente de Producción IA</p>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          {mensajes.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
              ¡Hola! Soy NEL, tu asistente de producción. ¿En qué puedo ayudarte?
            </div>
          )}
          {mensajes.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexDirection: m.rol === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: m.rol === 'user' ? '#6b7280' : 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {m.rol === 'user' ? 'AR' : '🤖'}
              </div>
              <div style={{ background: m.rol === 'user' ? '#ede9fe' : '#f9fafb', padding: '1rem 1.25rem', borderRadius: '12px', maxWidth: '80%' }}>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>{m.contenido}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), enviar())}
              placeholder="Escribe tu pregunta..."
              style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '14px', resize: 'none', fontFamily: 'inherit' }}
              rows="3"
            />
            <button onClick={enviar} disabled={loading} style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              {loading ? '...' : '→'} Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
