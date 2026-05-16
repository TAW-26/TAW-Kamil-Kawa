import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Wszystkie pola są wymagane.');
      return;
    }

    if (form.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Hasła nie są identyczne.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword: _confirmPassword, ...data } = form;
      await register(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Nie udało się zarejestrować.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <span className="auth-corner auth-corner-tl" aria-hidden="true" />
        <span className="auth-corner auth-corner-tr" aria-hidden="true" />
        <span className="auth-corner auth-corner-bl" aria-hidden="true" />
        <span className="auth-corner auth-corner-br" aria-hidden="true" />

        <header className="auth-header">
          <span className="caps">Rejestracja</span>
          <h1 className="auth-title">Rejestracja</h1>
          <p className="auth-subtitle">
            Załóż konto, aby rezerwować obiekty sportowe i zarządzać swoimi rezerwacjami.
          </p>
        </header>

        <hr className="rule" />

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-row">
            <label className="form-label">
              Imię
              <input
                type="text"
                className="form-input"
                name="first_name"
                placeholder="Jan"
                value={form.first_name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form-label">
              Nazwisko
              <input
                type="text"
                className="form-input"
                name="last_name"
                placeholder="Kowalski"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="form-label">
            Email
            <input
              type="email"
              className="form-input"
              name="email"
              placeholder="jan@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label">
            Hasło
            <input
              type="password"
              className="form-input"
              name="password"
              placeholder="Minimum 6 znaków"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label">
            Powtórz hasło
            <input
              type="password"
              className="form-input"
              name="confirmPassword"
              placeholder="Powtórz hasło"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Zapis…' : 'Zarejestruj się'}
          </button>
        </form>

        <p className="auth-footer">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
}
