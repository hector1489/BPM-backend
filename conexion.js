const mysql = require('mysql');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: '', 
    user: '',
    password: '',
    database: '' 
});

// Establecer la conexión
connection.connect(error => {
    if (error) {
        console.error('Error de conexión: ' + error.stack);
        return;
    }
    console.log('Conectado a la base de datos como el ID ' + connection.threadId);
});

// Cerrar la conexión
connection.end();
