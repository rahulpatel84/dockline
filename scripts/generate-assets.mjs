#!/usr/bin/env node
/**
 * MyDockGuide asset generator (v2 — illustration-first)
 *
 * Each guide gets a rich, custom SVG illustration (not text on a gradient).
 * The illustration is designed once per guide and adapted to each aspect ratio.
 *
 * Emits per-guide SVG assets:
 *  - public/covers/<slug>.svg                    1200x630 open-graph cover (illustration only)
 *  - public/social/<slug>/instagram-square.svg   1080x1080 IG post (illustration + minimal brand)
 *  - public/social/<slug>/instagram-story.svg    1080x1920 IG story (illustration top, brand bottom)
 *  - public/social/<slug>/twitter-card.svg       1600x900 Twitter/X card (illustration only)
 *  - public/social/<slug>/pinterest.svg          1000x1500 Pinterest pin (illustration top, brand strip)
 *  - public/social/<slug>/carousel-<n>.svg       1080x1080 slides (illustration + slide caption)
 *
 * Runs at build time (or manually via `node scripts/generate-assets.mjs`).
 * SVGs are static; regenerate whenever guide-assets.json changes.
 */

import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const data = JSON.parse(
  await (await import("node:fs/promises")).readFile(join(ROOT, "data/guide-assets.json"), "utf8"),
);
const { brandTokens, guides } = data;

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/* ────────────────────────────────────────────────────────────────────────────
   SCENE LIBRARY
   Every guide has a `scene(colors)` function that returns SVG content designed
   for a 1200x630 viewport, transformable to any aspect ratio via <g transform>.
   ──────────────────────────────────────────────────────────────────────────── */

/* Reusable atoms */
const waterWaves = (color, opacity = 0.4) => `
  <g fill="${color}" fill-opacity="${opacity}">
    <path d="M0 470 Q 150 445 300 470 T 600 470 T 900 470 T 1200 470 L 1200 630 L 0 630 Z" />
  </g>
  <g fill="${color}" fill-opacity="${opacity * 0.6}">
    <path d="M0 490 Q 150 465 300 490 T 600 490 T 900 490 T 1200 490 L 1200 630 L 0 630 Z" />
  </g>`;

const sunburst = (cx, cy, r, color) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" fill-opacity="0.35" />
  <circle cx="${cx}" cy="${cy}" r="${r * 0.7}" fill="${color}" fill-opacity="0.55" />
  <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="${color}" fill-opacity="0.85" />`;

/* Scene 1 — Permits: a large tilted document with an approval stamp */
function scenePermit(c) {
  const { deep, primary, secondary, accent, ink } = c;
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(1050, 130, 140, secondary)}
    ${waterWaves(accent, 0.15)}

    <!-- Tilted document -->
    <g transform="translate(360 90) rotate(-8)">
      <rect x="0" y="0" width="480" height="600" rx="10" fill="${accent}" />
      <rect x="0" y="0" width="480" height="80" fill="${primary}" fill-opacity="0.85" />
      <text x="30" y="52" font-family="'Fraunces', serif" font-size="24" fill="${accent}" font-weight="700" letter-spacing="4">PERMIT · TAMPA BAY</text>

      <!-- form fields -->
      <g fill="${ink}" fill-opacity="0.15">
        <rect x="30" y="120" width="200" height="8" rx="4" />
        <rect x="30" y="140" width="360" height="16" rx="4" fill-opacity="0.08" />
        <rect x="30" y="180" width="180" height="8" rx="4" />
        <rect x="30" y="200" width="300" height="16" rx="4" fill-opacity="0.08" />
        <rect x="30" y="240" width="160" height="8" rx="4" />
        <rect x="30" y="260" width="380" height="16" rx="4" fill-opacity="0.08" />
        <rect x="30" y="300" width="220" height="8" rx="4" />
        <rect x="30" y="320" width="340" height="16" rx="4" fill-opacity="0.08" />
        <rect x="30" y="360" width="180" height="8" rx="4" />
        <rect x="30" y="380" width="260" height="16" rx="4" fill-opacity="0.08" />
      </g>

      <!-- signature line -->
      <line x1="30" y1="530" x2="240" y2="530" stroke="${ink}" stroke-opacity="0.4" stroke-width="2" />
      <text x="30" y="555" font-family="'Hanken Grotesk', sans-serif" font-size="12" fill="${ink}" fill-opacity="0.5">FDEP · ACOE · COUNTY</text>
    </g>

    <!-- Approval stamp -->
    <g transform="translate(760 340) rotate(-14)">
      <circle cx="0" cy="0" r="120" fill="none" stroke="${secondary}" stroke-width="8" />
      <circle cx="0" cy="0" r="95" fill="none" stroke="${secondary}" stroke-width="3" />
      <text x="0" y="-12" font-family="'Fraunces', serif" font-size="34" fill="${secondary}" font-weight="900" text-anchor="middle" letter-spacing="4">APPROVED</text>
      <text x="0" y="20" font-family="'Hanken Grotesk', sans-serif" font-size="14" fill="${secondary}" font-weight="700" text-anchor="middle" letter-spacing="3">HILLSBOROUGH · 2026</text>
      <path d="M -60 45 L 60 45" stroke="${secondary}" stroke-width="2" />
    </g>

    <!-- Small dock silhouette at bottom -->
    <g transform="translate(0 490)" fill="${accent}" fill-opacity="0.45">
      <rect x="0" y="20" width="1200" height="6" />
      <rect x="80" y="0" width="4" height="30" />
      <rect x="140" y="0" width="4" height="30" />
      <rect x="200" y="0" width="4" height="30" />
      <rect x="60" y="-4" width="180" height="6" />
    </g>`;
}

