# RezSport — Prezentacja projektu

**Technologie Aplikacji Webowych II**
**Autor:** Kamil Kawa
**Data:** Czerwiec 2026

---

## 1. Cel i zakres projektu

### Cel
Stworzenie aplikacji webowej umożliwiającej rezerwację obiektów sportowych online — z podziałem na role użytkowników, panelem administracyjnym i monitoringiem wydajności.

### Zakres funkcjonalny
| Funkcja | Rola |
|---------|------|
| Rejestracja i logowanie (JWT) | Publiczny |
| Przeglądanie obiektów z filtrowaniem po kategorii | Publiczny |
| Rezerwacja obiektu na wybrany termin | Użytkownik |
| Podgląd i anulowanie własnych rezerwacji | Użytkownik |
| Zarządzanie kategoriami i obiektami | Administrator |
| Potwierdzanie / anulowanie rezerwacji | Administrator |
| Monitoring aplikacji (Prometheus + Grafana) | DevOps |

---

## 2. Użyte technologie

| Warstwa | Technologia |
|---------|------------|
| Frontend | React.js (Vite) + React Router + Axios |
| Backend | Node.js + Express.js |
| Baza danych | PostgreSQL |
| Autoryzacja | JSON Web Token (JWT) |
| Monitoring | Prometheus + Grafana + prom-client |
| Testy | Jest + Supertest |

---

## 3. Architektura systemu

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

### Przepływ danych
1. **Frontend** (React/Vite) wysyła żądania HTTP do backendu przez proxy Vite
2. **Backend** (Express.js) przetwarza żądania, autoryzuje JWT, komunikuje się z PostgreSQL
3. **Prometheus** co 15s scrapuje endpoint `/metrics` backendu
4. **Grafana** wizualizuje metryki z Prometheusa na dashboardzie z 9 panelami

### Baza danych (ERD)
Tabele: `users`, `categories`, `facilities`, `reservations`

- `users` — dane użytkowników, role (user/admin), hasła (bcrypt)
- `categories` — kategorie obiektów (Orlik, Kort, Basen, Siłownia...)
- `facilities` — obiekty sportowe z ceną, lokalizacją, zdjęciem, statusem aktywności
- `reservations` — rezerwacje z terminem, ceną, statusem (pending → confirmed / cancelled)

---

## 4. Demonstracja działania

### Strona główna
- Styl kremowe tło, ceglane akcenty
- Warunkowy przycisk: niezalogowany widzi „Załóż konto", zalogowany — „Moje rezerwacje"
- Lista kategorii z numeracją i ikonami SVG

### Katalog obiektów
- Filtrowanie po kategorii (zakładki)
- Karty z numerem, nazwą, lokalizacją, ceną
- Zdjęcia z Unsplash w ramce sepia

### Szczegóły obiektu + rezerwacja
- Formularz z datą/godziną rozpoczęcia i zakończenia
- Automatyczna kalkulacja ceny (godziny × cena/h)
- Walidacja: kolizje terminów, daty w przeszłości, brak pól

### Moje rezerwacje
- Lista w formacie „dziennika" z datą, obiektem, ceną
- Statusy: Oczekująca (żółty), Potwierdzona (zielony), Anulowana (czerwony)
- Możliwość anulowania

### Panel administratora
- 3 zakładki: Kategorie, Obiekty, Rezerwacje
- Dodawanie/edycja obiektów (z polem URL zdjęcia)
- Potwierdzanie oczekujących rezerwacji (przycisk „Potwierdź")
- Filtrowanie rezerwacji po statusie

### Monitoring
- Dashboard Grafana z 9 panelami:
  - Łączne żądania HTTP, Błędy 4xx/5xx
  - RAM (MB), Uptime
  - Żądania/min wg metody, Czas odpowiedzi p50/p95
  - Operacje CRUD, Aktywne połączenia
  - Błędy API (api_errors_total)

---

## 5. Endpointy API

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/auth/register` | Rejestracja |
| POST | `/api/auth/login` | Logowanie |
| GET | `/api/categories` | Lista kategorii |
| POST | `/api/categories` | Dodanie kategorii (admin) |
| GET | `/api/facilities` | Lista obiektów |
| GET | `/api/facilities/:id` | Szczegóły obiektu |
| POST | `/api/facilities` | Dodanie obiektu (admin) |
| PUT | `/api/facilities/:id` | Edycja obiektu (admin) |
| DELETE | `/api/facilities/:id` | Dezaktywacja (admin) |
| POST | `/api/reservations` | Nowa rezerwacja (pending) |
| GET | `/api/reservations/my` | Moje rezerwacje |
| PATCH | `/api/reservations/:id/cancel` | Anulowanie |
| PATCH | `/api/reservations/:id/confirm` | Potwierdzenie (admin) |
| GET | `/api/reservations` | Wszystkie rezerwacje (admin) |
| GET | `/metrics` | Metryki Prometheus |

---

## 6. Napotkane wyzwania i rozwiązania

### Konflikt portów (backend vs Grafana)
- **Problem:** Grafana domyślnie nasłuchuje na porcie 3000 — tak samo jak backend Express.js
- **Rozwiązanie:** Przeniesienie backendu na port 4000, aktualizacja proxy Vite i konfiguracji Prometheusa

### Status rezerwacji
- **Problem:** Rezerwacje były tworzone od razu jako „potwierdzone" (confirmed), co nie dawało adminowi kontroli
- **Rozwiązanie:** Zmiana domyślnego statusu na „oczekująca" (pending) + nowy endpoint `PATCH /confirm` dostępny tylko dla admina

### Przycisk „Załóż konto" po zalogowaniu
- **Problem:** Strona główna zawsze wyświetlała przycisk „Załóż konto", nawet gdy użytkownik był zalogowany
- **Rozwiązanie:** Warunkowe renderowanie na podstawie kontekstu autoryzacji (`useAuth`) — zalogowany widzi „Moje rezerwacje"

### Wysoka kardynalność metryk
- **Problem:** Metryki HTTP z dynamicznymi ścieżkami (np. `/facilities/123`) generowałyby nieskończoną liczbę serii czasowych
- **Rozwiązanie:** Użycie `req.route?.path` (wzorzec trasy np. `/:id`) zamiast `req.path` (konkretna wartość)

### Integracja monitoringu bez Dockera
- **Problem:** Większość tutoriali zakłada Docker Compose, natomiast laboratorium wymagało instalacji natywnej
- **Rozwiązanie:** Ręczna instalacja Prometheusa (ZIP) i Grafany (serwis Windows), konfiguracja plików YAML i import dashboardu JSON

---

## 7. Znane ograniczenia

- Brak uploadu plików — zdjęcia obiektów jako URL
- Brak powiadomień e-mail o zmianie statusu
- Brak paginacji list
- Brak edycji profilu użytkownika
- Token JWT nie jest unieważniany po wylogowaniu (wygasa po 24h)

---

## 8. Podsumowanie

Projekt RezSport realizuje pełny cykl aplikacji webowej:
- **Frontend** w React.js z autorskim design
- **Backend** REST API w Express.js z JWT i walidacją
- **Baza danych** PostgreSQL z relacjami i constraint'ami
- **Monitoring** Prometheus + Grafana z 4 typami metryk i 9-panelowym dashboardem
- **Testy** automatyczne (Jest + Supertest)
