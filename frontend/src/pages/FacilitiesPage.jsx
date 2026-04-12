import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { facilitiesAPI, categoriesAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
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
      <div className="page-header">
        <h1>Obiekty sportowe</h1>
        <p className="page-subtitle">Wybierz obiekt i zarezerwuj termin</p>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryChange('')}
        >
          Wszystkie
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${selectedCategory === String(cat.id) ? 'active' : ''}`}
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
          icon="🏟️"
          title="Brak obiektów"
          message="Nie znaleziono obiektów sportowych dla wybranej kategorii."
        />
      ) : (
        <div className="facilities-grid">
          {facilities.map((f) => (
            <Link key={f.id} to={`/facilities/${f.id}`} className="facility-card">
              <div className="facility-card-img">
                {f.image_url ? (
                  <img src={f.image_url} alt={f.name} loading="lazy" />
                ) : (
                  <div className="facility-card-img-placeholder">🏟️</div>
                )}
              </div>
              <div className="facility-card-body">
                <div className="facility-card-header">
                  <span className="facility-category">{f.category_name || 'Brak kategorii'}</span>
                </div>
                <h3 className="facility-name">{f.name}</h3>
                <p className="facility-location">📍 {f.location || 'Brak lokalizacji'}</p>
                <div className="facility-card-footer">
                  <span className="facility-price">{parseFloat(f.price_per_hour).toFixed(2)} zł/h</span>
                  <span className="btn btn-primary btn-sm">Szczegóły</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