/* Scene 2 — Cost: dock illustration with hanging price tag and coin stack */
function scenePrice(c) {
  const { deep, primary, secondary, accent, ink, warn } = c;
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(180, 130, 130, secondary)}
    ${waterWaves(accent, 0.2)}

    <!-- Sky glow -->
    <ellipse cx="600" cy="100" rx="600" ry="150" fill="${secondary}" fill-opacity="0.15" />

    <!-- Big dock in perspective -->
    <g>
      <!-- deck boards receding -->
      <path d="M 250 380 L 950 380 L 850 420 L 350 420 Z" fill="${accent}" fill-opacity="0.9" />
      <path d="M 250 380 L 950 380 L 950 385 L 250 385 Z" fill="${ink}" fill-opacity="0.15" />
      <line x1="330" y1="380" x2="360" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="410" y1="380" x2="430" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="490" y1="380" x2="500" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="570" y1="380" x2="575" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="650" y1="380" x2="650" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="730" y1="380" x2="720" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="810" y1="380" x2="795" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <line x1="890" y1="380" x2="870" y2="420" stroke="${ink}" stroke-opacity="0.3" stroke-width="2" />
      <!-- pilings -->
      <rect x="320" y="385" width="12" height="150" fill="${ink}" fill-opacity="0.55" />
      <rect x="480" y="385" width="12" height="150" fill="${ink}" fill-opacity="0.55" />
      <rect x="640" y="385" width="12" height="150" fill="${ink}" fill-opacity="0.55" />
      <rect x="800" y="385" width="12" height="150" fill="${ink}" fill-opacity="0.55" />
      <rect x="920" y="385" width="10" height="150" fill="${ink}" fill-opacity="0.55" />
    </g>

    <!-- Hanging price tag -->
    <g transform="translate(730 100)">
      <line x1="0" y1="0" x2="0" y2="60" stroke="${accent}" stroke-width="3" />
      <g transform="translate(-140 60) rotate(-6)">
        <path d="M 0 0 L 200 0 L 240 60 L 200 120 L 0 120 Z" fill="${warn}" />
        <circle cx="20" cy="60" r="10" fill="${deep}" />
        <text x="130" y="55" font-family="'Fraunces', serif" font-size="42" fill="${deep}" font-weight="900" text-anchor="middle">$15k</text>
        <text x="130" y="88" font-family="'Hanken Grotesk', sans-serif" font-size="14" fill="${deep}" font-weight="700" text-anchor="middle" letter-spacing="2">MEDIAN</text>
      </g>
    </g>

    <!-- Coin stack -->
    <g transform="translate(1000 400)">
      <ellipse cx="0" cy="120" rx="80" ry="15" fill="${warn}" />
      <rect x="-80" y="90" width="160" height="30" fill="${warn}" />
      <ellipse cx="0" cy="90" rx="80" ry="15" fill="${secondary}" />
      <rect x="-75" y="65" width="150" height="25" fill="${secondary}" />
      <ellipse cx="0" cy="65" rx="75" ry="14" fill="${warn}" />
      <rect x="-70" y="42" width="140" height="23" fill="${warn}" />
      <ellipse cx="0" cy="42" rx="70" ry="13" fill="${secondary}" />
      <text x="0" y="50" font-family="'Fraunces', serif" font-size="28" fill="${deep}" font-weight="900" text-anchor="middle">$</text>
    </g>`;
}

/* Scene 3 — Floating vs Fixed: split composition */
function sceneCompare(c) {
  const { deep, primary, secondary, accent, ink } = c;
  return `
    <rect width="1200" height="630" fill="${deep}" />
    <ellipse cx="600" cy="60" rx="700" ry="100" fill="${secondary}" fill-opacity="0.2" />

    <!-- Water line -->
    <rect x="0" y="360" width="1200" height="270" fill="${primary}" fill-opacity="0.35" />
    ${waterWaves(accent, 0.15)}

    <!-- Left: floating dock -->
    <g>
      <!-- floats -->
      <g fill="${accent}" fill-opacity="0.9">
        <rect x="80" y="340" width="80" height="40" rx="8" />
        <rect x="200" y="340" width="80" height="40" rx="8" />
        <rect x="320" y="340" width="80" height="40" rx="8" />
      </g>
      <!-- deck on floats -->
      <rect x="60" y="310" width="360" height="35" fill="${accent}" />
      <g stroke="${ink}" stroke-opacity="0.25" stroke-width="1.5">
        <line x1="120" y1="310" x2="120" y2="345" />
        <line x1="180" y1="310" x2="180" y2="345" />
        <line x1="240" y1="310" x2="240" y2="345" />
        <line x1="300" y1="310" x2="300" y2="345" />
        <line x1="360" y1="310" x2="360" y2="345" />
      </g>
      <!-- ramp to shore -->
      <path d="M 60 310 L 20 260 L 20 285 L 60 335 Z" fill="${accent}" fill-opacity="0.7" />
      <!-- label badge -->
      <g transform="translate(180 240)">
        <rect x="-70" y="0" width="140" height="34" rx="17" fill="${secondary}" />
        <text x="0" y="23" font-family="'Fraunces', serif" font-size="18" fill="${deep}" font-weight="800" text-anchor="middle">FLOATING</text>
      </g>
    </g>

    <!-- Vertical divider -->
    <line x1="600" y1="130" x2="600" y2="510" stroke="${accent}" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="8 6" />
    <g transform="translate(600 320)">
      <circle r="40" fill="${deep}" stroke="${accent}" stroke-width="3" />
      <text y="12" font-family="'Fraunces', serif" font-size="30" fill="${accent}" font-weight="900" text-anchor="middle">VS</text>
    </g>

    <!-- Right: fixed dock -->
    <g>
      <!-- deck -->
      <rect x="700" y="285" width="440" height="30" fill="${accent}" />
      <g stroke="${ink}" stroke-opacity="0.25" stroke-width="1.5">
        <line x1="760" y1="285" x2="760" y2="315" />
        <line x1="820" y1="285" x2="820" y2="315" />
        <line x1="880" y1="285" x2="880" y2="315" />
        <line x1="940" y1="285" x2="940" y2="315" />
        <line x1="1000" y1="285" x2="1000" y2="315" />
        <line x1="1060" y1="285" x2="1060" y2="315" />
      </g>
      <!-- tall pilings -->
      <rect x="740" y="315" width="14" height="220" fill="${ink}" fill-opacity="0.7" />
      <rect x="880" y="315" width="14" height="220" fill="${ink}" fill-opacity="0.7" />
      <rect x="1020" y="315" width="14" height="220" fill="${ink}" fill-opacity="0.7" />
      <rect x="1120" y="315" width="14" height="220" fill="${ink}" fill-opacity="0.7" />
      <!-- label badge -->
      <g transform="translate(910 220)">
        <rect x="-56" y="0" width="112" height="34" rx="17" fill="${accent}" />
        <text x="0" y="23" font-family="'Fraunces', serif" font-size="18" fill="${deep}" font-weight="800" text-anchor="middle">FIXED</text>
      </g>
    </g>`;
}

/* Scene 4 — Materials: 4 stacked deck samples with distinct textures */
function sceneMaterials(c) {
  const { deep, primary, secondary, accent, ink, warn } = c;
  const samples = [
    { name: "PRESSURE-TREATED", fill: "#a97a4c", grain: "wood", label: "$28/sqft · 10-15 yrs" },
    { name: "COMPOSITE", fill: "#8a9a8e", grain: "dots", label: "$55/sqft · 25-30 yrs" },
    { name: "IPE HARDWOOD", fill: "#6b3820", grain: "streak", label: "$78/sqft · 40+ yrs" },
    { name: "ALUMINUM", fill: "#b5c1c5", grain: "ridge", label: "$62/sqft · 40+ yrs" },
  ];
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(1050, 100, 100, secondary)}
    ${waterWaves(accent, 0.1)}

    <!-- Header ribbon -->
    <g transform="translate(60 40)">
      <text font-family="'Fraunces', serif" font-size="32" fill="${accent}" font-weight="900" letter-spacing="1">4 Materials</text>
      <text y="30" font-family="'Hanken Grotesk', sans-serif" font-size="16" fill="${accent}" fill-opacity="0.7" letter-spacing="3">TAMPA BAY SALTWATER TESTED</text>
    </g>

    ${samples
      .map((s, i) => {
        const y = 130 + i * 105;
        let grainSvg = "";
        if (s.grain === "wood") {
          grainSvg = `
            <path d="M 40 20 Q 200 15 400 22 T 800 20" stroke="${ink}" stroke-opacity="0.3" stroke-width="1.5" fill="none" />
            <path d="M 60 40 Q 200 36 400 42 T 800 40" stroke="${ink}" stroke-opacity="0.25" stroke-width="1" fill="none" />
            <path d="M 100 60 Q 260 56 440 62 T 800 58" stroke="${ink}" stroke-opacity="0.2" stroke-width="1" fill="none" />`;
        } else if (s.grain === "dots") {
          grainSvg = Array.from({ length: 40 }, (_, k) => {
            const x = 40 + (k * 20) % 780;
            const yy = 15 + Math.floor((k * 20) / 780) * 20;
            return `<circle cx="${x}" cy="${yy}" r="1.6" fill="${ink}" fill-opacity="0.3" />`;
          }).join("");
        } else if (s.grain === "streak") {
          grainSvg = `
            <path d="M 40 25 Q 300 40 800 20" stroke="${ink}" stroke-opacity="0.35" stroke-width="2" fill="none" />
            <path d="M 40 50 Q 400 30 800 55" stroke="${ink}" stroke-opacity="0.25" stroke-width="1.5" fill="none" />
            <path d="M 40 70 Q 250 60 800 75" stroke="${ink}" stroke-opacity="0.3" stroke-width="1.5" fill="none" />`;
        } else {
          grainSvg = Array.from({ length: 15 }, (_, k) => {
            const x = 50 + k * 50;
            return `<line x1="${x}" y1="10" x2="${x}" y2="80" stroke="${ink}" stroke-opacity="0.2" stroke-width="1" />`;
          }).join("");
        }
        return `
        <g transform="translate(60 ${y})">
          <rect x="0" y="0" width="880" height="88" rx="6" fill="${s.fill}" />
          <g>${grainSvg}</g>
          <rect x="0" y="0" width="880" height="88" rx="6" fill="none" stroke="${ink}" stroke-opacity="0.2" stroke-width="1" />
          <!-- side label -->
          <g transform="translate(920 20)">
            <text font-family="'Fraunces', serif" font-size="18" fill="${accent}" font-weight="800">${s.name}</text>
            <text y="26" font-family="'Hanken Grotesk', sans-serif" font-size="14" fill="${accent}" fill-opacity="0.75">${s.label}</text>
          </g>
        </g>`;
      })
      .join("")}`;
}

