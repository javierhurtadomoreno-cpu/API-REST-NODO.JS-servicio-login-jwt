-- Crear la base de datos
CREATE DATABASE login_db;

-- Usar la base de datos
USE login_db;

-- Crear tabla para los usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL
);

-- Crear tabla para los datos personales
CREATE TABLE datos_personales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombres VARCHAR(150) NOT NULL,
    identificacion VARCHAR(30) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Insertar usuarios iniciales con contraseñas cifradas (generadas con bcrypt 10 saltos)
INSERT INTO usuarios (usuario, contrasena) VALUES
  ('Erikacastillo', '$2b$10$8KmsQbvXm91f/tYmTDQR.OtqW8meHRZbU1dKGLtxWbcS41SI1fAaa'),
  ('AndresHurtado', '$2b$10$V4Y5e82fiwcGMu1m1R6Ay.raXM9n1w19Hwg9H1M68xkdazppwHrm.');

-- Insertar datos personales asociados a los usuarios
INSERT INTO datos_personales (usuario_id, nombres, identificacion) VALUES
  ((SELECT id FROM usuarios WHERE usuario = 'Erikacastillo'), 'Erika del Pilar Castillo', '1234567890'),
  ((SELECT id FROM usuarios WHERE usuario = 'AndresHurtado'), 'Andrés Hurtado', '9876501234');

