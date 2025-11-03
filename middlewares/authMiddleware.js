// Middleware para verificar token JWT en rutas protegidas
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Funcion middleware que verifica si el token JWT es valido
exports.verificarToken = (req, res, next) => {
  // Leer el token desde el header Authorization
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'Token no proporcionado.' });
  }

  // Extraer el token, soporta formato "Bearer TOKEN" o solo "TOKEN"
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado.' });
  }

  // Verificar que el token sea valido y no este expirado
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }

    // Guardar la informacion del usuario decodificada del token en el request
    req.usuario = decoded;
    next(); // Continuar con la siguiente funcion (ruta)
  });
};
