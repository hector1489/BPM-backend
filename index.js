const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  allowExitOnIdle: true,
});

app.use(express.json());
app.use(cors());


app.post('/tabla', (req, res) => {
  const tabla = req.body;
  console.log('Datos de la tabla recibidos:', tabla);

  
  res.send('Datos de la tabla recibidos correctamente');
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
