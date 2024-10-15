const express = require('express');
const router = express.Router();
const { createTablaDetail, getAllTablaDetails, deleteTablaDetail,  getTablaDetailsByNumeroAuditoria  } = require('../models/TableDetails.dao');


router.get('/tabla-details', async (req, res) => {
  try {
    const result = await getAllTablaDetails();
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los detalles' });
  }
});


router.get('/tabla-details/:numero_auditoria', async (req, res) => {
  const numero_auditoria = req.params.numero_auditoria;

  try {
    const result = await getTablaDetailsByNumeroAuditoria(numero_auditoria);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros para el número de auditoría proporcionado.' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener los detalles por número de auditoría:', error.message);
    res.status(500).json({ error: 'Error al obtener los detalles para el número de auditoría proporcionado.' });
  }
});

router.post('/tabla-details', async (req, res) => {
  try {
      const data = req.body;

      if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Los datos enviados no son válidos o están vacíos');
      }

      const result = await createTablaDetail(data);

      if (!result || !result.length || !result[0].rows || result[0].rows.length === 0) {
          throw new Error('No se pudieron insertar los detalles en la base de datos');
      }

      res.status(201).json(result.map(r => r.rows[0]));
  } catch (error) {
      console.error('Error en el backend al crear el detalle:', error.message);
      res.status(500).json({ 
          error: 'Error al crear el detalle', 
          message: error.message,
          stack: error.stack,
          name: error.name,
          code: error.code || 'UNKNOWN'
      });
  }
});


router.delete('/deleted-details/:numero_auditoria', async (req, res) => {
  const numero_auditoria = req.params.numero_auditoria;
 

  try {
    await  deleteTablaDetail(numero_auditoria);
    res.status(200).json({ message: 'Desviación eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar la desviación:', error);
    res.status(500).json({ error: 'Error al eliminar la desviación en la base de datos.' });
  }
});



module.exports = router;


