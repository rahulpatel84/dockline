import raw from "@/data/permits.json";

export type ProjectType = keyof typeof raw.matrix;
export type CountyKey = keyof typeof raw.counties;

export interface PermitAgency {
  name: string;
  url: string;
  typicalWeeks: [number, number];
  note?: string;
}

export interface PermitResult {
  county: string;
  project: string;
  agencies: PermitAgency[];
  notes: string[];
  totalWeeks: [number, number];
}

export interface PermitInputs {
  county: CountyKey;
  projectType: ProjectType;
}

export function validateInputs(i: Partial<PermitInputs>): string[] {
  const errs: string[] = [];
  if (!i.county || !(i.county in raw.counties)) errs.push("Pick a valid county.");
  if (!i.projectType || !(i.projectType in raw.matrix)) errs.push("Pick a valid project type.");
  return errs;
}

export function lookupPermits(inputs: PermitInputs): PermitResult {
  const errors = validateInputs(inputs);
  if (errors.length) throw new Error(`Invalid permit inputs: ${errors.join(" ")}`);

  const county = raw.counties[inputs.county];
  const project = raw.matrix[inputs.projectType];
  const agencies: PermitAgency[] = [];

  if (project.requires.buildingDept) {
    agencies.push(normalizeAgency(county.buildingDept));
  }
  if (project.requires.environmental && "environmental" in county && county.environmental) {
    agencies.push(normalizeAgency(county.environmental));
  }
  if (project.requires.fdep) agencies.push(normalizeAgency(raw.state.fdep));
  if (project.requires.acoe) agencies.push(normalizeAgency(raw.federal.acoe));

  const totalWeeks: [number, number] = agencies.length
    ? [Math.max(...agencies.map((a) => a.typicalWeeks[0])), Math.max(...agencies.map((a) => a.typicalWeeks[1]))]
    : [0, 0];

  return {
    county: county.name,
    project: project.label,
    agencies,
    notes: project.notes,
    totalWeeks,
  };
}

function normalizeAgency(a: {
  name: string;
  url: string;
  typicalWeeks: number[];
  note?: string;
}): PermitAgency {
  return {
    name: a.name,
    url: a.url,
    typicalWeeks: [a.typicalWeeks[0] ?? 0, a.typicalWeeks[1] ?? 0],
    note: a.note,
  };
}

export function labelProjectType(v: ProjectType): string {
  return raw.matrix[v].label;
}
export function labelCounty(v: CountyKey): string {
  return raw.counties[v].name;
}
export const COUNTY_KEYS = Object.keys(raw.counties) as CountyKey[];
export const PROJECT_KEYS = Object.keys(raw.matrix) as ProjectType[];

export const DEFAULT_INPUTS: PermitInputs = {
  county: "hillsborough",
  projectType: "new-dock",
};
