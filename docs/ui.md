# RezSport — Opis interfejsu użytkownika (UI)

System wizualny utrzymany jest w stylu **„Almanach Vintage"** — projekt świadomie odchodzi od tzw. „AI-slop" (Inter, gradient niebieski-fiolet, zaokrąglone karty, generic-emoji). Zamiast tego nawiązuje do estetyki rocznika sportowego z lat 80.

## System wizualny: Almanach Vintage

### Typografia
| Krój | Zastosowanie |
|------|--------------|
| **DM Serif Display** | Tytuły H1/H2, „okładkowy" feel |
| **Newsreader** | Body text, opisy obiektów, paragrafy |
| **IBM Plex Mono** | Liczby, ceny, daty, etykiety w small-caps |

### Paleta (OKLCH, tinted neutrals)
| Token | Wartość | Zastosowanie |
|-------|---------|--------------| 
| `--paper` | `oklch(96% 0.018 80)` | tło bazowe (kremowy papier) |
| `--paper-deep` | `oklch(92% 0.028 80)` | sekcje wyróżnione, alternujące wiersze |
| `--ink` | `oklch(22% 0.035 50)` | główny tekst (ciepły brąz, nie czysta czerń) |
| `--ink-soft` | `oklch(45% 0.030 60)` | tekst drugorzędny |
| `--rule` | `oklch(80% 0.040 80)` | hairline divider lines |
| `--brick` | `oklch(52% 0.160 35)` | primary, ceglany czerwony |
| `--bottle` | `oklch(38% 0.100 150)` | accent, butelkowa zieleń (status: potwierdzona) |
| `--mustard` | `oklch(78% 0.130 85)` | highlight (selection, status oczekująca) |

### Reguły wizualne
- **Brak gradientów, brak `box-shadow`, brak `backdrop-filter`** — wszystko płaskie z hairline borderami.
- **Border-radius 0–3px** — almanachy mają ostre rogi.
- **Inputy underlined** (tylko dolna kreska, nie ramka).
- **Buttony** — wąskie, mono caps, 2px solid `--ink` border.
- **Status badges** — stemple z 1px borderem, ostre rogi, mono small-caps (`POTWIERDZONA`, `ANULOWANA`).
- **Ikonografia** — własne inline SVG line-art w `frontend/src/icons/` (zero emoji w produkcyjnym UI).

---

## Główne widoki aplikacji

### 1. Strona główna (`/`)
**Cel:** Powitanie użytkownika, prezentacja katalogu obiektów jak okładka almanachu.

**Layout:**
- **Masthead (Navbar):** ikona SVG logo + serif `RezSport` + mono podtytuł `REZERWACJA OBIEKTÓW SPORTOWYCH`, hairline rule pod całą belką
- **Hero:** mono eyebrow `Rezerwacja obiektów sportowych`, wielki serif tytuł `Zarezerwuj obiekt sportowy` (z italic akcentem), krótszy podtytuł, dwa buttony: `Przeglądaj obiekty →` (primary) i `Załóż konto` (outline) — po zalogowaniu przycisk zmienia się na `Moje rezerwacje`
- **Sekcja kategorii:** lista 2-kolumnowa z numerami `01`, `02` itd., nazwa kategorii (serif) i line-art ikoną po prawej; dotted leader line między nazwą a ikoną; hairline rule między wpisami
- **Sekcja „Jak zarezerwować obiekt":** 3 kroki z liczbami arabskimi (`1.`, `2.`, `3.`) w DM Serif Display
- **Stopka:** `RezSport · System rezerwacji obiektów sportowych · {rok} · Autor: K. Kawa`

---

### 2. Lista obiektów sportowych (`/facilities`)
**Cel:** Przeglądanie i filtrowanie katalogu obiektów (UC-01).

**Layout:**
- **Nagłówek strony:** mono caps eyebrow `LISTA OBIEKTÓW`, serif tytuł, italic podtytuł
- **Filtr kategorii:** zakładkowy z brick underline na aktywnej (zamiast pełnego wypełnienia)
- **Karty obiektów:** 2px solid `--ink` ramka z sekwencyjnym numerem `01`, `02`... w nagłówku, serif nazwa, mono lokalizacja z ikoną pinezki, sekcja „Cena / 1 godz." w pseudo-tabeli indeksowej, CTA `Szczegóły i rezerwacja →`
- **Placeholder:** line-art ikona kategorii w sepia ramce z caption (zamiast emoji-tile)
- **Stany:** spinner (pulsująca 3-kropkowa linia), empty state z `IconBook`, error state z `IconAlert`

---

### 3. Szczegóły obiektu (`/facilities/:id`)
**Cel:** Pełne informacje + formularz rezerwacji (UC-04).

