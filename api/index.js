export default async function handler(req, res) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (req.method === 'POST') {
    const update = req.body;
    const chatId = update.message?.chat?.id;
    const text = update.message?.text;
    if (chatId && text) {
      let reply = "Halo! Bot udah jalan! 🎉";
      if (text === '/start') {
        reply = "Halo! Selamat datang di Gudang Lagu Ku! 🎵\n\nKetik nama lagu yang mau kamu cari.";
      }
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: reply })
      });
    }
    return res.status(200).json({ ok: true });
  }
  return res.status(200).json({ ok: true });
}
