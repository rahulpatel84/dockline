#!/usr/bin/env node
/**
 * MyDockGuide — Tampa Permit Checklist PDF generator.
 *
 * Emits public/downloads/tampa-permit-checklist.pdf using the brand kit
 * (teal, coral, sand + Fraunces-feel serif via Times / Hanken-feel sans via Helvetica).
 *
 * Regenerate whenever guide-assets.json colours or checklist content changes:
 *   node scripts/generate-permit-checklist.mjs
 */

import PDFDocument from "pdfkit";
import { createWriteStream, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// Brand tokens (mirror data/guide-assets.json)
const C = {
  teal: "#0c3b46",
  tealDark: "#062a34",
  aqua: "#3ab7c9",
  coral: "#ff6a5b",
  sand: "#faf5ec",
  sandDeep: "#f0e9d8",
  ink: "#0f1b1d",
  slate: "#5a6b6f",
  gold: "#e5a641",
  sea: "#3aa681",
  white: "#ffffff",
};

// Fonts — pdfkit built-ins that read closest to Fraunces / Hanken
const SERIF = "Times-Bold";
const SERIF_REG = "Times-Roman";
const SANS = "Helvetica";
const SANS_BOLD = "Helvetica-Bold";

const PAGE_W = 612;   // US Letter, 72 dpi
const PAGE_H = 792;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

const outDir = join(ROOT, "public/downloads");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "tampa-permit-checklist.pdf");

const doc = new PDFDocument({
  size: "LETTER",
  margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
  info: {
    Title: "Tampa Bay Dock Permit Checklist",
    Author: "MyDockGuide",
    Subject: "Agency-by-agency permit checklist for building a dock in Tampa Bay",
    Keywords: "tampa, dock, permit, checklist, hillsborough, pinellas, fdep, army corps",
    Creator: "MyDockGuide",
  },
});
doc.pipe(createWriteStream(outPath));

/* ── Helpers ────────────────────────────────────────────────────────────── */

function fillPage(color) {
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(color);
}

function drawWaveBand(y, height, color, opacity = 1) {
  doc.save().opacity(opacity).fillColor(color);
  const startX = 0;
  const endX = PAGE_W;
  const midY = y + height / 2;
  doc.moveTo(startX, midY);
  const points = 6;
  const step = (endX - startX) / points;
  for (let i = 0; i <= points; i++) {
    const x = startX + step * i;
    const controlOffset = i % 2 === 0 ? -8 : 8;
    doc.quadraticCurveTo(x - step / 2, midY + controlOffset, x, midY);
  }
  doc.lineTo(endX, y + height).lineTo(startX, y + height).closePath().fill();
  doc.restore();
}

function drawLogoMark(x, y, size = 22, tint = C.aqua) {
  // Simplified "dock-with-ruler" mark — teal square with a horizontal deck line + pilings
  doc.save();
  doc.roundedRect(x, y, size, size, size * 0.22).fill(C.teal);
  const inset = size * 0.18;
  const deckY = y + size * 0.58;
  doc.rect(x + inset, deckY, size - inset * 2, size * 0.09).fill(tint);
  const pW = size * 0.06;
  [0.28, 0.5, 0.72].forEach((p) => {
    doc.rect(x + size * p - pW / 2, deckY + size * 0.09, pW, size * 0.22).fill(tint);
  });
  // Ruler ticks along top
  for (let i = 0; i < 5; i++) {
    doc
      .rect(x + inset + i * ((size - inset * 2) / 4), y + size * 0.22, size * 0.02, size * 0.14)
      .fill(tint);
  }
  doc.restore();
}

function brandHeader(y = MARGIN - 12) {
  drawLogoMark(MARGIN, y, 22);
  doc
    .font(SERIF)
    .fontSize(13)
    .fillColor(C.teal)
    .text("MyDockGuide", MARGIN + 30, y + 4, { lineBreak: false });
  doc
    .font(SANS)
    .fontSize(8)
    .fillColor(C.slate)
    .text("TAMPA BAY DOCK GUIDE", PAGE_W - MARGIN - 140, y + 8, {
      width: 140,
      align: "right",
      characterSpacing: 2,
      lineBreak: false,
    });
}

