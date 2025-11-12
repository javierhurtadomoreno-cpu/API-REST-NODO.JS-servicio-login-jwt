// Controlador para gestionar datos personales de los usuarios
const conexion = require('../config/db');

// Guardar un registro de datos personales del usuario autenticado
exports.guardarDatos = async (req, res) => {
  const { nombres, identificacion } = req.body;
  const usuarioId = req.usuario ? req.usuario.id : null;

  if (!usuarioId) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  if (!nombres || !identificacion) {
    return res.status(400).json({ error: 'Los campos "nombres" y "identificacion" son obligatorios.' });
  }

  try {
    // Verificar si la identificación ya está registrada para otro usuario
    const [identificacionExistente] = await conexion.execute(
      'SELECT id, usuario_id FROM datos_personales WHERE identificacion = ? AND usuario_id <> ?',
      [identificacion, usuarioId]
    );

    if (identificacionExistente.length > 0) {
      return res.status(409).json({ error: 'La identificación ya está registrada para otro usuario.' });
    }

    // Verificar si el usuario ya tiene datos personales guardados
    const [datosExistentes] = await conexion.execute(
      'SELECT id FROM datos_personales WHERE usuario_id = ?',
      [usuarioId]
    );

    if (datosExistentes.length > 0) {
      // Actualizar datos personales
      await conexion.execute(
        'UPDATE datos_personales SET nombres = ?, identificacion = ? WHERE usuario_id = ?',
        [nombres, identificacion, usuarioId]
      );
      return res.json({ mensaje: 'Datos personales actualizados correctamente.' });
    }

    // Insertar nuevos datos personales
    await conexion.execute(
      'INSERT INTO datos_personales (usuario_id, nombres, identificacion) VALUES (?, ?, ?)',
      [usuarioId, nombres, identificacion]
    );

    res.status(201).json({ mensaje: 'Datos personales registrados correctamente.' });
  } catch (error) {
    console.error('Error al guardar datos personales:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Obtener todos los registros de datos personales del usuario autenticado
exports.obtenerDatos = async (req, res) => {
  const usuarioId = req.usuario ? req.usuario.id : null;

  if (!usuarioId) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  try {
    const [datos] = await conexion.execute(
      'SELECT nombres, identificacion FROM datos_personales WHERE usuario_id = ?',
      [usuarioId]
    );

    if (datos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron datos personales registrados.' });
    }

    res.json(datos[0]);
  } catch (error) {
    console.error('Error al obtener datos personales:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