**Layout:**
- **Link powrotny:** `← Powrót do katalogu`
- **Nagłówek rozdziału:** mono caps `OBIEKT #{id} · DZIAŁ: {kategoria}`, serif tytuł, lokalizacja z ikoną pinezki
- **Ilustracja:** sepia frame wokół zdjęcia z caption (jak ilustracja w książce), lub line-art ikona kategorii jeśli brak zdjęcia
- **Opis:** sekcja z nagłówkiem serif, klasa `chapter-dropcap` na pierwszym akapicie
- **„Specyfikacja"** w pseudo-tabeli indeksowej (label mono caps po lewej, wartość serif po prawej, hairline rules między wierszami): cena, lokalizacja, dział, status
- **Formularz rezerwacji:** underlined inputy `datetime-local`, label w mono small-caps, „Wycena wstępna" z podsumowaniem godzin × cena, button `Zarezerwuj termin` (primary, pełna szerokość)
- **Komunikat dla gości:** `IconLock` line-art + serif tekst + primary button `Zaloguj się` (pełna szerokość)

---

### 4. Rejestracja (`/register`)
**Cel:** Formularz rejestracji nowego użytkownika (UC-02).

**Layout:**
- Kremowe tło, 2px solid `--ink` border na karcie, wewnętrzna hairline ramka, drobne SVG corner ornaments w `--brick`
- Dwupiętrowy nagłówek: mono caps `REJESTRACJA` + serif `Rejestracja` + italic podtytuł
- Pola: imię, nazwisko (w jednym wierszu), email, hasło, powtórz hasło — wszystkie underlined
- Walidacja: komunikat błędu z lewym brick border-em (`form-error`)
- Button: `Zarejestruj się` (primary, pełna szerokość)
- Stopka: „Masz już konto? Zaloguj się" z brick podlinkowaniem

---

### 5. Logowanie (`/login`)
**Cel:** Formularz logowania (UC-03, UC-06).

**Layout:**
- Identyczny styl karty co rejestracja
- Dwupiętrowy nagłówek: mono caps `LOGOWANIE` + serif `Logowanie` + italic podtytuł
- Pola: email, hasło — underlined
- Button: `Zaloguj się` (primary, pełna szerokość)
- Stopka: „Nie masz konta? Zarejestruj się" w newsreader z brick podlinkowaniem

---

### 6. Moje rezerwacje (`/my-reservations`)
**Cel:** Historia rezerwacji zalogowanego użytkownika (UC-05).

**Layout:**
- **Nagłówek strony:** mono caps `MOJE REZERWACJE`, serif tytuł, italic podtytuł
- **Roczniki rezerwacji:** lista oddzielona hairline rules zamiast osobnych kart-pudełek (klasa `ledger`)
- Każdy wpis: po lewej data w mono z podziałem dzień/miesiąc/rok, w środku serif nazwa obiektu, lokalizacja z `IconPin` i czas z `IconClock`, po prawej stempel statusu (`POTWIERDZONA` w bottle-green ramce, `ANULOWANA` w brick, `OCZEKUJĄCA` w mustard), cena mono, button `Anuluj` (outline brick)
- **Stany:** brak rezerwacji (`IconBook`), ładowanie, błąd

---

### 7. Panel administratora (`/admin`)
**Cel:** Zarządzanie systemem (UC-07, UC-08, UC-09).

**Layout:**
- **Nagłówek strony:** mono caps `PANEL ADMINISTRATORA`, serif tytuł, italic podtytuł
- **Taby:** `Kategorie`, `Obiekty`, `Rezerwacje` — mono caps, brick underline na aktywnej
- **Tabele:** hairline `<thead>` w mono small-caps, body w newsreader, alternujące wiersze
- **Formularze inline:** underlined inputy, outline buttony hover invert
- **Status badges:** spójne z `MyReservationsPage`
- **Filtry rezerwacji:** zakładkowy filtr po statusie (Wszystkie / Potwierdzone / Anulowane / Oczekujące)
- **Potwierdzanie rezerwacji:** przycisk `Potwierdź` (primary) widoczny tylko przy statusie `Oczekująca`

---

## Wspólne komponenty

| Komponent | Opis |
|-----------|------|
| **Navbar** | Vintage masthead, SVG logo + serif nazwa + mono podtytuł, hairline rule, linki w mono caps |
| **LoadingSpinner** | Pulsująca pozioma linia 3-kropkowa w stylu prasa drukarska (animacja `opacity`) |
| **ErrorMessage** | `IconAlert` + serif tytuł + outline button „Spróbuj ponownie" |
| **EmptyState** | `Icon` line-art (book/clock/...) + serif tytuł + mono opis |
| **ProtectedRoute** | Wrapper przekierowujący niezalogowanych na `/login` |
| **Icon** | Wrapper po nazwie ikony, mapuje line-art SVG z `frontend/src/icons/` |

## Stany obsługiwane w każdym widoku

1. **Loading** — pulsująca linia 3-kropkowa
2. **Error** — `IconAlert` + brick komunikat + button „Spróbuj ponownie"
3. **Empty** — line-art ikona + przyjazny serif tytuł
4. **Success** — bottle-green pieczątka komunikatu / poprawne wyświetlenie danych

---

## Monitoring

Aplikacja udostępnia endpoint `/metrics` (port 4000) scrapowany przez Prometheusa. Dashboard Grafany (`backend/grafana-dashboard.json`) zawiera 9 paneli obejmujących ruch HTTP, czasy odpowiedzi, zużycie RAM, uptime, operacje CRUD, aktywne połączenia i błędy API.
