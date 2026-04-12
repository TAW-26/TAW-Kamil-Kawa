import { useEffect, useState } from 'react';
import { reservationsAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import './MyReservationsPage.css';

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

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const statusLabel = { confirmed: 'Potwierdzona', cancelled: 'Anulowana', pending: 'Oczekująca' };
  const statusClass = { confirmed: 'status-confirmed', cancelled: 'status-cancelled', pending: 'status-pending' };

  if (loading) return <div className="page"><LoadingSpinner /></div>;
  if (error) return <div className="page"><ErrorMessage message={error} onRetry={fetchReservations} /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Moje rezerwacje</h1>
        <p className="page-subtitle">Historia Twoich rezerwacji</p>
      </div>

      {reservations.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Brak rezerwacji"
          message="Nie masz jeszcze żadnych rezerwacji. Przejdź do listy obiektów, aby zarezerwować."
        />
      ) : (
        <div className="reservations-list">
          {reservations.map((r) => (
            <div key={r.id} className="reservation-card">
              <div className="reservation-main">
                <h3 className="reservation-facility">{r.facility_name}</h3>
                <p className="reservation-location">📍 {r.facility_location}</p>
                <div className="reservation-time">
                  <span>🕐 {formatDate(r.start_time)} — {formatDate(r.end_time)}</span>
                </div>
              </div>
              <div className="reservation-side">
                <span className={`status-badge ${statusClass[r.status]}`}>
                  {statusLabel[r.status] || r.status}
                </span>
                <span className="reservation-price">{parseFloat(r.total_price).toFixed(2)} zł</span>
                {r.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    className="btn btn-danger btn-sm"
                    disabled={cancellingId === r.id}
                  >
                    {cancellingId === r.id ? 'Anulowanie...' : 'Anuluj'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
