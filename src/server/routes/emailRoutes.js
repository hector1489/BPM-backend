
const express = require('express');
const sendEmail = require('../models/sendEmail');
const sendEmailWithExcel = require('../models/sendEmailWithExcel');

const router = express.Router();

router.post('/send', async (req, res) => {
  const { toEmail, subject, text } = req.body;

  if (!toEmail || !text) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    await sendEmail(toEmail, subject, text);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

// Ruta para enviar correos con archivo Excel adjunto
router.post('/send-excel', async (req, res) => {
  const { toEmail, subject, text, data } = req.body;

  if (!toEmail || !text || !data) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    await sendEmailWithExcel(toEmail, subject, text, data);
    res.status(200).json({ message: 'Correo con Excel enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo con Excel:', error.message);
    res.status(500).json({ error: 'Error al enviar el correo con Excel' });
  }
});

module.exports = router;
