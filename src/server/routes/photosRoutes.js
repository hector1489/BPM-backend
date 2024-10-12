const express = require('express');
const multer = require('multer');
const { listPhotos, uploadPhoto, getPhoto, deletePhoto } = require('../models/s3.dao');


const router = express.Router();

// Configuración de almacenamiento para Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para listar todas las fotos
router.get('/photos', async (req, res) => {
  try {
    const photos = await listPhotos();
    res.status(200).json(photos);
  } catch (error) {
    console.error('Error al listar las fotos:', error);
    res.status(500).json({ error: 'Error al listar las fotos' });
  }
});

// Ruta para subir una nueva foto
router.post('/upload-photo', upload.single('image'), async (req, res) => {
  try {
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
router.get('/photos/:key', async (req, res) => {
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
router.delete('/delete-photos/:key', async (req, res) => {
  console.log(req);
  try {
    const data = await deletePhoto(req.params.key);
    res.status(200).json({ message: 'Foto eliminada con éxito', data });
  } catch (error) {
    console.error('Error al eliminar la foto:', error);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
});


module.exports = router;

