# Przypadki użycia systemu SportReserve

## 1. Główni aktorzy systemu
* **Klient (Użytkownik zalogowany)** – osoba poszukująca obiektu sportowego w celu dokonania rezerwacji.
* **Administrator** – pracownik zarządzający systemem, obiektami (i ich kategoriami) oraz nadzorujący rezerwacje.
* **Gość (Użytkownik niezalogowany)** – osoba przeglądająca stronę bez możliwości rezerwacji.

---

## 2. Kluczowe scenariusze użycia

### Aktor: Gość
* **UC-01: Przeglądanie i filtrowanie oferty** – Gość może wyświetlić listę dostępnych obiektów sportowych oraz filtrować je na podstawie przypisanej kategorii (np. tylko korty tenisowe).
* **UC-02: Rejestracja w systemie** – Gość wypełnia formularz rejestracyjny (imię, nazwisko, email, hasło), aby uzyskać status Klienta.

### Aktor: Klient
* **UC-03: Logowanie** – Uwierzytelnienie w systemie i otrzymanie tokena dostępu (JWT).
* **UC-04: Rezerwacja obiektu** – Klient wybiera interesujący go obiekt, określa czas rozpoczęcia i zakończenia (start_time, end_time). System tworzy nową rezerwację ze statusem "pending" lub "confirmed" oraz oblicza całkowity koszt (total_price).
* **UC-05: Zarządzanie własnymi rezerwacjami** – Klient przegląda historię swoich rezerwacji. Może anulować nadchodzącą rezerwację (zmiana statusu na `cancelled`).

### Aktor: Administrator
* **UC-06: Logowanie do panelu** – Autoryzacja na konto z uprawnieniami administratora.
* **UC-07: Zarządzanie słownikiem kategorii** – Administrator może dodawać nowe kategorie obiektów (np. "Basen", "Orlik").
* **UC-08: Zarządzanie obiektami (CRUD)** – Administrator dodaje nowe obiekty, przypisuje je do kategorii, ustala cenę za godzinę (price_per_hour) oraz może dezaktywować obiekt (is_active = false), co ukryje go przed klientami.
* **UC-09: Nadzór nad rezerwacjami** – Przegląd wszystkich rezerwacji w systemie z możliwością administracyjnego anulowania (np. w przypadku awarii na obiekcie).