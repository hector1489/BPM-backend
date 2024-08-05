const express = require('express');
const cors = require('cors');
require('dotenv').config();

const verifyToken = require('./middleware/event.middleware');
const { createUsuario, findUsuarios, findUsuarioByEmail, updateUsuario, deleteUsuario } = require('./models/Events.dao');
const { verifyCredentials } = require('./models/Users.dao');
const { jwtSign } = require('../utils/jwt');
const { createTablaDetail, getAllTablaDetails } = require('./models/TablaDetails.dao');
const { createTablaWarning, getAllTablaWarnings } = require('./models/TablaWarning.dao');


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
  console.log('Datos de la tabla recibidos:', tabla);
  
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
  console.log('Datos de la tabla recibidos:', tabla);
  
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

// Evitar que el servidor se inicie durante las pruebas
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
