# SportReserve - System Rezerwacji Obiektów Sportowych

## Opis projektu
SportReserve to aplikacja internetowa umożliwiająca użytkownikom przeglądanie dostępnych obiektów sportowych oraz dokonywanie rezerwacji on-line na wybrane terminy. System wspiera podział na role (Użytkownik / Administrator) i zastępuje tradycyjne metody rezerwacji.

## Użyte technologie
* **Frontend:** React.js (w przygotowaniu)
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
│   ├── ERD.png                    # Diagram bazy danych
│   ├── api.md                    # Dokumentacja API
│   └── postman-testing-guide.md  # Instrukcja testowania w Postmanie
├── backend/                      # Serwer API
│   ├── config/                   # Konfiguracja (baza danych)
│   ├── controllers/              # Logika biznesowa
│   ├── middleware/                # Middleware (JWT, błędy)
│   ├── routes/                   # Definicje endpointów
│   ├── scripts/                  # Skrypty pomocnicze
│   ├── sql/                      # Skrypty SQL
│   ├── tests/                    # Testy automatyczne
│   ├── index.js                  # Punkt wejścia serwera
│   └── package.json              # Zależności backendu
└── README.md
```

## Dokumentacja
* [Opis tematu i zakres funkcjonalny](docs/topic-selection.md)
* [Przypadki użycia systemu (Use Cases)](docs/use-cases.md)
* [Diagram Bazy Danych (ERD)](docs/ERD.png)
* [Dokumentacja API](docs/api.md)
* [Instrukcja testowania w Postmanie](docs/postman-testing-guide.md)

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
cd backend
npm install
```

### 3. Skonfiguruj zmienne środowiskowe
```bash
cp .env.example .env
```
Edytuj plik `.env` i ustaw dane dostępowe do swojej bazy PostgreSQL (`DB_USER`, `DB_PASSWORD` itd.).

### 4. Automatyczna konfiguracja bazy danych
Skrypt automatycznie utworzy bazę danych `sportreserve` i wszystkie tabele:
```bash
npm run db:setup
```
Opcjonalnie z danymi testowymi (przykładowi użytkownicy, kategorie, obiekty):
```bash
npm run db:setup:seed
```

> **Uwaga:** Serwer przy starcie (`npm start`) również automatycznie tworzy tabele, jeśli jeszcze nie istnieją. Skrypt `db:setup` jest potrzebny tylko do pierwszego utworzenia samej bazy danych.

### 5. Uruchom serwer
```bash
npm start
```
Serwer uruchomi się na `http://localhost:3000`.

### 6. Uruchomienie testów
```bash
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
| POST | `/api/reservations` | Zalogowany | Utworzenie rezerwacji |
| GET | `/api/reservations/my` | Zalogowany | Moje rezerwacje |
| PATCH | `/api/reservations/:id/cancel` | Właściciel/Admin | Anulowanie rezerwacji |
| GET | `/api/reservations` | Admin | Wszystkie rezerwacje |

Pełna dokumentacja: [docs/api.md](docs/api.md)