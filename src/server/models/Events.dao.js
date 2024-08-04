const db = require('../database/db');
const { encrypt } = require('../../utils/bcrypt');

const findUsuarios = async () => await db('SELECT * FROM usuarios;');

const findUsuarioByEmail = async (email) => await db('SELECT * FROM usuarios WHERE email = $1;', [email]);

const createUsuario = async ({ email, password, rol, lenguage }) => {
  const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *;';
  const values = [email, encrypt(password), rol, lenguage];
  return await db(query, values);
};

const updateUsuario = async (id, { email, password, rol, lenguage }) => {
  const query = 'UPDATE usuarios SET email = $2, password = $3, rol = $4, lenguage = $5 WHERE id = $1 RETURNING *;';
  const values = [id, email, password, rol, lenguage];
  return await db(query, values);
};

const deleteUsuario = async (id) => await db('DELETE FROM usuarios WHERE id = $1 RETURNING *;', [id]);

module.exports = {
  findUsuarios,
  findUsuarioByEmail,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};