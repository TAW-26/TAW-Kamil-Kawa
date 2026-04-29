import { useEffect, useState } from 'react';
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

  const fetch = () => {
    setLoading(true);
    setError(null);
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => setError('Nie udało się pobrać kategorii.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

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
  if (error) return <ErrorMessage message={error} onRetry={fetch} />;

  return (
    <div>
      <form onSubmit={handleAdd} className="admin-add-form">
        <input
          type="text"
          className="form-input"
          placeholder="Nazwa nowej kategorii"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={adding}>
          {adding ? 'Dodawanie...' : 'Dodaj'}
        </button>
      </form>

      {categories.length === 0 ? (
        <EmptyState icon="📁" title="Brak kategorii" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Nazwa</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}><td>{c.id}</td><td>{c.name}</td></tr>
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
  const [form, setForm] = useState({ category_id: '', name: '', description: '', location: '', price_per_hour: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([facilitiesAPI.getAll(), categoriesAPI.getAll()])
      .then(([facRes, catRes]) => {
        setFacilities(facRes.data);
        setCategories(catRes.data);
      })
      .catch(() => setError('Nie udało się pobrać danych.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const resetForm = () => {
    setForm({ category_id: '', name: '', description: '', location: '', price_per_hour: '' });
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
  if (error) return <ErrorMessage message={error} onRetry={fetchAll} />;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm && !editId ? 'Anuluj' : '+ Dodaj obiekt'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-facility-form">
          <h3>{editId ? 'Edytuj obiekt' : 'Nowy obiekt'}</h3>
          <div className="form-row">
            <label className="form-label">
              Nazwa *
              <input type="text" className="form-input" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label className="form-label">
              Kategoria
              <select className="form-input" name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">-- brak --</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <label className="form-label">
            Lokalizacja
            <input type="text" className="form-input" name="location" value={form.location} onChange={handleChange} />
          </label>
          <label className="form-label">
            Opis
            <textarea className="form-input" name="description" rows="3" value={form.description} onChange={handleChange} />
          </label>
          <label className="form-label">
            Cena za godzinę (zł) *
            <input type="number" step="0.01" min="0" className="form-input" name="price_per_hour" value={form.price_per_hour} onChange={handleChange} required />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Zapisywanie...' : editId ? 'Zapisz zmiany' : 'Dodaj obiekt'}
            </button>
            <button type="button" className="btn btn-outline" onClick={resetForm}>Anuluj</button>
          </div>
        </form>
      )}

      {facilities.length === 0 ? (
        <EmptyState icon="🏟️" title="Brak obiektów" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Nazwa</th><th>Kategoria</th><th>Lokalizacja</th><th>Cena/h</th><th>Akcje</th></tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{f.category_name || '—'}</td>
                  <td>{f.location || '—'}</td>
                  <td>{parseFloat(f.price_per_hour).toFixed(2)} zł</td>
                  <td className="actions-cell">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(f)}>Edytuj</button>
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

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    reservationsAPI.getAll(params)
      .then((res) => setReservations(res.data))
      .catch(() => setError('Nie udało się pobrać rezerwacji.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, [statusFilter]);

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

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const statusLabel = { confirmed: 'Potwierdzona', cancelled: 'Anulowana', pending: 'Oczekująca' };
  const statusClass = { confirmed: 'status-confirmed', cancelled: 'status-cancelled', pending: 'status-pending' };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchAll} />;

  return (
    <div>
      <div className="filter-bar" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
        {['', 'confirmed', 'cancelled', 'pending'].map((s) => (
          <button
            key={s}
            className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s ? statusLabel[s] : 'Wszystkie'}
          </button>
        ))}
      </div>

      {reservations.length === 0 ? (
        <EmptyState icon="📋" title="Brak rezerwacji" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Obiekt</th><th>Użytkownik</th><th>Termin</th><th>Cena</th><th>Status</th><th>Akcje</th></tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.facility_name}</td>
                  <td>{r.first_name} {r.last_name}<br /><small>{r.email}</small></td>
                  <td>{formatDate(r.start_time)}<br />{formatDate(r.end_time)}</td>
                  <td>{parseFloat(r.total_price).toFixed(2)} zł</td>
                  <td><span className={`status-badge ${statusClass[r.status]}`}>{statusLabel[r.status]}</span></td>
                  <td>
                    {r.status !== 'cancelled' && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r.id)}>Anuluj</button>
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
      <div className="page-header">
        <h1>Panel administratora</h1>
        <p className="page-subtitle">Zarządzaj kategoriami, obiektami i rezerwacjami</p>
      </div>

      <div className="admin-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`admin-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {tab === 'categories' && <CategoriesTab />}
        {tab === 'facilities' && <FacilitiesTab />}
        {tab === 'reservations' && <ReservationsTab />}
      </div>
    </div>
  );
}
