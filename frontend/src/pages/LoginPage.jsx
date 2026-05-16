import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Podaj email i hasło.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Nie udało się zalogować.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="auth-corner auth-corner-tl" aria-hidden="true" />
        <span className="auth-corner auth-corner-tr" aria-hidden="true" />
        <span className="auth-corner auth-corner-bl" aria-hidden="true" />
        <span className="auth-corner auth-corner-br" aria-hidden="true" />

        <header className="auth-header">
          <span className="caps">Logowanie</span>
          <h1 className="auth-title">Logowanie</h1>
          <p className="auth-subtitle">
            Witaj z powrotem. Zaloguj się, aby
            kontynuować rezerwacje.
          </p>
        </header>

        <hr className="rule" />

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}

          <label className="form-label">
            Email
            <input
              type="email"
              className="form-input"
              placeholder="np. jan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="form-label">
            Hasło
            <input
              type="password"
              className="form-input"
              placeholder="Twoje hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logowanie…' : 'Zaloguj się'}
          </button>
        </form>

        <p className="auth-footer">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
}
