CREATE DATABASE bpm;

\c bpm

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role  VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE desviaciones (
    id SERIAL PRIMARY KEY,
    numero_requerimiento VARCHAR(100),
    preguntas_auditadas VARCHAR(255),
    desviacion_o_criterio VARCHAR(100),
    tipo_de_accion VARCHAR(255),
    responsable_problema VARCHAR(100),
    local VARCHAR(255),
    criticidad VARCHAR(50),
    acciones_correctivas VARCHAR(255),
    fecha_recepcion_solicitud DATE,
    fecha_solucion_programada DATE,
    estado VARCHAR(50),
    fecha_cambio_estado DATE,
    contacto_clientes VARCHAR(255),
    evidencia_fotografica VARCHAR(255),
    detalle_foto VARCHAR(255),
    auditor VARCHAR(150),
    correo VARCHAR(255),
    fecha_ultima_modificacion TIMESTAMP,
    auth_token TEXT
);




CREATE TABLE tabla_details (
    id SERIAL PRIMARY KEY,
    numero_auditoria VARCHAR(100),
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    field3 VARCHAR(255),
    field4 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tabla_warning (
    id SERIAL PRIMARY KEY,
    numero_auditoria VARCHAR(100),
    field1 VARCHAR(255),
    field2 VARCHAR(255),
    field3 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



