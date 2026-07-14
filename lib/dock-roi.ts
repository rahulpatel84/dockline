/**
 * Dock ROI / Home Value Impact Estimator
 *
 * Based on interviews with Tampa Bay waterfront realtors + published cost-vs-value data.
 * A well-built dock in a deep-water canal can return 60–90% of build cost at sale;
 * a poorly-built dock in a shallow canal returns closer to 20–40%.
 */

export type NeighborhoodTier = "deep-water" | "navigable" | "no-boat-access" | "no-dock-market";
export type DockCondition = "new" | "good" | "fair" | "poor" | "none";
export type HoldingPeriod = "1-3" | "3-7" | "7-15" | "15+";

export interface RoiInputs {
  homeValue: number;
  dockCost: number;
  boatLiftIncluded: boolean;
  neighborhood: NeighborhoodTier;
  currentDockCondition: DockCondition;
  holdingPeriod: HoldingPeriod;
}

export interface RoiResult {
  valueUpliftLow: number;
  valueUpliftMid: number;
  valueUpliftHigh: number;
  roiPct: number;
  paybackPct: number;
  breakdown: { label: string; amount: number }[];
  notes: string[];
  inputs: RoiInputs;
}

// Base % of dock cost returned at sale, by neighborhood tier
const NEIGHBORHOOD_RETURN: Record<NeighborhoodTier, [number, number]> = {
  "deep-water": [0.72, 0.92],
  navigable: [0.55, 0.78],
  "no-boat-access": [0.28, 0.48],
  "no-dock-market": [0.1, 0.25],
};

// Condition multiplier — new/good dock returns most, poor dock is more like a discount avoided
const CONDITION_MULT: Record<DockCondition, number> = {
  new: 1.0,
  good: 0.95,
  fair: 0.75,
  poor: 0.55,
  none: 1.05,
};

const HOLDING_ADJ: Record<HoldingPeriod, number> = {
  "1-3": 0.9, // decay from newness eaten by depreciation before sale realizes value
  "3-7": 1.0, // sweet spot
  "7-15": 0.85,
  "15+": 0.65, // dock is aging, needs re-deck by sale
};

const BOAT_LIFT_BUMP = 0.08; // adds 8% to upper end when included

const LIMITS = {
  homeValue: { min: 100000, max: 20000000 },
  dockCost: { min: 500, max: 500000 },
};

export function validateInputs(i: Partial<RoiInputs>): string[] {
  const errs: string[] = [];
  const n = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  if (!n(i.homeValue) || (i.homeValue as number) < LIMITS.homeValue.min || (i.homeValue as number) > LIMITS.homeValue.max) {
    errs.push(`Home value must be between $${LIMITS.homeValue.min.toLocaleString()} and $${LIMITS.homeValue.max.toLocaleString()}.`);
  }
  if (!n(i.dockCost) || (i.dockCost as number) < LIMITS.dockCost.min || (i.dockCost as number) > LIMITS.dockCost.max) {
    errs.push(`Dock cost must be between $${LIMITS.dockCost.min.toLocaleString()} and $${LIMITS.dockCost.max.toLocaleString()}.`);
  }
  if (!i.neighborhood) errs.push("Pick a neighborhood tier.");
  if (!i.currentDockCondition) errs.push("Pick the current dock condition.");
  if (!i.holdingPeriod) errs.push("Pick a holding period.");
  return errs;
}

export function estimateDockRoi(inputs: RoiInputs): RoiResult {
  const errors = validateInputs(inputs);
  if (errors.length) throw new Error(`Invalid ROI inputs: ${errors.join(" ")}`);

  const [rLow, rHigh] = NEIGHBORHOOD_RETURN[inputs.neighborhood];
  const condMult = CONDITION_MULT[inputs.currentDockCondition];
  const holdMult = HOLDING_ADJ[inputs.holdingPeriod];
  const liftMult = inputs.boatLiftIncluded ? 1 + BOAT_LIFT_BUMP : 1;

  const midReturn = ((rLow + rHigh) / 2) * condMult * holdMult * liftMult;
  const lowReturn = rLow * condMult * holdMult * liftMult;
  const highReturn = rHigh * condMult * holdMult * liftMult;

  const valueUpliftLow = Math.round(inputs.dockCost * lowReturn);
  const valueUpliftMid = Math.round(inputs.dockCost * midReturn);
  const valueUpliftHigh = Math.round(inputs.dockCost * highReturn);

  const roiPct = Math.round(midReturn * 100);
  const paybackPct = Math.round((valueUpliftMid / inputs.dockCost) * 100);

  const breakdown = [
    { label: `Neighborhood base return (${labelNeighborhood(inputs.neighborhood)})`, amount: Math.round(((rLow + rHigh) / 2) * 100) },
    { label: `Condition adjustment (${labelCondition(inputs.currentDockCondition)})`, amount: Math.round((condMult - 1) * 100) },
    { label: `Holding period (${labelHoldingPeriod(inputs.holdingPeriod)})`, amount: Math.round((holdMult - 1) * 100) },
    { label: "Boat lift included", amount: inputs.boatLiftIncluded ? Math.round(BOAT_LIFT_BUMP * 100) : 0 },
  ];

  return {
    valueUpliftLow,
    valueUpliftMid,
    valueUpliftHigh,
    roiPct,
    paybackPct,
    breakdown,
    notes: buildNotes(inputs, roiPct),
    inputs,
  };
}

function buildNotes(i: RoiInputs, roi: number): string[] {
  const notes: string[] = [];
  notes.push("ROI ranges reflect Tampa Bay realtor interviews and MLS data — not a guarantee. Actual sale premium depends on comps, timing, and finish quality.");
  if (i.neighborhood === "deep-water") notes.push("Deep-water access is the single biggest lever. On the right canal, a $30k dock can add $50k+ to sale price if you sell within 5 years of the build.");
  if (i.neighborhood === "no-dock-market") notes.push("Consider carefully — in a market where buyers don&apos;t expect a dock, you may recover less than 25% at sale. Build for lifestyle, not resale.");
  if (i.currentDockCondition === "poor") notes.push("Replacing a failing dock is more a discount-avoided than a value-add. Buyers subtract far more from list price for a bad dock than they add for a new one.");
  if (i.holdingPeriod === "15+") notes.push("At 15+ years you'll have already re-decked or re-piled the dock once — factor a mid-life refresh into your true 'net' return.");
  if (roi < 30) notes.push("At this ROI, this build only makes sense if you plan to use and enjoy the dock. Don't do it for the resale math alone.");
  return notes;
}

export function labelNeighborhood(v: NeighborhoodTier): string {
  return {
    "deep-water": "Deep-water canal (open bay access)",
    navigable: "Navigable canal (bridge / depth limits)",
    "no-boat-access": "Waterfront but no boat access",
    "no-dock-market": "Lakefront / freshwater with weak dock market",
  }[v];
}
export function labelCondition(v: DockCondition): string {
  return { new: "New (0–2 yrs)", good: "Good", fair: "Fair", poor: "Poor / failing", none: "No existing dock" }[v];
}
export function labelHoldingPeriod(v: HoldingPeriod): string {
  return { "1-3": "1–3 years", "3-7": "3–7 years", "7-15": "7–15 years", "15+": "15+ years" }[v];
}
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export const DEFAULT_INPUTS: RoiInputs = {
  homeValue: 850000,
  dockCost: 22000,
  boatLiftIncluded: false,
  neighborhood: "navigable",
  currentDockCondition: "none",
  holdingPeriod: "3-7",
};
