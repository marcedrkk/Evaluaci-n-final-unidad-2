const {
  obtenerProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto
} = require('../models/productoModel');
const { notificarPedidoTelegram } = require('../utils/telegram'); // ✅ Importar función para enviar mensajes a Telegram
const { procesarCompra } = require('../models/compraModel'); // ✅ Asegurar que el backend procese compras

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    console.log('GET /api/productos llamado');
    const productos = await obtenerProductos();
    res.json(productos);
  } catch (error) {
    console.error('Error en getProductos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Agregar un nuevo producto
const postProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, descripcion, categoria } = req.body;

    if (!nombre || isNaN(precio) || isNaN(stock) || !descripcion || !categoria) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const nuevoProducto = await agregarProducto({ nombre, precio, stock, descripcion, categoria });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error en postProducto:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// Actualizar un producto
const putProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, stock, descripcion, categoria } = req.body;

    if (!nombre || isNaN(precio) || isNaN(stock) || !descripcion || !categoria) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const productoActualizado = await actualizarProducto(id, { nombre, precio, stock, descripcion, categoria });
    res.json(productoActualizado);
  } catch (error) {
    console.error('Error en putProducto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarProducto(id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en deleteProducto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

// 🔹 Procesar compra y enviar notificación a Telegram
const postCompra = async (req, res) => {
  try {
    const { productos, usuario } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    const resultadoCompra = await procesarCompra(productos, usuario);
    if (!resultadoCompra.exito) {
      return res.status(500).json({ mensaje: resultadoCompra.mensaje });
    }

    console.log('✅ Pedido registrado correctamente.');

    await notificarPedidoTelegram(productos, usuario); // 🔹 Ahora envía el pedido, no una compra

    res.status(200).json({ mensaje: 'Pedido realizado con éxito y notificado en Telegram' });
  } catch (error) {
    console.error('Error en el pedido:', error);
    res.status(500).json({ mensaje: 'Error interno al procesar el pedido' });
  }
};


module.exports = {
  getProductos,
  postProducto,
  putProducto,
  deleteProducto,
  postCompra // ✅ Agregar la nueva función de compra
};
