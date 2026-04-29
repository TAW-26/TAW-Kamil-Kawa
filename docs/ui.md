# SportReserve - Opis interfejsu użytkownika (UI)

## Główne widoki aplikacji

---

### 1. Strona główna (`/`)
**Cel:** Powitanie użytkownika, szybki dostęp do kluczowych sekcji.

**Layout:**
- **Navbar** (góra): logo „SportReserve", linki: Obiekty, Logowanie/Rejestracja (lub: Moje rezerwacje, Wyloguj)
- **Hero section**: duży nagłówek z hasłem, przycisk „Przeglądaj obiekty"
- **Sekcja kategorii**: karty z kategoriami obiektów (Orlik, Kort, Hala…) — kliknięcie filtruje listę
- **Footer**: informacje o projekcie

---

### 2. Lista obiektów sportowych (`/facilities`)
**Cel:** Przeglądanie i filtrowanie dostępnych obiektów (UC-01).

**Layout:**
- **Filtr kategorii** (góra): dropdown lub przyciski z kategoriami
- **Siatka kart**: każda karta zawiera nazwę, lokalizację, cenę/h, kategorię, przycisk „Szczegóły"
- **Stany**: spinner (ładowanie), komunikat (brak obiektów), komunikat błędu

---

### 3. Szczegóły obiektu (`/facilities/:id`)
**Cel:** Wyświetlenie pełnych informacji + formularz rezerwacji (UC-04).

**Layout:**
- **Sekcja informacji**: nazwa, opis, lokalizacja, cena za godzinę, kategoria
- **Formularz rezerwacji** (tylko zalogowani): pola data/godzina rozpoczęcia i zakończenia, obliczona cena, przycisk „Zarezerwuj"
- **Komunikat dla gości**: „Zaloguj się, aby zarezerwować" z linkiem do logowania

---

### 4. Rejestracja (`/register`)
**Cel:** Formularz rejestracji nowego użytkownika (UC-02).

**Layout:**
- **Formularz**: imię, nazwisko, email, hasło, powtórz hasło
- **Walidacja**: podświetlenie błędnych pól, komunikaty pod polami
- **Link**: „Masz już konto? Zaloguj się"

---

### 5. Logowanie (`/login`)
**Cel:** Formularz logowania (UC-03, UC-06).

**Layout:**
- **Formularz**: email, hasło, przycisk „Zaloguj się"
- **Komunikat błędu**: „Nieprawidłowy email lub hasło"
- **Link**: „Nie masz konta? Zarejestruj się"

---

### 6. Moje rezerwacje (`/my-reservations`)
**Cel:** Historia rezerwacji zalogowanego użytkownika (UC-05).

**Layout:**
- **Tabela/lista**: obiekt, termin, status (badge kolorowy), cena, przycisk „Anuluj"
- **Stany**: brak rezerwacji (empty state), ładowanie, błąd
- **Dostęp**: tylko zalogowani (przekierowanie na /login)

---

### 7. Panel administratora (`/admin`)
**Cel:** Zarządzanie systemem (UC-07, UC-08, UC-09).

**Layout (zakładki):**
- **Kategorie**: lista + formularz dodawania nowej kategorii
- **Obiekty**: tabela z CRUD (dodaj, edytuj, dezaktywuj)
- **Rezerwacje**: lista wszystkich rezerwacji z filtrami (obiekt, status)
- **Dostęp**: tylko rola admin (przekierowanie na / dla pozostałych)

---

## Wspólne komponenty

| Komponent | Opis |
|-----------|------|
| **Navbar** | Nawigacja, logo, linki zależne od roli i stanu logowania |
| **LoadingSpinner** | Animowany spinner wyświetlany podczas ładowania danych |
| **ErrorMessage** | Czerwony komunikat o błędzie z przyciskiem „Spróbuj ponownie" |
| **EmptyState** | Komunikat gdy lista jest pusta (np. „Brak rezerwacji") |
| **ProtectedRoute** | Wrapper przekierowujący niezalogowanych na /login |

## Stany obsługiwane w każdym widoku

1. **Loading** — spinner podczas pobierania danych z API
2. **Error** — komunikat + opcja ponowienia w przypadku błędu sieciowego
3. **Empty** — przyjazny komunikat gdy brak danych do wyświetlenia
4. **Success** — poprawne wyświetlenie danych / potwierdzenie akcji
