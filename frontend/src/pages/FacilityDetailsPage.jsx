import { useCallback, useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { facilitiesAPI, reservationsAPI } from '../api/api';
import { useAuth } from '../context/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Icon from '../icons/Icon';
import { categoryIconName } from '../icons/categoryIconName';
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

  const fetchFacility = useCallback(() => {
    setLoading(true);
    setError(null);
    facilitiesAPI.getById(id)
      .then((res) => setFacility(res.data))
      .catch(() => setError('Nie udało się pobrać danych obiektu.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { fetchFacility(); }, [fetchFacility]);

  const calculatePrice = () => {
    if (!startTime || !endTime || !facility) return null;
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    if (hours <= 0) return null;
    return {
      hours: hours.toFixed(2),
      total: (hours * parseFloat(facility.price_per_hour)).toFixed(2),
    };
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
      setSuccess('Rezerwacja została złożona. Sprawdź ją w zakładce „Moje rezerwacje".');
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

  const price = calculatePrice();

  return (
    <div className="page">
      <Link to="/facilities" className="entry-back">
        <Icon name="back" size={14} />
        <span>Powrót do katalogu</span>
      </Link>

      <article className="chapter">
        <header className="chapter-head">
          <span className="caps">
            Obiekt #{facility.id}
            {facility.category_name && (
              <>&nbsp;·&nbsp;Dział: {facility.category_name}</>
            )}
          </span>
          <h1 className="chapter-title">{facility.name}</h1>
          <p className="chapter-byline">
            <Icon name="pin" size={14} />
            <span>{facility.location || 'Lokalizacja nieznana'}</span>
          </p>
        </header>

        <hr className="rule-thick" />

        <div className="chapter-grid">
          <div className="chapter-content">
            <figure className="chapter-figure">
              {facility.image_url ? (
                <img src={facility.image_url} alt={facility.name} />
              ) : (
                <div className="chapter-figure-empty">
                  <Icon name={categoryIconName(facility.category_name)} size={88} />
                </div>
              )}
              <figcaption className="caps">
                {facility.name}
                {facility.category_name && <> · {facility.category_name}</>}
              </figcaption>
            </figure>

            <section className="chapter-prose">
              <h2>Opis</h2>
              <p className="chapter-dropcap">
                {facility.description || 'Wpis nie zawiera dodatkowego opisu obiektu.'}
              </p>
            </section>

            <section className="chapter-spec">
              <h2>Specyfikacja</h2>
              <dl className="spec-table">
                <div className="spec-row">
                  <dt className="caps">Cena / 1 godzina</dt>
                  <dd className="numeric">{parseFloat(facility.price_per_hour).toFixed(2)} zł</dd>
                </div>
                <div className="spec-row">
                  <dt className="caps">Lokalizacja</dt>
                  <dd>{facility.location || '—'}</dd>
                </div>
                <div className="spec-row">
                  <dt className="caps">Dział</dt>
                  <dd>{facility.category_name || '—'}</dd>
                </div>
                <div className="spec-row">
                  <dt className="caps">Status</dt>
                  <dd>
                    <span className="status-badge status-confirmed">Czynny</span>
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <aside className="chapter-aside">
            <div className="reservation-panel">
              <span className="caps reservation-eyebrow">Formularz rezerwacji</span>
              <h2>Zarezerwuj termin</h2>

              {!isLoggedIn ? (
                <div className="login-prompt">
                  <span className="login-prompt-icon">
                    <Icon name="lock" size={36} />
                  </span>
                  <p>
                    Rezerwacja wymaga uprzedniego założenia konta lub zalogowania
                    się do serwisu.
                  </p>
                  <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                    Zaloguj się
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="reservation-form">
                  {formError && <div className="form-error">{formError}</div>}
                  {success && <div className="form-success">{success}</div>}

                  <label className="form-label">
                    Początek
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
                    Zakończenie
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      min={startTime || minDateTime}
                      required
                    />
                  </label>

                  {price && (
                    <div className="reservation-quote">
                      <span className="caps">Wycena wstępna</span>
                      <div className="reservation-quote-row">
                        <span className="numeric">{price.hours} h</span>
                        <span aria-hidden="true">×</span>
                        <span className="numeric">
                          {parseFloat(facility.price_per_hour).toFixed(2)} zł
                        </span>
                      </div>
                      <strong className="numeric reservation-quote-total">
                        {price.total} zł
                      </strong>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                    style={{ width: '100%' }}
                  >
                    {submitting ? 'Zapisuję…' : 'Zarezerwuj termin'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
