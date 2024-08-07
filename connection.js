const mysql = require('mysql');
require('dotenv').config();

// Configuración de la conexión
const connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

// Establecer la conexión
connection.connect(error => {
    if (error) {
        console.error('Error de conexión: ' + error.stack);
        return;
    }
    console.log('Conectado a la base de datos como el ID ' + connection.threadId);
});

module.exports = connection;
