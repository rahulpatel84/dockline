"use client";

import { useState } from "react";

const projectChoices = [
  { icon: "🛶", label: "New dock" },
  { icon: "🧱", label: "Seawall" },
  { icon: "⚓", label: "Boat lift" },
  { icon: "🔧", label: "Dock repair" },
  { icon: "🌊", label: "Seawall repair" },
  { icon: "❓", label: "Not sure yet" },
];

const budgetChoices = ["Under $10k", "$10k–$30k", "$30k+"];

export function QuoteForm() {
  const [project, setProject] = useState("New dock");
  const [budget, setBudget] = useState("$10k–$30k");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert("Demo only — this is where the lead is captured, qualified, and routed to builders.");
  }

  return (
    <form className="quote-card" onSubmit={submit}>
      <div className="steps">
        <div className="st on">1 · Project</div>
        <div className="st on">2 · Location</div>
        <div className="st">3 · Contact</div>
      </div>

      <label className="formlabel">What do you need built?</label>
      <div className="choice-grid">
        {projectChoices.map((c) => (
          <button
            key={c.label}
            type="button"
            className={`choice${project === c.label ? " sel" : ""}`}
            onClick={() => setProject(c.label)}
          >
            <span className="ci">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      <label className="formlabel">Rough budget</label>
      <div className="choice-grid">
        {budgetChoices.map((b) => (
          <button
            key={b}
            type="button"
            className={`choice${budget === b ? " sel" : ""}`}
            onClick={() => setBudget(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="qrow">
        <div>
          <label className="formlabel" htmlFor="q-name">
            Your name
          </label>
          <input id="q-name" name="name" className="field" placeholder="Jordan Rivera" required />
        </div>
        <div>
          <label className="formlabel" htmlFor="q-zip">
            Zip code
          </label>
          <input
            id="q-zip"
            name="zip"
            className="field"
            placeholder="33602"
            inputMode="numeric"
            pattern="\d{5}"
            required
          />
        </div>
      </div>
      <div className="qrow">
        <div>
          <label className="formlabel" htmlFor="q-email">
            Email
          </label>
          <input id="q-email" name="email" type="email" className="field" placeholder="you@email.com" required />
        </div>
        <div>
          <label className="formlabel" htmlFor="q-phone">
            Phone
          </label>
          <input id="q-phone" name="phone" type="tel" className="field" placeholder="(813) 555-0199" required />
        </div>
      </div>

      <input type="hidden" name="project" value={project} />
      <input type="hidden" name="budget" value={budget} />

      <button
        type="submit"
        className="btn btn-coral"
        style={{ width: "100%", justifyContent: "center", fontSize: "1.05rem", padding: 15 }}
      >
        Match me with builders →
      </button>

      <div className="privacy">
        🔒{" "}
        <span>
          By submitting, you agree to be contacted by matched builders. We log your consent (TCPA) and share details
          only with licensed contractors.
        </span>
      </div>
    </form>
  );
}
