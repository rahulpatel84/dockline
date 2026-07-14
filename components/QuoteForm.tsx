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

const LEAD_EMAIL = process.env.NEXT_PUBLIC_LEAD_EMAIL || "rahulpatel.e29@gmail.com";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${LEAD_EMAIL}`;

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm() {
  const [project, setProject] = useState("New dock");
  const [budget, setBudget] = useState("$10k–$30k");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);

    if ((fd.get("_website") as string)?.length) {
      setStatus("success");
      return;
    }

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      zip: fd.get("zip"),
      project: fd.get("project"),
      budget: fd.get("budget"),
      _subject: `New dock lead: ${fd.get("project")} in ${fd.get("zip")}`,
      _template: "table",
      _captcha: "false",
    };

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false") {
        throw new Error(data.message || `Submit failed (${res.status})`);
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="quote-card">
        <div className="quote-success">
          <div className="quote-success-icon">✓</div>
          <h3>Thanks — we got it.</h3>
          <p>
            A matched builder in your area will reach out within 1 business day. Keep an eye on your inbox
            (and your spam folder, just in case).
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setStatus("idle")}
            style={{ marginTop: 18 }}
          >
            Submit another request
          </button>
        </div>
      </div>
    );
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
      <input
        type="text"
        name="_website"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      {status === "error" && (
        <div className="quote-error" role="alert">
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-coral"
        disabled={status === "submitting"}
        style={{ width: "100%", justifyContent: "center", fontSize: "1.05rem", padding: 15 }}
      >
        {status === "submitting" ? "Sending…" : "Match me with builders →"}
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
