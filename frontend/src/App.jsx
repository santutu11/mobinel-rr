import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ChatNEL from './pages/ChatNEL';
import Inventario from './pages/Inventario';
import ControlCalidad from './pages/ControlCalidad';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat/:pedidoId" element={<ChatNEL />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/calidad/:pedidoId" element={<ControlCalidad />} />
      </Routes>
    </BrowserRouter>
  );
}
