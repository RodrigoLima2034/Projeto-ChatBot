const socket = io();

const form = document.getElementById("chat-form");
const input = document.getElementById("msg");
const messages = document.getElementById("messages");
const langSelect = document.getElementById("lang");

// Enviar mensagem do usuário
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const lang = langSelect.value;

  // Adiciona a mensagem do usuário na tela
  addMessage("Você", text, null, "user");

  // Envia para o servidor
  socket.emit("chatMessage", { text, lang });

  input.value = "";
});

// Recebe mensagens do servidor (bots)
socket.on("chatMessage", (msg) => {
  addMessage(msg.user, msg.text, msg.avatar, "bot");
});

// Função para adicionar mensagens no chat
function addMessage(user, text, avatar = null, type = "bot") {
  const li = document.createElement("li");
  li.classList.add(type);

  if (type === "bot" && avatar) {
    li.innerHTML = `<img src="${avatar}" alt="${user}" class="avatar"><strong>${user}:</strong> ${text}`;
  } else {
    li.innerHTML = `<strong>${user}:</strong> ${text}`;
  }

  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}
