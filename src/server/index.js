const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');
const desviacionesRoutes = require('./routes/desviacionesRoutes');
const questionsRoutes = require('./routes/questionsRoutes');
const photosRoutes = require('./routes/photosRoutes')
const detailsRoutes = require('./routes/tableDetailsRoutes');
const warningRoutes = require('./routes/warningRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//New Routes
app.use('/user', userRoutes);
app.use('/desviaciones', desviacionesRoutes);
app.use('/questions', questionsRoutes);
app.use('/photos', photosRoutes);
app.use('/details', detailsRoutes);
app.use('/warning', warningRoutes);
app.use('/pdf', pdfRoutes);
app.use('/email', emailRoutes);



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



