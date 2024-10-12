const express = require('express');
const { createDesviacion, getAllDesviaciones, updateDesviacion, deleteDesviacion, getDesviacionesByAuditor } = require('../models/Desviaciones.dao');

const router = express.Router();

// Ruta para recibir y almacenar los datos
router.post('/send-data', async (req, res) => {
  try {
    const datosTabla = req.body;
    const resultados = [];

    for (const dato of datosTabla) {
      if (!dato.numeroRequerimiento || !dato.auditor) {
        return res.status(400).json({ error: 'Datos incompletos o inválidos.' });
      }
    }

    for (const dato of datosTabla) {
      try {
        await createDesviacion(dato);
        resultados.push({ numeroRequerimiento: dato.numeroRequerimiento, estado: 'Guardado con éxito' });
      } catch (error) {
        resultados.push({
          numeroRequerimiento: dato.numeroRequerimiento,
          estado: 'Error al guardar',
          mensaje: error.message
        });
      }
    }

    res.status(207).json({ resultados });

  } catch (error) {
    console.error('Error al almacenar los datos:', error);
    res.status(500).json({ error: 'Error al almacenar los datos en la base de datos.' });
  }
});

// Ruta para recuperar todas las desviaciones
router.get('/desviaciones', async (req, res) => {
  try {
    const desviaciones = await getAllDesviaciones();
    res.status(200).json(desviaciones);
  } catch (error) {
    console.error('Error al recuperar las desviaciones:', error);
    res.status(500).json({ error: 'Error al recuperar las desviaciones de la base de datos.' });
  }
});

// Ruta para actualizar una desviación por ID
router.put('/desviaciones/:id', async (req, res) => {
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
router.delete('/desviacionesDelete/:id', async (req, res) => {
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
router.get('/desviaciones/auditor/:auditor', async (req, res) => {
  const auditor = req.params.auditor;

  try {
    const desviaciones = await getDesviacionesByAuditor(auditor);
    res.status(200).json(desviaciones);
  } catch (error) {
    console.error('Error al recuperar las desviaciones por auditor:', error);
    res.status(500).json({ error: 'Error al recuperar las desviaciones por auditor de la base de datos.' });
  }
});



module.exports = router;