/* Scene 5 — Seawall cross-section: educational infographic */
function sceneSeawall(c) {
  const { deep, primary, secondary, accent, ink, warn } = c;
  return `
    <rect width="1200" height="630" fill="${deep}" />
    <!-- sky -->
    <rect x="0" y="0" width="1200" height="200" fill="${secondary}" fill-opacity="0.25" />

    <!-- ground level line -->
    <line x1="0" y1="200" x2="1200" y2="200" stroke="${accent}" stroke-opacity="0.3" stroke-width="1" stroke-dasharray="4 6" />

    <!-- LAND (left half) -->
    <g>
      <path d="M 0 200 L 600 200 L 600 470 L 0 470 Z" fill="#8a5a35" fill-opacity="0.9" />
      <!-- grass -->
      <rect x="0" y="195" width="600" height="8" fill="#3aa681" />
      <!-- soil layers -->
      <path d="M 0 240 L 600 240" stroke="${ink}" stroke-opacity="0.15" stroke-width="1" />
      <path d="M 0 300 L 600 300" stroke="${ink}" stroke-opacity="0.15" stroke-width="1" />
      <path d="M 0 380 L 600 380" stroke="${ink}" stroke-opacity="0.15" stroke-width="1" />
      <!-- pebbles -->
      <g fill="${ink}" fill-opacity="0.25">
        <circle cx="80" cy="260" r="4" />
        <circle cx="200" cy="330" r="5" />
        <circle cx="350" cy="410" r="4" />
        <circle cx="480" cy="360" r="6" />
        <circle cx="150" cy="440" r="3" />
      </g>

      <!-- house on land -->
      <g transform="translate(100 130)">
        <path d="M 0 0 L 60 -50 L 120 0 L 120 65 L 0 65 Z" fill="${accent}" fill-opacity="0.9" />
        <rect x="45" y="30" width="30" height="35" fill="${primary}" />
        <rect x="10" y="10" width="25" height="18" fill="${primary}" fill-opacity="0.6" />
        <rect x="85" y="10" width="25" height="18" fill="${primary}" fill-opacity="0.6" />
      </g>
    </g>

    <!-- SEAWALL (vertical wall) -->
    <g>
      <!-- vinyl panels -->
      <g fill="${accent}" stroke="${ink}" stroke-opacity="0.2" stroke-width="1.5">
        <rect x="600" y="180" width="20" height="290" />
        <rect x="620" y="180" width="20" height="290" />
        <rect x="640" y="180" width="20" height="290" />
        <rect x="660" y="180" width="20" height="290" />
      </g>
      <!-- cap on top -->
      <rect x="590" y="170" width="100" height="22" fill="${secondary}" />
      <!-- tieback lines -->
      <g stroke="${warn}" stroke-width="3">
        <line x1="600" y1="230" x2="440" y2="290" />
        <circle cx="440" cy="290" r="8" fill="${warn}" />
        <line x1="600" y1="280" x2="440" y2="340" />
        <circle cx="440" cy="340" r="8" fill="${warn}" />
      </g>
      <text x="450" y="270" font-family="'Hanken Grotesk', sans-serif" font-size="13" fill="${warn}" font-weight="700">TIEBACKS</text>
    </g>

    <!-- WATER (right half) -->
    <g>
      <path d="M 690 200 L 1200 200 L 1200 630 L 690 630 Z" fill="${primary}" fill-opacity="0.5" />
      ${waterWaves(accent, 0.25)}
      <!-- fish -->
      <g transform="translate(900 380)" fill="${accent}" fill-opacity="0.7">
        <path d="M 0 0 Q 20 -8 40 0 Q 20 8 0 0 Z" />
        <path d="M -8 0 L -18 -8 L -18 8 Z" />
        <circle cx="30" cy="-2" r="2" fill="${deep}" />
      </g>
      <!-- water depth arrows -->
      <g stroke="${accent}" stroke-opacity="0.4" stroke-width="2">
        <line x1="1100" y1="220" x2="1100" y2="450" />
        <path d="M 1094 220 L 1100 210 L 1106 220" fill="${accent}" fill-opacity="0.5" />
        <path d="M 1094 450 L 1100 460 L 1106 450" fill="${accent}" fill-opacity="0.5" />
      </g>
      <text x="1130" y="340" font-family="'Fraunces', serif" font-size="18" fill="${accent}" font-weight="700">6 ft</text>
    </g>

    <!-- CAP label -->
    <text x="695" y="163" font-family="'Hanken Grotesk', sans-serif" font-size="13" fill="${secondary}" font-weight="700">CAP</text>`;
}

