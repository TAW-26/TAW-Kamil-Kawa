import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">&#9917;</span> SportReserve
        </Link>

        <div className="navbar-links">
          <Link to="/facilities" className="nav-link">Obiekty</Link>

          {isLoggedIn ? (
            <>
              <Link to="/my-reservations" className="nav-link">Moje rezerwacje</Link>
              {isAdmin && <Link to="/admin" className="nav-link nav-admin">Panel admina</Link>}
              <div className="nav-user">
                <span className="nav-user-name">{user.first_name} {user.last_name}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">Wyloguj</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Logowanie</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Rejestracja</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
