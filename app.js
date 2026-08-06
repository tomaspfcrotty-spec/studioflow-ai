window.addEventListener("DOMContentLoaded", function () {
  var WORKER_URL =
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
      ? "http://127.0.0.1:8787"
      : "https://studioflow-ai-worker.tomaspfcrotty.workers.dev";

  var chatLog = document.getElementById("chat-log");
  var chatForm = document.getElementById("chat-form");
  var chatInput = document.getElementById("chat-input");
  var sendButton = document.getElementById("send-button");
  var statusPill = document.getElementById("connection-status");

  if (!chatLog || !chatForm || !chatInput || !sendButton || !statusPill) {
    return;
  }

  appendMessage(
    "assistant",
    "Ask me about classes, availability, coaches, memberships, FAQs, or studio updates. If something in the live data looks unusual, I will tell you and suggest confirming it with the studio."
  );

  statusPill.textContent = "Ready";
  checkHealth();

  var promptButtons = document.querySelectorAll(".prompt-button");
  for (var i = 0; i < promptButtons.length; i += 1) {
    promptButtons[i].addEventListener("click", function () {
      chatInput.value = this.textContent.trim();
      chatForm.requestSubmit();
    });
  }

  chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });

  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var message = chatInput.value.trim();

    if (!message) {
      return;
    }

    appendMessage("user", message);
    chatInput.value = "";
    setBusy(true);

    fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    })
      .then(function (response) {
        return response.json().then(function (payload) {
          return { ok: response.ok, payload: payload };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.payload.error || "Request failed");
        }

        var hasWarnings = result.payload.warnings && result.payload.warnings.length;
        statusPill.textContent = "Connected";
        appendMessage("assistant", result.payload.reply, hasWarnings ? "warning" : "");
      })
      .catch(function (error) {
        statusPill.textContent = "Offline";
        appendMessage(
          "assistant",
          "I could not reach the live assistant right now. " + error.message,
          "warning"
        );
      })
      .finally(function () {
        setBusy(false);
      });
  });

  function checkHealth() {
    fetch(WORKER_URL + "/health")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Health check failed");
        }
        statusPill.textContent = "Connected";
      })
      .catch(function () {
        statusPill.textContent = "Ready";
      });
  }

  function setBusy(isBusy) {
    sendButton.disabled = isBusy;
    sendButton.textContent = isBusy ? "Sending..." : "Send";
  }

  function appendMessage(role, text, extraClass) {
    var message = document.createElement("div");
    message.className = ["message", role, extraClass || ""].join(" ").trim();
    message.textContent = text;
    chatLog.appendChild(message);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
});
