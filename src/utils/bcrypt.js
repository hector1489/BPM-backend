const bcrypt = require('bcryptjs');

const encrypt = (password) => bcrypt.hashSync(password);
const compareSync = (password, encryptedPassword) => bcrypt.compareSync(password, encryptedPassword);

module.exports = {
  encrypt,
  compareSync,
};
