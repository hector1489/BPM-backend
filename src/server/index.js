const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyToken } = require('./middleware/event.middleware');
const {
  findUsuarios,
  findUsuarioByEmail,
  createUsuario,
  updateUsuario,
  deleteUsuario
} = require('./models/event.dao');
const { verifyCredentials } = require('./models/user.dao');
const { jwtSign } = require('./utils/jwt');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Ruta de registro
app.post('/register', async (req, res) => {
  const { email, password, rol} = req.body;

  try {
    const newUser = await createUsuario({ email, password, rol});
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

app.post('/tabla-details', verifyToken, (req, res) => {
  const tabla = req.body;
  console.log('Datos de la tabla recibidos:', tabla);

  res.send('Datos de la tabla recibidos correctamente');
});

app.post('/tabla-warning', verifyToken, (req, res) => {
  const tabla = req.body;
  console.log('Datos de la tabla recibidos:', tabla);

  res.send('Datos de la tabla recibidos correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});