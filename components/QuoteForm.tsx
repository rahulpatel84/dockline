"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const projectChoices: { icon: string; label: string }[] = [
  { icon: "🛶", label: "New dock" },
  { icon: "🧱", label: "Seawall" },
  { icon: "⚓", label: "Boat lift" },
  { icon: "🔧", label: "Dock repair" },
  { icon: "🌊", label: "Seawall repair" },
  { icon: "❓", label: "Not sure yet" },
];

const budgetChoices = ["Under $10k", "$10k–$30k", "$30k+", "Not sure"];
const timelineChoices = ["ASAP", "Within 3 months", "3 to 6 months", "Just planning"];
const currentDockChoices = ["No dock yet", "Existing dock, needs replacing", "Building new next to existing", "Rebuilding after storm damage"];
const bestTimeChoices = ["Morning", "Afternoon", "Evening", "Any time"];

type Status = "idle" | "submitting" | "success" | "error";
type Step = 1 | 2 | 3;

interface FormState {
  project: string;
  budget: string;
  timeline: string;
  zip: string;
  neighborhood: string;
  currentDock: string;
  name: string;
  email: string;
  phone: string;
  bestTime: string;
  _website: string;
}

const initial: FormState = {
  project: "New dock",
  budget: "$10k–$30k",
  timeline: "Within 3 months",
  zip: "",
  neighborhood: "",
  currentDock: "No dock yet",
  name: "",
  email: "",
  phone: "",
  bestTime: "Any time",
  _website: "",
};