function pageFooter(pageLabel) {
  const y = PAGE_H - MARGIN + 8;
  doc
    .strokeColor(C.sandDeep)
    .lineWidth(0.8)
    .moveTo(MARGIN, y - 8)
    .lineTo(PAGE_W - MARGIN, y - 8)
    .stroke();
  doc
    .font(SANS)
    .fontSize(8)
    .fillColor(C.slate)
    .text("mydockguide.com  ·  Tampa Permit Checklist  ·  v2026.1", MARGIN, y, {
      lineBreak: false,
    });
  doc
    .font(SANS_BOLD)
    .fontSize(8)
    .fillColor(C.teal)
    .text(pageLabel, PAGE_W - MARGIN - 60, y, {
      width: 60,
      align: "right",
      lineBreak: false,
    });
}

function ensureRoom(needed, currentPage) {
  if (doc.y + needed > PAGE_H - MARGIN - 24) {
    pageFooter(currentPage.label);
    doc.addPage();
    currentPage.n += 1;
    currentPage.label = `Page ${currentPage.n} of ${currentPage.total}`;
    brandHeader();
    doc.y = MARGIN + 30;
  }
}

/* ── COVER PAGE ─────────────────────────────────────────────────────────── */

fillPage(C.tealDark);

// Sunburst / accent circles top-right
doc.save().opacity(0.35).circle(PAGE_W - 60, 90, 130).fill(C.coral).restore();
doc.save().opacity(0.55).circle(PAGE_W - 60, 90, 90).fill(C.coral).restore();
doc.save().opacity(0.9).circle(PAGE_W - 60, 90, 45).fill(C.coral).restore();

// Small deck line at very top
doc.save().opacity(0.35).fillColor(C.sand);
doc.rect(0, 30, PAGE_W, 4).fill();
[80, 160, 240, 320, 400, 480].forEach((x) => {
  doc.rect(x, 34, 3, 22).fill();
});
doc.restore();

// Water waves bottom
drawWaveBand(560, 90, C.aqua, 0.28);
drawWaveBand(600, 90, C.aqua, 0.18);
drawWaveBand(640, 100, C.teal, 0.5);

// Eyebrow
doc
  .font(SANS_BOLD)
  .fontSize(11)
  .fillColor(C.coral)
  .text("PERMITS · REGULATIONS · TAMPA BAY", MARGIN, 150, {
    characterSpacing: 4,
    width: CONTENT_W,
  });

// Big title
doc
  .font(SERIF)
  .fontSize(46)
  .fillColor(C.sand)
  .text("The Tampa Bay", MARGIN, 190, { width: CONTENT_W });
doc
  .font(SERIF)
  .fontSize(46)
  .fillColor(C.sand)
  .text("Dock Permit", MARGIN, 238, { width: CONTENT_W });
doc
  .font(SERIF)
  .fontSize(46)
  .fillColor(C.coral)
  .text("Checklist.", MARGIN, 286, { width: CONTENT_W });

// Deck under title
doc
  .strokeColor(C.aqua)
  .lineWidth(3)
  .moveTo(MARGIN, 355)
  .lineTo(MARGIN + 110, 355)
  .stroke();

// Subtitle
doc
  .font(SERIF_REG)
  .fontSize(15)
  .fillColor(C.sand)
  .fillOpacity(0.9)
  .text(
    "Every agency, every fee, every deadline you need to hit before a piling driver rolls onto your property. Five agencies, one checklist.",
    MARGIN,
    380,
    { width: CONTENT_W - 40, lineGap: 4 },
  )
  .fillOpacity(1);

// Stat cards (three)
const cardY = 470;
const cardW = (CONTENT_W - 28) / 3;
const cards = [
  { stat: "5", label: "Agencies your dock touches" },
  { stat: "10–16", label: "Weeks, permits to piling" },
  { stat: "$2k–$5k", label: "Typical permit fees" },
];
cards.forEach((c, i) => {
  const cx = MARGIN + i * (cardW + 14);
  doc.roundedRect(cx, cardY, cardW, 82, 10).fillOpacity(0.12).fill(C.sand).fillOpacity(1);
  doc.roundedRect(cx, cardY, cardW, 82, 10).lineWidth(1).strokeOpacity(0.35).strokeColor(C.sand).stroke().strokeOpacity(1);
  doc
    .font(SERIF)
    .fontSize(28)
    .fillColor(C.coral)
    .text(c.stat, cx + 14, cardY + 14, { width: cardW - 28, lineBreak: false });
  doc
    .font(SANS)
    .fontSize(9)
    .fillColor(C.sand)
    .fillOpacity(0.85)
    .text(c.label, cx + 14, cardY + 52, {
      width: cardW - 28,
      characterSpacing: 1.5,
      lineGap: 2,
    })
    .fillOpacity(1);
});

