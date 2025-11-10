import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

export default function Calidad() {
  const { pedidoNumero } = useParams()
  const [pedido, setPedido] = useState(null)

  useEffect(() => {
    if (!pedidoNumero) {
      fetch('http://localhost:3000/api/pedidos')
        .then(r => r.json())
        .then(data => {
          const completado = data.find(p => p.estado === 'Completado')
          if (completado) setPedido(completado)
        })
    } else {
      fetch(`http://localhost:3000/api/pedidos/${pedidoNumero}`)
        .then(r => r.json())
        .then(setPedido)
    }
  }, [pedidoNumero])

  const calidad = {
    superficie_libre: 1,
    bordes_correctos: 1,
    acabado_uniforme: 1,
    color_correcto: 1,
    burbujas_ausentes: 1,
    fotografias_documentadas: 0,
    largo_total: 200.2,
    largo_esperado: 200.5,
    ancho_total: 59.8,
    ancho_esperado: 60.2,
    espesor: 18.1,
    espesor_esperado: 18.0,
    escuadra: 89.8,
    escuadra_esperada: 90.0,
    observaciones: 'Pequeña marca no lija en esquina superior derecha - no afecta funcionalidad'
  }

  if (!pedido) return <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando...</div>

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '60px', height: '60px', background: 'white', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>✓</div>
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '0.25rem' }}>Proceso de producción completado</h2>
            <p style={{ opacity: 0.9, fontSize: '14px' }}>Pedido #{pedido.numero} - {pedido.cliente}</p>
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '1.5rem' }}>Inspección Visual</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { label: 'Superficie libre de imperfecciones', ok: calidad.superficie_libre },
              { label: 'Bordes correctamente lijados', ok: calidad.bordes_correctos },
              { label: 'Acabado uniforme en toda la pieza', ok: calidad.acabado_uniforme },
              { label: 'Color según especificación', ok: calidad.color_correcto },
              { label: 'Ausencia de burbujas o grietas', ok: calidad.burbujas_ausentes },
              { label: 'Fotografías documentadas', ok: calidad.fotografias_documentadas }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: item.ok ? '#d1fae5' : '#fef3c7', color: item.ok ? '#065f46' : '#92400e' }}>
                  {item.ok ? '✓' : '○'}
                </div>
                <div style={{ flex: 1, fontSize: '14px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '12px', background: item.ok ? '#d1fae5' : '#fef3c7', color: item.ok ? '#065f46' : '#92400e' }}>
                  {item.ok ? 'Aprobado' : 'Pendiente'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '1.5rem' }}>Mediciones de Precisión</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {[
              { label: 'Largo Total', valor: calidad.largo_total, esperado: calidad.largo_esperado, unidad: 'cm' },
              { label: 'Ancho Total', valor: calidad.ancho_total, esperado: calidad.ancho_esperado, unidad: 'cm' },
              { label: 'Espesor', valor: calidad.espesor, esperado: calidad.espesor_esperado, unidad: 'mm' },
              { label: 'Escuadra', valor: calidad.escuadra, esperado: calidad.escuadra_esperada, unidad: '°' }
            ].map((m, i) => (
              <div key={i} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{m.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '0.5rem' }}>{m.valor} {m.unidad}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>
                  Esperado: {m.esperado} {m.unidad} ± 0.3
                  <span style={{ display: 'inline-block', marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: '#d1fae5', color: '#065f46' }}>✓ Dentro</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {calidad.observaciones && (
          <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '1rem' }}>
              <h4 style={{ fontSize: '14px', color: '#92400e', marginBottom: '0.5rem' }}>⚠️ Observaciones</h4>
              <p style={{ fontSize: '13px', color: '#78350f', lineHeight: '1.6' }}>{calidad.observaciones}</p>
            </div>
          </div>
        )}

        <div style={{ padding: '2rem', background: '#f9fafb', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <button style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>✓ Aprobar y continuar</button>
          <button style={{ background: 'white', color: '#6b7280', border: '1px solid #d1d5db', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>📤 Enviar a cliente</button>
          <button style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>✗ Rechazar pieza</button>
        </div>
      </div>
    </div>
  )
}
