import { Building2, MapPinned, Sparkles } from "lucide-react";

export function WelcomePanel({ brand, featuredQuestions, onAskQuestion }) {
  return (
    <section className="mb-6 rounded-[2rem] border border-border/60 bg-gradient-to-br from-white/80 via-white/55 to-accent-soft/80 p-5 shadow-glass backdrop-blur-2xl dark:from-slate-950/70 dark:via-slate-900/60 dark:to-cyan-950/60">
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-accent-strong">
            <Sparkles className="h-3.5 w-3.5" />
            Welcome
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-text">
              Ask faster. Navigate VIT Vellore with confidence.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted md:text-base">
              {brand.assistantName} is built to handle the most common questions students ask about
              admissions, campus services, hostels, placements, and getting around {brand.cityName}.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/50 bg-surface/75 p-4">
              <div className="mb-2 inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
                Campus
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 h-5 w-5 text-accent-strong" />
                <p className="text-sm leading-6 text-muted">
                  Check admissions, services, placements, hostel details, and everyday academic info.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-surface/75 p-4">
              <div className="mb-2 inline-flex rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold uppercase tracking-[0.22em] text-accent-strong">
                City Guide
              </div>
              <div className="flex items-start gap-3">
                <MapPinned className="mt-1 h-5 w-5 text-accent-strong" />
                <p className="text-sm leading-6 text-muted">
                  Get quick answers on Katpadi access, buses, airport travel, and moving around Vellore.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-border/55 bg-surface/75 p-4">
          <div className="mb-3 text-sm font-semibold text-text">Suggested questions</div>
          <div className="flex flex-wrap gap-2">
            {featuredQuestions.slice(0, 6).map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onAskQuestion(question)}
                className="rounded-full border border-border/55 bg-white/65 px-3 py-2 text-left text-sm text-text transition hover:-translate-y-0.5 hover:border-accent/35 hover:bg-accent-soft dark:bg-slate-900/70"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
