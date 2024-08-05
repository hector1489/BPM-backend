INSERT INTO users (username, password, direction, email)
VALUES
    ('usuario1', 'hashedpassword1', 'Direccion 1', 'usuario1@example.com'),
    ('usuario2', 'hashedpassword2', 'Direccion 2', 'usuario2@example.com');


INSERT INTO sections (name) VALUES ('BPM INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES');
INSERT INTO sections (name) VALUES ('POES - Procedimientos Operacionales Estandarizados de Saneamiento');

INSERT INTO items (section_id, item_name, note, observation) VALUES
(1, 'Separaciones de áreas mínimas y condiciones de mantención de esta', 'Nota: 0%', 'Observación si aplica'),
(1, 'Equipos mínimos de cocción y frío (quemadores, refrigeradores, mantenedores, otros)', 'Nota: 0%', 'Observación si aplica'),

INSERT INTO averages (section_id, average) VALUES
(1, 100.00),
(2, 100.00),

