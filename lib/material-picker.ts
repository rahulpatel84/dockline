/**
 * Material Recommender Quiz
 *
 * Scores 4 decking materials against 6 lifestyle questions.
 * Returns primary + secondary recommendations with reasoning.
 */

export type Material = "pressure-treated" | "composite" | "ipe" | "aluminum";

export type Priority = "cheap-now" | "cheap-lifetime" | "premium-look";
export type Longevity = "10-year" | "20-year" | "40-year";
export type Sun = "shaded" | "mixed" | "full-sun";
export type Cleaning = "never" | "yearly" | "monthly";
export type Traffic = "light" | "medium" | "heavy";
export type Aesthetic = "traditional" | "modern" | "warm";

export interface QuizInputs {
  priority: Priority;
  longevity: Longevity;
  sun: Sun;
  cleaning: Cleaning;
  traffic: Traffic;
  aesthetic: Aesthetic;
}

export interface Score {
  material: Material;
  score: number;
  reasons: string[];
}

export interface QuizResult {
  primary: Score;
  secondary: Score;
  scores: Score[];
  summary: string;
  ctaText: string;
}

// Scoring matrix: for each question and answer, points added to each material.
// Range: -2 to +3 per axis.
const SCORING: Record<
  keyof QuizInputs,
  Record<string, Partial<Record<Material, number>>>
> = {
  priority: {
    "cheap-now": { "pressure-treated": 3, aluminum: 1, composite: -1, ipe: -2 },
    "cheap-lifetime": { composite: 3, aluminum: 2, ipe: 2, "pressure-treated": -2 },
    "premium-look": { ipe: 3, composite: 2, aluminum: 0, "pressure-treated": -1 },
  },
  longevity: {
    "10-year": { "pressure-treated": 2, aluminum: 1, composite: 0, ipe: -1 },
    "20-year": { composite: 3, aluminum: 2, ipe: 2, "pressure-treated": -1 },
    "40-year": { ipe: 3, composite: 2, aluminum: 3, "pressure-treated": -3 },
  },
  sun: {
    shaded: { "pressure-treated": 1, composite: 1, ipe: 1, aluminum: 0 },
    mixed: { composite: 2, ipe: 1, aluminum: 1, "pressure-treated": 0 },
    "full-sun": { aluminum: 3, composite: 2, ipe: 1, "pressure-treated": -1 },
  },
  cleaning: {
    never: { composite: 3, aluminum: 3, "pressure-treated": -1, ipe: -1 },
    yearly: { composite: 2, aluminum: 2, ipe: 1, "pressure-treated": 0 },
    monthly: { ipe: 2, "pressure-treated": 1, composite: 1, aluminum: 0 },
  },
  traffic: {
    light: { "pressure-treated": 1, composite: 2, ipe: 1, aluminum: 1 },
    medium: { composite: 2, ipe: 2, aluminum: 2, "pressure-treated": 0 },
    heavy: { ipe: 3, aluminum: 2, composite: 1, "pressure-treated": -1 },
  },
  aesthetic: {
    traditional: { "pressure-treated": 2, ipe: 2, composite: 0, aluminum: -1 },
    modern: { aluminum: 3, composite: 2, ipe: 1, "pressure-treated": -1 },
    warm: { ipe: 3, "pressure-treated": 2, composite: 1, aluminum: -1 },
  },
};

const REASONS: Record<Material, Partial<Record<string, string>>> = {
  "pressure-treated": {
    "cheap-now": "Lowest upfront cost per square foot in Tampa Bay.",
    "10-year": "Realistic 10–15 year lifespan in saltwater matches your horizon.",
    traditional: "Classic Florida dock look — warm brown weathering over time.",
    monthly: "You're willing to seal and pressure-wash annually, which is what wood demands.",
  },
  composite: {
    "cheap-lifetime": "Highest upfront cost is offset by 25–30 year lifespan and no annual sealing.",
    "20-year": "Manufacturer warranties typically cover 25 years in saltwater exposure.",
    never: "Essentially zero maintenance — hose off, done.",
    "full-sun": "Modern composites (Trex Transcend, TimberTech AZEK) are engineered for full sun UV.",
    modern: "Cleanest lines, most colors, and consistent grain.",
  },
  ipe: {
    "premium-look": "The hardwood that looks like $200/sqft even at $78/sqft.",
    "40-year": "Naturally rot-resistant Brazilian hardwood — 30–50 year lifespan is normal.",
    heavy: "Density (3× pressure-treated) shrugs off heavy traffic.",
    warm: "Rich reddish-brown that ages to silver-gray if untreated.",
  },
  aluminum: {
    "40-year": "Won't rot, warp, or splinter. Only serious enemy is anodizing quality.",
    "full-sun": "Won't UV-fade like wood. Marine-grade anodized aluminum handles Florida sun indefinitely.",
    never: "Zero maintenance beyond an occasional rinse.",
    modern: "Modern industrial aesthetic — clean lines, no grain pattern.",
  },
};

