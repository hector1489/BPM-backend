const express = require('express');
const { createTablaWarning, getAllTablaWarnings } = require('../models/TableWarning.dao');

const router = express.Router();

// Ruta para crear un nuevo warning
router.post('/tabla-warnings', async (req, res) => {
  try {
    const data = req.body;

    // Validación de los datos recibidos
    if (!data.field1 || !data.field2 || !data.field3) {
      return res.status(400).json({ error: 'Datos incompletos o inválidos.' });
    }

    const newWarning = await createTablaWarning(data);
    res.status(201).json(newWarning.rows[0]);
  } catch (error) {
    console.error('Error al crear un warning:', error);
    res.status(500).json({ error: 'Error al crear el warning.' });
  }
});

// Ruta para obtener todos los warnings
router.get('/tabla-warnings', async (req, res) => {
  try {
    const warnings = await getAllTablaWarnings();
    res.status(200).json(warnings.rows);
  } catch (error) {
    console.error('Error al obtener los warnings:', error);
    res.status(500).json({ error: 'Error al obtener los warnings.' });
  }
});


module.exports = router;

