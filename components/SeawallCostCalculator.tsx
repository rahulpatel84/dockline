"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_INPUTS,
  estimateSeawallCost,
  formatCurrency,
  labelCap,
  labelCounty,
  labelMaterial,
  labelTieback,
  labelWorkType,
  validateInputs,
  type CapType,
  type CountyKey,
  type SeawallInputs,
  type SeawallMaterial,
  type Tieback,
  type WorkType,
} from "@/lib/seawall-cost";

const materials: SeawallMaterial[] = ["vinyl", "concrete", "aluminum", "rip-rap", "steel"];
const tiebacks: Tieback[] = ["helical", "deadman", "batter", "none"];
const caps: CapType[] = ["concrete", "wood", "none"];
const counties: CountyKey[] = ["hillsborough", "pinellas", "manatee", "sarasota", "pasco", "other"];
const workTypes: WorkType[] = ["new", "replacement", "cap-only"];

type Field = keyof SeawallInputs;

export function SeawallCostCalculator() {
  const [inputs, setInputs] = useState<SeawallInputs>(DEFAULT_INPUTS);
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => {
    if (errors.length) return null;
    try {
      return estimateSeawallCost(inputs);
    } catch (e) {
      console.error("Seawall cost engine failure:", e);
      return null;
    }
  }, [inputs, errors]);

  const set = <K extends Field>(k: K, v: SeawallInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));
  const num = (k: Field, v: string, fallback: number) => {
    const n = parseFloat(v);
    set(k, (Number.isFinite(n) ? n : fallback) as never);
  };

  return (
    <div className="calc">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()} aria-label="Seawall cost inputs">
          <fieldset>
            <legend>Project scope</legend>
            <label className="calc-label" htmlFor="sw-work">Work type</label>
            <select id="sw-work" className="field" value={inputs.workType} onChange={(e) => set("workType", e.target.value as WorkType)}>
              {workTypes.map((v) => <option key={v} value={v}>{labelWorkType(v)}</option>)}
            </select>

            <div className="calc-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="calc-label" htmlFor="sw-length">Length (linear ft)</label>
                <input id="sw-length" className="field" type="number" inputMode="numeric" min={8} max={800} step={1}
                  value={inputs.lengthFt} onChange={(e) => num("lengthFt", e.target.value, DEFAULT_INPUTS.lengthFt)} />
              </div>
              <div>
                <label className="calc-label" htmlFor="sw-height">Retained height (ft)</label>
                <input id="sw-height" className="field" type="number" inputMode="numeric" min={2} max={20} step={0.5}
                  value={inputs.retainedHeightFt} onChange={(e) => num("retainedHeightFt", e.target.value, DEFAULT_INPUTS.retainedHeightFt)} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Materials</legend>
            <label className="calc-label" htmlFor="sw-mat">Wall material</label>
            <select id="sw-mat" className="field" value={inputs.material} onChange={(e) => set("material", e.target.value as SeawallMaterial)}>
              {materials.map((v) => <option key={v} value={v}>{labelMaterial(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="sw-tieback">Tieback style</label>
            <select id="sw-tieback" className="field" value={inputs.tieback} onChange={(e) => set("tieback", e.target.value as Tieback)}>
              {tiebacks.map((v) => <option key={v} value={v}>{labelTieback(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="sw-cap">Cap</label>
            <select id="sw-cap" className="field" value={inputs.cap} onChange={(e) => set("cap", e.target.value as CapType)}>
              {caps.map((v) => <option key={v} value={v}>{labelCap(v)}</option>)}
            </select>
          </fieldset>

          <fieldset>
            <legend>Location & extras</legend>
            <label className="calc-label" htmlFor="sw-county">County</label>
            <select id="sw-county" className="field" value={inputs.county} onChange={(e) => set("county", e.target.value as CountyKey)}>
              {counties.map((v) => <option key={v} value={v}>{labelCounty(v)}</option>)}
            </select>
            <label className="calc-check">
              <input type="checkbox" checked={inputs.removeExisting} onChange={(e) => set("removeExisting", e.target.checked)} />
              Remove existing seawall
            </label>
            <label className="calc-check">
              <input type="checkbox" checked={inputs.hasSeagrass} onChange={(e) => set("hasSeagrass", e.target.checked)} />
              Seagrass beds present (adds mitigation)
            </label>
          </fieldset>

          {errors.length > 0 && (
            <div className="calc-errors" role="alert">
              <b>Please fix:</b>
              <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
        </form>

        <aside className="calc-result" aria-live="polite">
          {result ? (
            <>
              <div className="calc-headline">
                <div className="calc-eyebrow">Estimated Tampa Bay seawall cost</div>
                <div className="calc-range">
                  <span className="calc-low">{formatCurrency(result.low)}</span>
                  <span className="calc-dash">–</span>
                  <span className="calc-high">{formatCurrency(result.high)}</span>
                </div>
                <div className="calc-mid">
                  Median: <b>{formatCurrency(result.mid)}</b> · ~
                  <b>{formatCurrency(result.perLinearFoot.mid)}</b>/linear ft
                </div>
              </div>

              <div className="calc-timeline">
                <div>
                  <span className="calc-tk">Permitting</span>
                  <b>{result.timelineWeeks.permitting[0]}–{result.timelineWeeks.permitting[1]} weeks</b>
                </div>
                <div>
                  <span className="calc-tk">Construction</span>
                  <b>{result.timelineWeeks.construction[0]}–{result.timelineWeeks.construction[1]} weeks</b>
                </div>
              </div>

              <h4>Cost breakdown</h4>
              <ul className="calc-breakdown">
                {result.breakdown.map((line) => (
                  <li key={line.label}>
                    <div>
                      <span className="calc-bd-label">{line.label}</span>
                      {line.detail && <small>{line.detail}</small>}
                    </div>
                    <b>{formatCurrency(line.amount)}</b>
                  </li>
                ))}
              </ul>

              {result.notes.length > 0 && (
                <div className="calc-notes">
                  <h5>Heads up</h5>
                  <ul>{result.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
              )}

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  Get 3 real seawall quotes →
                </Link>
                <p className="calc-cta-fine">Free. Matched to licensed marine contractors in your county.</p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your seawall project</h3>
              <p>Adjust length, height, and material to see your estimate.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
