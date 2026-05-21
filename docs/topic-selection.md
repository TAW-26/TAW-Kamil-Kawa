# Temat projektu: RezSport — Internetowy System Rezerwacji Obiektów Sportowych

## 1. Opis wybranego tematu projektu
Projekt **RezSport** to aplikacja webowa umożliwiająca użytkownikom przeglądanie dostępnych obiektów sportowych oraz dokonywanie rezerwacji online na wybrane terminy. System ma na celu zastąpienie tradycyjnych metod rezerwacji nowoczesnym interfejsem dostępnym z poziomu przeglądarki, zapewniając podgląd dostępności w czasie rzeczywistym. Frontend utrzymany jest w stylu „almanach vintage" — typografia szeryfowa, paleta sepii i ceglanego czerwonego, hairline rules zamiast kart-pudełek.

## 2. Cel projektu
Głównym celem projektu jest dostarczenie narzędzia, które zautomatyzuje proces zarządzania grafikiem obiektów sportowych. Z perspektywy edukacyjnej, celem jest implementacja pełnej aplikacji z uwzględnieniem:
* Bezpiecznej autentykacji użytkowników.
* Zarządzania rolami (Użytkownik vs Administrator).
* Integracji frontendu z bazą danych poprzez REST API.

## 3. Zakres funkcjonalny

### Moduł Użytkownika
* **Rejestracja i logowanie:** Tworzenie konta, autoryzacja za pomocą tokenów (JWT).
* **Przeglądanie obiektów:** Lista dostępnych obiektów sportowych wraz z opisem, ikoną kategorii i cennikiem.
* **Filtrowanie:** Filtrowanie po kategorii obiektu (np. „Kort tenisowy", „Orlik", „Basen").
* **System rezerwacji:** Wybór terminu za pomocą pól daty i godziny (datetime-local), automatyczne wyliczenie ceny.
* **Moje rezerwacje:** Podgląd historii swoich rezerwacji oraz możliwość anulowania.

### Moduł Administratora
* **Zarządzanie kategoriami:** Dodawanie nowych kategorii obiektów.
* **Zarządzanie obiektami (CRUD):** Dodawanie nowych obiektów, edycja danych, dezaktywacja obiektów z oferty (soft delete).
* **Nadzór nad rezerwacjami:** Lista wszystkich rezerwacji w systemie z filtrowaniem po statusie, możliwość administracyjnego anulowania.

## 4. Użyte technologie
* **Frontend:** React.js (Vite) + React Router + Axios
* **Backend:** Node.js z frameworkiem Express.js
* **Baza danych:** PostgreSQL
* **Autentykacja:** JSON Web Token (JWT)
* **Testy:** Jest + Supertest (testy automatyczne API)
