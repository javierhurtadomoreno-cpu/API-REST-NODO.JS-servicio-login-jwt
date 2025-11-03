// Configuracion de conexion a la base de datos MySQL
const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones para manejar multiples solicitudes
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'login_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Probar la conexion a la base de datos
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err.message);
    console.error('Verifica que la base de datos "login_db" exista y las credenciales sean correctas.');
  } else {
    console.log('Conexion exitosa con la base de datos MySQL');
    console.log('Base de datos: ' + (process.env.DB_NAME || 'login_db'));
    connection.release(); // Liberar la conexion de prueba
  }
});

// Exportar pool configurado para usar promesas (async/await)
module.exports = pool.promise();
