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
const poolPromise = pool.promise();

// Crear tablas necesarias si no existen
async function inicializarBaseDatos() {
  try {
    await poolPromise.query(`CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario VARCHAR(50) NOT NULL UNIQUE,
      contrasena VARCHAR(255) NOT NULL
    )`);

    await poolPromise.query(`CREATE TABLE IF NOT EXISTS datos_personales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      nombres VARCHAR(150) NOT NULL,
      identificacion VARCHAR(30) NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )`);

    console.log('Tablas verificadas o creadas correctamente.');
  } catch (error) {
    console.error('Error al crear tablas necesarias:', error.message);
  }
}

inicializarBaseDatos();

module.exports = poolPromise;
