const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// GET /api/reservations/my - Moje rezerwacje (zalogowany użytkownik)
router.get('/my', authenticate, reservationController.getMy);

// POST /api/reservations - Utworzenie rezerwacji (zalogowany użytkownik)
router.post('/', authenticate, reservationController.create);

// PATCH /api/reservations/:id/cancel - Anulowanie rezerwacji (zalogowany użytkownik)
router.patch('/:id/cancel', authenticate, reservationController.cancel);

// GET /api/reservations - Wszystkie rezerwacje (tylko admin)
router.get('/', authenticate, authorizeAdmin, reservationController.getAll);

module.exports = router;
