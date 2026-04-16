import { Compass, Search, Shapes, Sparkles } from "lucide-react";

export function CategorySidebar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categoryOptions,
  faqItems,
  featuredQuestions,
  onAskQuestion,
  isLoading
}) {
  const sidebarQuestions = faqItems.length ? faqItems.slice(0, 8) : [];

  return (
    <aside className="rounded-[2rem] border border-border/60 bg-shell/75 p-5 shadow-glass backdrop-blur-2xl">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-muted">
          <Compass className="h-3.5 w-3.5" />
          FAQ Directory
        </div>
        <h2 className="font-display text-2xl font-semibold text-text">Browse by topic</h2>
        <p className="text-sm leading-6 text-muted">
          Search across categories, then tap any question to send it straight into the chat.
        </p>
      </div>

      <label className="mt-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-surface/75 px-4 py-3">
        <Search className="h-4 w-4 text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search fees, transport, hostel..."
          className="w-full bg-transparent text-sm text-text outline-none placeholder:text-muted/80"
        />
      </label>

      <div className="mt-5 flex flex-wrap gap-2">
        {categoryOptions.map((category) => {
          const active = selectedCategory === category.name;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                active
                  ? "border-accent/40 bg-accent text-white shadow-glow"
                  : "border-border/60 bg-surface/65 text-text hover:border-accent/40 hover:bg-surface/90"
              }`}
            >
              {category.name}
              <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-xs">{category.count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
          <Shapes className="h-4 w-4 text-accent-strong" />
          Matching Questions
        </div>

        <div className="space-y-2">
          {isLoading && (
            <div className="rounded-2xl border border-border/50 bg-surface/70 px-4 py-3 text-sm text-muted">
              Loading the FAQ catalog...
            </div>
          )}

          {!isLoading && sidebarQuestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border/60 bg-surface/50 px-4 py-4 text-sm text-muted">
              No matching FAQs found for this filter. Try a broader search term or switch categories.
            </div>
          )}

          {sidebarQuestions.map((faq) => (
            <button
              key={faq.id}
              type="button"
              onClick={() => onAskQuestion(faq.question)}
              className="w-full rounded-2xl border border-border/55 bg-surface/70 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface/90"
            >
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
                {faq.category}
              </div>
              <div className="text-sm font-semibold leading-6 text-text">{faq.question}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[1.5rem] border border-border/55 bg-surface/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
          <Sparkles className="h-4 w-4 text-accent-strong" />
          Popular Starters
        </div>
        <div className="flex flex-wrap gap-2">
          {featuredQuestions.slice(0, 4).map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onAskQuestion(question)}
              className="rounded-full border border-border/55 bg-white/60 px-3 py-2 text-sm text-text transition hover:border-accent/40 hover:bg-accent-soft"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
