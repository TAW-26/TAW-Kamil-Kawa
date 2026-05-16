const pool = require('../config/db');

const FACILITY_WITH_CATEGORY = `
  SELECT f.*, c.name AS category_name
  FROM facilities f
  LEFT JOIN categories c ON f.category_id = c.id
`;

const getAll = async (req, res, next) => {
  try {
    const { category_id } = req.query;

    let query = `${FACILITY_WITH_CATEGORY} WHERE f.is_active = true`;
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

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `${FACILITY_WITH_CATEGORY} WHERE f.id = $1`,
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

const create = async (req, res, next) => {
  try {
    const { category_id, name, description, location, price_per_hour, image_url } = req.body;

    if (!name || price_per_hour === undefined || price_per_hour === null) {
      return res.status(400).json({ error: 'Nazwa i cena za godzinę są wymagane' });
    }

    const result = await pool.query(
      `INSERT INTO facilities (category_id, name, description, location, price_per_hour, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        category_id || null,
        name,
        description || null,
        location || null,
        price_per_hour,
        image_url || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      name,
      description,
      location,
      price_per_hour,
      image_url,
      is_active,
    } = req.body;

    const result = await pool.query(
      `UPDATE facilities
       SET category_id    = COALESCE($1, category_id),
           name           = COALESCE($2, name),
           description    = COALESCE($3, description),
           location       = COALESCE($4, location),
           price_per_hour = COALESCE($5, price_per_hour),
           image_url      = COALESCE($6, image_url),
           is_active      = COALESCE($7, is_active)
       WHERE id = $8
       RETURNING *`,
      [category_id, name, description, location, price_per_hour, image_url, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Obiekt sportowy nie został znaleziony' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

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
