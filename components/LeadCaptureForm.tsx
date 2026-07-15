"use client";

import { useState } from "react";

const DEFAULT_PDF_PATH = "/tampa-dock-planning-kit.pdf";
const DEFAULT_PDF_LABEL = "Tampa Dock Planning Kit";

type Status = "idle" | "submitting" | "success" | "error";
type Variant = "inline" | "stacked";

interface LeadCaptureFormProps {
  /** Attribution string sent with the lead so we know which surface it came from. */
  source: string;
  /** Submit button label. */
  ctaText?: string;
  /** Placeholder for the email field (inline variant only). */
  placeholder?: string;
  /** Constrain form width. */
  maxWidth?: number | string;
  /** Message shown after successful submission. */
  successHeadline?: string;
  /** "inline" = email + button on one row; "stacked" = name + email + button vertically. */
  variant?: Variant;
  /** Force showing the first-name field. Auto-on for stacked, off for inline. */
  showName?: boolean;
  /** Skip opening any PDF on success (for surfaces that aren't asset-gated). */
  suppressPdf?: boolean;
  /** Path to the PDF asset to deliver on success. Defaults to the planning kit. */
  pdfPath?: string;
  /** Human-readable name of the PDF asset (shown in the success message). */
  pdfLabel?: string;
}

export function LeadCaptureForm({
  source,
  ctaText = "Send it",
  placeholder = "you@email.com",
  maxWidth,
  successHeadline = "Sent — check your inbox.",
  variant = "inline",
  showName,
  suppressPdf,
  pdfPath = DEFAULT_PDF_PATH,
  pdfLabel = DEFAULT_PDF_LABEL,
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const shouldShowName = showName ?? variant === "stacked";
  const wrapStyle = maxWidth ? { maxWidth } : undefined;

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
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Planning kit request",
          email: email.trim(),
          source,
          _website: website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (!res.ok || !data.success) throw new Error(data.message || `Submit failed (${res.status})`);
      setStatus("success");
      if (!suppressPdf && typeof window !== "undefined") {
        window.open(pdfPath, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="lead-success" role="status" style={wrapStyle}>
        <div className="lead-success-icon">✓</div>
        <div>
          <b>{successHeadline}</b>
          {!suppressPdf ? (
            <p>
              Your {pdfLabel} should have opened in a new tab. If your browser blocked it,{" "}
              <a href={pdfPath} target="_blank" rel="noopener noreferrer">
                download it here
              </a>
              .
            </p>
          ) : (
            <p>Add hello@mydockguide.com to your contacts so future emails don&apos;t land in spam.</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <form className="form-card" style={wrapStyle} onSubmit={submit} noValidate>
        {shouldShowName && (
          <>
            <label htmlFor={`lc-name-${source}`}>First name</label>
            <input
              id={`lc-name-${source}`}
              name="name"
              className="field"
              placeholder="Jordan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="given-name"
              disabled={status === "submitting"}
            />
          </>
        )}
        <label htmlFor={`lc-email-${source}`}>Email</label>
        <input
          id={`lc-email-${source}`}
          name="email"
          type="email"
          className="field"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          disabled={status === "submitting"}
        />
        <input
          type="text"
          name="_website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <button
          type="submit"
          className="btn btn-coral"
          disabled={status === "submitting"}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {status === "submitting" ? "Sending…" : ctaText}
        </button>
        {status === "error" && (
          <div className="lead-error" role="alert">
            {errorMsg}
          </div>
        )}
      </form>
    );
  }

  return (
    <>
      <form className="mini-form" style={wrapStyle} onSubmit={submit} noValidate>
        {shouldShowName && (
          <input
            name="name"
            placeholder="First name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="given-name"
            aria-label="First name"
            disabled={status === "submitting"}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email address"
          disabled={status === "submitting"}
        />
        <input
          type="text"
          name="_website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <button className="btn btn-coral" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : ctaText}
        </button>
      </form>
      {status === "error" && (
        <div className="lead-error" role="alert">
          {errorMsg || "Something went wrong. Please try again."}
        </div>
      )}
    </>
  );
}
