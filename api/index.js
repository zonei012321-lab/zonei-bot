export default async function handler(req, res) {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  const LAGU = {
    "1": {
      judul: "1.Dua Hati 1 Jalan - ZONY MUSIK",
      file_id: "CQACAgUAAxkBAAMlavzBkls0eShqWb9IVljzQ2lfUUEAApsfAAI2julX8KsdahucYDE9BA"
    },
    "2": {
      judul: "2.Dua Nama 1 Hati - ZONY MUSIK",
      file_id: "CQACAgUAAxkBAAMmavzBktCBmgGMa7wH_K4a9Ehl12sAApwfAAI2julXxj dkBBj0cSg9BA"
    },
    "3": {
      judul: "3.Rabb yang Maha Pencipta - ZONY MUSIK",
      file_id: "CQACAgUAAxkBAAMnavzBkklQOJ65QiuWWBE7NAStHvEAAp0fAAI2julX_3wjdzEFKSo9BA"
    }
  };

  if (req.method === 'POST') {
    const msg = req.body.message;
    const chatId = msg?.chat?.id;

    if (chatId && msg?.text) {
      const text = msg.text.toLowerCase();
      let file_id = "";
      let judul = "";

      if (text === '/start') {
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: "Halo! Selamat datang di Gudang Lagu Ku! 🎵\n\nKetik angka / judul lagunya:\n\n1. Dua Hati 1 Jalan\n2. Dua Nama 1 Hati\n3. Rabb yang Maha Pencipta"
          })
        });
        return res.status(200).json({ ok: true });
      }

      if (text.includes("dua hati") || text === "1") {
        file_id = LAGU["1"].file_id; judul = LAGU["1"].judul;
      } else if (text.includes("dua nama") || text === "2") {
        file_id = LAGU["2"].file_id; judul = LAGU["2"].judul;
      } else if (text.includes("rabb") || text.includes("pencipta") || text === "3") {
        file_id = LAGU["3"].file_id; judul = LAGU["3"].judul;
      }

      if (file_id) {
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendAudio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, audio: file_id, caption: "🎵 " + judul + "\n\nTerima kasih sudah mendengarkan!" })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: "Lagu gak ketemu 😎\n\nCoba ketik:\n1 / Dua Hati 1 Jalan\n2 / Dua Nama 1 Hati\n3 / Rabb yang Maha Pencipta" })
        });
      }
    }
    return res.status(200).json({ ok: true });
  }
  return res.status(200).json({ ok: true });
}
