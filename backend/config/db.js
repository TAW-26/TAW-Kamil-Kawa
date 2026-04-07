const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'sportreserve',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

pool.on('error', (err) => {
  console.error('Błąd połączenia z bazą danych:', err);
});

async function initializeDatabase() {
  try {
    const initSQL = fs.readFileSync(
      path.join(__dirname, '..', 'sql', 'init.sql'),
      'utf-8'
    );
    await pool.query(initSQL);
    console.log('Połączono z bazą danych PostgreSQL — tabele gotowe.');
  } catch (err) {
    console.error('Nie udało się zainicjalizować tabel:', err.message);
    throw err;
  }
}

module.exports = pool;
module.exports.initializeDatabase = initializeDatabase;
