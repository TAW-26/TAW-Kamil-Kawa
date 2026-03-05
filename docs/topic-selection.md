# Temat projektu: Internetowy System Rezerwacji Obiektów Sportowych „SportReserve”

## 1. Opis wybranego tematu projektu
Projekt dotyczy stworzenia aplikacji webowej umożliwiającej użytkownikom przeglądanie dostępnych obiektów sportowych oraz dokonywanie rezerwacji online na wybrane terminy. System ma na celu zastąpienie tradycyjnych metod rezerwacji nowoczesnym interfejsem dostępnym z poziomu przeglądarki, zapewniając podgląd dostępności w czasie rzeczywistym.

## 2. Cel projektu
Głównym celem projektu jest dostarczenie narzędzia, które zautomatyzuje proces zarządzania grafikiem obiektów sportowych. Z perspektywy edukacyjnej, celem jest implementacja pełnej aplikacji z uwzględnieniem:
* Bezpiecznej autentykacji użytkowników.
* Zarządzania rolami (Użytkownik vs Administrator).
* Integracji frontendu z bazą danych poprzez REST API.

## 3. Zakres funkcjonalny

### Moduł Użytkownika
* **Rejestracja i logowanie:** Tworzenie konta, autoryzacja za pomocą tokenów (JWT).
* **Przeglądanie obiektów:** Lista dostępnych boisk wraz z opisem, zdjęciem i cennikiem.
* **Wyszukiwanie i filtrowanie:** Filtrowanie po typie obiektu (np. „tenis”, „piłka nożna”).
* **System rezerwacji:** Wybór wolnego terminu z kalendarza i dokonanie rezerwacji.
* **Profil użytkownika:** Podgląd historii swoich rezerwacji oraz możliwość odwołania nadchodzącego terminu.

### Moduł Administratora
* **Zarządzanie obiektami (CRUD):** Dodawanie nowych boisk, edycja danych, usuwanie obiektów z oferty.
* **Zarządzanie grafikiem:** Możliwość ręcznego blokowania terminów (np. na czas konserwacji).
* **Podgląd wszystkich rezerwacji:** Lista wszystkich zapisów w systemie z możliwością filtrowania po dacie lub obiekcie.

## 4. Proponowane technologie
* **Frontend:** React.js
* **Backend:** Node.js z frameworkiem Express.js
* **Baza danych:** PostgreSQL
* **Autentykacja:** JSON Web Token (JWT)
* **Dokumentacja API:** Swagger / Postman
