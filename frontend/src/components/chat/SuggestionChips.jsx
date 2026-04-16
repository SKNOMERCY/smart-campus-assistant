import { Sparkles } from "lucide-react";

export function SuggestionChips({ suggestions, onAskQuestion }) {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="border-t border-border/50 px-5 py-4 md:px-6">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
        <Sparkles className="h-4 w-4 text-accent-strong" />
        Quick Replies
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 custom-scroll">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onAskQuestion(suggestion)}
            className="whitespace-nowrap rounded-full border border-border/55 bg-surface/75 px-3 py-2 text-sm text-text transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
