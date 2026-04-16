import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="message-enter mb-5 flex gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/20 bg-gradient-to-br from-accent to-accent-strong text-white">
        <Bot className="h-5 w-5" />
      </div>

      <div className="rounded-[1.6rem] border border-border/50 bg-surface/80 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="typing-dot" />
          <span className="typing-dot [animation-delay:120ms]" />
          <span className="typing-dot [animation-delay:240ms]" />
        </div>
      </div>
    </div>
  );
}
