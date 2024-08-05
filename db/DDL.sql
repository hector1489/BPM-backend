CREATE DATABASE bpm;

\c bpm

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    direction VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*Script tablas*/

CREATE TABLE tabla_details (
    id SERIAL PRIMARY KEY,
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    -- Agrega más campos 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tabla_warning (
    id SERIAL PRIMARY KEY,
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    -- Agrega más campos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
