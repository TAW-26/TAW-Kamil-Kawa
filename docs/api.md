# SportReserve - Dokumentacja API

## Informacje ogólne
- **Bazowy URL:** `http://localhost:3000`
- **Format danych:** JSON
- **Autoryzacja:** Bearer Token (JWT) w nagłówku `Authorization`

---

## 1. Autoryzacja (Auth)

### POST `/api/auth/register` – Rejestracja
**Dostęp:** Publiczny

**Body:**
```json
{
  "first_name": "Jan",
  "last_name": "Kowalski",
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Odpowiedź (201):**
```json
{
  "message": "Rejestracja zakończona pomyślnie",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "first_name": "Jan",
    "last_name": "Kowalski",
    "email": "jan@example.com",
    "role": "user"
  }
}
```

**Błędy:**
- `400` – brak wymaganych pól lub hasło za krótkie
- `409` – email już istnieje

---

### POST `/api/auth/login` – Logowanie
**Dostęp:** Publiczny

**Body:**
```json
{
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Odpowiedź (200):**
```json
{
  "message": "Logowanie pomyślne",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "first_name": "Jan",
    "last_name": "Kowalski",
    "email": "jan@example.com",
    "role": "user"
  }
}
```

**Błędy:**
- `400` – brak email lub hasła
- `401` – nieprawidłowy email lub hasło

---

## 2. Kategorie (Categories)

### GET `/api/categories` – Lista kategorii
**Dostęp:** Publiczny

**Odpowiedź (200):**
```json
[
  { "id": 1, "name": "Orlik" },
  { "id": 2, "name": "Kort tenisowy" }
]
```

---

### POST `/api/categories` – Dodanie kategorii
**Dostęp:** Admin (Bearer Token)

**Nagłówek:** `Authorization: Bearer <token_admina>`

**Body:**
```json
{ "name": "Hala sportowa" }
```

**Odpowiedź (201):**
```json
{ "id": 3, "name": "Hala sportowa" }
```

**Błędy:**
- `401` – brak tokenu
- `403` – brak roli admin
- `409` – kategoria o tej nazwie już istnieje

---

## 3. Obiekty sportowe (Facilities)

### GET `/api/facilities` – Lista aktywnych obiektów
**Dostęp:** Publiczny

**Parametry query (opcjonalne):**
- `category_id` – filtrowanie po kategorii

**Przykład:** `GET /api/facilities?category_id=1`

**Odpowiedź (200):**
```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Orlik Centrum",
    "description": "Nowoczesny orlik",
    "location": "ul. Sportowa 1",
    "price_per_hour": "80.00",
    "is_active": true,
    "created_at": "2026-03-25T10:00:00.000Z",
    "category_name": "Orlik"
  }
]
```

---

### GET `/api/facilities/:id` – Szczegóły obiektu
**Dostęp:** Publiczny

**Odpowiedź (200):** Pojedynczy obiekt (jak wyżej)

**Błędy:**
- `404` – obiekt nie istnieje

---

### POST `/api/facilities` – Dodanie obiektu
**Dostęp:** Admin

**Body:**
```json
{
  "category_id": 1,
  "name": "Orlik Nowy",
  "description": "Opis obiektu",
  "location": "ul. Nowa 5",
  "price_per_hour": 90.00
}
```

**Odpowiedź (201):** Utworzony obiekt

---

### PUT `/api/facilities/:id` – Edycja obiektu
**Dostęp:** Admin

**Body:** Dowolne pola do aktualizacji
```json
{ "price_per_hour": 120.00, "is_active": false }
```

**Odpowiedź (200):** Zaktualizowany obiekt

---

### DELETE `/api/facilities/:id` – Dezaktywacja obiektu
**Dostęp:** Admin

Wykonuje "soft delete" – ustawia `is_active = false`.

**Odpowiedź (200):**
```json
{
  "message": "Obiekt został dezaktywowany",
  "facility": { ... }
}
```

---

## 4. Rezerwacje (Reservations)

### POST `/api/reservations` – Utworzenie rezerwacji
**Dostęp:** Zalogowany użytkownik

**Body:**
```json
{
  "facility_id": 1,
  "start_time": "2026-04-10T10:00:00Z",
  "end_time": "2026-04-10T12:00:00Z"
}
```

System automatycznie:
- sprawdza kolizje terminów
- oblicza `total_price` na podstawie czasu i `price_per_hour`
- ustawia status na `confirmed`

**Odpowiedź (201):**
```json
{
  "message": "Rezerwacja utworzona pomyślnie",
  "reservation": {
    "id": 1,
    "user_id": 1,
    "facility_id": 1,
    "start_time": "2026-04-10T10:00:00.000Z",
    "end_time": "2026-04-10T12:00:00.000Z",
    "status": "confirmed",
    "total_price": "240.00",
    "created_at": "2026-03-25T10:00:00.000Z"
  }
}
```

**Błędy:**
- `400` – brak wymaganych pól / data w przeszłości
- `404` – obiekt nie istnieje lub jest nieaktywny
- `409` – kolizja terminów (termin już zajęty)

---

### GET `/api/reservations/my` – Moje rezerwacje
**Dostęp:** Zalogowany użytkownik

**Odpowiedź (200):**
```json
[
  {
    "id": 1,
    "facility_name": "Orlik Centrum",
    "facility_location": "ul. Sportowa 1",
    "start_time": "2026-04-10T10:00:00.000Z",
    "end_time": "2026-04-10T12:00:00.000Z",
    "status": "confirmed",
    "total_price": "240.00"
  }
]
```

---

### PATCH `/api/reservations/:id/cancel` – Anulowanie rezerwacji
**Dostęp:** Właściciel rezerwacji lub Admin

**Odpowiedź (200):**
```json
{
  "message": "Rezerwacja została anulowana",
  "reservation": { "id": 1, "status": "cancelled", ... }
}
```

**Błędy:**
- `400` – rezerwacja jest już anulowana
- `403` – próba anulowania cudzej rezerwacji
- `404` – rezerwacja nie istnieje

---

### GET `/api/reservations` – Wszystkie rezerwacje
**Dostęp:** Admin

**Parametry query (opcjonalne):**
- `facility_id` – filtruj po obiekcie
- `status` – filtruj po statusie (`confirmed`, `cancelled`, `pending`)

**Przykład:** `GET /api/reservations?status=confirmed&facility_id=1`

---

## Kody HTTP

| Kod | Znaczenie |
|-----|-----------|
| `200` | Sukces |
| `201` | Utworzono zasób |
| `400` | Błędne dane wejściowe |
| `401` | Brak autoryzacji (brak/nieprawidłowy token) |
| `403` | Brak uprawnień (np. user próbuje coś admina) |
| `404` | Nie znaleziono zasobu |
| `409` | Konflikt (duplikat lub kolizja terminów) |
| `500` | Wewnętrzny błąd serwera |
