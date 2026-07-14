/**
 * Seawall Cost Estimation Engine
 *
 * Numbers reflect 2024–2026 Tampa Bay marine construction market. Tune quarterly
 * against real quotes captured through the lead form.
 */

export type SeawallMaterial = "vinyl" | "concrete" | "aluminum" | "rip-rap" | "steel";
export type CapType = "concrete" | "wood" | "none";
export type Tieback = "deadman" | "helical" | "batter" | "none";
export type WorkType = "new" | "replacement" | "cap-only";
export type CountyKey =
  | "hillsborough"
  | "pinellas"
  | "manatee"
  | "sarasota"
  | "pasco"
  | "other";

export interface SeawallInputs {
  workType: WorkType;
  material: SeawallMaterial;
  lengthFt: number;
  retainedHeightFt: number;
  tieback: Tieback;
  cap: CapType;
  county: CountyKey;
  removeExisting: boolean;
  hasSeagrass: boolean;
}

export interface CostLine {
  label: string;
  amount: number;
  detail?: string;
}

export interface SeawallResult {
  low: number;
  mid: number;
  high: number;
  perLinearFoot: { low: number; mid: number; high: number };
  breakdown: CostLine[];
  timelineWeeks: { permitting: [number, number]; construction: [number, number] };
  notes: string[];
  inputs: SeawallInputs;
}

// ── Cost per linear foot at reference height (6 ft retained) ──
export const MATERIAL_COST_PER_LF: Record<SeawallMaterial, number> = {
  vinyl: 320,
  concrete: 480,
  aluminum: 410,
  "rip-rap": 180,
  steel: 560,
};

export const HEIGHT_ADJ_PER_FT_OVER_6 = 0.08;
export const TIEBACK_COST_PER_LF: Record<Tieback, number> = {
  deadman: 45,
  helical: 95,
  batter: 65,
  none: 0,
};

export const CAP_COST_PER_LF: Record<CapType, number> = {
  concrete: 55,
  wood: 22,
  none: 0,
};

export const COUNTY_PERMIT_FEE: Record<CountyKey, number> = {
  hillsborough: 2800,
  pinellas: 3000,
  manatee: 2400,
  sarasota: 2600,
  pasco: 2200,
  other: 2500,
};

export const REMOVAL_COST_PER_LF = 42;
export const SEAGRASS_SURVEY_COST = 2200;
export const MOBILIZATION_COST = 4500;
export const LOW_HIGH_BAND = 0.2;

const LIMITS = {
  lengthFt: { min: 8, max: 800 },
  retainedHeightFt: { min: 2, max: 20 },
};

export function validateInputs(i: Partial<SeawallInputs>): string[] {
  const errors: string[] = [];
  const n = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  if (!i.material) errors.push("Pick a seawall material.");
  if (!i.workType) errors.push("Pick new build, replacement, or cap-only.");
  if (!i.county) errors.push("Pick a county.");
  if (!i.tieback) errors.push("Pick a tieback style (or 'none').");
  if (!i.cap) errors.push("Pick a cap type (or 'none').");
  if (!n(i.lengthFt) || (i.lengthFt as number) < LIMITS.lengthFt.min || (i.lengthFt as number) > LIMITS.lengthFt.max) {
    errors.push(`Length must be between ${LIMITS.lengthFt.min} and ${LIMITS.lengthFt.max} ft.`);
  }
  if (
    !n(i.retainedHeightFt) ||
    (i.retainedHeightFt as number) < LIMITS.retainedHeightFt.min ||
    (i.retainedHeightFt as number) > LIMITS.retainedHeightFt.max
  ) {
    errors.push(`Retained height must be between ${LIMITS.retainedHeightFt.min} and ${LIMITS.retainedHeightFt.max} ft.`);
  }
  return errors;
}

