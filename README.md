# RezSport — Rezerwacja Obiektów Sportowych

## Opis projektu
**RezSport** to aplikacja webowa umożliwiająca użytkownikom przeglądanie obiektów sportowych oraz rezerwowanie terminów online. System wspiera podział na role (Użytkownik / Administrator) i zastępuje tradycyjne metody rezerwacji nowoczesnym interfejsem dostępnym z poziomu przeglądarki.


## Użyte technologie
* **Frontend:** React.js (Vite) + React Router + Axios
* **Backend:** Node.js + Express.js
* **Baza danych:** PostgreSQL
* **Autoryzacja:** JSON Web Token (JWT)
* **Monitoring:** Prometheus + Grafana + prom-client
* **Testy:** Jest + Supertest

## Struktura projektu
```
TAW-Kamil-Kawa/
├── docs/                         # Dokumentacja projektu
│   ├── topic-selection.md        # Opis tematu
│   ├── use-cases.md              # Przypadki użycia
│   ├── ERD.png                   # Diagram bazy danych
│   ├── api.md                    # Dokumentacja API
│   └── ui.md                     # Opis UI + design system
├── backend/                      # Serwer API
│   ├── config/                   # Konfiguracja (baza danych)
│   ├── controllers/              # Logika biznesowa
│   ├── metrics/                  # Definicje metryk Prometheus
│   ├── middleware/               # Middleware (JWT, błędy, metryki)
│   ├── routes/                   # Definicje endpointów
│   ├── scripts/                  # Skrypty pomocnicze
│   ├── sql/                      # Skrypty SQL
│   ├── tests/                    # Testy automatyczne
│   ├── index.js                  # Punkt wejścia serwera
│   ├── prometheus.yml            # Konfiguracja Prometheusa
│   ├── grafana-dashboard.json    # Dashboard Grafany
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
- Zarządzanie obiektami sportowymi (dodawanie, edycja, dezaktywacja, zdjęcie URL)
- Podgląd wszystkich rezerwacji z filtrowaniem po statusie
- Potwierdzanie oczekujących rezerwacji
- Anulowanie dowolnych rezerwacji

### Statusy rezerwacji
| Status | Opis |
|--------|------|
| **Oczekująca** (pending) | Nowa rezerwacja, czeka na potwierdzenie przez admina |
| **Potwierdzona** (confirmed) | Rezerwacja potwierdzona przez administratora |
| **Anulowana** (cancelled) | Rezerwacja anulowana przez użytkownika lub admina |

### Monitoring (Prometheus + Grafana)
Aplikacja udostępnia endpoint `/metrics` z metrykami:
- `http_requests_total` — łączna liczba żądań HTTP (Counter)
- `http_request_duration_ms` — czas odpowiedzi (Histogram)
- `active_connections` — aktualnie obsługiwane połączenia (Gauge)
- `api_errors_total` — błędy API z podziałem na typ (Counter)
- Domyślne metryki Node.js (CPU, RAM, event loop, GC)

Dashboard Grafany (`backend/grafana-dashboard.json`) zawiera 9 paneli:
łączne żądania, błędy 4xx/5xx, RAM, uptime, żądania/min, czas odpowiedzi p50/p95, operacje CRUD, aktywne połączenia, błędy API.

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
* Prometheus (opcjonalnie, do monitoringu)
* Grafana (opcjonalnie, do dashboardu)

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
W jednym terminalu (backend):
```bash
cd backend
npm start
```
W drugim terminalu (frontend):
```bash
cd frontend
npm run dev
```
- **Backend API:** `http://localhost:4000`
- **Frontend:** `http://localhost:5173`

### 6. Uruchom monitoring (opcjonalnie)

**Prometheus:**
```bash
prometheus.exe --config.file="backend/prometheus.yml"
```
- **Prometheus UI:** `http://localhost:9090`

**Grafana** (działa jako serwis Windows):
- **Grafana UI:** `http://localhost:3000`
- Import dashboardu: Dashboards → Import → Upload `backend/grafana-dashboard.json`

### 7. Konta testowe (po załadowaniu seed)

| Rola | Email | Hasło |
|------|-------|-------|
| **Admin** | kamilkawa200@gmail.com | K@puczino21 |
| **Użytkownik** | jan@example.com | K@puczino21 |

### 8. Uruchomienie testów
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
| PATCH | `/api/reservations/:id/confirm` | Admin | Potwierdzenie rezerwacji |
| GET | `/api/reservations` | Admin | Wszystkie rezerwacje |
| GET | `/metrics` | Publiczny | Metryki Prometheus |

Pełna dokumentacja: [docs/api.md](docs/api.md).

## Architektura systemu

```
┌─────────────┐     HTTP      ┌──────────────────┐     SQL      ┌────────────┐
│  Frontend   │ ────────────► │    Backend API    │ ───────────► │ PostgreSQL │
│  React/Vite │ ◄──────────── │  Express.js:4000  │ ◄─────────── │            │
│  :5173      │     JSON      │                  │              └────────────┘
└─────────────┘               │  /metrics ────────┼──────┐
                              └──────────────────┘      │ scrape
                                                        ▼
                              ┌──────────────────┐    ┌──────────┐
                              │     Grafana      │◄───│Prometheus│
                              │     :3000        │    │  :9090   │
                              └──────────────────┘    └──────────┘
```

## Znane ograniczenia
- Brak uploadu plików — zdjęcia obiektów podawane są jako URL (np. Unsplash)
- Brak powiadomień e-mail o zmianie statusu rezerwacji
- Brak paginacji listy obiektów i rezerwacji
- Brak edycji profilu użytkownika
- Sesja JWT nie jest unieważniana po wylogowaniu (token wygasa po 24h)
- Monitoring wymaga ręcznej instalacji Prometheus i Grafana

## Autor
**Kamil Kawa** — Projekt na przedmiot TAW (Technologie Aplikacji Webowych)
