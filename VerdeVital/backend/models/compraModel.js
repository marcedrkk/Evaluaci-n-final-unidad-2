const db = require('../db/database');

const procesarCompra = async (productos, usuario_id) => {
  return new Promise((resolve, reject) => {
    if (!productos || productos.length === 0) {
      return reject({ exito: false, mensaje: 'El carrito está vacío' });
    }

    const sqlPedido = 'INSERT INTO pedidos (usuario_id, fecha, estado, total) VALUES (?, ?, ?, ?)';
    const fecha = new Date().toISOString();
    const estado = 'pendiente';
    const total = productos.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);

    db.run(sqlPedido, [usuario_id, fecha, estado, total], function (err) {
      if (err) {
        console.error('Error al registrar pedido:', err);
        return reject({ exito: false, mensaje: 'Error al registrar pedido' });
      }

      const pedido_id = this.lastID;

      const registrarItemsPromises = productos.map(producto => {
        return new Promise((res, rej) => {
          const sqlItem = 'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)';
          db.run(sqlItem, [pedido_id, producto.id, producto.cantidad, producto.precio], (err) => {
            if (err) {
              console.error('Error al registrar item del pedido:', err);
              return rej('Error al registrar item del pedido');
            }
            res();
          });
        });
      });

      Promise.all(registrarItemsPromises)
        .then(() => {
          // 🔹 Reducir stock después de registrar el pedido
          const actualizarStockPromises = productos.map(producto => {
            return new Promise((res, rej) => {
              db.run('UPDATE productos SET stock = stock - ? WHERE id = ?', [producto.cantidad, producto.id], (err) => {
                if (err) {
                  console.error('Error al actualizar stock:', err);
                  return rej('Error al actualizar stock');
                }
                res();
              });
            });
          });

          return Promise.all(actualizarStockPromises);
        })
        .then(() => {
          console.log('✅ Pedido y stock actualizados con éxito.');
          resolve({ exito: true, pedido_id });
        })
        .catch(err => reject({ exito: false, mensaje: err }));
    });
  });
};

module.exports = { procesarCompra };
