const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_NAME = process.env.DB_NAME || 'sportreserve';
const RUN_SEED = process.argv.includes('--seed');

const baseConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

function readSql(name) {
  return fs.readFileSync(path.join(__dirname, '..', 'sql', `${name}.sql`), 'utf-8');
}

async function ensureDatabaseExists() {
  const adminPool = new Pool({ ...baseConnection, database: 'postgres' });
  try {
    const exists = await adminPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_NAME]
    );

    if (exists.rows.length === 0) {
      console.log(`Tworzenie bazy danych "${DB_NAME}"...`);
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Baza danych "${DB_NAME}" została utworzona.`);
    } else {
      console.log(`Baza danych "${DB_NAME}" już istnieje.`);
    }
  } finally {
    await adminPool.end();
  }
}

async function applySchema() {
  const appPool = new Pool({ ...baseConnection, database: DB_NAME });
  try {
    await appPool.query(readSql('init'));
    console.log('Tabele zostały utworzone (lub już istniały).');

    if (RUN_SEED) {
      await appPool.query(readSql('seed'));
      console.log('Dane testowe zostały załadowane.');
    }
  } finally {
    await appPool.end();
  }
}

async function setup() {
  try {
    await ensureDatabaseExists();
    await applySchema();
    console.log('\nKonfiguracja bazy danych zakończona pomyślnie!');
    console.log('Możesz uruchomić serwer: npm start');
  } catch (err) {
    console.error('Błąd podczas konfiguracji bazy danych:', err.message);
    process.exit(1);
  }
}

setup();
