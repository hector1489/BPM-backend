const express = require('express');
const router = express.Router();


const {
  createAuditSheet,
  getAllAuditSheets,
  deleteAuditSheet,
  getAuditSheetByNumeroAuditoria,
  getAuditSheetsByUsername,
  deleteAuditSheetById
} = require('../models/TableAuditSheet.dao');

// Ruta para obtener todos los registros de audit_sheet
router.get('/audit-sheet', async (req, res) => {
  try {
    const result = await getAllAuditSheets();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener registros de audit_sheet:', error.message);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Ruta para obtener registros por numero_auditoria
router.get('/:numero_auditoria', async (req, res) => {
  const numero_auditoria = req.params.numero_auditoria;

  try {
    const result = await getAuditSheetByNumeroAuditoria(numero_auditoria);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros para el número de auditoría proporcionado.' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener registros por numero_auditoria:', error.message);
    res.status(500).json({ error: 'Error al obtener los registros para el número de auditoría proporcionado.' });
  }
});

// Ruta para obtener registros por username
router.get('/username/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const result = await getAuditSheetsByUsername(username);
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros para el usuario proporcionado.' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener registros por username:', error.message);
    res.status(500).json({ error: 'Error al obtener los registros para el nombre de usuario proporcionado.' });
  }
});

// Ruta para crear un nuevo registro en audit_sheet
router.post('/audit-sheet', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    if (!data.username || !data.numero_auditoria) {
      throw new Error('El nombre de usuario y el número de auditoría son obligatorios');
    }

    const result = await createAuditSheet(data);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error al crear el registro en audit_sheet:', error.message);
    res.status(500).json({
      error: 'Error al crear el registro',
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code || 'UNKNOWN'
    });
  }
});

// Ruta para eliminar un registro por numero_auditoria
router.delete('/audit-sheet/:numero_auditoria', async (req, res) => {
  const numero_auditoria = req.params.numero_auditoria;

  try {
    const result = await deleteAuditSheet(numero_auditoria);
    if (!result) {
      return res.status(404).json({ message: 'No se encontró el registro para eliminar' });
    }
    res.status(200).json({ message: 'Registro eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar el registro de audit_sheet:', error.message);
    res.status(500).json({ error: 'Error al eliminar el registro en la base de datos.' });
  }
});

router.delete('/audit-sheet/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteAuditSheetById(id);
    if (!result) {
      return res.status(404).json({ message: 'No se encontró el registro para eliminar' });
    }
    res.status(200).json({ message: 'Registro eliminado con éxito', result });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el registro' });
  }
});

module.exports = router;
