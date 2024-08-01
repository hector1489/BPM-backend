const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;


app.use(bodyParser.json());


app.post('/tabla', (req, res) => {
  const tabla = req.body;
  console.log('Datos de la tabla recibidos:', tabla);

  
  res.send('Datos de la tabla recibidos correctamente');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
