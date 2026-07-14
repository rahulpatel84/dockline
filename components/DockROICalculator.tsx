"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_INPUTS,
  estimateDockRoi,
  formatCurrency,
  labelCondition,
  labelHoldingPeriod,
  labelNeighborhood,
  validateInputs,
  type DockCondition,
  type HoldingPeriod,
  type NeighborhoodTier,
  type RoiInputs,
} from "@/lib/dock-roi";

const neighborhoods: NeighborhoodTier[] = ["deep-water", "navigable", "no-boat-access", "no-dock-market"];
const conditions: DockCondition[] = ["none", "new", "good", "fair", "poor"];
const holds: HoldingPeriod[] = ["1-3", "3-7", "7-15", "15+"];

type Field = keyof RoiInputs;

export function DockROICalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(DEFAULT_INPUTS);
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => {
    if (errors.length) return null;
    try { return estimateDockRoi(inputs); } catch (e) { console.error(e); return null; }
  }, [inputs, errors]);

  const set = <K extends Field>(k: K, v: RoiInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));
  const num = (k: Field, v: string, fb: number) => {
    const n = parseFloat(v);
    set(k, (Number.isFinite(n) ? n : fb) as never);
  };

  return (
    <div className="calc">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()} aria-label="Dock ROI inputs">
          <fieldset>
            <legend>Your property</legend>
            <div className="calc-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="calc-label" htmlFor="ro-home">Home value ($)</label>
                <input id="ro-home" className="field" type="number" min={100000} max={20000000} step={10000}
                  value={inputs.homeValue} onChange={(e) => num("homeValue", e.target.value, DEFAULT_INPUTS.homeValue)} />
              </div>
              <div>
                <label className="calc-label" htmlFor="ro-dock">Dock cost ($)</label>
                <input id="ro-dock" className="field" type="number" min={500} max={500000} step={500}
                  value={inputs.dockCost} onChange={(e) => num("dockCost", e.target.value, DEFAULT_INPUTS.dockCost)} />
              </div>
            </div>

            <label className="calc-label" htmlFor="ro-hood">Neighborhood tier</label>
            <select id="ro-hood" className="field" value={inputs.neighborhood}
              onChange={(e) => set("neighborhood", e.target.value as NeighborhoodTier)}>
              {neighborhoods.map((v) => <option key={v} value={v}>{labelNeighborhood(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="ro-cond">Current dock condition</label>
            <select id="ro-cond" className="field" value={inputs.currentDockCondition}
              onChange={(e) => set("currentDockCondition", e.target.value as DockCondition)}>
              {conditions.map((v) => <option key={v} value={v}>{labelCondition(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="ro-hold">Holding period before sale</label>
            <select id="ro-hold" className="field" value={inputs.holdingPeriod}
              onChange={(e) => set("holdingPeriod", e.target.value as HoldingPeriod)}>
              {holds.map((v) => <option key={v} value={v}>{labelHoldingPeriod(v)}</option>)}
            </select>

            <label className="calc-check">
              <input type="checkbox" checked={inputs.boatLiftIncluded}
                onChange={(e) => set("boatLiftIncluded", e.target.checked)} />
              Boat lift included in the build
            </label>
          </fieldset>

          {errors.length > 0 && (
            <div className="calc-errors" role="alert">
              <b>Please fix:</b><ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
        </form>

        <aside className="calc-result" aria-live="polite">
          {result ? (
            <>
              <div className="calc-headline">
                <div className="calc-eyebrow">Estimated home value uplift</div>
                <div className="calc-range">
                  <span className="calc-low">{formatCurrency(result.valueUpliftLow)}</span>
                  <span className="calc-dash">–</span>
                  <span className="calc-high">{formatCurrency(result.valueUpliftHigh)}</span>
                </div>
                <div className="calc-mid">
                  Mid estimate: <b>{formatCurrency(result.valueUpliftMid)}</b> — that&apos;s <b>{result.paybackPct}%</b> of the dock cost recovered at sale.
                </div>
              </div>

              <h4>What drives your ROI</h4>
              <ul className="calc-breakdown">
                {result.breakdown.map((line) => (
                  <li key={line.label}>
                    <div><span className="calc-bd-label">{line.label}</span></div>
                    <b>{line.amount >= 0 ? "+" : ""}{line.amount}%</b>
                  </li>
                ))}
              </ul>

              {result.notes.length > 0 && (
                <div className="calc-notes">
                  <h5>Realtor reality check</h5>
                  <ul>{result.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
              )}

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  Get quotes for this build →
                </Link>
                <p className="calc-cta-fine">Know the number before you commit.</p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Estimate your dock ROI</h3>
              <p>Enter home value, dock cost, and location tier to see the resale math.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
