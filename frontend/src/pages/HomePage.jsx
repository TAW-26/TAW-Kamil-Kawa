import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './HomePage.css';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categoryIcons = {
    'Orlik': '⚽', 'Kort tenisowy': '🎾', 'Hala sportowa': '🏀',
    'Basen': '🏊', 'Siłownia': '💪',
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Zarezerwuj obiekt sportowy <span className="hero-accent">online</span></h1>
          <p className="hero-subtitle">
            Przeglądaj dostępne obiekty sportowe i rezerwuj terminy w kilka kliknięć.
            Bez telefonów, bez czekania.
          </p>
          <Link to="/facilities" className="btn btn-primary btn-lg">
            Przeglądaj obiekty
          </Link>
        </div>
      </section>

      <section className="categories-section">
        <h2>Kategorie obiektów</h2>
        <p className="section-subtitle">Wybierz kategorię i znajdź idealny obiekt dla siebie</p>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/facilities?category=${cat.id}`}
                className="category-card"
              >
                <span className="category-icon">
                  {categoryIcons[cat.name] || '🏟️'}
                </span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="features-section">
        <h2>Jak to działa?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">1</div>
            <h3>Wybierz obiekt</h3>
            <p>Przeglądaj listę dostępnych obiektów sportowych i wybierz interesujący Cię.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">2</div>
            <h3>Zarezerwuj termin</h3>
            <p>Wybierz datę i godziny. System automatycznie obliczy cenę.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">3</div>
            <h3>Gotowe!</h3>
            <p>Twoja rezerwacja jest potwierdzona. Zarządzaj nią w panelu użytkownika.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
