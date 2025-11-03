// Servidor principal de la aplicacion
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurar CORS para permitir peticiones desde cualquier origen
app.use(cors());

// Configurar middleware para parsear JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rutas de autenticacion
const authRoutes = require('./routes/authRoutes');

// Usar las rutas bajo el prefijo /api
app.use('/api', authRoutes);

// Ruta principal para verificar que el servidor funciona
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API REST funcionando correctamente',
    rutas: {
      registro: 'POST /api/registro',
      login: 'POST /api/login',
      perfil: 'GET /api/perfil (requiere token)'
    }
  });
});

// Configurar puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
  console.log('Endpoints disponibles:');
  console.log('POST http://localhost:' + PORT + '/api/registro');
  console.log('POST http://localhost:' + PORT + '/api/login');
  console.log('GET  http://localhost:' + PORT + '/api/perfil');
});
