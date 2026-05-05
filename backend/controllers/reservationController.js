const pool = require('../config/db');

// POST /api/reservations - Utworzenie nowej rezerwacji (zalogowany użytkownik)
const create = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { facility_id, start_time, end_time } = req.body;

    // Walidacja danych wejściowych
    if (!facility_id || !start_time || !end_time) {
      return res.status(400).json({ error: 'Wymagane pola: facility_id, start_time, end_time' });
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (endDate <= startDate) {
      return res.status(400).json({ error: 'Czas zakończenia musi być późniejszy niż czas rozpoczęcia' });
    }

    if (startDate < new Date()) {
      return res.status(400).json({ error: 'Nie można rezerwować terminów w przeszłości' });
    }

    // Sprawdzenie czy obiekt istnieje i jest aktywny
    const facilityResult = await pool.query(
      'SELECT * FROM facilities WHERE id = $1 AND is_active = true',
      [facility_id]
    );

    if (facilityResult.rows.length === 0) {
      return res.status(404).json({ error: 'Obiekt sportowy nie istnieje lub jest nieaktywny' });
    }

    const facility = facilityResult.rows[0];

    // Sprawdzenie kolizji terminów (czy termin nie jest już zajęty)
    const conflictResult = await pool.query(
      `SELECT id FROM reservations
       WHERE facility_id = $1
         AND status != 'cancelled'
         AND start_time < $3
         AND end_time > $2`,
      [facility_id, start_time, end_time]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'Wybrany termin jest już zarezerwowany' });
    }

    // Obliczenie ceny (godziny * cena za godzinę)
    const hours = (endDate - startDate) / (1000 * 60 * 60);
    const total_price = (hours * parseFloat(facility.price_per_hour)).toFixed(2);

    // Tworzenie rezerwacji
    const result = await pool.query(
      `INSERT INTO reservations (user_id, facility_id, start_time, end_time, status, total_price)
       VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
      [user_id, facility_id, start_time, end_time, total_price]
    );

    res.status(201).json({
      message: 'Rezerwacja utworzona pomyślnie',
      reservation: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reservations/my - Moje rezerwacje (zalogowany użytkownik)
const getMy = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `SELECT r.*, f.name AS facility_name, f.location AS facility_location
       FROM reservations r
       JOIN facilities f ON r.facility_id = f.id
       WHERE r.user_id = $1
       ORDER BY r.start_time DESC`,
      [user_id]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/reservations/:id/cancel - Anulowanie rezerwacji (klient anuluje swoją)
const cancel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Pobierz rezerwację
    const reservationResult = await pool.query(
      'SELECT * FROM reservations WHERE id = $1',
      [id]
    );

    if (reservationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Rezerwacja nie została znaleziona' });
    }

    const reservation = reservationResult.rows[0];

    // Sprawdź czy to rezerwacja tego użytkownika (admin może anulować wszystkie)
    if (reservation.user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Nie możesz anulować cudzej rezerwacji' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: 'Rezerwacja jest już anulowana' });
    }

    // Anulowanie
    const result = await pool.query(
      `UPDATE reservations SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );

    res.json({
      message: 'Rezerwacja została anulowana',
      reservation: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/reservations - Wszystkie rezerwacje (tylko admin)
const getAll = async (req, res, next) => {
  try {
    const { facility_id, status } = req.query;

    let query = `
      SELECT r.*, f.name AS facility_name, u.first_name, u.last_name, u.email
      FROM reservations r
      JOIN facilities f ON r.facility_id = f.id
      JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (facility_id) {
      params.push(facility_id);
      query += ` AND r.facility_id = $${params.length}`;
    }

    if (status) {
      params.push(status);
      query += ` AND r.status = $${params.length}`;
    }

    query += ' ORDER BY r.start_time DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { create, getMy, cancel, getAll };
