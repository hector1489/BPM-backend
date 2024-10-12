const express = require('express');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');
const desviacionesRoutes = require('./routes/desviacionesRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const photosRoutes = require('./routes/photosRoutes')
const detailsRoutes = require('./routes/detailsRoutes');
const warningRoutes = require('./routes/warningRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//New Routes
app.use('bpm/user', userRoutes);
app.use('bpm/desviaciones', desviacionesRoutes);
app.use('bpm/questions', questionsRoutes);
app.use('bpm/photos', photosRoutes);
app.use('bpm/details', detailsRoutes);
app.use('bpm/warning', warningRoutes);
app.use('bpm/pdf', pdfRoutes);


// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal' });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



