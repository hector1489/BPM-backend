const express = require('express');
const multer = require('multer');
const { listPDFs, uploadPDF, getPDF, deletePDF } = require('../models/pdf.dao');

const router = express.Router();

// Configuración de almacenamiento para Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para listar todos los PDFs
router.get('/pdfs', async (req, res) => {
  try {
    const pdfs = await listPDFs();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para subir un PDF
router.post('/pdfs/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Por favor, sube un archivo PDF' });
    }
    const uploadedPDF = await uploadPDF(file);
    res.json(uploadedPDF);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para obtener un PDF por su clave
router.get('/pdfs/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const pdf = await getPDF(key);
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para eliminar un PDF por su clave
router.delete('/pdfs/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const result = await deletePDF(key);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;

