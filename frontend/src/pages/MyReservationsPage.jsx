import { useEffect, useState } from 'react';
import { reservationsAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Icon from '../icons/Icon';
import './MyReservationsPage.css';

const MONTHS_PL = [
  'STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE',
  'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU',
];

function formatDateParts(iso) {
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: MONTHS_PL[d.getMonth()],
    year: d.getFullYear(),
    time: d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
  };
}

const STATUS_LABEL = {
  confirmed: 'Potwierdzona',
  cancelled: 'Anulowana',
  pending: 'Oczekująca',
};

const STATUS_CLASS = {
  confirmed: 'status-confirmed',
  cancelled: 'status-cancelled',
  pending: 'status-pending',
};

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchReservations = () => {
    setLoading(true);
    setError(null);
    reservationsAPI.getMy()
      .then((res) => setReservations(res.data))
      .catch(() => setError('Nie udało się pobrać rezerwacji.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Czy na pewno chcesz anulować tę rezerwację?')) return;
    setCancellingId(id);
    try {
      await reservationsAPI.cancel(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Nie udało się anulować rezerwacji.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <div className="page"><LoadingSpinner /></div>;
  if (error) return <div className="page"><ErrorMessage message={error} onRetry={fetchReservations} /></div>;

  return (
    <div className="page">
      <header className="page-header">
        <span className="caps">Moje rezerwacje</span>
        <h1>Moje rezerwacje</h1>
        <p className="page-subtitle">
          Historia twoich rezerwacji obiektów sportowych.
        </p>
      </header>

      {reservations.length === 0 ? (
        <EmptyState
          icon="book"
          title="Brak rezerwacji"
          message="Nie masz jeszcze żadnych rezerwacji. Przejdź do listy obiektów, aby zarezerwować pierwszy termin."
        />
      ) : (
        <div className="ledger">
          {reservations.map((r) => {
            const start = formatDateParts(r.start_time);
            const end = formatDateParts(r.end_time);
            return (
              <article key={r.id} className="ledger-row">
                <aside className="ledger-date">
                  <span className="ledger-date-day numeric">{start.day}</span>
                  <span className="ledger-date-month">{start.month}</span>
                  <span className="ledger-date-year numeric">{start.year}</span>
                </aside>

                <div className="ledger-body">
                  <h3 className="ledger-facility">{r.facility_name}</h3>
                  <p className="ledger-location">
                    <Icon name="pin" size={13} />
                    <span>{r.facility_location || '—'}</span>
                  </p>
                  <p className="ledger-time">
                    <Icon name="clock" size={13} />
                    <span className="numeric">
                      {start.time}&nbsp;&ndash;&nbsp;{end.time}
                    </span>
                    {start.day !== end.day && (
                      <span className="ledger-time-end caps">
                        {' '}do {end.day} {end.month}
                      </span>
                    )}
                  </p>
                </div>

                <div className="ledger-side">
                  <span className={`status-badge ${STATUS_CLASS[r.status]}`}>
                    {STATUS_LABEL[r.status] || r.status}
                  </span>
                  <span className="ledger-price numeric">
                    {parseFloat(r.total_price).toFixed(2)} zł
                  </span>
                  {r.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="btn btn-danger btn-sm"
                      disabled={cancellingId === r.id}
                    >
                      {cancellingId === r.id ? 'Anuluję…' : 'Anuluj'}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
