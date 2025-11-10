import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import db from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// ============ RUTAS DE PEDIDOS ============
app.get('/api/pedidos', (req, res) => {
  try {
    const pedidos = db.pedidos.getAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pedidos/:id', (req, res) => {
  try {
    const pedido = db.pedidos.getById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pedidos', (req, res) => {
  try {
    const { cliente, producto, material, dimensiones } = req.body;
    const numero = `0${Date.now().toString().slice(-3)}`;
    
    const pedido = db.pedidos.create({
      numero,
      cliente,
      producto,
      material,
      dimensiones,
      estado: 'pendiente',
      eficiencia: 96
    });

    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/pedidos/:id', (req, res) => {
  try {
    const pedido = db.pedidos.update(req.params.id, req.body);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RUTAS DE INVENTARIO ============
app.get('/api/inventario', (req, res) => {
  try {
    const items = db.inventario.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/inventario/:id', (req, res) => {
  try {
    const item = db.inventario.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ RUTAS DE MENSAJES/CHAT ============
app.get('/api/mensajes/:pedidoId', (req, res) => {
  try {
    const mensajes = db.mensajes.getByPedido(req.params.pedidoId);
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/mensajes', async (req, res) => {
  try {
    const { pedido_id, contenido } = req.body;

    // Guardar mensaje del usuario
    db.mensajes.create({
      pedido_id: parseInt(pedido_id),
      rol: 'user',
      contenido
    });

    // Obtener información del pedido
    const pedido = db.pedidos.getById(pedido_id);
    const inventario = db.inventario.getAll();

    // Crear contexto para NEL
    const contexto = `Eres NEL, el asistente de producción IA de MOBINEL. 
Pedido actual: #${pedido.numero}
Cliente: ${pedido.cliente}
Producto: ${pedido.producto}
Material: ${pedido.material}
Dimensiones: ${pedido.dimensiones}
Estado: ${pedido.estado}

Inventario disponible:
${inventario.map(i => `- ${i.material}: ${i.cantidad} unidades (${i.estado})`).join('\n')}

Responde de manera profesional, técnica y útil. Si el usuario pregunta sobre el proceso, dale detalles técnicos relevantes.`;

    // Llamar a Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: contexto + '\n\nUsuario: ' + contenido }
      ]
    });

    const respuesta = message.content[0].text;

    // Guardar respuesta de NEL
    db.mensajes.create({
      pedido_id: parseInt(pedido_id),
      rol: 'assistant',
      contenido: respuesta
    });

    res.json({ respuesta });
  } catch (error) {
    console.error('Error en chat:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ RUTAS DE CONTROL DE CALIDAD ============
app.get('/api/calidad/:pedidoId', (req, res) => {
  try {
    const control = db.calidad.getByPedido(req.params.pedidoId);
    res.json(control || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/calidad', (req, res) => {
  try {
    const { pedido_id, verificaciones, mediciones, observaciones } = req.body;
    
    const control = db.calidad.create({
      pedido_id: parseInt(pedido_id),
      verificaciones,
      mediciones,
      observaciones,
      estado: 'aprobado'
    });

    res.status(201).json(control);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ ESTADÍSTICAS DASHBOARD ============
app.get('/api/stats', (req, res) => {
  try {
    const pedidos = db.pedidos.getAll();
    const today = new Date().toISOString().split('T')[0];
    
    const pedidosHoy = pedidos.filter(p => 
      p.fecha_creacion.split('T')[0] === today
    ).length;
    
    const enProceso = pedidos.filter(p => p.estado === 'en_proceso').length;
    const completados = pedidos.filter(p => p.estado === 'completado').length;
    
    const eficienciaTotal = pedidos.reduce((sum, p) => sum + (p.eficiencia || 94), 0);
    const eficiencia = Math.round(eficienciaTotal / pedidos.length);

    res.json({
      pedidosHoy,
      enProceso,
      completados,
      eficiencia
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend MOBINEL corriendo en http://localhost:${PORT}`);
});
