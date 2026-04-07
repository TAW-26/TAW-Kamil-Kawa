const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_NAME = process.env.DB_NAME || 'sportreserve';
const SEED = process.argv.includes('--seed');

const adminPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function setup() {
  try {
    const dbCheck = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_NAME]
    );

    if (dbCheck.rows.length === 0) {
      console.log(`Tworzenie bazy danych "${DB_NAME}"...`);
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Baza danych "${DB_NAME}" została utworzona.`);
    } else {
      console.log(`Baza danych "${DB_NAME}" już istnieje.`);
    }

    await adminPool.end();

    const appPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: DB_NAME,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    });

    const initSQL = fs.readFileSync(
      path.join(__dirname, '..', 'sql', 'init.sql'),
      'utf-8'
    );
    await appPool.query(initSQL);
    console.log('Tabele zostały utworzone (lub już istniały).');

    if (SEED) {
      const seedSQL = fs.readFileSync(
        path.join(__dirname, '..', 'sql', 'seed.sql'),
        'utf-8'
      );
      await appPool.query(seedSQL);
      console.log('Dane testowe zostały załadowane.');
    }

    await appPool.end();
    console.log('\nKonfiguracja bazy danych zakończona pomyślnie!');
    console.log('Możesz uruchomić serwer: npm start');
  } catch (err) {
    console.error('Błąd podczas konfiguracji bazy danych:', err.message);
    process.exit(1);
  }
}

setup();