// Footer of cover
doc
  .font(SANS)
  .fontSize(9)
  .fillColor(C.sand)
  .fillOpacity(0.75)
  .text("Prepared by MyDockGuide  ·  mydockguide.com", MARGIN, PAGE_H - MARGIN - 20, {
    width: CONTENT_W,
    lineBreak: false,
  });
doc
  .font(SANS_BOLD)
  .fontSize(9)
  .fillColor(C.coral)
  .text("2026 EDITION", PAGE_W - MARGIN - 110, PAGE_H - MARGIN - 20, {
    width: 110,
    align: "right",
    characterSpacing: 3,
    lineBreak: false,
  })
  .fillOpacity(1);

/* ── INTRO PAGE ─────────────────────────────────────────────────────────── */

doc.addPage();
fillPage(C.sand);
brandHeader();

doc.y = MARGIN + 40;

doc
  .font(SANS_BOLD)
  .fontSize(10)
  .fillColor(C.coral)
  .text("START HERE", MARGIN, doc.y, { characterSpacing: 3 });
doc.moveDown(0.3);
doc
  .font(SERIF)
  .fontSize(30)
  .fillColor(C.teal)
  .text("Read this before you file anything.", MARGIN, doc.y, {
    width: CONTENT_W,
  });
doc.moveDown(0.6);

doc
  .font(SERIF_REG)
  .fontSize(11.5)
  .fillColor(C.ink)
  .text(
    "Every private dock in Tampa Bay ends up in front of four to five separate offices. Miss any one and the entire project stalls. This checklist walks each agency in the order they actually matter — county first, federal last — with the fees, timelines, and gotchas we see kill applications every quarter.",
    MARGIN,
    doc.y,
    { width: CONTENT_W, lineGap: 4, align: "left" },
  );
doc.moveDown(1);

// How to use — coral card
const howY = doc.y + 6;
doc.roundedRect(MARGIN, howY, CONTENT_W, 138, 12).fill(C.sandDeep);
doc.roundedRect(MARGIN, howY, 5, 138).fill(C.coral);
doc
  .font(SERIF)
  .fontSize(16)
  .fillColor(C.teal)
  .text("How to use this checklist", MARGIN + 22, howY + 16, { width: CONTENT_W - 40 });
doc
  .font(SANS)
  .fontSize(10.5)
  .fillColor(C.ink)
  .fillOpacity(0.85);
const howItems = [
  "Work top to bottom. Later agencies almost always require documents from earlier ones.",
  "Tick each row as you complete it. If a row does not apply, cross it out and note why.",
  "Keep a folder with every stamped approval — you will need originals at final inspection.",
  "Do not assume your builder pulled a permit. Ask for the receipt on the day they promise it.",
];
howItems.forEach((t, i) => {
  const rowY = howY + 46 + i * 20;
  doc.circle(MARGIN + 32, rowY + 6, 3.2).fill(C.coral);
  doc
    .font(SANS)
    .fontSize(10.5)
    .fillColor(C.ink)
    .fillOpacity(0.85)
    .text(t, MARGIN + 44, rowY, { width: CONTENT_W - 60, lineBreak: false });
});
doc.fillOpacity(1);

// Timeline diagram (5 dots)
doc.y = howY + 138 + 28;
doc
  .font(SANS_BOLD)
  .fontSize(10)
  .fillColor(C.coral)
  .text("THE FIVE-AGENCY ORDER", MARGIN, doc.y, { characterSpacing: 3 });
doc.moveDown(0.4);
const steps = ["County Building", "County Env. (EPC)", "Florida DEP", "Army Corps", "HOA / CCRs"];
const dotY = doc.y + 20;
const spanW = CONTENT_W;
const gap = spanW / (steps.length - 1);
doc
  .strokeColor(C.aqua)
  .lineWidth(2)
  .moveTo(MARGIN, dotY)
  .lineTo(MARGIN + spanW, dotY)
  .stroke();
