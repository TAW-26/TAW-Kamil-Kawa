const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// POST /api/auth/register - Rejestracja nowego użytkownika
const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Walidacja danych wejściowych
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane: first_name, last_name, email, password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
    }

    // Sprawdzenie czy email jest już zajęty
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Użytkownik z tym adresem email już istnieje' });
    }

    // Hashowanie hasła
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Zapis do bazy danych
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, role, created_at',
      [first_name, last_name, email, password_hash, 'user']
    );

    const user = result.rows[0];

    // Generowanie tokenu JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Rejestracja zakończona pomyślnie',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login - Logowanie użytkownika
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email i hasło są wymagane' });
    }

    // Szukanie użytkownika w bazie
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    const user = result.rows[0];

    // Porównanie hasła
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło' });
    }

    // Generowanie tokenu JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Logowanie pomyślne',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
