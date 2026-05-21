const fs = require('fs');
const path = require('path');
const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeAll(async () => {
  const initSQL = fs.readFileSync(
    path.join(__dirname, '..', 'sql', 'init.sql'),
    'utf-8'
  );
  await pool.query(initSQL);

  await pool.query('DELETE FROM reservations');
  await pool.query('DELETE FROM facilities');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM users');
});

afterAll(async () => {
  await pool.end();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const auth = (token) => ({ Authorization: `Bearer ${token}` });

const tomorrowAt = (hour) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const yesterdayAt = (hour) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

// Shared state used across describe blocks (tests run sequentially in the
// declared order — Jest preserves file order by default).
const state = {
  userToken: '',
  adminToken: '',
  secondUserToken: '',
  secondUserId: null,
  categoryId: null,
  facilityId: null,
  reservationId: null,
};

// ===========================================================================
// AUTH
// ===========================================================================

describe('Auth — rejestracja i logowanie', () => {
  test('POST /api/auth/register → tworzy konto użytkownika', async () => {
    const res = await request(app).post('/api/auth/register').send({
      first_name: 'Jan',
      last_name: 'Testowy',
      email: 'jan@test.pl',
      password: 'haslo123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('jan@test.pl');
    expect(res.body.user.role).toBe('user');
    state.userToken = res.body.token;
  });

  test('POST /api/auth/register → 400, gdy hasło jest za krótkie', async () => {
    const res = await request(app).post('/api/auth/register').send({
      first_name: 'A',
      last_name: 'B',
      email: 'short@test.pl',
      password: '123',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Hasło/i);
  });

  test('POST /api/auth/register → 400, gdy brak wymaganych pól', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'brak@test.pl' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/register → 409, gdy email już istnieje', async () => {
    const res = await request(app).post('/api/auth/register').send({
      first_name: 'Jan',
      last_name: 'Drugi',
      email: 'jan@test.pl',
      password: 'haslo123',
    });
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/register → tworzy drugiego usera (kontrola właściciela)', async () => {
    const res = await request(app).post('/api/auth/register').send({
      first_name: 'Anna',
      last_name: 'Druga',
      email: 'anna@test.pl',
      password: 'haslo123',
    });
    expect(res.statusCode).toBe(201);
    state.secondUserToken = res.body.token;
    state.secondUserId = res.body.user.id;
  });

  test('POST /api/auth/register + UPDATE → przygotowuje admina', async () => {
    const res = await request(app).post('/api/auth/register').send({
      first_name: 'Admin',
      last_name: 'Testowy',
      email: 'admin@test.pl',
      password: 'admin123',
    });
    expect(res.statusCode).toBe(201);

    await pool.query(
      "UPDATE users SET role = 'admin' WHERE email = 'admin@test.pl'"
    );

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.pl', password: 'admin123' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.user.role).toBe('admin');
    state.adminToken = loginRes.body.token;
  });

  test('POST /api/auth/login → 200 dla poprawnych danych', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jan@test.pl', password: 'haslo123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login → 401 dla błędnego hasła', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jan@test.pl', password: 'zle_haslo' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/login → 401 dla nieistniejącego emaila', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@test.pl', password: 'cokolwiek' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/login → 400, gdy brak pól', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
});

// ===========================================================================
// AUTH MIDDLEWARE
// ===========================================================================

describe('Auth middleware — token JWT', () => {
  test('endpoint chroniony bez nagłówka → 401', async () => {
    const res = await request(app).get('/api/reservations/my');
    expect(res.statusCode).toBe(401);
  });

  test('endpoint chroniony z błędnym schematem → 401', async () => {
    const res = await request(app)
      .get('/api/reservations/my')
      .set('Authorization', 'Token abc');
    expect(res.statusCode).toBe(401);
  });

  test('endpoint chroniony z niepoprawnym tokenem → 401', async () => {
    const res = await request(app)
      .get('/api/reservations/my')
      .set('Authorization', 'Bearer not.a.real.jwt');
    expect(res.statusCode).toBe(401);
  });

  test('endpoint chroniony z pustym tokenem → 401', async () => {
    const res = await request(app)
      .get('/api/reservations/my')
      .set('Authorization', 'Bearer ');
    expect(res.statusCode).toBe(401);
  });
});

// ===========================================================================
// CATEGORIES
// ===========================================================================

describe('Categories — kategorie obiektów', () => {
  test('POST /api/categories → admin dodaje kategorię', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set(auth(state.adminToken))
      .send({ name: 'Orlik' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Orlik');
    state.categoryId = res.body.id;
  });

  test('POST /api/categories → 409 dla duplikatu nazwy', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set(auth(state.adminToken))
      .send({ name: 'Orlik' });
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/categories → 400, gdy brak nazwy', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set(auth(state.adminToken))
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/categories → 403 dla zwykłego usera', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set(auth(state.userToken))
      .send({ name: 'Kort' });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/categories → 401 bez tokenu', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: 'Hala' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/categories → publiczna lista', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// FACILITIES
// ===========================================================================

describe('Facilities — obiekty sportowe', () => {
  test('POST /api/facilities → admin dodaje obiekt', async () => {
    const res = await request(app)
      .post('/api/facilities')
      .set(auth(state.adminToken))
      .send({
        category_id: state.categoryId,
        name: 'Orlik Testowy',
        description: 'Boisko do testów',
        location: 'ul. Testowa 1',
        price_per_hour: 100.0,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Orlik Testowy');
    state.facilityId = res.body.id;
  });

  test('POST /api/facilities → 400 bez nazwy lub ceny', async () => {
    const res = await request(app)
      .post('/api/facilities')
      .set(auth(state.adminToken))
      .send({ description: 'brak wymaganych pól' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/facilities → 403 dla zwykłego usera', async () => {
    const res = await request(app)
      .post('/api/facilities')
      .set(auth(state.userToken))
      .send({ name: 'Nielegalny obiekt', price_per_hour: 50 });
    expect(res.statusCode).toBe(403);
  });

  test('GET /api/facilities → publiczna lista', async () => {
    const res = await request(app).get('/api/facilities');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/facilities?category_id=X → filtrowanie', async () => {
    const res = await request(app).get(
      `/api/facilities?category_id=${state.categoryId}`
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.every((f) => f.category_id === state.categoryId)).toBe(true);
  });

  test('GET /api/facilities/:id → szczegóły', async () => {
    const res = await request(app).get(`/api/facilities/${state.facilityId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Orlik Testowy');
  });

  test('GET /api/facilities/:id → 404 dla nieistniejącego id', async () => {
    const res = await request(app).get('/api/facilities/999999');
    expect(res.statusCode).toBe(404);
  });

  test('PUT /api/facilities/:id → admin edytuje obiekt', async () => {
    const res = await request(app)
      .put(`/api/facilities/${state.facilityId}`)
      .set(auth(state.adminToken))
      .send({ price_per_hour: 120.0 });
    expect(res.statusCode).toBe(200);
    expect(parseFloat(res.body.price_per_hour)).toBe(120.0);
  });

  test('PUT /api/facilities/:id → 404 dla nieistniejącego id', async () => {
    const res = await request(app)
      .put('/api/facilities/999999')
      .set(auth(state.adminToken))
      .send({ price_per_hour: 50 });
    expect(res.statusCode).toBe(404);
  });
});

// ===========================================================================
// RESERVATIONS
// ===========================================================================

describe('Reservations — rezerwacje', () => {
  test('POST /api/reservations → user tworzy rezerwację (status pending)', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: state.facilityId,
        start_time: tomorrowAt(10),
        end_time: tomorrowAt(12),
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.reservation).toHaveProperty('id');
    expect(res.body.reservation.status).toBe('pending');
    expect(parseFloat(res.body.reservation.total_price)).toBe(240);
    state.reservationId = res.body.reservation.id;
  });

  test('POST /api/reservations → 409 dla kolizji terminu', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: state.facilityId,
        start_time: tomorrowAt(11),
        end_time: tomorrowAt(13),
      });
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/reservations → 400 dla daty w przeszłości', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: state.facilityId,
        start_time: yesterdayAt(10),
        end_time: yesterdayAt(12),
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/przeszłości/i);
  });

  test('POST /api/reservations → 400, gdy end_time <= start_time', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: state.facilityId,
        start_time: tomorrowAt(15),
        end_time: tomorrowAt(15),
      });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/reservations → 400 dla niepoprawnego formatu daty', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: state.facilityId,
        start_time: 'not-a-date',
        end_time: 'also-not',
      });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/reservations → 400, gdy brak pól', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({ facility_id: state.facilityId });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/reservations → 404 dla nieistniejącego obiektu', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: 999999,
        start_time: tomorrowAt(8),
        end_time: tomorrowAt(9),
      });
    expect(res.statusCode).toBe(404);
  });

  test('POST /api/reservations → 401 bez tokenu', async () => {
    const res = await request(app).post('/api/reservations').send({
      facility_id: state.facilityId,
      start_time: tomorrowAt(20),
      end_time: tomorrowAt(21),
    });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/reservations/my → lista rezerwacji zalogowanego', async () => {
    const res = await request(app)
      .get('/api/reservations/my')
      .set(auth(state.userToken));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((r) => r.facility_name !== undefined)).toBe(true);
  });

  test('GET /api/reservations → admin widzi wszystkie rezerwacje', async () => {
    const res = await request(app)
      .get('/api/reservations')
      .set(auth(state.adminToken));
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/reservations?facility_id=X → admin filtruje', async () => {
    const res = await request(app)
      .get(`/api/reservations?facility_id=${state.facilityId}`)
      .set(auth(state.adminToken));
    expect(res.statusCode).toBe(200);
    expect(res.body.every((r) => r.facility_id === state.facilityId)).toBe(true);
  });

  test('GET /api/reservations?status=pending → admin filtruje po statusie', async () => {
    const res = await request(app)
      .get('/api/reservations?status=pending')
      .set(auth(state.adminToken));
    expect(res.statusCode).toBe(200);
    expect(res.body.every((r) => r.status === 'pending')).toBe(true);
  });

  test('GET /api/reservations → 403 dla zwykłego usera', async () => {
    const res = await request(app)
      .get('/api/reservations')
      .set(auth(state.userToken));
    expect(res.statusCode).toBe(403);
  });

  test('PATCH /api/reservations/:id/cancel → 403, gdy nie jest właścicielem', async () => {
    const res = await request(app)
      .patch(`/api/reservations/${state.reservationId}/cancel`)
      .set(auth(state.secondUserToken));
    expect(res.statusCode).toBe(403);
  });

  test('PATCH /api/reservations/:id/cancel → 404 dla nieistniejącej', async () => {
    const res = await request(app)
      .patch('/api/reservations/999999/cancel')
      .set(auth(state.userToken));
    expect(res.statusCode).toBe(404);
  });

  test('PATCH /api/reservations/:id/cancel → właściciel anuluje', async () => {
    const res = await request(app)
      .patch(`/api/reservations/${state.reservationId}/cancel`)
      .set(auth(state.userToken));
    expect(res.statusCode).toBe(200);
    expect(res.body.reservation.status).toBe('cancelled');
  });

  test('PATCH /api/reservations/:id/cancel → 400, gdy już anulowana', async () => {
    const res = await request(app)
      .patch(`/api/reservations/${state.reservationId}/cancel`)
      .set(auth(state.userToken));
    expect(res.statusCode).toBe(400);
  });

  test('PATCH /api/reservations/:id/cancel → admin może anulować cudzą', async () => {
    const created = await request(app)
      .post('/api/reservations')
      .set(auth(state.userToken))
      .send({
        facility_id: state.facilityId,
        start_time: tomorrowAt(14),
        end_time: tomorrowAt(15),
      });
    expect(created.statusCode).toBe(201);

    const res = await request(app)
      .patch(`/api/reservations/${created.body.reservation.id}/cancel`)
      .set(auth(state.adminToken));
    expect(res.statusCode).toBe(200);
    expect(res.body.reservation.status).toBe('cancelled');
  });

  test('Po anulowaniu — drugi user może zarezerwować ten sam termin', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set(auth(state.secondUserToken))
      .send({
        facility_id: state.facilityId,
        start_time: tomorrowAt(10),
        end_time: tomorrowAt(11),
      });
    expect(res.statusCode).toBe(201);
  });
});

// ===========================================================================
// SOFT DELETE
// ===========================================================================

describe('Facility — dezaktywacja (soft delete)', () => {
  test('DELETE /api/facilities/:id → admin dezaktywuje', async () => {
    const res = await request(app)
      .delete(`/api/facilities/${state.facilityId}`)
      .set(auth(state.adminToken));
    expect(res.statusCode).toBe(200);
    expect(res.body.facility.is_active).toBe(false);
  });

  test('DELETE /api/facilities/:id → 404 dla nieistniejącego', async () => {
    const res = await request(app)
      .delete('/api/facilities/999999')
      .set(auth(state.adminToken));
    expect(res.statusCode).toBe(404);
  });

  test('GET /api/facilities → dezaktywowany obiekt znika z listy', async () => {
    const res = await request(app).get('/api/facilities');
    expect(res.statusCode).toBe(200);
    expect(res.body.find((f) => f.id === state.facilityId)).toBeUndefined();
  });

  test('GET /api/facilities/:id → szczegóły dezaktywowanego nadal dostępne', async () => {
    const res = await request(app).get(`/api/facilities/${state.facilityId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.is_active).toBe(false);
  });
});
