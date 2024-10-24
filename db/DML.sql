INSERT INTO users (username, email, role,  password )
VALUES
    ('admin', 'usuario1@example.com', 'administrador', 'admin'),
    ('admin2', 'usuario2@example.com', 'administrado', 'admin2');

INSERT INTO sections (name) VALUES 
('BPM INFRAESTRUCTURA Y REQUERIMIENTOS LEGALES'),
('POES - Procedimientos Operacionales Estandarizados de Saneamiento');

INSERT INTO items (section_id, item_name, note, observation) VALUES
(1, 'Separaciones de áreas mínimas y condiciones de mantención de esta', 'Nota: 0%', 'Observación si aplica'),
(1, 'Equipos mínimos de cocción y frío (quemadores, refrigeradores, mantenedores, otros)', 'Nota: 0%', 'Observación si aplica');

INSERT INTO averages (section_id, average) VALUES
(1, 100.00),
(2, 100.00);

INSERT INTO audit_sheet (numero_auditoria, field1, field2, field3, field4, field5, field6)
VALUES 
('AUD123456', 'Valor1', 'Valor2', 'Valor3', 'Valor4', 'Valor5', 'Valor6');




