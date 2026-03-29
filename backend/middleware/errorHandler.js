// Globalny handler błędów Express
const errorHandler = (err, req, res, next) => {
  console.error('Błąd serwera:', err.stack || err.message);

  // Błędy walidacji PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Taki rekord już istnieje (duplikat)' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ error: 'Błąd referencji: powiązany rekord nie istnieje' });
  }

  if (err.code === '23514') {
    return res.status(400).json({ error: 'Dane nie spełniają wymagań walidacji' });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Wewnętrzny błąd serwera';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
