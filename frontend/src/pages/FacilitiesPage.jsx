import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { facilitiesAPI, categoriesAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Icon from '../icons/Icon';
import { categoryIconName } from '../icons/categoryIconName';
import './FacilitiesPage.css';

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  const fetchData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      facilitiesAPI.getAll(selectedCategory || undefined),
      categoriesAPI.getAll(),
    ])
      .then(([facRes, catRes]) => {
        setFacilities(facRes.data);
        setCategories(catRes.data);
      })
      .catch(() => setError('Nie udało się pobrać danych.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [selectedCategory]);

  const handleCategoryChange = (catId) => {
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      setSearchParams({});
    }
  };

  if (error) return <div className="page"><ErrorMessage message={error} onRetry={fetchData} /></div>;

  return (
    <div className="page">
      <header className="page-header">
        <span className="caps">Lista obiektów</span>
        <h1>Obiekty sportowe</h1>
        <p className="page-subtitle">
          Pełny spis dostępnych obiektów sportowych.
          Filtruj po kategorii, by zawęzić wyniki.
        </p>
      </header>

      <div className="catalog-filter" role="tablist">
        <button
          role="tab"
          className={`catalog-filter-tab ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          Wszystkie
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            className={`catalog-filter-tab ${selectedCategory === String(cat.id) ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : facilities.length === 0 ? (
        <EmptyState
          icon="book"
          title="Brak obiektów"
          message="Nie znaleziono obiektów dla wybranej kategorii. Spróbuj wybrać inną kategorię."
        />
      ) : (
        <div className="catalog-grid">
          {facilities.map((f, idx) => (
            <Link key={f.id} to={`/facilities/${f.id}`} className="entry">
              <div className="entry-header">
                <span className="entry-num numeric">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {f.category_name && (
                  <span className="entry-cat caps">{f.category_name}</span>
                )}
              </div>

              <div className="entry-illustration">
                {f.image_url ? (
                  <img src={f.image_url} alt={f.name} loading="lazy" />
                ) : (
                  <div className="entry-illustration-empty">
                    <Icon name={categoryIconName(f.category_name)} size={56} />
                  </div>
                )}
                <span className="entry-illustration-caption caps">
                  {f.name}
                </span>
              </div>

              <h3 className="entry-title">{f.name}</h3>

              <p className="entry-location">
                <Icon name="pin" size={13} />
                <span>{f.location || 'Lokalizacja nieznana'}</span>
              </p>

              <hr className="rule" />

              <dl className="entry-meta">
                <div className="entry-meta-row">
                  <dt className="caps">Cena / 1 godz.</dt>
                  <dd className="numeric">{parseFloat(f.price_per_hour).toFixed(2)} zł</dd>
                </div>
              </dl>

              <span className="entry-cta">
                Szczegóły i rezerwacja
                <Icon name="arrow" size={13} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
