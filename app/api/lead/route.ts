import { NextResponse } from "next/server";
import site from "@/data/site.json";

/**
 * POST /api/lead
 *
 * Receives lead submissions from the multi-step quote form and any embedded
 * planning-kit forms. Validates, checks honeypot, and forwards to Web3Forms
 * if WEB3FORMS_KEY is set in the server environment. If not configured, logs
 * the submission and returns success so local development works.
 *
 * Body: JSON with at minimum { name, email }, plus any other fields.
 * Honeypot: "_website" field must be empty.
 * Response: { success: boolean, message?: string }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type LeadBody = {
  name?: string;
  email?: string;
  phone?: string;
  zip?: string;
  project?: string;
  budget?: string;
  timeline?: string;
  currentDock?: string;
  neighborhood?: string;
  bestTime?: string;
  source?: string;
  _website?: string;
};

function isValidEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidZip(value: unknown): boolean {
  if (typeof value !== "string" || value.length === 0) return true; // optional for planning kit
  return /^\d{5}(-\d{4})?$/.test(value);
}

function sanitize(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, 500);
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot — silently succeed so bots think they won
  if (body._website && body._website.length > 0) {
    return NextResponse.json({ success: true });
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email);
  const phone = sanitize(body.phone);
  const zip = sanitize(body.zip);
  const project = sanitize(body.project);
  const budget = sanitize(body.budget);
  const timeline = sanitize(body.timeline);
  const currentDock = sanitize(body.currentDock);
  const neighborhood = sanitize(body.neighborhood);
  const bestTime = sanitize(body.bestTime);
  const source = sanitize(body.source) || "quote-form";

  const errors: string[] = [];
  if (!name) errors.push("Name is required.");
  if (!isValidEmail(email)) errors.push("A valid email is required.");
  if (!isValidZip(zip)) errors.push("ZIP code must be 5 digits.");
  if (errors.length) {
    return NextResponse.json({ success: false, message: errors.join(" ") }, { status: 400 });
  }

  const key = process.env.WEB3FORMS_KEY;

  // No key configured — log server-side and return success (dev mode)
  if (!key) {
    console.warn("[/api/lead] WEB3FORMS_KEY not set. Submission received but not forwarded.", {
      source,
      name,
      email,
      phone,
      zip,
      project,
      budget,
    });
    return NextResponse.json({
      success: true,
      message: "Received (email delivery not configured yet).",
    });
  }

  const subject = source === "quote-form"
    ? `New dock lead: ${project || "Not specified"} in ${zip || "no ZIP"}`
    : `New ${source} signup: ${email}`;

  const payload = {
    access_key: key,
    subject,
    from_name: site.name,
    to: site.contact?.email,
    name,
    email,
    phone,
    zip,
    project,
    budget,
    timeline,
    currentDock,
    neighborhood,
    bestTime,
    source,
    botcheck: "",
  };

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Web3Forms error ${res.status}`);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/lead] Failed to forward:", err);
    return NextResponse.json(
      { success: false, message: "Could not deliver your submission. Please email us directly." },
      { status: 502 },
    );
  }
}
