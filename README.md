# RezSport — Rezerwacja Obiektów Sportowych

## Opis projektu
**RezSport** to aplikacja webowa umożliwiająca użytkownikom przeglądanie obiektów sportowych oraz rezerwowanie terminów online. System wspiera podział na role (Użytkownik / Administrator) i zastępuje tradycyjne metody rezerwacji nowoczesnym interfejsem dostępnym z poziomu przeglądarki.


## Użyte technologie
* **Frontend:** React.js (Vite) + React Router + Axios
* **Backend:** Node.js + Express.js
* **Baza danych:** PostgreSQL
* **Autoryzacja:** JSON Web Token (JWT)
* **Testy:** Jest + Supertest

## Struktura projektu
```
TAW-Kamil-Kawa/
├── docs/                         # Dokumentacja projektu
│   ├── topic-selection.md        # Opis tematu
│   ├── use-cases.md              # Przypadki użycia
│   ├── ERD.png                   # Diagram bazy danych
│   ├── api.md                    # Dokumentacja API
│   ├── ui.md                     # Opis UI + design system
│   └── postman-testing-guide.md  # Instrukcja testowania w Postmanie
├── backend/                      # Serwer API
│   ├── config/                   # Konfiguracja (baza danych)
│   ├── controllers/              # Logika biznesowa
│   ├── middleware/               # Middleware (JWT, błędy)
│   ├── routes/                   # Definicje endpointów
│   ├── scripts/                  # Skrypty pomocnicze
│   ├── sql/                      # Skrypty SQL
│   ├── tests/                    # Testy automatyczne
│   ├── index.js                  # Punkt wejścia serwera
│   └── package.json              # Zależności backendu
├── frontend/                     # Aplikacja React
│   ├── src/
│   │   ├── api/                  # Warstwa komunikacji z API
│   │   ├── components/           # Komponenty współdzielone
│   │   ├── context/              # Kontekst autoryzacji
│   │   ├── icons/                # Inline SVG line-art ikony
│   │   ├── pages/                # Widoki / strony aplikacji
│   │   ├── App.jsx               # Routing aplikacji
│   │   ├── index.css             # Design system (OKLCH, fonty, buttony)
│   │   └── main.jsx              # Punkt wejścia
│   ├── package.json              # Zależności frontendu
│   └── vite.config.js            # Konfiguracja Vite + proxy
└── README.md
```

## Funkcjonalności

### Użytkownik (rola: user)
- Rejestracja i logowanie (JWT)
- Przeglądanie obiektów sportowych z filtrowaniem po kategorii
- Rezerwacja obiektu na wybrany termin (status: oczekująca)
- Podgląd swoich rezerwacji w zakładce „Moje rezerwacje"
- Anulowanie własnych rezerwacji

### Administrator (rola: admin)
- Zarządzanie kategoriami obiektów (dodawanie)
- Zarządzanie obiektami sportowymi (dodawanie, edycja, dezaktywacja)
- Podgląd wszystkich rezerwacji z filtrowaniem po statusie
- Anulowanie dowolnych rezerwacji

### Statusy rezerwacji
| Status | Opis |
|--------|------|
| **Oczekująca** (pending) | Nowa rezerwacja, czeka na potwierdzenie |
| **Potwierdzona** (confirmed) | Rezerwacja została potwierdzona |
| **Anulowana** (cancelled) | Rezerwacja anulowana przez użytkownika lub admina |

Pełny opis: [docs/ui.md](docs/ui.md).

## Dokumentacja
* [Opis tematu i zakres funkcjonalny](docs/topic-selection.md)
* [Przypadki użycia systemu (Use Cases)](docs/use-cases.md)
* [Diagram Bazy Danych (ERD)](docs/ERD.png)
* [Dokumentacja API](docs/api.md)
* [Opis interfejsu użytkownika + design system](docs/ui.md)

## Instrukcja uruchomienia

### Wymagania
* Node.js (v18+)
* PostgreSQL (v14+) — serwer musi być uruchomiony

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/TAW-26/TAW-Kamil-Kawa.git
cd TAW-Kamil-Kawa
```

### 2. Zainstaluj zależności
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Skonfiguruj zmienne środowiskowe
```bash
cd backend
cp .env.example .env
```
Edytuj plik `.env` i ustaw dane dostępowe do swojej bazy PostgreSQL (`DB_USER`, `DB_PASSWORD` itd.).

### 4. Automatyczna konfiguracja bazy danych
```bash
cd backend
npm run db:setup
```
Opcjonalnie z danymi testowymi:
```bash
npm run db:setup:seed
```

> **Uwaga:** Serwer przy starcie (`npm start`) automatycznie tworzy tabele, jeśli jeszcze nie istnieją. Skrypt `db:setup` jest potrzebny tylko do pierwszego utworzenia samej bazy danych.

### 5. Uruchom aplikację
W jednym terminalu:
```bash
cd backend
npm start
```
W drugim terminalu:
```bash
cd frontend
npm run dev
```
- **Backend API:** `http://localhost:3000`
- **Frontend:** `http://localhost:5173`

### 6. Konta testowe (po załadowaniu seed)

| Rola | Email | Hasło |
|------|-------|-------|
| **Admin** | kamilkawa200@gmail.com | K@puczino21 |
| **Użytkownik** | jan@example.com | K@puczino21 |

### 7. Uruchomienie testów
```bash
cd backend
npm test
```

## Endpointy API (podsumowanie)

| Metoda | Endpoint | Dostęp | Opis |
|--------|----------|--------|------|
| POST | `/api/auth/register` | Publiczny | Rejestracja użytkownika |
| POST | `/api/auth/login` | Publiczny | Logowanie (zwraca JWT) |
| GET | `/api/categories` | Publiczny | Lista kategorii |
| POST | `/api/categories` | Admin | Dodanie kategorii |
| GET | `/api/facilities` | Publiczny | Lista aktywnych obiektów |
| GET | `/api/facilities/:id` | Publiczny | Szczegóły obiektu |
| POST | `/api/facilities` | Admin | Dodanie obiektu |
| PUT | `/api/facilities/:id` | Admin | Edycja obiektu |
| DELETE | `/api/facilities/:id` | Admin | Dezaktywacja obiektu |
| POST | `/api/reservations` | Zalogowany | Utworzenie rezerwacji (status: pending) |
| GET | `/api/reservations/my` | Zalogowany | Moje rezerwacje |
| PATCH | `/api/reservations/:id/cancel` | Właściciel/Admin | Anulowanie rezerwacji |
| GET | `/api/reservations` | Admin | Wszystkie rezerwacje |

Pełna dokumentacja: [docs/api.md](docs/api.md).

## Autor
**Kamil Kawa** — Projekt na przedmiot TAW (Technologie Aplikacji Webowych)