export function estimateSeawallCost(inputs: SeawallInputs): SeawallResult {
  const errors = validateInputs(inputs);
  if (errors.length) throw new Error(`Invalid seawall inputs: ${errors.join(" ")}`);

  const baseLF = MATERIAL_COST_PER_LF[inputs.material];
  const heightMult = 1 + Math.max(0, inputs.retainedHeightFt - 6) * HEIGHT_ADJ_PER_FT_OVER_6;
  const workMult = inputs.workType === "cap-only" ? 0.35 : 1;

  const wallCostLF = baseLF * heightMult * workMult;
  const wallCost = wallCostLF * inputs.lengthFt;

  const tiebackCost =
    inputs.workType === "cap-only" ? 0 : TIEBACK_COST_PER_LF[inputs.tieback] * inputs.lengthFt;
  const capCost = CAP_COST_PER_LF[inputs.cap] * inputs.lengthFt;
  const removalCost = inputs.removeExisting ? REMOVAL_COST_PER_LF * inputs.lengthFt : 0;
  const seagrassCost = inputs.hasSeagrass ? SEAGRASS_SURVEY_COST : 0;
  const permit = COUNTY_PERMIT_FEE[inputs.county];

  const breakdown: CostLine[] = [
    {
      label: `${labelMaterial(inputs.material)} wall`,
      amount: Math.round(wallCost),
      detail: `${inputs.lengthFt} lf × $${Math.round(wallCostLF)}/lf${
        inputs.retainedHeightFt > 6 ? ` (height adj. ×${heightMult.toFixed(2)})` : ""
      }${inputs.workType === "cap-only" ? " (cap-only)" : ""}`,
    },
  ];
  if (tiebackCost > 0) {
    breakdown.push({
      label: `${labelTieback(inputs.tieback)} tiebacks`,
      amount: Math.round(tiebackCost),
      detail: `${inputs.lengthFt} lf × $${TIEBACK_COST_PER_LF[inputs.tieback]}/lf`,
    });
  }
  if (capCost > 0) {
    breakdown.push({
      label: `${labelCap(inputs.cap)} cap`,
      amount: Math.round(capCost),
      detail: `${inputs.lengthFt} lf × $${CAP_COST_PER_LF[inputs.cap]}/lf`,
    });
  }
  if (removalCost > 0) {
    breakdown.push({ label: "Remove existing seawall", amount: Math.round(removalCost) });
  }
  if (seagrassCost > 0) {
    breakdown.push({ label: "Seagrass survey", amount: seagrassCost });
  }
  breakdown.push({ label: "Mobilization", amount: MOBILIZATION_COST });
  breakdown.push({ label: `Permits (${labelCounty(inputs.county)})`, amount: permit });

  const mid = breakdown.reduce((s, l) => s + l.amount, 0);
  const low = Math.round(mid * (1 - LOW_HIGH_BAND));
  const high = Math.round(mid * (1 + LOW_HIGH_BAND));

  const perLinearFoot = {
    low: Math.round(low / inputs.lengthFt),
    mid: Math.round(mid / inputs.lengthFt),
    high: Math.round(high / inputs.lengthFt),
  };

  return {
    low,
    mid,
    high,
    perLinearFoot,
    breakdown,
    timelineWeeks: estimateTimeline(inputs),
    notes: buildNotes(inputs),
    inputs,
  };
}

function estimateTimeline(i: SeawallInputs): SeawallResult["timelineWeeks"] {
  let permMin = i.workType === "cap-only" ? 3 : 8;
  let permMax = i.workType === "cap-only" ? 6 : 16;
  if (i.hasSeagrass) permMax += 4;
  if (i.county === "pinellas") permMax += 1;

  const constMin = i.workType === "cap-only" ? 1 : Math.max(2, Math.ceil(i.lengthFt / 60));
  const constMax = constMin + 2;
  return { permitting: [permMin, permMax], construction: [constMin, constMax] };
}

function buildNotes(i: SeawallInputs): string[] {
  const notes: string[] = [];
  notes.push(
    "Estimate excludes survey, engineered drawings, dewatering, and unusual soil-boring requirements. Get a site visit before signing.",
  );
  if (i.material === "rip-rap") {
    notes.push("Rip-rap looks cheap up front but only works where wave energy is low — it can't hold back a lawn on Tampa Bay's open water side.");
  }
  if (i.workType === "cap-only" && i.retainedHeightFt > 8) {
    notes.push("Cap-only is only viable on a seawall in solid condition. If the panels are cracked or the tiebacks are failing, a cap is throwing money at the wrong problem.");
  }
  if (i.hasSeagrass) {
    notes.push("Seagrass beds trigger FDEP/ACOE mitigation. Budget an extra 8–16 weeks for permits and $2–8k for mitigation credits.");
  }
  if (i.retainedHeightFt >= 10) {
    notes.push("Retaining more than 10 ft usually needs a licensed engineer's design and can double the wall thickness — quote inflation is real above 10 ft.");
  }
  return notes;
}

export function labelMaterial(v: SeawallMaterial): string {
  return {
    vinyl: "Vinyl",
    concrete: "Concrete panel",
    aluminum: "Aluminum",
    "rip-rap": "Rip-rap",
    steel: "Steel",
  }[v];
}
export function labelTieback(v: Tieback): string {
  return { deadman: "Deadman", helical: "Helical", batter: "Batter-pile", none: "None" }[v];
}
export function labelCap(v: CapType): string {
  return { concrete: "Concrete", wood: "Wood", none: "None" }[v];
}
export function labelWorkType(v: WorkType): string {
  return { new: "New build", replacement: "Full replacement", "cap-only": "Cap-only refresh" }[v];
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

export const DEFAULT_INPUTS: SeawallInputs = {
  workType: "replacement",
  material: "vinyl",
  lengthFt: 100,
  retainedHeightFt: 6,
  tieback: "helical",
  cap: "concrete",
  county: "hillsborough",
  removeExisting: true,
  hasSeagrass: false,
};
