import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="user-avatar" style={{ width: '50px', height: '50px', fontSize: '1.5rem' }}>
          M
        </div>
        <div>
          <h1>MOBINEL</h1>
          <p>Sistema de Producción Móvil</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: location.pathname === '/' ? '600' : '400',
            opacity: location.pathname === '/' ? 1 : 0.8
          }}
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/inventario" 
          style={{ 
            color: 'white', 
            textDecoration: 'none',
            fontWeight: location.pathname === '/inventario' ? '600' : '400',
            opacity: location.pathname === '/inventario' ? 1 : 0.8
          }}
        >
          📦 Inventario
        </Link>
      </div>

      <div className="navbar-user">
        <div>
          <div style={{ fontWeight: 600 }}>Anthony Ramírez</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Técnico CNC</div>
        </div>
        <div className="user-avatar">AR</div>
      </div>
    </nav>
  );
}
