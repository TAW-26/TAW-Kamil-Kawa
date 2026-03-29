-- SportReserve - Dane testowe (seed)
-- Hasło: K@puczino21 (bcrypt hash)

INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES
('Kamil', 'Kawa', 'kamilkawa200@gmail.com', '$2b$10$qUEidNMH6wRrGAt0G7P6Xe8dx.zB3pRbqhIeRystyx2/GYT1MOSd2', 'admin'),
('Jan', 'Testowy', 'jan@example.com', '$2b$10$qUEidNMH6wRrGAt0G7P6Xe8dx.zB3pRbqhIeRystyx2/GYT1MOSd2', 'user')
ON CONFLICT (email) DO NOTHING;

INSERT INTO categories (name) VALUES
('Orlik'),
('Kort tenisowy'),
('Hala sportowa'),
('Basen'),
('Siłownia')
ON CONFLICT (name) DO NOTHING;

INSERT INTO facilities (category_id, name, description, location, price_per_hour) VALUES
(1, 'Orlik Centrum', 'Nowoczesny orlik z nawierzchnią sztuczną trawą', 'ul. Sportowa 1, Warszawa', 80.00),
(1, 'Orlik Południe', 'Orlik z oświetleniem nocnym', 'ul. Polna 15, Warszawa', 60.00),
(2, 'Kort Główny', 'Kort tenisowy z nawierzchnią ceglastą', 'ul. Tenisowa 3, Warszawa', 120.00),
(3, 'Hala Sportowa MOSiR', 'Hala wielofunkcyjna 40x20m', 'ul. Olimpijska 10, Warszawa', 200.00),
(4, 'Basen Olimpijski', 'Basen 50m, 8 torów', 'ul. Pływacka 5, Warszawa', 150.00);