export function validateInputs(i: Partial<QuizInputs>): string[] {
  const errors: string[] = [];
  const keys: (keyof QuizInputs)[] = ["priority", "longevity", "sun", "cleaning", "traffic", "aesthetic"];
  for (const k of keys) {
    if (!i[k]) errors.push(`Answer the "${k}" question.`);
  }
  return errors;
}

export function recommendMaterial(inputs: QuizInputs): QuizResult {
  const errors = validateInputs(inputs);
  if (errors.length) throw new Error(`Invalid quiz inputs: ${errors.join(" ")}`);

  const materials: Material[] = ["pressure-treated", "composite", "ipe", "aluminum"];
  const scores: Score[] = materials.map((m) => ({ material: m, score: 0, reasons: [] }));

  const bump = (m: Material, delta: number, reasonKey?: string) => {
    const s = scores.find((s) => s.material === m);
    if (!s) return;
    s.score += delta;
    if (reasonKey && REASONS[m][reasonKey]) s.reasons.push(REASONS[m][reasonKey] as string);
  };

  (Object.keys(inputs) as (keyof QuizInputs)[]).forEach((axis) => {
    const answer = inputs[axis];
    const row = SCORING[axis][answer];
    if (!row) return;
    (Object.entries(row) as [Material, number][]).forEach(([m, delta]) => bump(m, delta, answer));
  });

  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const primary = sorted[0];
  const secondary = sorted[1];

  return {
    primary,
    secondary,
    scores: sorted,
    summary: buildSummary(primary, inputs),
    ctaText: `Get quotes for a ${labelMaterial(primary.material)} dock →`,
  };
}

function buildSummary(primary: Score, inputs: QuizInputs): string {
  return `Based on your answers — ${inputs.priority.replace("-", " ")}, ${inputs.longevity} horizon, ${inputs.sun.replace("-", " ")} exposure — ${labelMaterial(
    primary.material,
  )} is the best fit for your Tampa Bay dock.`;
}

export function labelMaterial(m: Material): string {
  return {
    "pressure-treated": "Pressure-treated pine",
    composite: "Composite (Trex / Azek / Fiberon)",
    ipe: "Ipe hardwood",
    aluminum: "Marine-grade aluminum",
  }[m];
}
export function labelPriority(v: Priority): string {
  return { "cheap-now": "Cheapest upfront", "cheap-lifetime": "Cheapest over 20 years", "premium-look": "Best appearance" }[v];
}
export function labelLongevity(v: Longevity): string {
  return { "10-year": "10 years is fine — I'll rebuild later", "20-year": "20 years — build once, refresh later", "40-year": "40+ years — build for the grandkids" }[v];
}
export function labelSun(v: Sun): string {
  return { shaded: "Mostly shaded (trees, boathouse)", mixed: "Mixed — some shade", "full-sun": "Full Tampa sun all day" }[v];
}
export function labelCleaning(v: Cleaning): string {
  return { never: "Never — hose off max", yearly: "Yearly clean is fine", monthly: "I'll seal and scrub monthly" }[v];
}
export function labelTraffic(v: Traffic): string {
  return { light: "Light — us and guests", medium: "Medium — kids, dogs, gear", heavy: "Heavy — Airbnb / party dock" }[v];
}
export function labelAesthetic(v: Aesthetic): string {
  return { traditional: "Traditional dock look", modern: "Clean modern lines", warm: "Warm natural wood tones" }[v];
}

export const DEFAULT_INPUTS: QuizInputs = {
  priority: "cheap-lifetime",
  longevity: "20-year",
  sun: "full-sun",
  cleaning: "yearly",
  traffic: "medium",
  aesthetic: "modern",
};