/* Scene 6 — Home Value: house + dock with upward chart */
function sceneHomeValue(c) {
  const { deep, primary, secondary, accent, ink, warn, success } = c;
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(180, 130, 120, secondary)}

    <!-- Water bottom -->
    <rect x="0" y="410" width="1200" height="220" fill="${primary}" fill-opacity="0.35" />
    ${waterWaves(accent, 0.15)}

    <!-- House on left -->
    <g transform="translate(150 180)">
      <!-- roof -->
      <path d="M 0 0 L 120 -80 L 240 0 Z" fill="${accent}" />
      <!-- body -->
      <rect x="0" y="0" width="240" height="200" fill="${accent}" fill-opacity="0.92" />
      <!-- door -->
      <rect x="95" y="120" width="50" height="80" fill="${primary}" />
      <circle cx="135" cy="160" r="3" fill="${warn}" />
      <!-- windows -->
      <rect x="20" y="30" width="55" height="55" fill="${primary}" />
      <line x1="47" y1="30" x2="47" y2="85" stroke="${accent}" stroke-width="2" />
      <line x1="20" y1="57" x2="75" y2="57" stroke="${accent}" stroke-width="2" />
      <rect x="165" y="30" width="55" height="55" fill="${primary}" />
      <line x1="192" y1="30" x2="192" y2="85" stroke="${accent}" stroke-width="2" />
      <line x1="165" y1="57" x2="220" y2="57" stroke="${accent}" stroke-width="2" />
    </g>

    <!-- Dock extending right from house -->
    <g>
      <rect x="380" y="395" width="500" height="20" fill="${accent}" />
      <rect x="410" y="415" width="6" height="60" fill="${ink}" fill-opacity="0.6" />
      <rect x="510" y="415" width="6" height="60" fill="${ink}" fill-opacity="0.6" />
      <rect x="610" y="415" width="6" height="60" fill="${ink}" fill-opacity="0.6" />
      <rect x="710" y="415" width="6" height="60" fill="${ink}" fill-opacity="0.6" />
      <rect x="810" y="415" width="6" height="60" fill="${ink}" fill-opacity="0.6" />
      <rect x="870" y="415" width="6" height="60" fill="${ink}" fill-opacity="0.6" />
      <!-- Boat at end -->
      <g transform="translate(830 355)">
        <path d="M 0 30 Q 40 60 100 30 L 90 40 L 10 40 Z" fill="${warn}" />
        <rect x="20" y="10" width="60" height="20" rx="3" fill="${accent}" />
        <rect x="35" y="-15" width="10" height="25" fill="${ink}" fill-opacity="0.6" />
      </g>
    </g>

    <!-- Ascending value arrow (big) -->
    <g transform="translate(960 100)">
      <!-- bars ascending -->
      <g fill="${success}">
        <rect x="0" y="220" width="40" height="80" />
        <rect x="55" y="180" width="40" height="120" />
        <rect x="110" y="120" width="40" height="180" />
        <rect x="165" y="50" width="40" height="250" />
      </g>
      <!-- arrow going up-right through bars -->
      <path d="M 5 265 L 205 40" stroke="${warn}" stroke-width="8" fill="none" stroke-linecap="round" />
      <path d="M 205 40 L 175 40 L 205 40 L 205 70" stroke="${warn}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <polygon points="205,40 175,40 195,10 235,50 205,70" fill="${warn}" />
    </g>

    <!-- Dollar sign floating -->
    <g transform="translate(1000 380)">
      <circle r="42" fill="${warn}" />
      <text y="15" font-family="'Fraunces', serif" font-size="52" fill="${deep}" font-weight="900" text-anchor="middle">$</text>
    </g>`;
}

/* Scene 7 — 12 Questions: clipboard with numbered checklist */
function sceneChecklist(c) {
  const { deep, primary, secondary, accent, ink, warn } = c;
  const items = [
    { done: true, text: "Licensed marine contractor?" },
    { done: true, text: "12 mo Tampa Bay project count" },
    { done: true, text: "Three references in your ZIP" },
    { done: false, text: "Line-item quote in writing" },
    { done: true, text: "316 stainless fasteners" },
    { done: false, text: "Concrete pilings for lift" },
    { done: true, text: "Permits included in scope" },
  ];
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(1050, 100, 120, secondary)}
    ${waterWaves(accent, 0.12)}

    <!-- Big clipboard, slightly tilted -->
    <g transform="translate(220 60) rotate(-4)">
      <!-- clipboard back -->
      <rect x="0" y="0" width="580" height="540" rx="12" fill="#8a5a35" />
      <rect x="0" y="0" width="580" height="540" rx="12" fill="${ink}" fill-opacity="0.1" />
      <!-- clip -->
      <rect x="220" y="-25" width="140" height="50" rx="10" fill="${ink}" fill-opacity="0.55" />
      <rect x="240" y="-30" width="100" height="20" rx="6" fill="${ink}" fill-opacity="0.8" />
      <!-- paper -->
      <rect x="20" y="30" width="540" height="490" fill="${accent}" />

      <!-- title -->
      <text x="50" y="80" font-family="'Fraunces', serif" font-size="26" fill="${deep}" font-weight="900">Vetting checklist</text>
      <line x1="50" y1="95" x2="180" y2="95" stroke="${warn}" stroke-width="4" />

      <!-- checklist rows -->
      ${items
        .map((it, i) => {
          const y = 140 + i * 52;
          const box = it.done
            ? `<g><rect x="50" y="${y - 20}" width="28" height="28" rx="4" fill="${warn}" /><path d="M 56 ${y - 5} l 8 8 l 12 -14" stroke="${accent}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" /></g>`
            : `<rect x="50" y="${y - 20}" width="28" height="28" rx="4" fill="none" stroke="${ink}" stroke-width="2.5" />`;
          return `
            <g>
              <text x="18" y="${y}" font-family="'Fraunces', serif" font-size="20" fill="${primary}" font-weight="800">${i + 1}</text>
              ${box}
              <text x="95" y="${y}" font-family="'Hanken Grotesk', sans-serif" font-size="18" fill="${deep}" fill-opacity="0.85">${escapeXml(it.text)}</text>
            </g>`;
        })
        .join("")}
    </g>

    <!-- Pen -->
    <g transform="translate(880 380) rotate(30)">
      <rect x="0" y="0" width="180" height="16" rx="4" fill="${warn}" />
      <path d="M 0 0 L -22 8 L 0 16 Z" fill="${ink}" fill-opacity="0.85" />
      <rect x="150" y="0" width="30" height="16" rx="4" fill="${secondary}" />
    </g>

    <!-- Big question mark -->
    <g transform="translate(920 140)" opacity="0.75">
      <circle r="55" fill="${warn}" fill-opacity="0.9" />
      <text y="22" font-family="'Fraunces', serif" font-size="80" fill="${deep}" font-weight="900" text-anchor="middle">?</text>
    </g>`;
}

