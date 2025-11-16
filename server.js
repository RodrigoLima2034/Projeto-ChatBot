const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const fetch = require("node-fetch");

// Serve arquivos da pasta public
app.use(express.static("public"));

// Função de tradução
async function translateText(text, fromLang, toLang) {
  if (fromLang === toLang) return text; // evita traduzir para o mesmo idioma
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${fromLang}|${toLang}`
    );
    const data = await res.json();
    return data.responseData.translatedText;
  } catch {
    return text;
  }
}

// Bots
const bots = [
  {
    name: "Emma 🇺🇸",
    lang: "en",
    avatar: "https://i.pravatar.cc/50?img=1",
    messages: [
      "Hey! How are you today?",
      "I love learning new languages!",
      "Do you like music?",
      "That's really interesting!",
      "Wow, amazing!"
    ],
  },
  {
    name: "Lucas 🇧🇷",
    lang: "pt",
    avatar: "https://i.pravatar.cc/50?img=2",
    messages: [
      "E aí! Tudo bem?",
      "Que legal, me conte mais!",
      "Hoje o dia está ótimo para bater papo!",
      "Você gosta de tecnologia?",
      "Ler livros é muito relaxante."
    ],
  },
];

// Conexão Socket.io
io.on("connection", (socket) => {
  console.log("Usuário conectado ✅");

  socket.on("chatMessage", async ({ text, lang }) => {
    // Escolhe um bot aleatório
    const bot = bots[Math.floor(Math.random() * bots.length)];

    // Escolhe uma mensagem aleatória
    const botReply =
      bot.messages[Math.floor(Math.random() * bot.messages.length)];

    // Traduz para o idioma do usuário
    const translated = await translateText(botReply, bot.lang, lang);

    // Simula digitação do bot (1s)
    setTimeout(() => {
      socket.emit("chatMessage", {
        user: bot.name,
        text: translated,
        avatar: bot.avatar,
        type: "bot",
      });
    }, 1000);
  });
});

// Porta padrão 3000, mas verifica se já está ocupada
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`🌍 Servidor rodando em http://localhost:${PORT}`);
});
