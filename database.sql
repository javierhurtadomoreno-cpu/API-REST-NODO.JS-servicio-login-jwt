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