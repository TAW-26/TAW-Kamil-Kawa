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
├── docs/                     # Dokumentacja projektu
│   ├── topic-selection.md    # Opis tematu
│   ├── use-cases.md          # Przypadki użycia
│   ├── ERD.png               # Diagram bazy danych
│   └── api.md                # Dokumentacja API
├── backend/                  # Serwer API
│   ├── config/               # Konfiguracja (baza danych)
│   ├── controllers/          # Logika biznesowa
│   ├── middleware/            # Middleware (JWT, błędy)
│   ├── routes/               # Definicje endpointów
│   ├── sql/                  # Skrypty SQL
│   ├── tests/                # Testy automatyczne
│   ├── index.js              # Punkt wejścia serwera
│   └── package.json          # Zależności backendu
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
* PostgreSQL (v14+)

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/TAW-26/TAW-Kamil-Kawa.git
cd TAW-Kamil-Kawa
```

### 2. Skonfiguruj bazę danych
Utwórz bazę danych PostgreSQL:
```sql
CREATE DATABASE sportreserve;
```
Uruchom skrypt inicjalizacyjny:
```bash
psql -U postgres -d sportreserve -f backend/sql/init.sql
```
Opcjonalnie załaduj dane testowe:
```bash
psql -U postgres -d sportreserve -f backend/sql/seed.sql
```

### 3. Skonfiguruj zmienne środowiskowe
```bash
cd backend
cp .env.example .env
```
Edytuj plik `.env` i ustaw dane dostępowe do swojej bazy danych.

### 4. Zainstaluj zależności i uruchom serwer
```bash
cd backend
npm install
npm start
```
Serwer uruchomi się na `http://localhost:3000`.

### 5. Uruchomienie testów
```bash
cd backend
npm test
```