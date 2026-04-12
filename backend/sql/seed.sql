-- SportReserve - Dane testowe (seed)
-- Hasło dla obu użytkowników: K@puczino21 (bcrypt hash)

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

INSERT INTO facilities (category_id, name, description, location, price_per_hour, image_url)
SELECT c.id, v.name, v.description, v.location, v.price_per_hour, v.image_url
FROM (VALUES
  ('Orlik', 'Orlik Centrum',
   'Nowoczesne boisko ze sztuczną nawierzchnią trawiastą o wymiarach 60x40m. Wyposażone w bramki aluminiowe, oświetlenie LED umożliwiające grę wieczorem, trybuny na 100 miejsc oraz szatnie z prysznicami. Idealne do gry w piłkę nożną, zarówno amatorskiej jak i ligowej.',
   'ul. Sportowa 1, Warszawa', 80.00,
   'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=500&fit=crop'),

  ('Orlik', 'Orlik Południe',
   'Boisko wielofunkcyjne z nawierzchnią poliuretanową. Możliwość gry w piłkę nożną (5 vs 5 i 7 vs 7), piłkę ręczną oraz koszykówkę. Oświetlenie nocne, ławki dla zawodników, szatnia z natryskami. Dostęp dla osób z niepełnosprawnościami.',
   'ul. Polna 15, Warszawa', 60.00,
   'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&h=500&fit=crop'),

  ('Kort tenisowy', 'Kort Główny',
   'Profesjonalny kort tenisowy z nawierzchnią ceglastą (mączka). Wymiary zgodne z regulaminem ITF. Wyposażony w siatkę turniejową, sędziowskie krzesło, ławki dla zawodników i oświetlenie halogenowe. Dostępny wynajem rakiet i piłek na miejscu.',
   'ul. Tenisowa 3, Warszawa', 120.00,
   'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=500&fit=crop'),

  ('Kort tenisowy', 'Kort Kryty Premium',
   'Kryty kort tenisowy z nawierzchnią akrylową typu hard court. Klimatyzacja i ogrzewanie umożliwiają grę przez cały rok. Szatnie VIP, strefa relaksu, możliwość wynajęcia trenera. Parking podziemny dla gości.',
   'ul. Racketowa 8, Warszawa', 180.00,
   'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=500&fit=crop'),

  ('Hala sportowa', 'Hala Sportowa MOSiR',
   'Wielofunkcyjna hala sportowa o wymiarach 40x20m z parkietem drewnianym. Przystosowana do gry w koszykówkę, siatkówkę, piłkę ręczną i futsal. Trybuny na 500 miejsc, elektroniczna tablica wyników, profesjonalny system nagłośnienia. Szatnie, natryski i sala konferencyjna.',
   'ul. Olimpijska 10, Warszawa', 200.00,
   'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&h=500&fit=crop'),

  ('Basen', 'Basen Olimpijski',
   'Pływalnia olimpijska z basenem 50m (8 torów) oraz basenem rekreacyjnym 25m. Temperatura wody 26-28°C. Zjeżdżalnia wodna, jacuzzi, sauna sucha i parowa. Ratownicy na miejscu, szkoła pływania dla dzieci i dorosłych. Szafki na klucz elektroniczny.',
   'ul. Pływacka 5, Warszawa', 150.00,
   'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=500&fit=crop'),

  ('Basen', 'Aqua Park Mokotów',
   'Nowoczesny park wodny z basenem sportowym (25m, 6 torów), strefą rekreacyjną z atrakcjami wodnymi, rwącą rzeką oraz wannami z hydromasażem. Strefa saun (fińska, infrared, hammam). Barek z przekąskami, leżaki do wypoczynku.',
   'ul. Wodna 22, Warszawa', 90.00,
   'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=500&fit=crop'),

  ('Siłownia', 'FitZone Centrum',
   'Profesjonalna siłownia na 800m² wyposażona w najnowszy sprzęt Technogym i Life Fitness. Strefa wolnych ciężarów, maszyny cardio z ekranami dotykowymi, strefa funkcjonalna z kettlebells i TRX. Klimatyzacja, szatnie z sauną, bar z suplementami. Trenerzy personalni dostępni na miejscu.',
   'ul. Marszałkowska 55, Warszawa', 35.00,
   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop'),

  ('Siłownia', 'PowerGym Praga',
   'Siłownia typu hardcore z ogromną strefą wolnych ciężarów, platformami do martwego ciągu i przysiadów. Sprzęt Rogue Fitness i Eleiko. Doskonała do treningu siłowego, crossfit i strongman. Klatka do kalisteniki, worek bokserski, ring. Dostęp 24/7 z kartą członkowską.',
   'ul. Targowa 12, Warszawa', 30.00,
   'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop')
) AS v(cat_name, name, description, location, price_per_hour, image_url)
JOIN categories c ON c.name = v.cat_name
WHERE NOT EXISTS (
  SELECT 1 FROM facilities f WHERE f.name = v.name
);
