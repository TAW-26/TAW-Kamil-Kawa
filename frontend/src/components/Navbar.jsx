import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Icon from '../icons/Icon';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="masthead">
      <div className="masthead-inner">
        <Link to="/" className="masthead-brand">
          <span className="masthead-seal">
            <Icon name="logo" size={42} />
          </span>
          <span className="masthead-wordmark">
            <span className="masthead-name">RezSport</span>
            <span className="masthead-sub">REZERWACJA OBIEKTÓW SPORTOWYCH</span>
          </span>
        </Link>

        <div className="masthead-nav">
          <NavLink to="/facilities" className="masthead-link">
            Obiekty
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/my-reservations" className="masthead-link">
                Moje rezerwacje
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin" className="masthead-link masthead-link-admin">
                  Admin
                </NavLink>
              )}
              <span className="masthead-divider" aria-hidden="true" />
              <span className="masthead-user">
                <span className="masthead-user-label">Użytkownik</span>
                <span className="masthead-user-name">{user.first_name} {user.last_name}</span>
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Wyloguj</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="masthead-link">Logowanie</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">Rejestracja</Link>
            </>
          )}
        </div>
      </div>
      <hr className="rule-thick masthead-rule" />
    </nav>
  );
}
