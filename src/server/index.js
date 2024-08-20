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
const { createDesviacion, getAllDesviaciones, updateDesviacion, deleteDesviacion  } = require('./models/Desviaciones.dao');

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
    res.json({
      token,
      usuarioId: user[0].id,
      role: user[0].role
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
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


// Ruta para recibir y almacenar los datos
app.post('/send-data', async (req, res) => {
  try {
    const datosTabla = req.body;
    console.log('Datos recibidos:', datosTabla);

    // Validación de la estructura de los datos
    for (const dato of datosTabla) {
      if (!dato.numeroRequerimiento || !dato.preguntasAuditadas || !dato.desviacionOCriterio || 
          !dato.responsableProblema || !dato.local || !dato.criticidad ||
          !dato.accionesCorrectivas || !dato.fechaRecepcionSolicitud || !dato.fechaSolucionProgramada ||
          !dato.estado || !dato.contactoClientes || !dato.auditor || !dato.authToken) {
        return res.status(400).json({ error: 'Datos incompletos o inválidos.' });
      }
    }
    

    // Si la validación es exitosa, se pasan los datos al DAO
    for (const dato of datosTabla) {
      await createDesviacion(dato);
    }

    res.status(200).json({ message: 'Datos almacenados con éxito.' });
  } catch (error) {
    console.error('Error al almacenar los datos:', error);
    res.status(500).json({ error: 'Error al almacenar los datos en la base de datos.' });
  }
});

// Ruta para recuperar todas las desviaciones
app.get('/desviaciones', async (req, res) => {
  try {
    const desviaciones = await getAllDesviaciones();
    res.status(200).json(desviaciones);
  } catch (error) {
    console.error('Error al recuperar las desviaciones:', error);
    res.status(500).json({ error: 'Error al recuperar las desviaciones de la base de datos.' });
  }
});

// Ruta para actualizar una desviación por ID
app.put('/desviaciones/:id', async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  try {
    await updateDesviacion(id, updatedData);
    res.status(200).json({ message: 'Desviación actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar la desviación:', error);
    res.status(500).json({ error: 'Error al actualizar la desviación en la base de datos.' });
  }
});

// Ruta para eliminar una desviación por ID
app.delete('/desviacionesDelete/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await deleteDesviacion(id);
    res.status(200).json({ message: 'Desviación eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar la desviación:', error);
    res.status(500).json({ error: 'Error al eliminar la desviación en la base de datos.' });
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
