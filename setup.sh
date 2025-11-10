#!/bin/bash

echo "🚀 Iniciando MOBINEL - Sistema de Producción Móvil"
echo "=================================================="
echo ""

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
echo "✅ Backend listo"
echo ""

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install
echo "✅ Frontend listo"
echo ""

# Inicializar base de datos
echo "🗄️  Inicializando base de datos..."
cd ../backend
node database.js
echo "✅ Base de datos lista"
echo ""

echo "=================================================="
echo "✅ MOBINEL está listo para usar!"
echo ""
echo "Para iniciar el sistema, ejecuta:"
echo "  Backend:  cd backend && npm start"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Luego abre: http://localhost:5173"
echo "=================================================="
