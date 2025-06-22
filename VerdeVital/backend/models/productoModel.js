const db = require('../db/database');

// Obtener todos los productos
const obtenerProductos = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, nombre, precio, stock, descripcion, categoria FROM productos', (err, rows) => {
      if (err) {
        console.error('Error al consultar productos:', err);
        reject(err);
      } else {
        console.log('Consulta de productos exitosa. Total:', rows.length);
        resolve(rows);
      }
    });
  });
};

// Agregar nuevo producto
const agregarProducto = ({ nombre, precio, stock, descripcion, categoria }) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO productos (nombre, precio, stock, descripcion, categoria) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [nombre, precio, stock, descripcion, categoria], function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, nombre, precio, stock, descripcion, categoria });
    });
  });
};

// Actualizar producto
const actualizarProducto = (id, { nombre, precio, stock, descripcion, categoria }) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE productos SET nombre = ?, precio = ?, stock = ?, descripcion = ?, categoria = ? WHERE id = ?';
    db.run(sql, [nombre, precio, stock, descripcion, categoria, id], function (err) {
      if (err) reject(err);
      else resolve({ id, nombre, precio, stock, descripcion, categoria });
    });
  });
};

// Eliminar producto
const eliminarProducto = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM productos WHERE id = ?';
    db.run(sql, [id], function (err) {
      if (err) reject(err);
      else resolve({ eliminado: true });
    });
  });
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
};
