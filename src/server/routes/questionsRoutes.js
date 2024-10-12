const express = require('express');
const { getAccionCorrectivas } = require('../models/accionCorrectivas.dao');
const { getQuestions } = require('../models/questions.dao');

const router = express.Router();

// Ruta para obtener todos los datos de accionCorrectivas
router.get('/accion-correctivas', async (req, res) => {
  try {
    const data = await getAccionCorrectivas();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error obteniendo datos de accion correctivas:', error);
    res.status(500).json({ error: 'Error obteniendo datos de accion correctivas' });
  }
});

// Ruta para obtener todos los datos de questions
router.get('/questions', async (req, res) => {
  try {
    const data = await getQuestions();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error obteniendo datos de accion correctivas:', error);
    res.status(500).json({ error: 'Error obteniendo datos de accion correctivas' });
  }
});



module.exports = router;

