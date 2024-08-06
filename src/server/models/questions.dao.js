
const questions = require('../../../questions.json');

// Función para obtener datos del archivo JSON
const getQuestions = () => {
  return new Promise((resolve) => {
    resolve(questions);
  });
};

module.exports = { getQuestions };
