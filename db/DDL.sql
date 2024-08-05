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
    field3 VARCHAR(255),
    field4 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tabla_warning (
    id SERIAL PRIMARY KEY,
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    field3 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    section_id INT REFERENCES sections(id),
    item_name VARCHAR(255),
    note VARCHAR(255),
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE averages (
    id SERIAL PRIMARY KEY,
    section_id INT REFERENCES sections(id),
    average FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
