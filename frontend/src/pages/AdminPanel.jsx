import { useCallback, useEffect, useState } from 'react';
import { categoriesAPI, facilitiesAPI, reservationsAPI } from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import './AdminPanel.css';

function CategoriesTab() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const loadCategories = useCallback(() => {
    setLoading(true);
    setError(null);
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => setError('Nie udało się pobrać kategorii.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      const res = await categoriesAPI.create({ name: newName.trim() });
      setCategories((prev) => [...prev, res.data]);
      setNewName('');
    } catch (err) {
      alert(err.response?.data?.error || 'Nie udało się dodać kategorii.');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadCategories} />;

  return (
    <div>
      <form onSubmit={handleAdd} className="admin-add-form">
        <label className="form-label admin-add-label">
          Nowa kategoria
          <input
            type="text"
            className="form-input"
            placeholder="np. Lodowisko"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={adding}>
          {adding ? 'Dodaję…' : 'Dodaj'}
        </button>
      </form>

      {categories.length === 0 ? (
        <EmptyState icon="book" title="Brak kategorii" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Nr</th><th>Nazwa</th></tr>
            </thead>
            <tbody>
              {categories.map((c, idx) => (
                <tr key={c.id}>
                  <td className="numeric">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="admin-table-name">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function FacilitiesTab() {
  const [facilities, setFacilities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ category_id: '', name: '', description: '', location: '', price_per_hour: '', image_url: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadFacilities = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([facilitiesAPI.getAll(), categoriesAPI.getAll()])
      .then(([facRes, catRes]) => {
        setFacilities(facRes.data);
        setCategories(catRes.data);
      })
      .catch(() => setError('Nie udało się pobrać danych.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadFacilities(); }, [loadFacilities]);

  const resetForm = () => {
    setForm({ category_id: '', name: '', description: '', location: '', price_per_hour: '', image_url: '' });
    setEditId(null);
    setShowForm(false);
  };

  const openEdit = (f) => {
    setForm({
      category_id: f.category_id || '',
      name: f.name,
      description: f.description || '',
      location: f.location || '',
      price_per_hour: f.price_per_hour,
      image_url: f.image_url || '',
    });
    setEditId(f.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        const res = await facilitiesAPI.update(editId, { ...form, category_id: form.category_id || null });
        setFacilities((prev) => prev.map((f) => (f.id === editId ? { ...f, ...res.data } : f)));
      } else {
        const res = await facilitiesAPI.create({ ...form, category_id: form.category_id || null });
        setFacilities((prev) => [res.data, ...prev]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || 'Operacja nie powiodła się.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Czy dezaktywować ten obiekt?')) return;
    try {
      await facilitiesAPI.remove(id);
      setFacilities((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Nie udało się dezaktywować.');
    }
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadFacilities} />;

  return (
    <div>
      <div className="admin-toolbar">
        <button
          className="btn btn-outline"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
        >
          {showForm && !editId ? 'Anuluj' : 'Dodaj wpis'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <header className="admin-form-head">
            <span className="caps">Formularz redakcyjny</span>
            <h3>{editId ? 'Edytuj obiekt' : 'Nowy obiekt'}</h3>
          </header>
          <hr className="rule" />

          <div className="form-row">
            <label className="form-label">
              Nazwa *
              <input
                type="text"
                className="form-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form-label">
              Dział
              <select className="form-input" name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">— brak —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>

          <label className="form-label">
            Lokalizacja
            <input
              type="text"
              className="form-input"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </label>

          <label className="form-label">
            Opis
            <textarea
              className="form-input"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label className="form-label">
            Cena za godzinę (zł) *
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              name="price_per_hour"
              value={form.price_per_hour}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-label">
            URL zdjęcia
            <input
              type="url"
              className="form-input"
              name="image_url"
              placeholder="https://images.unsplash.com/..."
              value={form.image_url}
              onChange={handleChange}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Zapis…' : editId ? 'Zapisz zmiany' : 'Dodaj obiekt'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>Anuluj</button>
          </div>
        </form>
      )}

      {facilities.length === 0 ? (
        <EmptyState icon="book" title="Brak obiektów" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nr</th>
                <th>Nazwa</th>
                <th>Dział</th>
                <th>Lokalizacja</th>
                <th>Cena / h</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f, idx) => (
                <tr key={f.id}>
                  <td className="numeric">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="admin-table-name">{f.name}</td>
                  <td>{f.category_name || '—'}</td>
                  <td>{f.location || '—'}</td>
                  <td className="numeric">{parseFloat(f.price_per_hour).toFixed(2)}</td>
                  <td className="admin-actions-cell">
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(f)}>Edytuj</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeactivate(f.id)}>Dezaktywuj</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReservationsTab() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const loadReservations = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    reservationsAPI.getAll(params)
      .then((res) => setReservations(res.data))
      .catch(() => setError('Nie udało się pobrać rezerwacji.'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- canonical fetch-on-mount pattern
  useEffect(() => { loadReservations(); }, [loadReservations]);

  const handleCancel = async (id) => {
    if (!window.confirm('Anulować tę rezerwację?')) return;
    try {
      await reservationsAPI.cancel(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Nie udało się anulować.');
    }
  };

  const handleConfirm = async (id) => {
    if (!window.confirm('Potwierdzić tę rezerwację?')) return;
    try {
      await reservationsAPI.confirm(id);
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'confirmed' } : r))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Nie udało się potwierdzić.');
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const statusLabel = { confirmed: 'Potwierdzona', cancelled: 'Anulowana', pending: 'Oczekująca' };
  const statusClass = { confirmed: 'status-confirmed', cancelled: 'status-cancelled', pending: 'status-pending' };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadReservations} />;

  return (
    <div>
      <div className="catalog-filter" style={{ marginBottom: '1.5rem' }}>
        {[
          { key: '', label: 'Wszystkie' },
          { key: 'confirmed', label: 'Potwierdzone' },
          { key: 'cancelled', label: 'Anulowane' },
          { key: 'pending', label: 'Oczekujące' },
        ].map((s) => (
          <button
            key={s.key || 'all'}
            className={`catalog-filter-tab ${statusFilter === s.key ? 'active' : ''}`}
            onClick={() => setStatusFilter(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {reservations.length === 0 ? (
        <EmptyState icon="book" title="Brak rezerwacji" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Obiekt</th>
                <th>Użytkownik</th>
                <th>Termin</th>
                <th>Cena</th>
                <th>Status</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td className="admin-table-name">{r.facility_name}</td>
                  <td>
                    {r.first_name} {r.last_name}
                    <br />
                    <small className="caps">{r.email}</small>
                  </td>
                  <td className="numeric admin-table-time">
                    {formatDate(r.start_time)}
                    <br />
                    {formatDate(r.end_time)}
                  </td>
                  <td className="numeric">{parseFloat(r.total_price).toFixed(2)} zł</td>
                  <td>
                    <span className={`status-badge ${statusClass[r.status]}`}>
                      {statusLabel[r.status]}
                    </span>
                  </td>
                  <td className="admin-actions-cell">
                    {r.status === 'pending' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleConfirm(r.id)}>
                        Potwierdź
                      </button>
                    )}
                    {r.status !== 'cancelled' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r.id)}>
                        Anuluj
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [tab, setTab] = useState('facilities');

  const tabs = [
    { key: 'categories', label: 'Kategorie' },
    { key: 'facilities', label: 'Obiekty' },
    { key: 'reservations', label: 'Rezerwacje' },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <span className="caps">Panel administratora</span>
        <h1>Panel administratora</h1>
        <p className="page-subtitle">
          Zarządzaj kategoriami, obiektami i rezerwacjami.
        </p>
      </header>

      <nav className="admin-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`admin-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'facilities' && <FacilitiesTab />}
        {tab === 'reservations' && <ReservationsTab />}
      </div>
    </div>
  );
}
