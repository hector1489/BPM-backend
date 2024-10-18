
const express = require('express');
const sendEmail = require('../models/sendEmail');

const router = express.Router();

router.post('/send', async (req, res) => {
  const { toEmail, subject, text } = req.body;

  if (!toEmail || !text) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos' });
  }

  try {
    // Llamamos a la función para enviar el correo
    await sendEmail(toEmail, subject, text);
    res.status(200).json({ message: 'Correo enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error.message);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

module.exports = router;
