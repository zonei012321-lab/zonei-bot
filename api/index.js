export default async function handler(req, res) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (req.method === 'POST') {
    const update = req.body;
    const msg = update.message;
    const chatId = msg?.chat?.id;

    if (chatId && msg) {
      let reply = "";

      // Kalo yang dikirim LAGU / AUDIO
      if (msg.audio || msg.document) {
        const file = msg.audio || msg.document;
        const nama = file.file_name || file.title || "lagu";
        reply = `Lagu kesimpen! ✅\n\nNama: ${nama}\nFILE_ID:\n${file.file_id}\n\nScreenshot ini kirim ke aku!`;
      }
      // Kalo yang dikirim TULISAN
      else if (msg.text) {
        const text = msg.text;
        if (text === '/start') {
          reply = "Halo! Selamat datang di Gudang Lagu Ku! 🎵\n\nKetik nama lagu yang mau kamu cari.\n\n1. Dua Hati 1 Jalan\n2. Dua Nama 1 Hati\n3. Rabb yang Maha Pencipta";
        } else {
          reply = "Halo! Bot udah jalan! 🎉";
        }
      }

      if (reply) {
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: reply })
        });
      }
    }
    return res.status(200).json({ ok: true });
  }
  return res.status(200).json({ ok: true });
}
