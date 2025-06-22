const db = require('../db/database');

const buscarPorCredenciales = (correo, contrasena, callback) => {
  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';
  db.get(sql, [correo, contrasena], callback);
};

module.exports = { buscarPorCredenciales };
