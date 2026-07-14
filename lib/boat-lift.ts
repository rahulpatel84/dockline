/**
 * Boat Lift Capacity Sizing Engine
 *
 * The industry rule of thumb is 20–25% safety margin over the boat's fully-loaded
 * weight. We apply 25% by default (Tampa Bay salt + storm risk warrants a bigger
 * margin). This engine returns the required lift class and flags borderline sizing.
 */

export type LiftStyle = "four-post" | "elevator" | "cradle" | "pwc";
export type EngineType = "outboard-single" | "outboard-twin" | "inboard" | "io" | "electric";

export interface BoatLiftInputs {
  boatLengthFt: number;
  dryWeightLb: number;
  engineType: EngineType;
  fuelCapGal: number; // usable fuel tank
  waterCapGal: number; // fresh water tank (if any)
  gearWeightLb: number; // batteries, safety equipment, coolers, tackle, people-at-dock
  liftStyle: LiftStyle;
  safetyMarginPct: number; // 0.15–0.35 typical
}

export interface BoatLiftResult {
  fullyLoadedLb: number;
  requiredCapacityLb: number;
  recommendedClass: number; // 6000, 8000, 10000, ...
  headroomLb: number;
  headroomPct: number;
  isBorderline: boolean;
  liftStyle: LiftStyle;
  warnings: string[];
  breakdown: { label: string; amount: number }[];
  inputs: BoatLiftInputs;
}

// Standard commercial lift capacity classes (lb)
export const LIFT_CLASSES = [
  4500, 6000, 8000, 10000, 12500, 16000, 20000, 24000, 30000, 40000,
] as const;

export const FUEL_LB_PER_GAL = 6.1; // marine gasoline avg
export const WATER_LB_PER_GAL = 8.34;

const LIMITS = {
  boatLengthFt: { min: 8, max: 60 },
  dryWeightLb: { min: 300, max: 40000 },
  fuelCapGal: { min: 0, max: 400 },
  waterCapGal: { min: 0, max: 200 },
  gearWeightLb: { min: 0, max: 3000 },
  safetyMarginPct: { min: 0.1, max: 0.5 },
};

export function validateInputs(i: Partial<BoatLiftInputs>): string[] {
  const errs: string[] = [];
  const n = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  if (!i.engineType) errs.push("Pick an engine type.");
  if (!i.liftStyle) errs.push("Pick a lift style.");
  const check = (k: keyof typeof LIMITS, name: string) => {
    const v = i[k as keyof BoatLiftInputs] as number | undefined;
    const { min, max } = LIMITS[k];
    if (!n(v) || (v as number) < min || (v as number) > max) errs.push(`${name} must be between ${min} and ${max}.`);
  };
  check("boatLengthFt", "Boat length (ft)");
  check("dryWeightLb", "Dry weight (lb)");
  check("fuelCapGal", "Fuel capacity (gal)");
  check("waterCapGal", "Water capacity (gal)");
  check("gearWeightLb", "Gear weight (lb)");
  check("safetyMarginPct", "Safety margin (0.1–0.5)");
  return errs;
}

export function sizeBoatLift(inputs: BoatLiftInputs): BoatLiftResult {
  const errors = validateInputs(inputs);
  if (errors.length) throw new Error(`Invalid boat lift inputs: ${errors.join(" ")}`);

  const fuelLb = inputs.fuelCapGal * FUEL_LB_PER_GAL;
  const waterLb = inputs.waterCapGal * WATER_LB_PER_GAL;

  const fullyLoadedLb = Math.round(inputs.dryWeightLb + fuelLb + waterLb + inputs.gearWeightLb);
  const requiredCapacityLb = Math.round(fullyLoadedLb * (1 + inputs.safetyMarginPct));
  const recommendedClass = pickLiftClass(requiredCapacityLb);

  const headroomLb = recommendedClass - fullyLoadedLb;
  const headroomPct = fullyLoadedLb > 0 ? headroomLb / fullyLoadedLb : 0;
  const isBorderline = recommendedClass < requiredCapacityLb || headroomPct < inputs.safetyMarginPct;

  const warnings: string[] = [];
  if (isBorderline) warnings.push("Your fully-loaded weight is close to the next lift class. Bump up one class before ordering.");
  if (inputs.liftStyle === "cradle" && inputs.boatLengthFt < 20) warnings.push("Cradle lifts are usually overkill under 20 ft. A 4-post lift will save you $2–4k and is easier to service.");
  if (inputs.engineType === "outboard-twin" && recommendedClass < 12500) warnings.push("Twin outboards move the boat's center of gravity aft — spec a lift rated for the higher class even if the weight is on the line.");
  if (inputs.dryWeightLb > 0 && fuelLb < inputs.dryWeightLb * 0.05) warnings.push("Fuel capacity seems very low — did you enter it correctly? Under-sizing here is the classic way to blow a lift cable.");

  const breakdown = [
    { label: "Dry weight", amount: inputs.dryWeightLb },
    { label: `Fuel (${inputs.fuelCapGal} gal × ${FUEL_LB_PER_GAL} lb)`, amount: Math.round(fuelLb) },
    { label: `Water (${inputs.waterCapGal} gal × ${WATER_LB_PER_GAL} lb)`, amount: Math.round(waterLb) },
    { label: "Gear, batteries, people at dock", amount: inputs.gearWeightLb },
    { label: `Safety margin (${Math.round(inputs.safetyMarginPct * 100)}%)`, amount: requiredCapacityLb - fullyLoadedLb },
  ];

  return {
    fullyLoadedLb,
    requiredCapacityLb,
    recommendedClass,
    headroomLb,
    headroomPct,
    isBorderline,
    liftStyle: inputs.liftStyle,
    warnings,
    breakdown,
    inputs,
  };
}

function pickLiftClass(required: number): number {
  for (const c of LIFT_CLASSES) if (c >= required) return c;
  return LIFT_CLASSES[LIFT_CLASSES.length - 1];
}

export function labelEngineType(v: EngineType): string {
  return {
    "outboard-single": "Single outboard",
    "outboard-twin": "Twin outboards",
    inboard: "Inboard",
    io: "I/O sterndrive",
    electric: "Electric",
  }[v];
}
export function labelLiftStyle(v: LiftStyle): string {
  return { "four-post": "4-post", elevator: "Elevator", cradle: "Cradle", pwc: "PWC / jetski" }[v];
}
export function formatLb(n: number): string {
  return `${new Intl.NumberFormat("en-US").format(n)} lb`;
}

export const DEFAULT_INPUTS: BoatLiftInputs = {
  boatLengthFt: 24,
  dryWeightLb: 4200,
  engineType: "outboard-single",
  fuelCapGal: 80,
  waterCapGal: 12,
  gearWeightLb: 400,
  liftStyle: "four-post",
  safetyMarginPct: 0.25,
};