/* Scene 8 — Quote breakdown: long receipt with line items */
function sceneReceipt(c) {
  const { deep, primary, secondary, accent, ink, warn } = c;
  const items = [
    { label: "Decking + framing", amount: "$8,200" },
    { label: "Pilings (8x concrete)", amount: "$6,240" },
    { label: "Labor + installation", amount: "$6,800" },
    { label: "Boundary survey", amount: "MISSING", missing: true },
    { label: "Permits (county+FDEP)", amount: "MISSING", missing: true },
    { label: "Electrical run", amount: "MISSING", missing: true },
    { label: "Mobilization", amount: "$3,500" },
  ];
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(200, 100, 110, secondary)}
    ${waterWaves(accent, 0.12)}

    <!-- Long receipt scroll -->
    <g transform="translate(340 40) rotate(-5)">
      <!-- serrated top -->
      <path d="M 0 0 L 20 -10 L 40 0 L 60 -10 L 80 0 L 100 -10 L 120 0 L 140 -10 L 160 0 L 180 -10 L 200 0 L 220 -10 L 240 0 L 260 -10 L 280 0 L 300 -10 L 320 0 L 340 -10 L 360 0 L 380 -10 L 400 0 L 420 -10 L 440 0 L 460 -10 L 480 0 L 500 -10 L 520 0" fill="${accent}" />
      <rect x="0" y="0" width="520" height="560" fill="${accent}" />
      <!-- serrated bottom -->
      <path d="M 0 560 L 20 570 L 40 560 L 60 570 L 80 560 L 100 570 L 120 560 L 140 570 L 160 560 L 180 570 L 200 560 L 220 570 L 240 560 L 260 570 L 280 560 L 300 570 L 320 560 L 340 570 L 360 560 L 380 570 L 400 560 L 420 570 L 440 560 L 460 570 L 480 560 L 500 570 L 520 560" fill="${accent}" />

      <!-- Receipt header -->
      <text x="260" y="50" font-family="'Fraunces', serif" font-size="28" fill="${primary}" font-weight="900" text-anchor="middle">DOCK QUOTE</text>
      <text x="260" y="72" font-family="'Hanken Grotesk', sans-serif" font-size="12" fill="${primary}" fill-opacity="0.6" text-anchor="middle" letter-spacing="3">TAMPA · 40 x 6 · COMPOSITE</text>
      <line x1="30" y1="90" x2="490" y2="90" stroke="${primary}" stroke-opacity="0.25" stroke-width="1" stroke-dasharray="4 4" />

      <!-- Line items -->
      ${items
        .map((it, i) => {
          const y = 130 + i * 55;
          const isMissing = it.missing;
          return `
            <g>
              <text x="30" y="${y}" font-family="'Hanken Grotesk', sans-serif" font-size="17" fill="${primary}" font-weight="600">${escapeXml(it.label)}</text>
              <text x="490" y="${y}" font-family="'Fraunces', serif" font-size="${isMissing ? 15 : 22}" fill="${isMissing ? warn : primary}" font-weight="800" text-anchor="end">${it.amount}</text>
              ${isMissing ? `<rect x="380" y="${y - 20}" width="130" height="26" fill="${warn}" fill-opacity="0.15" rx="4" />` : ""}
              <line x1="30" y1="${y + 12}" x2="490" y2="${y + 12}" stroke="${primary}" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="2 3" />
            </g>`;
        })
        .join("")}

      <!-- Highlighter marks over MISSING items -->
      <g fill="${warn}" fill-opacity="0.35">
        <rect x="20" y="235" width="500" height="30" rx="3" />
        <rect x="20" y="290" width="500" height="30" rx="3" />
        <rect x="20" y="345" width="500" height="30" rx="3" />
      </g>

      <!-- total -->
      <text x="30" y="510" font-family="'Fraunces', serif" font-size="22" fill="${primary}" font-weight="900">Total shown</text>
      <text x="490" y="510" font-family="'Fraunces', serif" font-size="30" fill="${primary}" font-weight="900" text-anchor="end">$24,740</text>
      <text x="30" y="540" font-family="'Hanken Grotesk', sans-serif" font-size="14" fill="${warn}" font-weight="700">+ $6,200 hidden</text>
    </g>

    <!-- Highlighter marker -->
    <g transform="translate(880 340) rotate(-25)">
      <rect x="0" y="0" width="180" height="30" rx="4" fill="${warn}" />
      <path d="M 180 0 L 220 15 L 180 30 Z" fill="${warn}" />
      <rect x="0" y="0" width="30" height="30" rx="4" fill="${ink}" fill-opacity="0.6" />
    </g>`;
}

/* Scene 9 — Ready to Build: dock under construction */
function sceneConstruction(c) {
  const { deep, primary, secondary, accent, ink, warn, success } = c;
  return `
    <rect width="1200" height="630" fill="${deep}" />
    ${sunburst(180, 110, 120, secondary)}
    <ellipse cx="600" cy="70" rx="700" ry="130" fill="${secondary}" fill-opacity="0.15" />

    <!-- water -->
    <rect x="0" y="360" width="1200" height="270" fill="${primary}" fill-opacity="0.35" />
    ${waterWaves(accent, 0.2)}

    <!-- Left: finished dock section -->
    <g>
      <rect x="0" y="340" width="480" height="25" fill="${accent}" />
      <g stroke="${ink}" stroke-opacity="0.28" stroke-width="1.5">
        <line x1="60" y1="340" x2="60" y2="365" />
        <line x1="120" y1="340" x2="120" y2="365" />
        <line x1="180" y1="340" x2="180" y2="365" />
        <line x1="240" y1="340" x2="240" y2="365" />
        <line x1="300" y1="340" x2="300" y2="365" />
        <line x1="360" y1="340" x2="360" y2="365" />
        <line x1="420" y1="340" x2="420" y2="365" />
      </g>
      <rect x="70" y="365" width="10" height="180" fill="${ink}" fill-opacity="0.65" />
      <rect x="230" y="365" width="10" height="180" fill="${ink}" fill-opacity="0.65" />
      <rect x="390" y="365" width="10" height="180" fill="${ink}" fill-opacity="0.65" />
    </g>

    <!-- Middle: framing (no decking yet) -->
    <g stroke="${ink}" stroke-opacity="0.6" stroke-width="4" fill="none">
      <line x1="480" y1="345" x2="800" y2="345" />
      <line x1="480" y1="360" x2="800" y2="360" />
      <line x1="510" y1="345" x2="510" y2="365" />
      <line x1="560" y1="345" x2="560" y2="365" />
      <line x1="610" y1="345" x2="610" y2="365" />
      <line x1="660" y1="345" x2="660" y2="365" />
      <line x1="710" y1="345" x2="710" y2="365" />
      <line x1="760" y1="345" x2="760" y2="365" />
    </g>
    <rect x="540" y="365" width="10" height="180" fill="${ink}" fill-opacity="0.65" />
    <rect x="700" y="365" width="10" height="180" fill="${ink}" fill-opacity="0.65" />

    <!-- Right: piling being driven -->
    <g>
      <rect x="890" y="200" width="14" height="345" fill="${ink}" fill-opacity="0.75" />
      <!-- piling driver hammer -->
      <g transform="translate(880 180)">
        <rect x="0" y="0" width="34" height="50" fill="${warn}" />
        <rect x="4" y="4" width="26" height="10" fill="${deep}" />
        <rect x="4" y="20" width="26" height="10" fill="${deep}" />
        <rect x="4" y="36" width="26" height="10" fill="${deep}" />
      </g>
      <!-- guide rails -->
      <line x1="864" y1="140" x2="864" y2="360" stroke="${warn}" stroke-width="4" />
      <line x1="930" y1="140" x2="930" y2="360" stroke="${warn}" stroke-width="4" />
      <line x1="864" y1="140" x2="930" y2="140" stroke="${warn}" stroke-width="4" />
      <!-- cable -->
      <line x1="897" y1="140" x2="897" y2="80" stroke="${ink}" stroke-opacity="0.6" stroke-width="2" />
      <circle cx="897" cy="80" r="10" fill="${ink}" fill-opacity="0.65" />
    </g>

    <!-- Toolbox in foreground -->
    <g transform="translate(1000 480)">
      <rect x="0" y="0" width="140" height="70" rx="6" fill="${warn}" />
      <rect x="10" y="15" width="120" height="8" fill="${deep}" fill-opacity="0.3" />
      <path d="M 55 0 Q 70 -30 85 0" stroke="${ink}" stroke-width="6" fill="none" stroke-linecap="round" />
      <!-- hammer sticking out -->
      <g transform="translate(50 -15) rotate(-30)">
        <rect x="0" y="0" width="6" height="55" fill="#8a5a35" />
        <rect x="-8" y="-3" width="24" height="14" rx="2" fill="${ink}" fill-opacity="0.75" />
      </g>
    </g>

    <!-- Big "OK" checkmark badge (left section done) -->
    <g transform="translate(240 260)">
      <circle r="42" fill="${success}" />
      <path d="M -18 0 L -6 14 L 20 -14" stroke="${accent}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </g>`;
}

