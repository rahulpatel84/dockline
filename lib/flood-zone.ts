import raw from "@/data/flood-zones.json";

export type ZoneCode = keyof typeof raw.zoneDefinitions;

export interface ZoneDefinition {
  code: string;
  name: string;
  risk: string;
  description: string;
  insuranceImpact: string;
  buildRules: string;
  annualRiskPct: number;
}

export interface FloodZoneResult {
  found: boolean;
  zip: string;
  primary: ZoneDefinition;
  secondary?: ZoneDefinition;
  bfeRange?: [number, number];
  localNotes?: string;
}

export function validateZip(zip: string): string | null {
  if (!/^\d{5}$/.test(zip)) return "Enter a 5-digit ZIP code.";
  return null;
}

export function lookupFloodZone(zip: string): FloodZoneResult {
  const err = validateZip(zip);
  if (err) throw new Error(err);

  const entry = (raw.zipZones as Record<string, { primary: string; secondary?: string; bfeRange: number[]; notes: string }>)[
    zip
  ];

  if (!entry) {
    // Fallback for ZIPs outside our Tampa Bay dataset — return X (unshaded) with a "not in our dataset" flag
    return {
      found: false,
      zip,
      primary: (raw.zoneDefinitions as Record<string, ZoneDefinition>).X,
      localNotes:
        "This ZIP isn't in our Tampa Bay–focused dataset. For an authoritative reading, use FEMA's Flood Map Service Center at msc.fema.gov.",
    };
  }

  const primary = (raw.zoneDefinitions as Record<string, ZoneDefinition>)[entry.primary];
  const secondary = entry.secondary
    ? (raw.zoneDefinitions as Record<string, ZoneDefinition>)[entry.secondary]
    : undefined;

  return {
    found: true,
    zip,
    primary,
    secondary,
    bfeRange: entry.bfeRange && entry.bfeRange.length === 2 ? [entry.bfeRange[0], entry.bfeRange[1]] : undefined,
    localNotes: entry.notes,
  };
}

export function labelZone(z: ZoneDefinition): string {
  return `${z.code} — ${z.name}`;
}
