CREATE DATABASE  BPM;

\c BPM

CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    direction VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE forms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user(id),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    forms_id INTEGER REFERENCES forms(id),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    modules_id  INTEGER REFERENCES modules(id),
    question VARCHAR(255) NOT NULL,
    responses VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE answers (
    id PRIMARY SERIAL KEY,
    question_id INTEGER REFERENCES questions(id),
    forms_id INTEGER REFERENCES forms(id),
    response INTEGER NOT NULL,
    text VARCHAR(255) NOT NULL
);

CREATE TABLE details (
    id PRIMARY SERIAL KEY,
    items VARCHAR(255) NOT NULL,
    questions VARCHAR(255) NOT NULL,
    nota VARCHAR(255) NOT NULL,
    observacion VARCHAR(255) NOT NULL,
    promedios VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE warning (
    id PRIMARY SERIAL KEY,
    items VARCHAR(255) NOT NULL,
    questions VARCHAR(255) NOT NULL,
    nota VARCHAR(255) NOT NULL,
    observacion VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE deviations (
    id PRIMARY SERIAL KEY,
    pregunta VARCHAR(255) NOT NULL,
    criterio VARCHAR(255) NOT NULL,
    desviacion VARCHAR(255) NOT NULL,
    prioridad VARCHAR(255) NOT NULL,
    estado VARCHAR(255) NOT NULL,
    accion VARCHAR(255) NOT NULL,
    update_date_estado VARCHAR(255) NOT NULL,
    fecha_recepcion VARCHAR(255) NOT NULL,
    fecha_solucion VARCHAR(255) NOT NULL,
    cantidad_dias VARCHAR(255) NOT NULL,
    entidad_evaluada VARCHAR(255) NOT NULL,
    responsable VARCHAR(255) NOT NULL,
    auditor VARCHAR(255) NOT NULL,
    contacto VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    fecha_modificacion VARCHAR(255) NOT NULL,
    foto_url VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);



