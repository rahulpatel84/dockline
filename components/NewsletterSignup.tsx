"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  submitLabel?: string;
  showName?: boolean;
  source?: string;
}

export function NewsletterSignup({
  submitLabel = "Send me Thursday's issue →",
  showName = true,
  source = "newsletter-page",
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source }),
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
      <div className="newsletter-success" role="status">
        <div className="quote-success-icon" style={{ margin: "0 auto 12px" }}>✓</div>
        <h3 style={{ color: "var(--ocean)", fontSize: "1.3rem", marginBottom: 8 }}>You&apos;re in.</h3>
        <p style={{ color: "var(--ink-soft)", margin: 0 }}>
          Check your inbox to confirm. First issue lands this Thursday at 7am ET.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="newsletter-form" noValidate>
      {showName && (
        <>
          <label htmlFor="nl-name" className="sr-only">First name</label>
          <input
            id="nl-name"
            name="name"
            placeholder="First name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
          />
        </>
      )}
      <label htmlFor="nl-email" className="sr-only">Email</label>
      <input
        id="nl-email"
        name="email"
        type="email"
        placeholder="you@email.com"
        className="field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <button
        type="submit"
        className="btn btn-coral"
        disabled={status === "submitting"}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {status === "submitting" ? "Sending…" : submitLabel}
      </button>
      {status === "error" && (
        <div className="quote-error" role="alert" style={{ marginTop: 10 }}>
          {errorMsg}
        </div>
      )}
    </form>
  );
}
