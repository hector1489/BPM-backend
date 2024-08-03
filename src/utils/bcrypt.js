const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const compareSync = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const encrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = {
  hashPassword,
  compareSync,
  encrypt
};
