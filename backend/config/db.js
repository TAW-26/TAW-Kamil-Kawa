const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'sportreserve',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Test połączenia przy starcie
pool.on('connect', () => {
  console.log('Połączono z bazą danych PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Błąd połączenia z bazą danych:', err);
});

module.exports = pool;