export function QuoteForm() {
  const [step, setStep] = useState<Step>(1);
  const [state, setState] = useState<FormState>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [attempted, setAttempted] = useState<Record<Step, boolean>>({ 1: false, 2: false, 3: false });

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((prev) => ({ ...prev, [k]: v }));

  const stepErrors = useMemo(() => {
    const errs: Record<Step, string[]> = { 1: [], 2: [], 3: [] };
    if (!state.project) errs[1].push("Pick a project type.");
    if (!state.budget) errs[1].push("Pick a budget range.");
    if (!state.timeline) errs[1].push("Pick a timeline.");
    if (!/^\d{5}$/.test(state.zip)) errs[2].push("Enter a valid 5-digit ZIP code.");
    if (!state.currentDock) errs[2].push("Tell us about the current dock.");
    if (state.name.trim().length < 2) errs[3].push("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) errs[3].push("Enter a valid email.");
    if (state.phone.replace(/\D/g, "").length < 10) errs[3].push("Enter a 10-digit phone number.");
    return errs;
  }, [state]);

  const currentStepValid = stepErrors[step].length === 0;

  function goNext() {
    setAttempted((a) => ({ ...a, [step]: true }));
    if (!currentStepValid) return;
    if (step < 3) setStep((s) => (s + 1) as Step);
  }

  function goBack() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted((a) => ({ ...a, [step]: true }));
    if (status === "submitting") return;
    if (!currentStepValid) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, source: "quote-form" }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) throw new Error(data.message || `Submit failed (${res.status})`);
      setStatus("success");
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
          <h3>Thanks. We got your project.</h3>
          <p>
            We&apos;re matching you with two or three licensed marine contractors that fit your project and ZIP.
            You&apos;ll hear from them within 1 business day. Meanwhile, use our{" "}
            <Link href="/tools/dock-cost" style={{ color: "var(--teal)", fontWeight: 600 }}>
              free Dock Cost Calculator
            </Link>{" "}
            to sanity-check the quotes when they arrive.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setState(initial);
              setStep(1);
              setStatus("idle");
              setAttempted({ 1: false, 2: false, 3: false });
            }}
            style={{ marginTop: 18 }}
          >
            Submit another project
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="quote-card" onSubmit={submit} noValidate>
      <div className="steps" aria-label="Form progress">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            className={`st${step === n ? " on" : ""}${step > n ? " done" : ""}`}
            onClick={() => {
              if (n < step) setStep(n as Step);
            }}
            aria-current={step === n ? "step" : undefined}
            aria-label={`Go to step ${n}`}
          >
            <span className="st-num">{step > n ? "✓" : n}</span>
            <span className="st-label">{n === 1 ? "Project" : n === 2 ? "Location" : "Contact"}</span>
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="step-panel">
          <label className="formlabel">What do you need built?</label>
          <div className="choice-grid">
            {projectChoices.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`choice${state.project === c.label ? " sel" : ""}`}
                onClick={() => update("project", c.label)}
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
                className={`choice${state.budget === b ? " sel" : ""}`}
                onClick={() => update("budget", b)}
              >
                {b}
              </button>
            ))}
          </div>

          <label className="formlabel">Timeline</label>
          <div className="choice-grid">
            {timelineChoices.map((t) => (
              <button
                key={t}
                type="button"
                className={`choice${state.timeline === t ? " sel" : ""}`}
                onClick={() => update("timeline", t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step-panel">
          <div className="qrow">
            <div>
              <label className="formlabel" htmlFor="q-zip">ZIP code</label>
              <input
                id="q-zip"
                className="field"
                inputMode="numeric"
                maxLength={5}
                placeholder="33602"
                value={state.zip}
                onChange={(e) => update("zip", e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
                required
              />
            </div>
            <div>
              <label className="formlabel" htmlFor="q-neighborhood">Neighborhood (optional)</label>
              <input
                id="q-neighborhood"
                className="field"
                placeholder="Davis Islands, Apollo Beach…"
                value={state.neighborhood}
                onChange={(e) => update("neighborhood", e.target.value)}
              />
            </div>
          </div>

          <label className="formlabel" style={{ marginTop: 18 }}>Current dock situation</label>
          <div className="choice-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {currentDockChoices.map((c) => (
              <button
                key={c}
                type="button"
                className={`choice${state.currentDock === c ? " sel" : ""}`}
                onClick={() => update("currentDock", c)}
                style={{ fontSize: "0.9rem", lineHeight: 1.3 }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step-panel">
          <div className="qrow">
            <div>
              <label className="formlabel" htmlFor="q-name">Your name</label>
              <input
                id="q-name"
                className="field"
                placeholder="Jordan Rivera"
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <label className="formlabel" htmlFor="q-email">Email</label>
              <input
                id="q-email"
                type="email"
                className="field"
                placeholder="you@email.com"
                value={state.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="qrow" style={{ marginTop: 12 }}>
            <div>
              <label className="formlabel" htmlFor="q-phone">Phone</label>
              <input
                id="q-phone"
                type="tel"
                className="field"
                placeholder="(813) 555-0199"
                value={state.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                required
              />
            </div>
            <div>
              <label className="formlabel" htmlFor="q-besttime">Best time to call</label>
              <select
                id="q-besttime"
                className="field"
                value={state.bestTime}
                onChange={(e) => update("bestTime", e.target.value)}
              >
                {bestTimeChoices.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="quote-summary">
            <h4>Your project</h4>
            <dl>
              <div><dt>What</dt><dd>{state.project}</dd></div>
              <div><dt>Budget</dt><dd>{state.budget}</dd></div>
              <div><dt>Timeline</dt><dd>{state.timeline}</dd></div>
              <div><dt>Location</dt><dd>{state.zip}{state.neighborhood ? ` · ${state.neighborhood}` : ""}</dd></div>
              <div><dt>Current dock</dt><dd>{state.currentDock}</dd></div>
            </dl>
          </div>
        </div>
      )}

      {/* honeypot */}
      <input
        type="text"
        name="_website"
        tabIndex={-1}
        autoComplete="off"
        value={state._website}
        onChange={(e) => update("_website", e.target.value)}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      {attempted[step] && stepErrors[step].length > 0 && (
        <div className="quote-error" role="alert" style={{ marginTop: 16 }}>
          <b>Please fix:</b>
          <ul style={{ margin: "6px 0 0 18px" }}>
            {stepErrors[step].map((e) => <li key={e}>{e}</li>)}
          </ul>
        </div>
      )}

      {status === "error" && (
        <div className="quote-error" role="alert" style={{ marginTop: 16 }}>
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}

      <div className="step-actions">
        {step > 1 ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={goBack}
            disabled={status === "submitting"}
          >
            ← Back
          </button>
        ) : <span />}

        {step < 3 ? (
          <button type="button" className="btn btn-coral" onClick={goNext}>
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-coral"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Match me with builders →"}
          </button>
        )}
      </div>

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
