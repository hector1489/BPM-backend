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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Simulando una base de datos en memoria
const tablaDetailsData = [];
const tablaWarningData = [];

// Ruta de registro
app.post('/register', async (req, res) => {
  const { email, password, direction, rol } = req.body;

  try {
    const newUser = await createUsuario({ email, password, direction, rol });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Ruta de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await verifyCredentials(email, password);
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

// Rutas para tabla-details
app.post('/tabla-details', verifyToken, async (req, res) => {
  const tabla = req.body;

  // Validar datos de entrada
  if (!tabla || typeof tabla !== 'object') {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const newTablaDetail = await createTablaDetail(tabla);
    res.status(201).json(newTablaDetail);
  } catch (error) {
    console.error('Error guardando tabla detail:', error);
    res.status(500).json({ error: 'Error guardando tabla detail' });
  }
});

app.get('/tabla-details', verifyToken, async (req, res) => {
  try {
    const tablaDetails = await getAllTablaDetails();
    res.status(200).json(tablaDetails);
  } catch (error) {
    console.error('Error obteniendo tabla details:', error);
    res.status(500).json({ error: 'Error obteniendo tabla details' });
  }
});

// Rutas para tabla-warning
app.post('/tabla-warning', verifyToken, async (req, res) => {
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

app.get('/tabla-warning', verifyToken, async (req, res) => {
  try {
    const tablaWarnings = await getAllTablaWarnings();
    res.status(200).json(tablaWarnings);
  } catch (error) {
    console.error('Error obteniendo tabla warnings:', error);
    res.status(500).json({ error: 'Error obteniendo tabla warnings' });
  }
});

// Ruta para obtener todos los datos de accionCorrectivas.json
const accionCorrectivasFilePath = path.join(__dirname, 'data', 'accionCorrectivas.json');

app.get('/accion-correctivas', async (req, res) => {
  try {
    const data = fs.readFileSync(accionCorrectivasFilePath, 'utf8');
    res.status(200).json(JSON.parse(data));
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