steps.forEach((s, i) => {
  const x = MARGIN + i * gap;
  doc.circle(x, dotY, 10).fill(C.teal);
  doc.circle(x, dotY, 5).fill(C.coral);
  doc
    .font(SANS_BOLD)
    .fontSize(9)
    .fillColor(C.teal)
    .text(String(i + 1), x - 20, dotY - 26, { width: 40, align: "center", lineBreak: false });
  doc
    .font(SANS)
    .fontSize(8.5)
    .fillColor(C.slate)
    .text(s, x - 55, dotY + 18, {
      width: 110,
      align: "center",
      lineBreak: true,
    });
});

pageFooter("Page 2 of 4");

/* ── CHECKLIST PAGES ────────────────────────────────────────────────────── */

const agencies = [
  {
    n: 1,
    title: "County Building Department",
    subtitle: "Hillsborough · Pinellas · Manatee · Sarasota · Pasco",
    tint: C.teal,
    fee: "$1,800 – $3,000",
    timeline: "4 – 12 weeks",
    intro:
      "The local permit that authorises construction on your property. Every Tampa Bay dock starts here.",
    items: [
      "Confirm the correct office by parcel: Hillsborough Building Services, Pinellas Building & Development Review, Manatee Building & Development Services, Sarasota Development Services, or Pasco Building Construction Services.",
      "Order a fresh boundary survey (< 12 months). Old surveys get rejected. Budget $800–$2,500.",
      "Site plan showing dock length, width, height, distance to property lines, and mean high water line.",
      "Structural drawings signed and sealed by a Florida-licensed engineer for anything over 500 sq ft or with a lift.",
      "Product-approval numbers for pilings, fasteners, and decking. Miami-Dade NOA numbers speed review.",
      "Notice of Commencement filed with the county Clerk of Court once permit is issued.",
    ],
  },
  {
    n: 2,
    title: "County Environmental Review",
    subtitle: "Hillsborough EPC (Pinellas rolls this into #1)",
    tint: C.sea,
    fee: "$250 – $700",
    timeline: "4 – 8 weeks (parallel to #1)",
    intro:
      "Hillsborough EPC layers on top of the building permit. Cares about seagrass, manatee zones, and shoreline change.",
    items: [
      "Seagrass survey by a qualified biologist if any part of the dock is within 100 ft of documented seagrass beds.",
      "Manatee protection plan referencing current Hillsborough / Pinellas MSA zones and construction windows.",
      "Turbidity control plan (silt curtains) for any in-water work.",
      "Confirmation that decking material meets EPC light-penetration guidelines (grated boards for wider than 4 ft).",
      "If in Pinellas, verify the county-consolidated permit already covers EPC-equivalent review.",
    ],
  },
  {
    n: 3,
    title: "Florida DEP (FDEP)",
    subtitle: "Sovereign submerged lands + state Environmental Resource Permit",
    tint: C.aqua,
    fee: "$420 – $1,000",
    timeline: "30 days (exempt) · 6 – 20 weeks (individual)",
    intro:
      "State agency that reviews every dock built over submerged lands. Most single-family docks qualify for an exemption or general permit.",
    items: [
      "Check exemption thresholds: ≤ 500 sq ft, ≤ 4 slips, single-family use, no boathouse, no fill.",
      "File the Notice of Intent to Use exemption online via the FDEP self-service portal.",
      "Sovereignty submerged lands consent form (required even when exempt from permitting).",
      "If over 500 sq ft or near seagrass, file for an Individual Environmental Resource Permit. Expect 6–20 weeks + biological survey.",
      "Save the exemption letter or ERP with your county submittal — the county will ask for it.",
    ],
  },
  {
    n: 4,
    title: "U.S. Army Corps of Engineers",
    subtitle: "Jacksonville District — federal navigable-waters review",
    tint: C.coral,
    fee: "No fee for Nationwide · $100 individual",
    timeline: "4 – 8 weeks (nationwide) · up to 24 weeks (individual)",
    intro:
      "Federal review for anything in navigable waters. Most Tampa Bay canals connecting to the Bay proper qualify.",
    items: [
      "Determine whether your dock fits Nationwide Permit 51 (recreational). Most single-family docks do.",
      "File the pre-construction notification (PCN) if the dock is over 32 ft long or in special aquatic sites.",
      "Include a plan-view drawing, elevation drawing, and location map with lat/long coordinates.",
      "Section 106 (historic) and Endangered Species Act consultation may be attached automatically — no action needed unless the Corps requests it.",
      "Individual Permit path: budget 3–6 months and an environmental assessment. Boat lifts and roofs often trigger this.",
    ],
  },
  {
    n: 5,
    title: "HOA & Deed Restrictions (CCRs)",
    subtitle: "The one that ambushes owners most often",
    tint: C.gold,
    fee: "Varies (usually $0 – $150 review)",
    timeline: "2 – 12 weeks depending on ARC meeting cadence",
    intro:
      "Not government, but functionally the strictest reviewer. Can shut a build down after construction has started.",
    items: [
      "Read the current CCRs cover to cover before you finalise dock design.",
      "Identify the Architectural Review Committee (ARC) and its meeting schedule — some meet quarterly.",
      "Submit dock length, width, height, lighting colour, decking material, and any lift or roof for approval.",
      "Confirm setback from side property lines and from any neighbouring dock.",
      "Get the ARC approval letter in writing on letterhead. A verbal approval from a board member is not enough.",
    ],
  },
];