const SCENES = {
  "do-i-need-a-permit-to-build-a-dock-in-tampa-bay": scenePermit,
  "how-much-does-a-dock-cost-in-tampa-2026": scenePrice,
  "floating-vs-fixed-docks-tampa-bay": sceneCompare,
  "best-dock-materials-saltwater": sceneMaterials,
  "dock-seawall-or-bulkhead": sceneSeawall,
  "does-adding-a-dock-increase-home-value": sceneHomeValue,
  "12-questions-tampa-dock-builder": sceneChecklist,
  "whats-included-vs-excluded-in-a-dock-quote": sceneReceipt,
  "ready-to-build-get-quotes": sceneConstruction,
};

/* ────────────────────────────────────────────────────────────────────────────
   Color resolver — derives a per-guide 6-color kit from brand tokens + palette
   ──────────────────────────────────────────────────────────────────────────── */

function colorsFor(guide) {
  const primary = brandTokens[guide.palette.primary];
  const secondary = brandTokens[guide.palette.secondary];
  const accent = brandTokens[guide.palette.accent] ?? brandTokens.sand;
  return {
    deep: brandTokens.tealDark,
    primary,
    secondary,
    accent,
    ink: brandTokens.ink,
    warn: brandTokens.coral,
    success: brandTokens.sea,
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   Layouts — wrap a scene into different aspect ratios
   Each layout takes a slug, guide, and the raw scene SVG (designed at 1200x630)
   and returns a complete SVG document at the target size.
   ──────────────────────────────────────────────────────────────────────────── */

function coverSVG(slug, guide, scene) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(guide.headline)}">
  ${scene}
  <!-- discreet brand mark -->
  <g transform="translate(1170 610)" opacity="0.7">
    <text font-family="'Fraunces', serif" font-size="15" fill="${brandTokens.sand}" font-weight="700" text-anchor="end">MyDockGuide</text>
  </g>
</svg>`;
}

function twitterCardSVG(slug, guide, scene) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="${escapeXml(guide.headline)}">
  <g transform="translate(0 0) scale(1.333 1.428)">${scene}</g>
  <g transform="translate(1570 875)" opacity="0.75">
    <text font-family="'Fraunces', serif" font-size="18" fill="${brandTokens.sand}" font-weight="700" text-anchor="end">MyDockGuide</text>
  </g>
</svg>`;
}

