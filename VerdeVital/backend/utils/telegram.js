const fetch = require('node-fetch');
const TELEGRAM_TOKEN = '7624090315:AAFEe3O2LyIVyJwOhbwymg8e-39BoO-KiFU'; // 🔹 Reemplaza con tu token de bot
const CHAT_ID = '1489366257'; // 🔹 Reemplaza con tu chat ID
//7914735627:AAGaPzd7CpWfjzkUVDrdXTfVjXe8klTX-Wg
//7571656070
exports.notificarPedidoTelegram = async (productos, usuario_id) => {
  let mensaje = `🛒 *Nuevo pedido de usuario ${usuario_id || 'anónimo'}:*\n`;
  productos.forEach(p => {
    mensaje += `🔹 *${p.nombre}* x${p.cantidad} ($${p.precio * p.cantidad})\n`;
  });

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: 'Markdown' }) // ✅ Mensaje con formato Markdown
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Error en Telegram: ${data.description}`);
    }
    console.log('✅ Pedido enviado a Telegram');
  } catch (error) {
    console.error('❌ Error al enviar a Telegram:', error);
  }
};
