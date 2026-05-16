const PG_ERROR_MAP = {
  '23505': { status: 409, message: 'Taki rekord już istnieje (duplikat)' },
  '23503': { status: 400, message: 'Błąd referencji: powiązany rekord nie istnieje' },
  '23514': { status: 400, message: 'Dane nie spełniają wymagań walidacji' },
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('Błąd serwera:', err.stack || err.message);

  const pgMapping = PG_ERROR_MAP[err.code];
  if (pgMapping) {
    return res.status(pgMapping.status).json({ error: pgMapping.message });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Wewnętrzny błąd serwera';
  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
