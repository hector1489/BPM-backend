const jwt = require('jsonwebtoken');
require('dotenv').config();

const KEY = process.env.JWT_SECRET;

if (!KEY) {
  throw new Error('JWT_SECRET is not defined');
}

const jwtVerify = (token) => {
  try {
    return jwt.verify(token, KEY);
  } catch (err) {
    throw err;
  }
};

const jwtSign = (payload) => jwt.sign(payload, KEY, { expiresIn: 60 * 5 }); // 5 minutos

module.exports = { jwtVerify, jwtSign };