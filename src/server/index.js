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
router.post('/send-data', async (req, res) => {
  try {
    const datosTabla = req.body;

    for (const dato of datosTabla) {
      const {
        numeroRequerimiento,
        preguntasAuditadas,
        desviacionOCriterio,
        tipoDeAccion,
        responsableProblema,
        local,
        criticidad,
        accionesCorrectivas,
        fechaRecepcionSolicitud,
        fechaSolucionProgramada,
        estado,
        fechaCambioEstado,
        contactoClientes,
        evidenciaFotografica,
        detalleFoto,
        auditor,
        correo,
        fechaUltimaModificacion,
        authToken
      } = dato;

      await pool.query(
        `INSERT INTO desviaciones (
          numero_requerimiento, 
          preguntas_auditadas, 
          desviacion_o_criterio, 
          tipo_de_accion, 
          responsable_problema, 
          local, 
          criticidad, 
          acciones_correctivas, 
          fecha_recepcion_solicitud, 
          fecha_solucion_programada, 
          estado, 
          fecha_cambio_estado, 
          contacto_clientes, 
          evidencia_fotografica, 
          detalle_foto, 
          auditor, 
          correo, 
          fecha_ultima_modificacion,
          auth_token  -- Incluye authToken en el INSERT
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          numeroRequerimiento,
          preguntasAuditadas,
          desviacionOCriterio,
          tipoDeAccion,
          responsableProblema,
          local,
          criticidad,
          accionesCorrectivas,
          fechaRecepcionSolicitud,
          fechaSolucionProgramada,
          estado,
          fechaCambioEstado,
          contactoClientes,
          evidenciaFotografica,
          detalleFoto,
          auditor,
          correo,
          fechaUltimaModificacion,
          authToken
        ]
      );
    }

    res.status(200).json({ message: 'Datos almacenados con éxito.' });
  } catch (error) {
    console.error('Error al almacenar los datos:', error);
    res.status(500).json({ error: 'Error al almacenar los datos en la base de datos.' });
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
