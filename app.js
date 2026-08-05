const WORKER_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? "http://127.0.0.1:8787"
  : "https://studioflow-ai-worker.tomaspfcrotty.workers.dev";

const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const statusPill = document.getElementById("connection-status");

appendMessage(
  "assistant",
  "Ask me about classes, availability, coaches, memberships, FAQs, or studio updates. If something in the live data looks unusual, I will tell you and suggest confirming it with the studio."
);

checkHealth();

for (const button of document.querySelectorAll(".prompt-button")) {
  button.addEventListener("click", () => {
    chatInput.value = button.textContent.trim();
    chatInput.focus();
  });
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();

  if (!message) {
    return;
  }

  appendMessage("user", message);
  chatInput.value = "";
  setBusy(true);

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Request failed");
    }

    appendMessage("assistant", payload.reply, payload.warnings?.length ? "warning" : "");
  } catch (error) {
    appendMessage(
      "assistant",
      `I could not reach the live assistant right now. ${error.message}`,
      "warning"
    );
  } finally {
    setBusy(false);
  }
});

async function checkHealth() {
  try {
    const response = await fetch(WORKER_URL, { method: "OPTIONS" });
    if (!response.ok) {
      throw new Error("Health check failed");
    }
    statusPill.textContent = "Connected";
  } catch {
    statusPill.textContent = "Offline";
  }
}

function setBusy(isBusy) {
  sendButton.disabled = isBusy;
  sendButton.textContent = isBusy ? "Sending..." : "Send";
}

function appendMessage(role, text, extraClass = "") {
  const message = document.createElement("div");
  message.className = `message ${role} ${extraClass}`.trim();
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}
