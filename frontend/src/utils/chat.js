import { APP_BRAND } from "../data/constants";

export function createMessage({ role, text, type = "message", meta = {} }) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    type,
    meta,
    timestamp: new Date().toISOString()
  };
}

export function buildWelcomeMessage(brand = APP_BRAND) {
  return createMessage({
    role: "bot",
    type: "welcome",
    text: `Welcome to ${brand.assistantName}. Ask about admissions, academics, hostel life, placements, or getting around Vellore.`,
    meta: {
      category: "Welcome"
    }
  });
}

export function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

export function downloadTranscript(messages, brand = APP_BRAND) {
  const lines = [
    `${brand.assistantName} Conversation Export`,
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    ""
  ];

  messages.forEach((message) => {
    const speaker = message.role === "user" ? "You" : brand.assistantName;
    lines.push(`[${formatTimestamp(message.timestamp)}] ${speaker}: ${message.text}`);
  });

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "vit-vellore-chat-transcript.txt";
  anchor.click();

  URL.revokeObjectURL(url);
}
