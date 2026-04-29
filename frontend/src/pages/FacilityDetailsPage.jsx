import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { facilitiesAPI, reservationsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './FacilityDetailsPage.css';

function getMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  now.setMinutes(0, 0, 0);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:00`;
}

export default function FacilityDetailsPage() {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const minDateTime = useMemo(() => getMinDateTime(), []);

  const fetchFacility = () => {
    setLoading(true);
    setError(null);
    facilitiesAPI.getById(id)
      .then((res) => setFacility(res.data))
      .catch(() => setError('Nie udało się pobrać danych obiektu.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFacility(); }, [id]);

  const calculatePrice = () => {
    if (!startTime || !endTime || !facility) return null;
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    if (hours <= 0) return null;
    return (hours * parseFloat(facility.price_per_hour)).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccess('');

    if (!startTime || !endTime) {
      setFormError('Podaj datę rozpoczęcia i zakończenia.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setFormError('Czas zakończenia musi być późniejszy niż rozpoczęcia.');
      return;
    }

    if (start < new Date()) {
      setFormError('Nie można rezerwować terminów w przeszłości.');
      return;
    }

    const hours = (end - start) / (1000 * 60 * 60);
    if (hours > 12) {
      setFormError('Maksymalny czas rezerwacji to 12 godzin.');
      return;
    }

    setSubmitting(true);
    try {
      await reservationsAPI.create({
        facility_id: parseInt(id),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });
      setSuccess('Rezerwacja utworzona pomyślnie! Sprawdź ją w zakładce "Moje rezerwacje".');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      const msg = err.response?.data?.error || 'Nie udało się utworzyć rezerwacji.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page"><LoadingSpinner /></div>;
  if (error) return <div className="page"><ErrorMessage message={error} onRetry={fetchFacility} /></div>;
  if (!facility) return null;

  const estimatedPrice = calculatePrice();

  return (
    <div className="page">
      <Link to="/facilities" className="back-link">&larr; Powrót do listy obiektów</Link>

      {facility.image_url && (
        <div className="detail-hero-img">
          <img src={facility.image_url} alt={facility.name} />
          <div className="detail-hero-overlay">
            <span className="facility-category">{facility.category_name || 'Obiekt sportowy'}</span>
            <h1 className="detail-hero-title">{facility.name}</h1>
            <p className="detail-hero-location">📍 {facility.location}</p>
          </div>
        </div>
      )}

      <div className="detail-layout">
        <div className="detail-info">
          {!facility.image_url && (
            <>
              <span className="facility-category" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
                {facility.category_name || 'Brak kategorii'}
              </span>
              <h1 className="detail-title">{facility.name}</h1>
              <p className="detail-location">📍 {facility.location || 'Brak lokalizacji'}</p>
            </>
          )}

          <div className="detail-section">
            <h2>Opis obiektu</h2>
            <p className="detail-desc">{facility.description || 'Brak opisu'}</p>
          </div>

          <div className="detail-features">
            <div className="detail-feature">
              <span className="detail-feature-icon">💰</span>
              <div>
                <span className="detail-feature-label">Cena za godzinę</span>
                <span className="detail-feature-value">{parseFloat(facility.price_per_hour).toFixed(2)} zł</span>
              </div>
            </div>
            <div className="detail-feature">
              <span className="detail-feature-icon">📍</span>
              <div>
                <span className="detail-feature-label">Lokalizacja</span>
                <span className="detail-feature-value">{facility.location || '—'}</span>
              </div>
            </div>
            <div className="detail-feature">
              <span className="detail-feature-icon">🏷️</span>
              <div>
                <span className="detail-feature-label">Kategoria</span>
                <span className="detail-feature-value">{facility.category_name || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-reservation">
          <h2>Zarezerwuj termin</h2>

          {!isLoggedIn ? (
            <div className="login-prompt">
              <div className="login-prompt-icon">🔒</div>
              <p>Zaloguj się, aby zarezerwować ten obiekt.</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Zaloguj się</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reservation-form">
              {formError && <div className="form-error">{formError}</div>}
              {success && <div className="form-success">{success}</div>}

              <label className="form-label">
                Data i godzina rozpoczęcia
                <input
                  type="datetime-local"
                  className="form-input"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  min={minDateTime}
                  required
                />
              </label>

              <label className="form-label">
                Data i godzina zakończenia
                <input
                  type="datetime-local"
                  className="form-input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  min={startTime || minDateTime}
                  required
                />
              </label>

              {estimatedPrice && (
                <div className="estimated-price">
                  <span>Szacowana cena</span>
                  <strong>{estimatedPrice} zł</strong>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? 'Rezerwuję...' : 'Zarezerwuj teraz'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