function instagramSquareSVG(slug, guide, scene) {
  const c = colorsFor(guide);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" role="img" aria-label="${escapeXml(guide.headline)}">
  <rect width="1080" height="1080" fill="${c.deep}" />
  <!-- scene occupies top 720px -->
  <g transform="translate(0 0) scale(0.9 1.143)">${scene}</g>
  <!-- caption band -->
  <rect x="0" y="820" width="1080" height="260" fill="${c.deep}" />
  <g transform="translate(60 880)">
    <text font-family="'Hanken Grotesk', sans-serif" font-size="20" fill="${c.accent}" fill-opacity="0.75" letter-spacing="5" font-weight="700">${escapeXml(guide.eyebrow.toUpperCase())}</text>
    <text y="45" font-family="'Fraunces', serif" font-size="42" fill="${c.accent}" font-weight="700">
      ${wrapText(guide.shortTitle, 25).map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 48}">${escapeXml(line)}</tspan>`).join("")}
    </text>
  </g>
  <text x="1020" y="1050" font-family="'Fraunces', serif" font-size="20" fill="${c.accent}" fill-opacity="0.75" font-weight="700" text-anchor="end">MyDockGuide</text>
</svg>`;
}

function instagramStorySVG(slug, guide, scene) {
  const c = colorsFor(guide);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" role="img" aria-label="${escapeXml(guide.headline)}">
  <rect width="1080" height="1920" fill="${c.deep}" />
  <!-- top: scene inside a rounded card -->
  <g transform="translate(60 200)">
    <rect x="0" y="0" width="960" height="800" rx="30" fill="${c.deep}" />
    <clipPath id="storyclip-${slug}">
      <rect x="0" y="0" width="960" height="800" rx="30" />
    </clipPath>
    <g clip-path="url(#storyclip-${slug})">
      <g transform="translate(0 -60) scale(0.8 1.42)">${scene}</g>
    </g>
  </g>
  <!-- caption -->
  <g transform="translate(60 1100)">
    <text font-family="'Hanken Grotesk', sans-serif" font-size="28" fill="${c.accent}" fill-opacity="0.75" letter-spacing="6" font-weight="700">${escapeXml(guide.eyebrow.toUpperCase())}</text>
    <text y="65" font-family="'Fraunces', serif" font-size="72" fill="${c.accent}" font-weight="700">
      ${wrapText(guide.headline, 18).map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 82}">${escapeXml(line)}</tspan>`).join("")}
    </text>
  </g>
  <g transform="translate(60 1750)">
    <rect width="220" height="70" rx="35" fill="${c.warn}" />
    <text x="110" y="46" font-family="'Fraunces', serif" font-size="24" fill="${c.deep}" font-weight="900" text-anchor="middle">Read now</text>
  </g>
  <text x="1020" y="1880" font-family="'Fraunces', serif" font-size="28" fill="${c.accent}" fill-opacity="0.75" font-weight="700" text-anchor="end">MyDockGuide</text>
</svg>`;
}

function pinterestSVG(slug, guide, scene) {
  const c = colorsFor(guide);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1500" role="img" aria-label="${escapeXml(guide.headline)}">
  <rect width="1000" height="1500" fill="${c.deep}" />
  <!-- top: scene inside a card -->
  <g transform="translate(40 130)">
    <clipPath id="pinclip-${slug}">
      <rect x="0" y="0" width="920" height="720" rx="26" />
    </clipPath>
    <g clip-path="url(#pinclip-${slug})">
      <g transform="translate(0 -70) scale(0.77 1.4)">${scene}</g>
    </g>
  </g>
  <!-- caption band -->
  <g transform="translate(40 920)">
    <text font-family="'Hanken Grotesk', sans-serif" font-size="26" fill="${c.accent}" fill-opacity="0.75" letter-spacing="6" font-weight="700">${escapeXml(guide.eyebrow.toUpperCase())}</text>
    <text y="60" font-family="'Fraunces', serif" font-size="64" fill="${c.accent}" font-weight="700">
      ${wrapText(guide.headline, 20).map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 72}">${escapeXml(line)}</tspan>`).join("")}
    </text>
  </g>
  <g transform="translate(40 1350)">
    <rect width="250" height="70" rx="35" fill="${c.warn}" />
    <text x="125" y="47" font-family="'Fraunces', serif" font-size="24" fill="${c.deep}" font-weight="900" text-anchor="middle">Save + Read</text>
  </g>
  <text x="960" y="1470" font-family="'Fraunces', serif" font-size="24" fill="${c.accent}" fill-opacity="0.75" font-weight="700" text-anchor="end">MyDockGuide</text>
