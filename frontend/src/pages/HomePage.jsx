import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../api/api';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../icons/Icon';
import { categoryIconName } from '../icons/categoryIconName';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="cover">
      <section className="cover-hero">
        <div className="cover-hero-inner">
          <div className="cover-eyebrow">
            <span>Rezerwacja obiektów sportowych</span>
          </div>
          <h1 className="cover-title">
            Zarezerwuj obiekt
            <span className="cover-title-em"> sportowy</span>
          </h1>
          <p className="cover-lede">
            Spis miejskich boisk, hal, kortów i pływalni z możliwością
            rezerwacji terminu — bez telefonów, bez papierowych grafików,
            wszystko online w jednym miejscu.
          </p>
          <div className="cover-actions">
            <Link to="/facilities" className="btn btn-primary btn-lg">
              Przeglądaj obiekty
              <Icon name="arrow" size={14} />
            </Link>
            {user ? (
              <Link to="/my-reservations" className="btn btn-outline btn-lg">
                Moje rezerwacje
              </Link>
            ) : (
              <Link to="/register" className="btn btn-outline btn-lg">
                Załóż konto
              </Link>
            )}
          </div>
        </div>
      </section>

      <hr className="rule-thick" />

      <section className="cover-section">
        <header className="cover-section-head">
          <span className="caps">Dostępne kategorie</span>
          <h2>Kategorie obiektów</h2>
          <p className="cover-section-lede">
            Wybierz kategorię, aby przejść do listy obiektów sportowych.
          </p>
        </header>

        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <p className="cover-empty">Brak kategorii do wyświetlenia.</p>
        ) : (
          <ol className="cover-toc">
            {categories.map((cat, idx) => (
              <li key={cat.id} className="cover-toc-item">
                <Link to={`/facilities?category=${cat.id}`} className="cover-toc-link">
                  <span className="cover-toc-num numeric">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="cover-toc-name">{cat.name}</span>
                  <span className="cover-toc-leader" aria-hidden="true" />
                  <span className="cover-toc-icon">
                    <Icon name={categoryIconName(cat.name)} size={26} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <hr className="rule-thick" />

      <section className="cover-section">
        <header className="cover-section-head">
          <span className="caps">Instrukcja</span>
          <h2>Jak zarezerwować obiekt</h2>
        </header>

        <div className="cover-howto">
          {[
            { title: 'Wybierz obiekt', body: 'Przeglądaj listę obiektów sportowych. Filtruj po kategorii, jeśli wiesz czego szukasz.' },
            { title: 'Zaplanuj termin', body: 'Na stronie obiektu wskaż datę rozpoczęcia i zakończenia. Wycenę zobaczysz od razu.' },
            { title: 'Zarezerwuj', body: 'Po potwierdzeniu rezerwacja trafia do zakładki „Moje rezerwacje" ze statusem oczekującym.' },
          ].map((step, idx) => (
            <article key={step.title} className="cover-step">
              <span className="cover-step-num">{idx + 1}.</span>
              <div className="cover-step-body">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <footer className="cover-footer">
        <p className="caps">
          RezSport · System rezerwacji obiektów sportowych · {new Date().getFullYear()} ·
          Autor: K. Kawa
        </p>
      </footer>
    </div>
  );
}
