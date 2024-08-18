const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

const verifyToken = require('./middleware/event.middleware');
const { createUsuario, findUsuarios, findUsuarioByEmail, updateUsuario, deleteUsuario } = require('./models/Events.dao');
const { verifyCredentials } = require('./models/Users.dao');
const { jwtSign } = require('../utils/jwt');
const { createTablaDetail, getAllTablaDetails } = require('./models/TableDetails.dao');
const { createTablaWarning, getAllTablaWarnings } = require('./models/TableWarning.dao');
const { getAccionCorrectivas } = require('./models/accionCorrectivas.dao');
const { getQuestions } = require('./models/questions.dao');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());


// Simulando una base de datos en memoria
const tablaDetailsData = [];
const tablaWarningData = [];

// Ruta de registro
app.post('/register', async (req, res) => {
  const { username, email, role,  password } = req.body;

  try {
    const newUser = await createUsuario({ username, email, role,  password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Ruta de login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await verifyCredentials(username, password);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwtSign({ userId: user[0].id });
    res.json({ token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});

// Ruta para tabla-details
app.post('/tabla-details', async (req, res) => {
  const { tablaId, datos } = req.body;

  // Validar datos de entrada
  if (!tablaId || !Array.isArray(datos)) {
    console.error('Datos inválidos:', req.body);
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const results = [];

    // Procesar cada fila de datos
    for (const fila of datos) {
      const result = await createTablaDetail(fila);
      results.push(result);
    }

    res.status(201).json(results);
  } catch (error) {
    console.error('Error guardando tabla detail:', error);
    res.status(500).json({ error: 'Error guardando tabla detail' });
  }
});


// Ruta para obtener todos los detalles de la tabla
app.get('/tabla-details', async (req, res) => {
  try {
    const tablaDetails = await getAllTablaDetails();
    res.status(200).json(tablaDetails);
  } catch (error) {
    console.error('Error obteniendo tabla details:', error);
    res.status(500).json({ error: 'Error obteniendo tabla details' });
  }
});

// Rutas para tabla-warning
app.post('/tabla-warning', async (req, res) => {
  const tabla = req.body;

  // Validar datos de entrada
  if (!tabla || typeof tabla !== 'object') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const newTablaWarning = await createTablaWarning(tabla);
    res.status(201).json(newTablaWarning);
  } catch (error) {
    console.error('Error guardando tabla warning:', error);
    res.status(500).json({ error: 'Error guardando tabla warning' });
  }
});

app.get('/tabla-warning', async (req, res) => {
  try {
    const tablaWarnings = await getAllTablaWarnings();
    res.status(200).json(tablaWarnings);
  } catch (error) {
    console.error('Error obteniendo tabla warnings:', error);
    res.status(500).json({ error: 'Error obteniendo tabla warnings' });
  }
});

// Ruta para obtener todos los datos de accionCorrectivas
app.get('/accion-correctivas', async (req, res) => {
  try {
    const data = await getAccionCorrectivas();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error obteniendo datos de accion correctivas:', error);
    res.status(500).json({ error: 'Error obteniendo datos de accion correctivas' });
  }
});

// Ruta para obtener todos los datos de questions
app.get('/questions', async (req, res) => {
  try {
    const data = await getQuestions();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error obteniendo datos de accion correctivas:', error);
    res.status(500).json({ error: 'Error obteniendo datos de accion correctivas' });
  }
});



// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

// Evitar que el servidor se inicie durante las pruebas
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