</svg>`;
}

function carouselSlideSVG(slug, guide, scene, slide, index, total) {
  const c = colorsFor(guide);
  const isCover = index === 0;

  if (isCover) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" role="img" aria-label="${escapeXml(slide.title)}">
  <rect width="1080" height="1080" fill="${c.deep}" />
  <!-- scene fills top 700 -->
  <clipPath id="csclip-${slug}-0">
    <rect x="60" y="60" width="960" height="640" rx="26" />
  </clipPath>
  <g clip-path="url(#csclip-${slug}-0)">
    <g transform="translate(60 0) scale(0.8 1.14)">${scene}</g>
  </g>
  <!-- caption -->
  <g transform="translate(60 770)">
    <text font-family="'Hanken Grotesk', sans-serif" font-size="22" fill="${c.accent}" fill-opacity="0.75" letter-spacing="5" font-weight="700">${escapeXml(guide.eyebrow.toUpperCase())}</text>
    <text y="60" font-family="'Fraunces', serif" font-size="56" fill="${c.accent}" font-weight="700">
      ${wrapText(slide.title, 22).map((line, i) => `<tspan x="0" dy="${i === 0 ? 0 : 62}">${escapeXml(line)}</tspan>`).join("")}
    </text>
  </g>
  <text x="90" y="1030" font-family="'Hanken Grotesk', sans-serif" font-size="20" fill="${c.accent}" fill-opacity="0.7" font-weight="700">Swipe →</text>
  <text x="990" y="1030" font-family="'Fraunces', serif" font-size="22" fill="${c.accent}" fill-opacity="0.75" font-weight="700" text-anchor="end">MyDockGuide</text>
</svg>`;
  }

  // interior slide: number + short body
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" role="img" aria-label="${escapeXml(slide.title)}">
  <rect width="1080" height="1080" fill="${c.accent}" />
  <!-- soft scene backdrop (faded) -->
  <g opacity="0.15">
    <clipPath id="csbg-${slug}-${index}">
      <rect x="0" y="0" width="1080" height="1080" />
    </clipPath>
    <g clip-path="url(#csbg-${slug}-${index})">
      <g transform="translate(0 200) scale(0.9 1.4)">${scene}</g>
    </g>
  </g>

  <!-- Big number pill -->
  <g transform="translate(80 100)">
    <circle cx="80" cy="80" r="80" fill="${c.primary}" />
    <text x="80" y="105" font-family="'Fraunces', serif" font-size="80" fill="${c.accent}" font-weight="900" text-anchor="middle">${index}</text>
  </g>
  <text x="240" y="150" font-family="'Hanken Grotesk', sans-serif" font-size="22" fill="${c.primary}" fill-opacity="0.75" letter-spacing="5" font-weight="700">${escapeXml(`${index} / ${total - 1}`)}</text>
  <text x="240" y="195" font-family="'Fraunces', serif" font-size="34" fill="${c.primary}" font-weight="700">${escapeXml(guide.eyebrow)}</text>

  <!-- Title -->
  <text x="80" y="370" font-family="'Fraunces', serif" font-size="70" fill="${c.primary}" font-weight="700">
    ${wrapText(slide.title, 20).map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 80}">${escapeXml(line)}</tspan>`).join("")}
  </text>

  <!-- Body -->
  <text x="80" y="720" font-family="'Hanken Grotesk', sans-serif" font-size="32" fill="${c.primary}" fill-opacity="0.75" font-weight="500">
    ${wrapText(slide.body, 32).map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`).join("")}
  </text>

  <line x1="80" y1="960" x2="1000" y2="960" stroke="${c.primary}" stroke-opacity="0.25" stroke-width="2" />
  <text x="80" y="1010" font-family="'Hanken Grotesk', sans-serif" font-size="22" fill="${c.primary}" fill-opacity="0.7" font-weight="700">${index === total - 1 ? "Full guide → mydockguide.com" : "Keep swiping →"}</text>
  <text x="1000" y="1010" font-family="'Fraunces', serif" font-size="24" fill="${c.primary}" font-weight="700" text-anchor="end">MyDockGuide</text>
</svg>`;
}

/* ── Text-wrap helper ── */
function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function ensureFreshDir(path) {
  if (existsSync(path)) await rm(path, { recursive: true, force: true });
  await mkdir(path, { recursive: true });
}

/* ── Main ── */
(async () => {
  const coversDir = join(ROOT, "public/covers");
  const socialRoot = join(ROOT, "public/social");
  await ensureFreshDir(coversDir);
  await ensureFreshDir(socialRoot);

  let count = 0;
  for (const [slug, guide] of Object.entries(guides)) {
    const sceneFn = SCENES[slug];
    if (!sceneFn) {
      console.warn(`⚠ no scene defined for ${slug} — skipping`);
      continue;
    }
    const c = colorsFor(guide);
    const scene = sceneFn(c);

    await writeFile(join(coversDir, `${slug}.svg`), coverSVG(slug, guide, scene));
    count++;

    const dir = join(socialRoot, slug);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "instagram-square.svg"), instagramSquareSVG(slug, guide, scene));
    await writeFile(join(dir, "instagram-story.svg"), instagramStorySVG(slug, guide, scene));
    await writeFile(join(dir, "twitter-card.svg"), twitterCardSVG(slug, guide, scene));
    await writeFile(join(dir, "pinterest.svg"), pinterestSVG(slug, guide, scene));
    count += 4;

    const carouselSlides = [
      { title: guide.headline, body: guide.carouselHook, isCover: true },
      ...guide.carousel.slice(1),
    ];
    for (let i = 0; i < carouselSlides.length; i++) {
      await writeFile(
        join(dir, `carousel-${i + 1}.svg`),
        carouselSlideSVG(slug, guide, scene, carouselSlides[i], i, carouselSlides.length),
      );
      count++;
    }
    console.log(`✓ ${slug}: cover + 4 social + ${carouselSlides.length}-slide carousel`);
  }

  console.log(`\nGenerated ${count} SVG assets across ${Object.keys(guides).length} guides.`);
})();
