# MOBINEL - Sistema de Producción Móvil 🚀

Sistema completo funcional con backend, frontend y base de datos.

## 🎯 Inicio Rápido

### 1. Backend (Terminal 1)
```bash
cd backend
node server.js
```
✅ Backend corriendo en: **http://localhost:3001**

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
✅ Frontend corriendo en: **http://localhost:5173**

## 📋 Funcionalidades Implementadas

### ✓ Dashboard Principal
- Estadísticas en tiempo real (pedidos, eficiencia, completados)
- Lista completa de pedidos con filtros
- Acciones rápidas: Ver, Monitorear, Iniciar

### ✓ Chat con NEL (Asistente IA)
- Integración completa con Claude API
- Contexto del pedido actual
- Acciones rápidas predefinidas
- Historial de conversación persistente

### ✓ Gestión de Inventario
- Visualización de materiales
- Alertas automáticas de stock bajo
- Barras de progreso de disponibilidad
- Acciones para solicitar pedidos

### ✓ Control de Calidad
- Checklist de verificación visual
- Mediciones de precisión con tolerancias
- Sistema de observaciones
- Aprobar/Rechazar piezas

## 🔑 Configuración Importante

### API Key de Claude
Para que NEL funcione, configura tu API key:

1. Abre `backend/server.js`
2. Línea 9: Reemplaza `'tu-api-key-aqui'` con tu API key real de Anthropic

```javascript
const anthropic = new Anthropic({
  apiKey: 'sk-ant-api03-...' // TU API KEY AQUÍ
});
```

## 📁 Estructura del Proyecto

```
mobinel-app/
├── backend/
│   ├── server.js         # API REST completa
│   ├── database.js       # Sistema de datos JSON
│   ├── data.json         # Base de datos (se crea automáticamente)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── ChatNEL.jsx
    │   │   ├── Inventario.jsx
    │   │   └── ControlCalidad.jsx
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    └── package.json
```

## 🛠️ Stack Tecnológico

**Backend:**
- Node.js + Express
- Sistema de archivos JSON
- Claude API (Anthropic)
- CORS habilitado

**Frontend:**
- React 18 con Hooks
- React Router v6
- Vite
- CSS personalizado

## 📝 Datos de Prueba

El sistema viene con datos precargados:
- 4 pedidos de ejemplo (completado, en proceso, pendientes)
- 5 items de inventario
- Usuario: Anthony Ramírez (Técnico CNC)

## 🌐 Rutas de la API

```
GET    /api/pedidos           # Obtener todos los pedidos
GET    /api/pedidos/:id       # Obtener un pedido
POST   /api/pedidos           # Crear pedido
PUT    /api/pedidos/:id       # Actualizar pedido

GET    /api/inventario        # Obtener inventario
PUT    /api/inventario/:id    # Actualizar item

GET    /api/mensajes/:pedidoId # Obtener mensajes de un pedido
POST   /api/mensajes          # Enviar mensaje a NEL

GET    /api/calidad/:pedidoId # Obtener control de calidad
POST   /api/calidad           # Guardar control de calidad

GET    /api/stats             # Estadísticas del dashboard
```

## 🎨 Navegación de la App

- **/** - Dashboard principal
- **/chat/:pedidoId** - Chat con NEL para un pedido
- **/inventario** - Gestión de inventario
- **/calidad/:pedidoId** - Control de calidad de un pedido

## 🚀 Para Desplegar

### Backend → Render.com
1. Conecta tu repositorio
2. Configura la API key como variable de entorno
3. Deploy automático

### Frontend → Vercel
1. Importa el proyecto
2. Configura build: `npm run build`
3. Output: `dist/`
4. Deploy automático

## ✨ Características Destacadas

- ✅ TODO funcional, no hay wireframes ni prototipos
- ✅ Base de datos persistente
- ✅ Navegación completa entre páginas
- ✅ Chat real con IA (Claude)
- ✅ Interfaz profesional y responsive
- ✅ Sin dependencias problemáticas

---

**Proyecto:** MOBINEL - Proyecto V: Experiencia Intercultural de Diseño  
**Universidad:** Jorge Tadeo Lozano  
**Equipo:** Santiago, Catalina, Tatiana, Jhon
