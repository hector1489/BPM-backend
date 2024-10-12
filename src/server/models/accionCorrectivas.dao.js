
const accionCorrectivas = require('../../../accionCorrectivas.json');

const getAccionCorrectivas = () => {
  return new Promise((resolve) => {
    resolve(accionCorrectivas);
  });
};

module.exports = { getAccionCorrectivas };
