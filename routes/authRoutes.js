// Rutas de autenticacion y perfil
const express = require('express');
const router = express.Router();
const { registrar, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Ruta para registrar un nuevo usuario
router.post('/registro', registrar);

// Ruta para iniciar sesion y obtener token JWT
router.post('/login', login);

// Ruta protegida que requiere token JWT valido
router.get('/perfil', verificarToken, perfil);

module.exports = router;
