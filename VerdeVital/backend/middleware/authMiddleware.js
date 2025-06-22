const jwt = require('jsonwebtoken');

const verificarAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ mensaje: 'Acceso denegado' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto');
    if (decoded.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso solo para administradores' });
    }
    next();
  } catch (error) {
    res.status(403).json({ mensaje: 'Token inválido' });
  }
};

module.exports = { verificarAdmin };
