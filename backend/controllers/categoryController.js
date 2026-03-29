const pool = require('../config/db');

// GET /api/categories - Lista wszystkich kategorii
const getAll = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// POST /api/categories - Dodanie nowej kategorii (tylko admin)
const create = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nazwa kategorii jest wymagana' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create };
