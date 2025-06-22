const db = require('../db/database');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ mensaje: 'Correo y contraseña requeridos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
  db.get(sql, [correo, contrasena], (err, usuario) => {
    if (err) return res.status(500).json({ mensaje: 'Error en la base de datos' });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    // Crear token JWT
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'secreto', { expiresIn: '2h' });

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      token
    });
  });
};

module.exports = { login };
