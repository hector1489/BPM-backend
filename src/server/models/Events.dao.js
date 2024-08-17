const db = require('../database/db');
const { encrypt } = require('../../utils/bcrypt');

const findUsuarios = async () => await db('SELECT * FROM usuarios;');

const findUsuarioByEmail = async (email) => await db('SELECT * FROM usuarios WHERE email = $1;', [email]);

const createUsuario = async ({ username, email, role,  password }) => {
  const query = 'INSERT INTO usuarios (username, email, role,  password) VALUES ($1, $2, $3, $4) RETURNING *;';
  const values = [username, email, role, encrypt(password)];
  return await db(query, values);
};

const updateUsuario = async (id, { username, email, role,  password }) => {
  const query = 'UPDATE usuarios SET username = $2, email = $3, role = $4, password = $5 WHERE id = $1 RETURNING *;';
  const values = [username, email, role,  password];
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