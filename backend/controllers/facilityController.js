const pool = require('../config/db');

// GET /api/facilities - Lista aktywnych obiektów (z opcjonalnym filtrowaniem po kategorii)
const getAll = async (req, res, next) => {
  try {
    const { category_id } = req.query;

    let query = `
      SELECT f.*, c.name AS category_name
      FROM facilities f
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE f.is_active = true
    `;
    const params = [];

    if (category_id) {
      params.push(category_id);
      query += ` AND f.category_id = $${params.length}`;
    }

    query += ' ORDER BY f.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/facilities/:id - Szczegóły jednego obiektu
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT f.*, c.name AS category_name
       FROM facilities f
       LEFT JOIN categories c ON f.category_id = c.id
       WHERE f.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obiekt sportowy nie został znaleziony' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/facilities - Dodanie nowego obiektu (tylko admin)
const create = async (req, res, next) => {
  try {
    const { category_id, name, description, location, price_per_hour } = req.body;

    if (!name || !price_per_hour) {
      return res.status(400).json({ error: 'Nazwa i cena za godzinę są wymagane' });
    }

    const result = await pool.query(
      `INSERT INTO facilities (category_id, name, description, location, price_per_hour)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [category_id || null, name, description || null, location || null, price_per_hour]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PUT /api/facilities/:id - Edycja obiektu (tylko admin)
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, location, price_per_hour, is_active } = req.body;

    const result = await pool.query(
      `UPDATE facilities
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           location = COALESCE($4, location),
           price_per_hour = COALESCE($5, price_per_hour),
           is_active = COALESCE($6, is_active)
       WHERE id = $7
       RETURNING *`,
      [category_id, name, description, location, price_per_hour, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obiekt sportowy nie został znaleziony' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/facilities/:id - Dezaktywacja obiektu (soft delete, tylko admin)
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE facilities SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obiekt sportowy nie został znaleziony' });
    }

    res.json({ message: 'Obiekt został dezaktywowany', facility: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
