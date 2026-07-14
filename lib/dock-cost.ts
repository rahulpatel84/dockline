/**
 * Dock Cost Estimation Engine
 *
 * Pure functions only — no DOM, no framework. This makes the engine easy to
 * unit-test and reuse anywhere (calculator UI, PDF exports, admin dashboard).
 *
 * The numbers below are grounded in publicly reported 2024–2026 Tampa Bay
 * marine construction cost data. They should be tuned quarterly against real
 * quote data collected via the lead form. Every constant is exported so the
 * admin dashboard can override them without touching engine code.
 */

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export type DockType = "fixed" | "floating" | "t-shape" | "l-shape" | "u-shape";
export type Decking = "pressure-treated" | "composite" | "ipe" | "aluminum";
export type Piling = "wood" | "concrete" | "composite";
export type Bottom = "sand" | "soft-mud" | "rock" | "mixed";

export type CountyKey =
  | "hillsborough"
  | "pinellas"
  | "manatee"
  | "sarasota"
  | "pasco"
  | "other";

export interface DockCostInputs {
  dockType: DockType;
  lengthFt: number;
  widthFt: number;
  waterDepthFt: number;
  bottom: Bottom;
  decking: Decking;
  piling: Piling;
  county: CountyKey;
  addBoatLift: boolean;
  boatLiftWeightLb: number; // 0 if no lift
  hasRoof: boolean;
  hasWaterElectric: boolean;
  hasLighting: boolean;
  hasKayakLaunch: boolean;
}

export interface CostLine {
  label: string;
  amount: number;
  detail?: string;
}

export interface DockCostResult {
  low: number;
  mid: number;
  high: number;
  currency: "USD";
  breakdown: CostLine[];
  timelineWeeks: { permitting: [number, number]; construction: [number, number] };
  notes: string[];
  inputs: DockCostInputs;
}

// ────────────────────────────────────────────────────────────────────────────
// Constants — tune these as we collect real Tampa Bay quote data
// ────────────────────────────────────────────────────────────────────────────

export const DECKING_COST_PER_SQFT: Record<Decking, number> = {
  "pressure-treated": 28,
  composite: 55,
  ipe: 78,
  aluminum: 62,
};

export const PILING_COST_EACH: Record<Piling, number> = {
  wood: 320,
  concrete: 780,
  composite: 640,
};

// Pilings needed increase with length; rough rule: one piling every ~7 ft for
// fixed docks (both sides), plus corner pilings for L/T/U shapes.
export const PILING_SPACING_FT = 7;

export const BOTTOM_LABOR_MULT: Record<Bottom, number> = {
  sand: 1.0,
  "soft-mud": 1.25, // needs longer pilings + more time to set
  rock: 1.35, // may need drilling
  mixed: 1.15,
};

export const DOCK_SHAPE_MULT: Record<DockType, number> = {
  fixed: 1.0,
  floating: 0.9, // no pilings for the deck itself
  "l-shape": 1.15,
  "t-shape": 1.2,
  "u-shape": 1.35,
};

export const COUNTY_PERMIT_FEE: Record<CountyKey, number> = {
  hillsborough: 2200,
  pinellas: 2400,
  manatee: 2000,
  sarasota: 2100,
  pasco: 1800,
  other: 2000,
};

export const BOAT_LIFT_COST_PER_LB = 0.55; // rough $/lb capacity — includes install
export const BOAT_LIFT_MIN_COST = 6500;

export const ROOF_COST_PER_SQFT = 42;
export const WATER_ELECTRIC_COST = 3800;
export const LIGHTING_COST = 1400;
export const KAYAK_LAUNCH_COST = 2200;

// Fixed baseline labor and mobilization the crew charges no matter the size
export const MOBILIZATION_COST = 3500;

// Uncertainty band: ±% around midpoint
export const LOW_HIGH_BAND = 0.18;

// ────────────────────────────────────────────────────────────────────────────
// Validation
// ────────────────────────────────────────────────────────────────────────────

const LIMITS = {
  lengthFt: { min: 4, max: 300 },
  widthFt: { min: 3, max: 40 },
  waterDepthFt: { min: 0, max: 25 },
  boatLiftWeightLb: { min: 0, max: 40000 },
} as const;

