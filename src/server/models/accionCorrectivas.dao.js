
const accionCorrectivas = require('../../../accionCorrectivas.json');

// Función para obtener datos del archivo JSON
const getAccionCorrectivas = () => {
  return new Promise((resolve) => {
    resolve(accionCorrectivas);
  });
};

module.exports = { getAccionCorrectivas };