const totalPages = 2 + Math.ceil(agencies.length / 2) + 1; // cover + intro + 3 checklist + closing
const currentPage = { n: 3, total: totalPages, label: `Page 3 of ${totalPages}` };

function renderAgency(a) {
  const startY = doc.y;
  // Section band
  doc.roundedRect(MARGIN, startY, CONTENT_W, 78, 10).fill(C.tealDark);
  doc.roundedRect(MARGIN, startY, 6, 78).fill(a.tint);

  // Number badge
  doc.circle(MARGIN + 40, startY + 39, 22).fill(a.tint);
  doc
    .font(SERIF)
    .fontSize(22)
    .fillColor(C.tealDark)
    .text(String(a.n), MARGIN + 26, startY + 25, {
      width: 28,
      align: "center",
      lineBreak: false,
    });

  // Title + subtitle
  doc
    .font(SERIF)
    .fontSize(17)
    .fillColor(C.sand)
    .text(a.title, MARGIN + 74, startY + 14, {
      width: CONTENT_W - 220,
      lineBreak: false,
    });
  doc
    .font(SANS)
    .fontSize(9)
    .fillColor(C.sand)
    .fillOpacity(0.7)
    .text(a.subtitle, MARGIN + 74, startY + 38, {
      width: CONTENT_W - 220,
      characterSpacing: 1,
      lineBreak: false,
    })
    .fillOpacity(1);

  // Fee / timeline chips
  const chipX = MARGIN + CONTENT_W - 175;
  doc
    .font(SANS)
    .fontSize(7.5)
    .fillColor(C.sand)
    .fillOpacity(0.55)
    .text("FEE RANGE", chipX, startY + 12, { characterSpacing: 2, lineBreak: false });
  doc
    .font(SERIF)
    .fontSize(13)
    .fillColor(C.coral)
    .fillOpacity(1)
    .text(a.fee, chipX, startY + 22, { width: 170, lineBreak: false });
  doc
    .font(SANS)
    .fontSize(7.5)
    .fillColor(C.sand)
    .fillOpacity(0.55)
    .text("TIMELINE", chipX, startY + 44, { characterSpacing: 2, lineBreak: false });
  doc
    .font(SERIF)
    .fontSize(11)
    .fillColor(C.sand)
    .fillOpacity(1)
    .text(a.timeline, chipX, startY + 54, { width: 170, lineBreak: false });

  doc.y = startY + 90;

  // Intro line
  doc
    .font(SERIF_REG)
    .fontSize(10.5)
    .fillColor(C.ink)
    .text(a.intro, MARGIN + 4, doc.y, { width: CONTENT_W - 8, lineGap: 3 });
  doc.moveDown(0.6);

  // Checklist rows
  a.items.forEach((it) => {
    const rowY = doc.y;
    doc.roundedRect(MARGIN + 4, rowY - 4, 16, 16, 3).lineWidth(1.2).strokeColor(a.tint).stroke();
    doc
      .font(SANS)
      .fontSize(10)
      .fillColor(C.ink)
      .fillOpacity(0.9)
      .text(it, MARGIN + 30, rowY, { width: CONTENT_W - 40, lineGap: 3 })
      .fillOpacity(1);
    doc.moveDown(0.55);
  });
  doc.moveDown(0.5);
}

// Two agencies per page (roughly)
doc.addPage();
fillPage(C.sand);
brandHeader();
doc.y = MARGIN + 30;

