import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'data.json');

// Estructura inicial de datos
const initialData = {
  pedidos: [
    {
      id: 1,
      numero: '0891',
      cliente: 'María González',
      producto: 'Panel decorativo',
      material: 'MDF 15mm',
      dimensiones: '120 × 80 cm',
      estado: 'completado',
      tiempo_corte: 40,
      consumo_pintura: 350,
      tiempo_curado: 15,
      eficiencia: 98,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    },
    {
      id: 2,
      numero: '0892',
      cliente: 'Carlos Ruiz',
      producto: 'Puerta de closet',
      material: 'MDF 18mm',
      dimensiones: '200 × 60 cm',
      estado: 'en_proceso',
      tiempo_corte: 45,
      consumo_pintura: 480,
      tiempo_curado: 20,
      eficiencia: 96,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    },
    {
      id: 3,
      numero: '0893',
      cliente: 'Ana Martínez',
      producto: 'Estantería modular',
      material: 'MDF 12mm',
      dimensiones: '150 × 40 cm',
      estado: 'pendiente',
      tiempo_corte: 35,
      consumo_pintura: 280,
      tiempo_curado: 18,
      eficiencia: 94,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    },
    {
      id: 4,
      numero: '0894',
      cliente: 'Pedro Silva',
      producto: 'Mesa auxiliar',
      material: 'MDF 20mm',
      dimensiones: '80 × 80 cm',
      estado: 'pendiente',
      tiempo_corte: 50,
      consumo_pintura: 520,
      tiempo_curado: 25,
      eficiencia: 95,
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    }
  ],
  inventario: [
    { id: 1, material: 'Lámina MDF 9mm', cantidad: 12, minimo: 5, disponibilidad: 0.85, estado: 'Normal', codigo: 'MAT-001' },
    { id: 2, material: 'Lámina MDF 18mm', cantidad: 8, minimo: 6, disponibilidad: 0.55, estado: 'Medio', codigo: 'MAT-003' },
    { id: 3, material: 'Barniz mate', cantidad: 1.2, minimo: 2.0, disponibilidad: 0.35, estado: 'Bajo', codigo: 'PIN-005' },
    { id: 4, material: 'Lija grano 120', cantidad: 2, minimo: 10, disponibilidad: 0.20, estado: 'Bajo', codigo: 'CON-012' },
    { id: 5, material: 'Tornillos 4x40', cantidad: 150, minimo: 50, disponibilidad: 0.90, estado: 'Normal', codigo: 'FIJ-008' }
  ],
  mensajes: [],
  control_calidad: []
};

// Cargar o inicializar datos
function loadData() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

// Guardar datos
function saveData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Operaciones de base de datos simuladas
const db = {
  pedidos: {
    getAll: () => {
      const data = loadData();
      return data.pedidos;
    },
    getById: (id) => {
      const data = loadData();
      return data.pedidos.find(p => p.id === parseInt(id));
    },
    create: (pedido) => {
      const data = loadData();
      const newId = Math.max(...data.pedidos.map(p => p.id), 0) + 1;
      const newPedido = {
        ...pedido,
        id: newId,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      };
      data.pedidos.push(newPedido);
      saveData(data);
      return newPedido;
    },
    update: (id, updates) => {
      const data = loadData();
      const index = data.pedidos.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        data.pedidos[index] = {
          ...data.pedidos[index],
          ...updates,
          fecha_actualizacion: new Date().toISOString()
        };
        saveData(data);
        return data.pedidos[index];
      }
      return null;
    }
  },
  inventario: {
    getAll: () => {
      const data = loadData();
      return data.inventario;
    },
    update: (id, updates) => {
      const data = loadData();
      const index = data.inventario.findIndex(i => i.id === parseInt(id));
      if (index !== -1) {
        data.inventario[index] = { ...data.inventario[index], ...updates };
        saveData(data);
        return data.inventario[index];
      }
      return null;
    }
  },
  mensajes: {
    getByPedido: (pedidoId) => {
      const data = loadData();
      return data.mensajes.filter(m => m.pedido_id === parseInt(pedidoId));
    },
    create: (mensaje) => {
      const data = loadData();
      const newId = Math.max(...data.mensajes.map(m => m.id), 0) + 1;
      const newMensaje = {
        ...mensaje,
        id: newId,
        fecha: new Date().toISOString()
      };
      data.mensajes.push(newMensaje);
      saveData(data);
      return newMensaje;
    }
  },
  calidad: {
    getByPedido: (pedidoId) => {
      const data = loadData();
      return data.control_calidad.find(c => c.pedido_id === parseInt(pedidoId));
    },
    create: (control) => {
      const data = loadData();
      const newId = Math.max(...data.control_calidad.map(c => c.id), 0) + 1;
      const newControl = {
        ...control,
        id: newId,
        fecha: new Date().toISOString()
      };
      data.control_calidad.push(newControl);
      saveData(data);
      return newControl;
    }
  }
};

export default db;
