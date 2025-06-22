const express = require('express');
const router = express.Router();
const { verificarAdmin } = require('../middleware/authMiddleware');
const {
  getProductos,
  postProducto,
  putProducto,
  deleteProducto,
  postCompra // 🔹 Ahora representa pedidos
} = require('../controllers/productoController');

router.get('/productos', getProductos); // 🔹 Obtener productos
router.post('/productos', verificarAdmin, postProducto); // 🔹 Agregar productos (solo admin)
router.put('/productos/:id', verificarAdmin, putProducto); // 🔹 Modificar productos (solo admin)
router.delete('/productos/:id', verificarAdmin, deleteProducto); // 🔹 Eliminar productos (solo admin)

// 🔹 Agregar la ruta para procesar pedidos en lugar de compras
router.post('/pedidos', postCompra);

module.exports = router;
