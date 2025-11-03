// Controlador que maneja registro, login y perfil con JWT
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const conexion = require('../config/db');
require('dotenv').config();

// Funcion para registrar un nuevo usuario
exports.registrar = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Validar que se envien usuario y contrasena
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    // Verificar si el usuario ya existe en la base de datos
    const [resultados] = await conexion.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (resultados.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe.' });
    }

    // Cifrar la contrasena con bcrypt antes de guardarla
    const hash = await bcrypt.hash(contrasena, 10);

    // Insertar el nuevo usuario en la base de datos
    await conexion.execute('INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)', [usuario, hash]);
    
    res.status(201).json({ mensaje: 'Registro exitoso.' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Funcion para iniciar sesion y obtener token JWT
exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // Validar que se envien usuario y contrasena
    if (!usuario || !contrasena) {
      return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
    }

    // Buscar el usuario en la base de datos
    const [resultados] = await conexion.execute('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

    if (resultados.length === 0) {
      return res.status(401).json({ error: 'Error en la autenticación.' });
    }

    const usuarioEncontrado = resultados[0];

    // Verificar que la contrasena coincida con la almacenada
    const contrasenaValida = await bcrypt.compare(contrasena, usuarioEncontrado.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Error en la autenticación.' });
    }

    // Verificar que JWT_SECRET este configurado en el archivo .env
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado en el archivo .env');
      return res.status(500).json({ error: 'Error de configuración del servidor.' });
    }

    // Crear token JWT con la informacion del usuario
    const token = jwt.sign(
      { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ mensaje: 'Autenticación satisfactoria.', token });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Funcion para mostrar el perfil del usuario autenticado
exports.perfil = (req, res) => {
  res.json({
    mensaje: 'Bienvenido al perfil privado.',
    usuario: req.usuario.usuario,
    id: req.usuario.id
  });
};
