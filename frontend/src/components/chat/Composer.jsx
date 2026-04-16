import { SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";

import { MAX_INPUT_LENGTH } from "../../data/constants";

export function Composer({ onSend, disabled, uiError }) {
  const [draft, setDraft] = useState("");
  const textareaRef = useRef(null);

  function resizeTextarea(nextValue) {
    const element = textareaRef.current;

    if (!element) {
      return;
    }

    element.style.height = "0px";
    element.style.height = `${Math.min(element.scrollHeight, 160)}px`;

    if (!nextValue) {
      element.style.height = "56px";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (disabled || !draft.trim()) {
      return;
    }

    const currentDraft = draft;
    setDraft("");
    resizeTextarea("");
    await onSend(currentDraft);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4 md:px-6 md:pb-6">
      <div className="rounded-[1.75rem] border border-border/60 bg-surface/80 p-3 shadow-sm">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={draft}
            maxLength={MAX_INPUT_LENGTH}
            rows={1}
            onKeyDown={handleKeyDown}
            onChange={(event) => {
              setDraft(event.target.value);
              resizeTextarea(event.target.value);
            }}
            placeholder="Ask about fees, admissions, hostel, transport, placements..."
            className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-3 py-3 text-sm leading-7 text-text outline-none placeholder:text-muted/80"
          />

          <button
            type="submit"
            disabled={disabled || !draft.trim()}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-strong text-white shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className={`${uiError ? "text-rose-500" : "text-muted"}`}>
            {uiError || "Press Enter to send, Shift + Enter for a new line."}
          </div>
          <div className="font-semibold text-muted">{draft.length}/{MAX_INPUT_LENGTH}</div>
        </div>
      </div>
    </form>
  );
}
