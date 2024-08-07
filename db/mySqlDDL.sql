

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    direction VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tabla_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    field3 VARCHAR(255),
    field4 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tabla_warning (
    id INT AUTO_INCREMENT PRIMARY KEY,
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    field3 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    item_name VARCHAR(255),
    note VARCHAR(255),
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id)
);

CREATE TABLE averages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_id INT,
    average FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id)
);
