import { Bot, User2 } from "lucide-react";

import { formatTimestamp } from "../../utils/chat";

function Avatar({ role }) {
  const isBot = role === "bot";

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
        isBot
          ? "border-accent/20 bg-gradient-to-br from-accent to-accent-strong text-white"
          : "border-slate-300/40 bg-gradient-to-br from-slate-700 to-slate-900 text-white"
      }`}
    >
      {isBot ? <Bot className="h-5 w-5" /> : <User2 className="h-5 w-5" />}
    </div>
  );
}

export function MessageBubble({ message }) {
  const isBot = message.role === "bot";

  return (
    <div className={`message-enter mb-5 flex gap-3 ${isBot ? "" : "justify-end"}`}>
      {isBot && <Avatar role="bot" />}

      <div className={`max-w-[86%] space-y-2 md:max-w-[74%] ${isBot ? "" : "items-end"}`}>
        {message.meta?.matchedQuestion && (
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-strong">
            Matched FAQ: {message.meta.matchedQuestion}
          </div>
        )}

        <div
          className={`rounded-[1.6rem] border px-4 py-3 text-sm leading-7 shadow-sm transition ${
            isBot
              ? "border-border/50 bg-surface/80 text-text"
              : "border-accent/30 bg-gradient-to-br from-accent to-accent-strong text-white"
          }`}
        >
          {message.text}
        </div>

        <div className={`text-xs text-muted ${isBot ? "" : "text-right text-slate-400 dark:text-slate-500"}`}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      {!isBot && <Avatar role="user" />}
    </div>
  );
}