export function validateInputs(inputs: Partial<DockCostInputs>): string[] {
  const errors: string[] = [];
  const n = (v: unknown) => typeof v === "number" && Number.isFinite(v);

  if (!inputs.dockType) errors.push("Pick a dock type.");
  if (!inputs.decking) errors.push("Pick a decking material.");
  if (!inputs.piling) errors.push("Pick a piling material.");
  if (!inputs.county) errors.push("Pick a county.");
  if (!inputs.bottom) errors.push("Pick a bottom type.");

  if (!n(inputs.lengthFt) || (inputs.lengthFt as number) < LIMITS.lengthFt.min || (inputs.lengthFt as number) > LIMITS.lengthFt.max) {
    errors.push(`Length must be between ${LIMITS.lengthFt.min} and ${LIMITS.lengthFt.max} ft.`);
  }
  if (!n(inputs.widthFt) || (inputs.widthFt as number) < LIMITS.widthFt.min || (inputs.widthFt as number) > LIMITS.widthFt.max) {
    errors.push(`Width must be between ${LIMITS.widthFt.min} and ${LIMITS.widthFt.max} ft.`);
  }
  if (!n(inputs.waterDepthFt) || (inputs.waterDepthFt as number) < LIMITS.waterDepthFt.min || (inputs.waterDepthFt as number) > LIMITS.waterDepthFt.max) {
    errors.push(`Water depth must be between ${LIMITS.waterDepthFt.min} and ${LIMITS.waterDepthFt.max} ft.`);
  }
  if (inputs.addBoatLift) {
    const w = inputs.boatLiftWeightLb;
    if (!n(w) || (w as number) < 2000 || (w as number) > LIMITS.boatLiftWeightLb.max) {
      errors.push(`Boat lift capacity must be between 2,000 and ${LIMITS.boatLiftWeightLb.max.toLocaleString()} lb.`);
    }
  }
  return errors;
}

// ────────────────────────────────────────────────────────────────────────────
// Engine
// ────────────────────────────────────────────────────────────────────────────

function safeNumber(v: number, fallback = 0): number {
  return Number.isFinite(v) ? v : fallback;
}

function pilingCount(inputs: DockCostInputs): number {
  const perimeter = 2 * (inputs.lengthFt + inputs.widthFt);
  const base = Math.ceil(perimeter / PILING_SPACING_FT);
  const shapeExtras: Record<DockType, number> = {
    fixed: 0,
    floating: -Math.floor(base * 0.6), // most pilings replaced by floats
    "l-shape": 2,
    "t-shape": 4,
    "u-shape": 6,
  };
  return Math.max(4, base + shapeExtras[inputs.dockType]);
}

export function estimateDockCost(inputs: DockCostInputs): DockCostResult {
  const errors = validateInputs(inputs);
  if (errors.length) {
    throw new Error(`Invalid dock cost inputs: ${errors.join(" ")}`);
  }

  const sqft = inputs.lengthFt * inputs.widthFt;

  // ── Materials + labor lines ──
  const deckingCost = safeNumber(sqft * DECKING_COST_PER_SQFT[inputs.decking]);
  const pilings = pilingCount(inputs);
  const pilingCost = safeNumber(pilings * PILING_COST_EACH[inputs.piling]);

  const shapeMult = DOCK_SHAPE_MULT[inputs.dockType];
  const bottomMult = BOTTOM_LABOR_MULT[inputs.bottom];

  // Base construction labor is roughly proportional to piling+decking materials
  const baseLabor = (deckingCost + pilingCost) * 0.55;
  const shapedLabor = baseLabor * shapeMult;
  const laborCost = shapedLabor * bottomMult;

  // Water depth adjustment: each foot over 6 ft adds 4% for longer pilings
  const depthAdj =
    inputs.waterDepthFt > 6 ? (inputs.waterDepthFt - 6) * 0.04 * (pilingCost + laborCost) : 0;

  const permitFee = COUNTY_PERMIT_FEE[inputs.county];

  const roofCost = inputs.hasRoof ? safeNumber(sqft * ROOF_COST_PER_SQFT) : 0;
  const waterElectric = inputs.hasWaterElectric ? WATER_ELECTRIC_COST : 0;
  const lighting = inputs.hasLighting ? LIGHTING_COST : 0;
  const kayak = inputs.hasKayakLaunch ? KAYAK_LAUNCH_COST : 0;

  const boatLiftCost = inputs.addBoatLift
    ? Math.max(BOAT_LIFT_MIN_COST, inputs.boatLiftWeightLb * BOAT_LIFT_COST_PER_LB)
    : 0;

  const breakdown: CostLine[] = [
    {
      label: "Decking",
      amount: Math.round(deckingCost),
      detail: `${sqft.toFixed(0)} sq ft × $${DECKING_COST_PER_SQFT[inputs.decking]}/sq ft (${labelDecking(inputs.decking)})`,
    },
    {
      label: "Pilings",
      amount: Math.round(pilingCost),
      detail: `${pilings} × $${PILING_COST_EACH[inputs.piling]} (${labelPiling(inputs.piling)})`,
    },
    {
      label: "Labor & installation",
      amount: Math.round(laborCost + depthAdj),
      detail: `Shape ×${shapeMult}, bottom ×${bottomMult}${
        inputs.waterDepthFt > 6 ? `, depth adj. for ${inputs.waterDepthFt} ft` : ""
      }`,
    },
    { label: "Mobilization", amount: MOBILIZATION_COST, detail: "Crew, equipment, delivery" },
    { label: `Permits (${labelCounty(inputs.county)})`, amount: permitFee },
  ];

  if (roofCost > 0) breakdown.push({ label: "Roof / boathouse cover", amount: Math.round(roofCost) });
  if (waterElectric > 0) breakdown.push({ label: "Water & electric run", amount: waterElectric });
  if (lighting > 0) breakdown.push({ label: "Lighting", amount: lighting });
  if (kayak > 0) breakdown.push({ label: "Kayak / jetski launch", amount: kayak });
  if (boatLiftCost > 0) {
    breakdown.push({
      label: "Boat lift (installed)",
      amount: Math.round(boatLiftCost),
      detail: `${inputs.boatLiftWeightLb.toLocaleString()} lb capacity`,
    });
  }

  const mid = breakdown.reduce((sum, line) => sum + line.amount, 0);
  const low = Math.round(mid * (1 - LOW_HIGH_BAND));
  const high = Math.round(mid * (1 + LOW_HIGH_BAND));

  const notes = buildNotes(inputs);
  const timelineWeeks = estimateTimeline(inputs);

  return { low, mid, high, currency: "USD", breakdown, timelineWeeks, notes, inputs };
}

