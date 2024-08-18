const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const compareSync = (password, hash) => {
  console.log("Password:", password);
  console.log("Hash:", hash);
  const isMatch = bcrypt.compareSync(password, hash);
  console.log("Comparison result:", isMatch);
  return isMatch;
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