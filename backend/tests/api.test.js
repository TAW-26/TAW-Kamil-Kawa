const request = require('supertest');
const app = require('../index');
const pool = require('../config/db');

// ===================== KONFIGURACJA TESTÓW =====================

// Przed wszystkimi testami: przygotuj bazę danych
beforeAll(async () => {
  // Tworzenie tabel (jeśli nie istnieją)
  const fs = require('fs');
  const path = require('path');
  const initSQL = fs.readFileSync(path.join(__dirname, '..', 'sql', 'init.sql'), 'utf-8');
  await pool.query(initSQL);

  // Czyszczenie danych testowych
  await pool.query('DELETE FROM reservations');
  await pool.query('DELETE FROM facilities');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM users');
});

// Po wszystkich testach: zamknij połączenie z bazą
afterAll(async () => {
  await pool.end();
});

// ===================== ZMIENNE TESTOWE =====================

let userToken = '';
let adminToken = '';
let testCategoryId = null;
let testFacilityId = null;
let testReservationId = null;

// ===================== TESTY: AUTORYZACJA =====================

describe('Auth - Rejestracja i Logowanie', () => {

  test('POST /api/auth/register - rejestracja nowego użytkownika', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Jan',
        last_name: 'Testowy',
        email: 'jan@test.pl',
        password: 'haslo123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('jan@test.pl');
    expect(res.body.user.role).toBe('user');
    userToken = res.body.token;
  });

  test('POST /api/auth/register - rejestracja admina', async () => {
    // Najpierw rejestrujemy normalnego użytkownika, potem zmienimy mu rolę
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Admin',
        last_name: 'Testowy',
        email: 'admin@test.pl',
        password: 'admin123'
      });

    expect(res.statusCode).toBe(201);

    // Ręcznie ustawiamy rolę admin w bazie (bo rejestracja zawsze daje rolę "user")
    await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admin@test.pl'");

    // Logujemy się ponownie, żeby dostać token z rolą admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.pl', password: 'admin123' });

    expect(loginRes.statusCode).toBe(200);
    adminToken = loginRes.body.token;
  });

  test('POST /api/auth/register - błąd: brak wymaganych pól', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'brak@test.pl' });

    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/register - błąd: duplikat emaila', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        first_name: 'Jan',
        last_name: 'Drugi',
        email: 'jan@test.pl',
        password: 'haslo123'
      });

    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/login - logowanie prawidłowe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jan@test.pl', password: 'haslo123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/auth/login - błąd: nieprawidłowe hasło', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'jan@test.pl', password: 'zle_haslo' });

    expect(res.statusCode).toBe(401);
  });
});

// ===================== TESTY: KATEGORIE =====================

describe('Categories - Kategorie obiektów', () => {

  test('POST /api/categories - admin dodaje kategorię', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Orlik' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Orlik');
    testCategoryId = res.body.id;
  });

  test('POST /api/categories - błąd: zwykły user nie ma dostępu', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Kort' });

    expect(res.statusCode).toBe(403);
  });

  test('POST /api/categories - błąd: brak tokenu', async () => {
    const res = await request(app)
      .post('/api/categories')
      .send({ name: 'Hala' });

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/categories - lista kategorii (publiczny)', async () => {
    const res = await request(app).get('/api/categories');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// ===================== TESTY: OBIEKTY SPORTOWE =====================

describe('Facilities - Obiekty sportowe', () => {

  test('POST /api/facilities - admin dodaje obiekt', async () => {
    const res = await request(app)
      .post('/api/facilities')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category_id: testCategoryId,
        name: 'Orlik Testowy',
        description: 'Boisko do testów',
        location: 'ul. Testowa 1',
        price_per_hour: 100.00
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Orlik Testowy');
    testFacilityId = res.body.id;
  });

  test('GET /api/facilities - lista obiektów (publiczny)', async () => {
    const res = await request(app).get('/api/facilities');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/facilities?category_id=X - filtrowanie po kategorii', async () => {
    const res = await request(app).get(`/api/facilities?category_id=${testCategoryId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.every(f => f.category_id === testCategoryId)).toBe(true);
  });

  test('GET /api/facilities/:id - szczegóły obiektu', async () => {
    const res = await request(app).get(`/api/facilities/${testFacilityId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Orlik Testowy');
  });

  test('PUT /api/facilities/:id - admin edytuje obiekt', async () => {
    const res = await request(app)
      .put(`/api/facilities/${testFacilityId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price_per_hour: 120.00 });

    expect(res.statusCode).toBe(200);
    expect(parseFloat(res.body.price_per_hour)).toBe(120.00);
  });

  test('POST /api/facilities - błąd: zwykły user nie ma dostępu', async () => {
    const res = await request(app)
      .post('/api/facilities')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Nielegalny obiekt', price_per_hour: 50 });

    expect(res.statusCode).toBe(403);
  });
});

// ===================== TESTY: REZERWACJE =====================

describe('Reservations - Rezerwacje', () => {

  test('POST /api/reservations - użytkownik tworzy rezerwację', async () => {
    // Rezerwacja na jutro od 10:00 do 12:00
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.setHours(10, 0, 0, 0));
    const end = new Date(tomorrow.setHours(12, 0, 0, 0));

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        facility_id: testFacilityId,
        start_time: start.toISOString(),
        end_time: end.toISOString()
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.reservation).toHaveProperty('id');
    expect(res.body.reservation.status).toBe('confirmed');
    testReservationId = res.body.reservation.id;
  });

  test('POST /api/reservations - błąd: kolizja terminów', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.setHours(11, 0, 0, 0));
    const end = new Date(tomorrow.setHours(13, 0, 0, 0));

    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        facility_id: testFacilityId,
        start_time: start.toISOString(),
        end_time: end.toISOString()
      });

    expect(res.statusCode).toBe(409);
  });

  test('POST /api/reservations - błąd: brak tokenu', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .send({ facility_id: testFacilityId, start_time: '2026-05-01T10:00:00Z', end_time: '2026-05-01T12:00:00Z' });

    expect(res.statusCode).toBe(401);
  });

  test('GET /api/reservations/my - moje rezerwacje', async () => {
    const res = await request(app)
      .get('/api/reservations/my')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/reservations - admin widzi wszystkie rezerwacje', async () => {
    const res = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/reservations - błąd: zwykły user nie ma dostępu', async () => {
    const res = await request(app)
      .get('/api/reservations')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test('PATCH /api/reservations/:id/cancel - anulowanie rezerwacji', async () => {
    const res = await request(app)
      .patch(`/api/reservations/${testReservationId}/cancel`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.reservation.status).toBe('cancelled');
  });

  test('PATCH /api/reservations/:id/cancel - błąd: ponowne anulowanie', async () => {
    const res = await request(app)
      .patch(`/api/reservations/${testReservationId}/cancel`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toBe(400);
  });
});

// ===================== TESTY: DEZAKTYWACJA OBIEKTU =====================

describe('Facility - Dezaktywacja', () => {

  test('DELETE /api/facilities/:id - admin dezaktywuje obiekt', async () => {
    const res = await request(app)
      .delete(`/api/facilities/${testFacilityId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.facility.is_active).toBe(false);
  });

  test('GET /api/facilities - dezaktywowany obiekt znika z listy', async () => {
    const res = await request(app).get('/api/facilities');

    expect(res.statusCode).toBe(200);
    const found = res.body.find(f => f.id === testFacilityId);
    expect(found).toBeUndefined();
  });
});