renderAgency(agencies[0]);
ensureRoom(220, currentPage);
renderAgency(agencies[1]);
pageFooter(currentPage.label);

// Page with agencies 3 + 4
doc.addPage();
currentPage.n += 1;
currentPage.label = `Page ${currentPage.n} of ${currentPage.total}`;
fillPage(C.sand);
brandHeader();
doc.y = MARGIN + 30;
renderAgency(agencies[2]);
ensureRoom(220, currentPage);
renderAgency(agencies[3]);
pageFooter(currentPage.label);

// Page with agency 5 + kill list + closing CTA
doc.addPage();
currentPage.n += 1;
currentPage.label = `Page ${currentPage.n} of ${currentPage.total}`;
fillPage(C.sand);
brandHeader();
doc.y = MARGIN + 30;
renderAgency(agencies[4]);

// Kill list block
doc.moveDown(0.6);
const killY = doc.y;
doc.roundedRect(MARGIN, killY, CONTENT_W, 168, 12).fill(C.tealDark);
doc
  .font(SANS_BOLD)
  .fontSize(10)
  .fillColor(C.coral)
  .text("THE FOUR THINGS THAT QUIETLY KILL APPLICATIONS", MARGIN + 20, killY + 18, {
    characterSpacing: 3,
    width: CONTENT_W - 40,
  });
doc
  .font(SERIF)
  .fontSize(16)
  .fillColor(C.sand)
  .text("Skip these and you restart from zero.", MARGIN + 20, killY + 38, {
    width: CONTENT_W - 40,
  });
const killItems = [
  "Assuming the quote covers permit fees — always ask for the line item.",
  "Skipping HOA review — post-construction teardown is expensive.",
  "Filing with a stale survey — under 12 months old, every time.",
  "Ignoring seagrass on aerial photos — reviewers can see what you can’t.",
];
killItems.forEach((t, i) => {
  const ry = killY + 78 + i * 20;
  doc.circle(MARGIN + 30, ry + 6, 3.5).fill(C.coral);
  doc
    .font(SANS)
    .fontSize(10)
    .fillColor(C.sand)
    .fillOpacity(0.9)
    .text(t, MARGIN + 44, ry, { width: CONTENT_W - 60, lineBreak: false })
    .fillOpacity(1);
});

// Closing CTA card
doc.y = killY + 168 + 20;
const ctaY = doc.y;
doc.roundedRect(MARGIN, ctaY, CONTENT_W, 118, 12).fill(C.sandDeep);
doc.roundedRect(MARGIN, ctaY, 5, 118).fill(C.coral);
doc
  .font(SERIF)
  .fontSize(18)
  .fillColor(C.teal)
  .text("Want a licensed builder to handle the paperwork?", MARGIN + 22, ctaY + 18, {
    width: CONTENT_W - 40,
  });
doc
  .font(SANS)
  .fontSize(10.5)
  .fillColor(C.ink)
  .fillOpacity(0.85)
  .text(
    "Most established Tampa marine contractors pull every permit as part of scope. Get up to three free quotes from vetted local builders who manage this end-to-end.",
    MARGIN + 22,
    ctaY + 50,
    { width: CONTENT_W - 40, lineGap: 3 },
  )
  .fillOpacity(1);
// Button-look CTA
const btnW = 210;
const btnH = 30;
doc.roundedRect(MARGIN + 22, ctaY + 118 - 44, btnW, btnH, btnH / 2).fill(C.coral);
doc
  .font(SANS_BOLD)
  .fontSize(11)
  .fillColor(C.white)
  .text("mydockguide.com/quote  →", MARGIN + 22, ctaY + 118 - 44 + 9, {
    width: btnW,
    align: "center",
    lineBreak: false,
  });

// Disclaimer at bottom
doc.y = ctaY + 118 + 18;
doc
  .font(SANS)
  .fontSize(7.5)
  .fillColor(C.slate)
  .text(
    "This checklist is general guidance based on 2026 Tampa Bay permitting practice, not legal advice. Rules and fees change — confirm with the relevant agency before you file. © 2026 MyDockGuide.",
    MARGIN,
    doc.y,
    { width: CONTENT_W, lineGap: 2 },
  );

pageFooter(currentPage.label);

doc.end();
doc.on("end", () => console.log(`✓ Wrote ${outPath}`));
