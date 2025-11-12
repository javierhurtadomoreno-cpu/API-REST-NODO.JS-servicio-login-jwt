// Rutas para gestionar datos personales del usuario
const express = require('express');
const router = express.Router();
const { guardarDatos, obtenerDatos } = require('../controllers/datosController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Ruta para registrar o actualizar nombres e identificacion
router.post('/datos', verificarToken, guardarDatos);

// Ruta para obtener los datos personales guardados
router.get('/datos', verificarToken, obtenerDatos);

module.exports = router;
