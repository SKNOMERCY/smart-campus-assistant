import { Download, MoonStar, Sparkles, SunMedium, Trash2 } from "lucide-react";

function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-surface/70 px-4 py-2 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface/90"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function Header({ brand, theme, onToggleTheme, onExportConversation, onClearConversation }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border/50 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-soft/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-accent-strong">
          <Sparkles className="h-3.5 w-3.5" />
          Student Info Assistant
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-text md:text-3xl">
            {brand.assistantName}
          </h1>
          <p className="max-w-2xl text-sm text-muted md:text-base">{brand.tagline}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          icon={theme === "dark" ? SunMedium : MoonStar}
          label={theme === "dark" ? "Light Mode" : "Dark Mode"}
          onClick={onToggleTheme}
        />
        <ActionButton icon={Download} label="Export Chat" onClick={onExportConversation} />
        <ActionButton icon={Trash2} label="Clear Chat" onClick={onClearConversation} />
      </div>
    </header>
  );
}
