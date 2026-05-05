# RezSport — Opis interfejsu użytkownika (UI)

System wizualny utrzymany jest w stylu **„Almanach Vintage"** — projekt świadomie odchodzi od tzw. „AI-slop" (Inter, gradient niebieski-fiolet, zaokrąglone karty, generic-emoji). Zamiast tego nawiązuje do estetyki rocznika sportowego z lat 80.

## System wizualny: Almanach Vintage

### Typografia
| Krój | Zastosowanie |
|------|--------------|
| **DM Serif Display** | Tytuły H1/H2, „okładkowy" feel, dropcapy |
| **Newsreader** | Body text, opisy obiektów, paragrafy |
| **IBM Plex Mono** | Liczby, ceny, daty, etykiety w small-caps, „stemple" (`Nº 04`, `MMXXVI`) |

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
- **Masthead (Navbar):** monogram „RS" + serif `RezSport` + mono podtytuł `ALMANACH OBIEKTÓW · MMXXVI`, hairline rule pod całą belką
- **Hero:** mono eyebrow `EDYCJA MMXXVI · TOM I`, wielki serif tytuł, krótszy podtytuł, button `Otwórz katalog →`
- **Sekcja kategorii:** lista 2-kolumnowa z numerami `Nº 01`, nazwa kategorii (serif) i line-art ikoną po prawej; hairline rule między wpisami
- **Sekcja „Jak korzystać":** 3 kroki z rzymskimi cyframi (`I.`, `II.`, `III.`) w DM Serif Display
- **Kolofon:** stopka w stylu książki (`Numer · Tom · Wydawca`)

---

### 2. Lista obiektów sportowych (`/facilities`)
**Cel:** Przeglądanie i filtrowanie katalogu obiektów (UC-01).

**Layout:**
- **Filtr kategorii:** zakładkowy z brick underline na aktywnej (zamiast pełnego wypełnienia)
- **Karty obiektów:** 2px solid `--ink` ramka z pieczątką `Nº {id}` w nagłówku, serif nazwa, mono lokalizacja z ikoną pinezki, sekcja „Cennik" w pseudo-tabeli indeksowej, CTA `Czytaj wpis →`
- **Placeholder:** line-art ikona kategorii w sepia ramce z caption (zamiast emoji-tile)
- **Stany:** spinner (pulsująca 3-kropkowa linia), empty state z `IconBook`, error state z `IconAlert`

---

### 3. Szczegóły obiektu (`/facilities/:id`)
**Cel:** Pełne informacje + formularz rezerwacji (UC-04).

**Layout:**
- **Sepia frame** wokół zdjęcia z caption (jak ilustracja w książce)
- **Tytuł** w DM Serif Display, dropcap pierwszej litery opisu
- **„Specyfikacja"** w pseudo-tabeli indeksowej (label mono caps po lewej, wartość serif po prawej, hairline rules między wierszami)
- **Formularz rezerwacji:** underlined inputy `datetime-local`, label w mono small-caps, „Wycena wstępna" jako pieczątka z brick borderem
- **Komunikat dla gości:** `IconLock` line-art + serif tytuł + outline button `Zaloguj się`

---

### 4. Rejestracja (`/register`)
**Cel:** Formularz rejestracji nowego użytkownika (UC-02).

**Layout:**
- Sepia tło, hairline brick border na karcie, drobne SVG corner ornaments
- Dwupiętrowy nagłówek: mono caps `FORMULARZ · II` + serif `Rejestracja`
- Pola: imię, nazwisko, email, hasło, powtórz hasło — wszystkie underlined
- Walidacja: komunikat błędu z lewym brick border-em

---

### 5. Logowanie (`/login`)
**Cel:** Formularz logowania (UC-03, UC-06).

**Layout:**
- Identyczny styl karty co rejestracja, mono caps `FORMULARZ · I`
- Pola: email, hasło — underlined
- Link „Nie masz konta? Zarejestruj się" w newsreader z brick podlinkowaniem

---

### 6. Moje rezerwacje (`/my-reservations`)
**Cel:** Historia rezerwacji zalogowanego użytkownika (UC-05).

**Layout:**
- **Roczniki rezerwacji:** lista oddzielona hairline rules zamiast osobnych kart-pudełek
- Każdy wpis: po lewej data w mono z `IconClock`, w środku serif nazwa obiektu i lokalizacja, po prawej stempel statusu (`POTWIERDZONA` w bottle-green ramce, `ANULOWANA` w brick), cena mono, button `Anuluj` (outline brick)
- **Stany:** brak rezerwacji (`IconBook`), ładowanie, błąd

---

### 7. Panel administratora (`/admin`)
**Cel:** Zarządzanie systemem (UC-07, UC-08, UC-09).

**Layout:**
- **Taby z rzymskimi cyframi:** `I. KATEGORIE · II. OBIEKTY · III. REZERWACJE`, mono caps, brick underline na aktywnej
- **Tabele:** hairline `<thead>` w mono small-caps, body w newsreader, alternujące wiersze `--paper` / `--paper-deep`
- **Formularze inline:** underlined inputy, outline buttony hover invert
- **Status badges:** spójne z `MyReservationsPage`

---

## Wspólne komponenty

| Komponent | Opis |
|-----------|------|
| **Navbar** | Vintage masthead, monogram RS + serif nazwa + mono podtytuł, hairline rule, linki w mono caps |
| **LoadingSpinner** | Pulsująca pozioma linia 3-kropkowa w stylu prasa drukarska (animacja `opacity`) |
| **ErrorMessage** | `IconAlert` + serif tytuł + brick outline button „Spróbuj ponownie" |
| **EmptyState** | `Icon` line-art (book/clock/...) + serif tytuł + mono opis |
| **ProtectedRoute** | Wrapper przekierowujący niezalogowanych na `/login` |
| **Icon** | Wrapper po nazwie ikony, mapuje line-art SVG z `frontend/src/icons/` |

## Stany obsługiwane w każdym widoku

1. **Loading** — pulsująca linia 3-kropkowa
2. **Error** — `IconAlert` + brick komunikat + button „Spróbuj ponownie"
3. **Empty** — line-art ikona + przyjazny serif tytuł
4. **Success** — bottle-green pieczątka komunikatu / poprawne wyświetlenie danych
