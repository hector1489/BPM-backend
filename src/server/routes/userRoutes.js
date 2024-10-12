const express = require('express');
const { jwtSign } = require('../../utils/jwt');
const { createUsuario, findUsuarios, findUsuarioByEmail, updateUsuario, deleteUsuario } = require('../models/Events.dao'); // Corrected path
const { verifyCredentials } = require('../models/Users.dao');

const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
  const { username, email, role, password } = req.body;

  try {
    const newUser = await createUsuario({ username, email, role, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await verifyCredentials(username, password);
    if (user.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwtSign({ userId: user[0].id });
    res.json({
      token,
      usuarioId: user[0].id,
      role: user[0].role
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en login' });
  }
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await findUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

// Ruta para obtener un usuario por email
router.get('/usuarios/email/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const usuario = await findUsuarioByEmail(email);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error obteniendo usuario por email:', error);
    res.status(500).json({ error: 'Error obteniendo usuario por email' });
  }
});

// Ruta para actualizar un usuario
router.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedUsuario = await updateUsuario(id, updatedData);
    if (!updatedUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario actualizado con éxito', updatedUsuario });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
});

// Ruta para eliminar un usuario
router.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUsuario = await deleteUsuario(id);
    if (!deletedUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Usuario eliminado con éxito' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
});

module.exports = router;
