const express = require('express');
const cors = require('cors');
const app = express();
const telegram = require('./utils/telegram');

// Rutas
const loginRoutes = require('./routes/loginRoutes');
const productoRoutes = require('./routes/productoRoutes');

app.use(cors());
app.use(express.json());

app.use('/api', loginRoutes);
app.use('/api', productoRoutes);

// Ruta para comprar productos y notificar por Telegram
app.post('/api/pedidos', async (req, res) => {
  const { productos, usuario } = req.body;
  
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ mensaje: 'No hay productos en el carrito' });
  }

  try {
    // ✅ Registrar el pedido en la base de datos y reducir el stock
    const resultadoPedido = await procesarCompra(productos, usuario);
    if (!resultadoPedido.exito) {
      return res.status(500).json({ mensaje: resultadoPedido.mensaje });
    }

    console.log('✅ Pedido registrado correctamente.');

    // ✅ Enviar notificación a Telegram con detalles del pedido
    await telegram.notificarPedidoTelegram(productos, usuario);

    res.json({ mensaje: 'Pedido realizado y notificado por Telegram', pedido_id: resultadoPedido.pedido_id });
  } catch (e) {
    console.error('❌ Error al procesar el pedido:', e);
    res.status(500).json({ mensaje: 'Error interno al procesar el pedido' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
