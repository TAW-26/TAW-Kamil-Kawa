const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');
const metricsMiddleware = require('./middleware/metricsMiddleware');
const { register } = require('./metrics');
const { initializeDatabase } = require('./config/db');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const facilityRoutes = require('./routes/facilities');
const reservationRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(metricsMiddleware);

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/', (req, res) => {
  res.json({
    message: 'RezSport API działa!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      categories: '/api/categories',
      facilities: '/api/facilities',
      reservations: '/api/reservations',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/reservations', reservationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Nie znaleziono takiego endpointu' });
});

app.use(errorHandler);

if (require.main === module) {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Serwer RezSport działa na porcie ${PORT}`);
        console.log(`Otwórz: http://localhost:${PORT}`);
        console.log(`Metryki: http://localhost:${PORT}/metrics`);
      });
    })
    .catch((err) => {
      console.error('Nie udało się uruchomić serwera:', err.message);
      process.exit(1);
    });
}

module.exports = app;
