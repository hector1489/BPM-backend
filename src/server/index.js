const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
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
const { createDesviacion, getAllDesviaciones, updateDesviacion, deleteDesviacion, getDesviacionesByAuditor  } = require('./models/Desviaciones.dao');
const { listPhotos, uploadPhoto, getPhoto, deletePhoto } = require('./models/s3.dao');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de almacenamiento para Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
      if (!dato.numeroRequerimiento || !dato.preguntasAuditadas || !dato.auditor || !dato.authToken) {
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

// Ruta para obtener desviaciones por auditor
app.get('/desviaciones/auditor/:auditor', async (req, res) => {
  const auditor = req.params.auditor;

  try {
    const desviaciones = await getDesviacionesByAuditor(auditor);
    res.status(200).json(desviaciones);
  } catch (error) {
    console.error('Error al recuperar las desviaciones por auditor:', error);
    res.status(500).json({ error: 'Error al recuperar las desviaciones por auditor de la base de datos.' });
  }
});


// Ruta para listar todas las fotos
app.get('/photos', async (req, res) => {
  try {
    const photos = await listPhotos();
    res.status(200).json(photos);
  } catch (error) {
    console.error('Error al listar las fotos:', error);
    res.status(500).json({ error: 'Error al listar las fotos' });
  }
});

// Ruta para subir una nueva foto
app.post('/upload-photo', upload.single('image'), async (req, res) => {
  try {
    // Verificar si el archivo se ha subido correctamente
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    }

    const data = await uploadPhoto(req.file);
    res.status(200).json({ message: 'Foto subida con éxito', data });
  } catch (error) {
    console.error('Error al subir la foto:', error);
    res.status(500).json({ error: 'Error al subir la foto' });
  }
});


// Ruta para recuperar una foto por su clave
app.get('/photos/:key', async (req, res) => {
  try {
    const data = await getPhoto(req.params.key);
    res.writeHead(200, { 'Content-Type': data.ContentType });
    res.write(data.Body);
    res.end();
  } catch (error) {
    console.error('Error al obtener la foto:', error);
    res.status(500).json({ error: 'Error al obtener la foto' });
  }
});

// Ruta para eliminar una foto por su clave
app.delete('/delete-photos/:key', async (req, res) => {
  console.log(req);
  try {
    const data = await deletePhoto(req.params.key);
    res.status(200).json({ message: 'Foto eliminada con éxito', data });
  } catch (error) {
    console.error('Error al eliminar la foto:', error);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



