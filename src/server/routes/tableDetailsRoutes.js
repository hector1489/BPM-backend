const express = require('express');
const router = express.Router();
const { createTablaDetail, getAllTablaDetails, deleteTablaDetail } = require('../models/TableDetails.dao');


router.get('/tabla-details', async (req, res) => {
  try {
    const result = await getAllTablaDetails();
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los detalles' });
  }
});


router.post('/tabla-details', async (req, res) => {
  try {
    const data = req.body;
    const result = await createTablaDetail(data);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error en el backend al crear el detalle:', error);


    res.status(500).json({
      error: 'Error al crear el detalle',
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code || 'UNKNOWN'
    });
  }
});


router.delete('/tabla-details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTablaDetail(id);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Registro eliminado exitosamente', detail: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

module.exports = router;
