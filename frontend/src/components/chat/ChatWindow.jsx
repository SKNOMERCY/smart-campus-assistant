import { useEffect, useRef } from "react";

import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomePanel } from "./WelcomePanel";

export function ChatWindow({
  brand,
  messages,
  isTyping,
  hasUserMessages,
  featuredQuestions,
  onAskQuestion
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="custom-scroll flex-1 overflow-y-auto px-5 py-5 md:px-6">
      {!hasUserMessages && (
        <WelcomePanel
          brand={brand}
          featuredQuestions={featuredQuestions}
          onAskQuestion={onAskQuestion}
        />
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
