import { NextResponse } from "next/server";
import site from "@/data/site.json";

/**
 * POST /api/newsletter
 *
 * Newsletter subscriptions. Same Web3Forms fallback pattern as /api/lead.
 * When wired to a real ESP (Beehiiv, ConvertKit, etc.), swap the Web3Forms
 * call for the ESP's API.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type Body = {
  name?: string;
  email?: string;
  _website?: string;
};

function isValidEmail(v: unknown): boolean {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request): Promise<NextResponse> {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body." }, { status: 400 });
  }

  if (body._website && body._website.length > 0) {
    return NextResponse.json({ success: true });
  }

  const name = (body.name ?? "").trim().slice(0, 100);
  const email = (body.email ?? "").trim().slice(0, 200);

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const key = process.env.WEB3FORMS_KEY;

  if (!key) {
    console.warn("[/api/newsletter] WEB3FORMS_KEY not set. Received but not forwarded.", {
      name,
      email,
    });
    return NextResponse.json({
      success: true,
      message: "Received (delivery not configured yet).",
    });
  }

  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `New newsletter subscriber: ${email}`,
        from_name: site.name,
        to: site.contact?.email,
        name,
        email,
        source: "newsletter",
        botcheck: "",
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (!res.ok || data.success === false) {
      throw new Error(data.message || `Web3Forms error ${res.status}`);
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/newsletter] Failed to forward:", err);
    return NextResponse.json(
      { success: false, message: "Could not subscribe you. Please email us directly." },
      { status: 502 },
    );
  }
}