function estimateTimeline(inputs: DockCostInputs): DockCostResult["timelineWeeks"] {
  // Permitting: typical Tampa Bay range 6–14 weeks; larger + roofed adds time
  let permMin = 6;
  let permMax = 12;
  if (inputs.hasRoof) permMax += 2;
  if (inputs.dockType === "u-shape" || inputs.dockType === "t-shape") permMax += 1;
  if (inputs.county === "pinellas") permMax += 1;

  // Construction: base ~2 weeks + scale by size
  const constMin = Math.max(2, Math.floor(inputs.lengthFt / 20));
  const constMax = constMin + 3 + (inputs.hasRoof ? 2 : 0);
  return { permitting: [permMin, permMax], construction: [constMin, constMax] };
}

function buildNotes(inputs: DockCostInputs): string[] {
  const notes: string[] = [];
  notes.push(
    "Estimates are based on 2026 Tampa Bay marine-construction data and exclude survey, engineering drawings for oversized structures, and HOA architectural review fees.",
  );
  if (inputs.waterDepthFt > 8) {
    notes.push("At water depths over 8 ft, pilings often need to be 10–20 ft longer, which can push labor and materials 8–15% higher than the midpoint shown.");
  }
  if (inputs.bottom === "rock") {
    notes.push("Rocky bottoms sometimes require jet-drilling or a barge — get a site visit before committing to a fixed price.");
  }
  if (inputs.dockType === "floating") {
    notes.push("Floating docks are usually 10–20% cheaper up front but cost more in mid-life maintenance in Tampa Bay saltwater.");
  }
  if (inputs.decking === "pressure-treated" && !inputs.addBoatLift) {
    notes.push("Pressure-treated pine is the cheapest quote you'll get but usually only lasts 10–15 years in saltwater — factor in a re-deck around year 12.");
  }
  return notes;
}

// ────────────────────────────────────────────────────────────────────────────
// Labels (used by both engine and UI)
// ────────────────────────────────────────────────────────────────────────────

export function labelDockType(v: DockType): string {
  return {
    fixed: "Fixed",
    floating: "Floating",
    "l-shape": "L-shape",
    "t-shape": "T-shape",
    "u-shape": "U-shape",
  }[v];
}

export function labelDecking(v: Decking): string {
  return {
    "pressure-treated": "Pressure-treated pine",
    composite: "Composite (Trex/Azek)",
    ipe: "Ipe hardwood",
    aluminum: "Aluminum",
  }[v];
}

export function labelPiling(v: Piling): string {
  return { wood: "Wood", concrete: "Concrete", composite: "Composite" }[v];
}

export function labelBottom(v: Bottom): string {
  return { sand: "Sand", "soft-mud": "Soft mud", rock: "Rock", mixed: "Mixed" }[v];
}

export function labelCounty(v: CountyKey): string {
  return {
    hillsborough: "Hillsborough",
    pinellas: "Pinellas",
    manatee: "Manatee",
    sarasota: "Sarasota",
    pasco: "Pasco",
    other: "Other Florida",
  }[v];
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

// Default inputs — safe values that produce a reasonable Tampa median dock
export const DEFAULT_INPUTS: DockCostInputs = {
  dockType: "fixed",
  lengthFt: 40,
  widthFt: 6,
  waterDepthFt: 4,
  bottom: "sand",
  decking: "composite",
  piling: "concrete",
  county: "hillsborough",
  addBoatLift: false,
  boatLiftWeightLb: 10000,
  hasRoof: false,
  hasWaterElectric: false,
  hasLighting: true,
  hasKayakLaunch: false,
};
