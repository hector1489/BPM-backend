const express = require('express');
const { createTablaDetail, getAllTablaDetails } = require('../models/TableDetails.dao');


const router = express.Router();

// Ruta para crear un nuevo detalle de la tabla
router.post('/tabla-details', async (req, res) => {
  const { columna1, columna2, columna3, columna4 } = req.body;

  try {
    const newDetail = await createTablaDetail({ columna1, columna2, columna3, columna4 });
    res.status(201).json(newDetail.rows[0]);
  } catch (error) {
    console.error('Error al crear tabla detail:', error);
    res.status(500).json({ error: 'Error al crear tabla detail' });
  }
});

// Ruta para obtener todos los detalles de la tabla
router.get('/tabla-details', async (req, res) => {
  try {
    const details = await getAllTablaDetails();
    res.status(200).json(details.rows);
  } catch (error) {
    console.error('Error al obtener tabla details:', error);
    res.status(500).json({ error: 'Error al obtener tabla details' });
  }
});

module.exports = router;

