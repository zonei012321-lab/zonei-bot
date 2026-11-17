const BOT_TOKEN = process.env.BOT_TOKEN;
const API_KEY = process.env.ZONEI_API_KEY;
const VAULT = "https://api-security-for-zonei-music.vercel.app";

async function kirim(chat_id, text, tombol = null) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat_id, text: text, parse_mode: "HTML", reply_markup: tombol ? { inline_keyboard: tombol } : undefined })
  });
}

async function kirimLagu(chat_id, judul, url) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendAudio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat_id, audio: url, caption: "🎵 " + judul })
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(200).send("Bot Zonei Hidup!");
  const update = req.body;
  const msg = update.message || update.callback_query?.message;
  if (!msg) return res.status(200).send("ok");
  const chat_id = msg.chat.id;
  const text = update.message?.text || update.callback_query?.data || "";

  if (text === "/start") {
    await kirim(chat_id, "Halo Bos! 🎵\nKetik judul lagu yang kau mau!\nContoh: <code>galau</code>");
    return res.status(200).send("ok");
  }

  if (text.startsWith("LAGU_")) {
    const id = text.replace("LAGU_", "");
    await kirim(chat_id, "⏳ Lagi ngambil lagunya...");
    const r = await fetch(`${VAULT}/api/v1/songs/${id}`, { headers: { "x-api-key": API_KEY } });
    const data = await r.json();
    const link = data.playUrl || data.url || data.signedUrl || data.link;
    if (link) await kirimLagu(chat_id, data.title || "Lagu", link);
    else await kirim(chat_id, "Link gagal Bos, coba lagi!");
    return res.status(200).send("ok");
  }

  await kirim(chat_id, `🔍 Lagi nyari "${text}"...`);
  try {
    const r = await fetch(`${VAULT}/api/v1/songs`, { headers: { "x-api-key": API_KEY } });
    const data = await r.json();
    const list = data.songs || data.data || data || [];
    const ketemu = list.filter(s => (s.title + " " + (s.artist || "")).toLowerCase().includes(text.toLowerCase())).slice(0, 10);
    if (ketemu.length === 0) { await kirim(chat_id, "Nggak ketemu Bos! Coba judul lain!"); return res.status(200).send("ok"); }
    let tombol = ketemu.map(s => [{ text: `🎵 ${s.title} - ${s.artist || ""}`, callback_data: `LAGU_${s.id || s._id}` }]);
    await kirim(chat_id, `Ketemu ${ketemu.length} lagu Bos! Pencet buat dapet MP3-nya:`, tombol);
  } catch (e) { await kirim(chat_id, "Gudang lagi error Bos!"); }
  return res.status(200).send("ok");
    }
