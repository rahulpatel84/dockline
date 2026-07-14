"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_INPUTS,
  estimateDockCost,
  formatCurrency,
  labelBottom,
  labelCounty,
  labelDecking,
  labelDockType,
  labelPiling,
  validateInputs,
  type Bottom,
  type CountyKey,
  type Decking,
  type DockCostInputs,
  type DockType,
  type Piling,
} from "@/lib/dock-cost";

type Field = keyof DockCostInputs;

const dockTypes: DockType[] = ["fixed", "floating", "l-shape", "t-shape", "u-shape"];
const deckings: Decking[] = ["pressure-treated", "composite", "ipe", "aluminum"];
const pilings: Piling[] = ["wood", "concrete", "composite"];
const bottoms: Bottom[] = ["sand", "soft-mud", "rock", "mixed"];
const counties: CountyKey[] = ["hillsborough", "pinellas", "manatee", "sarasota", "pasco", "other"];

export function DockCostCalculator() {
  const [inputs, setInputs] = useState<DockCostInputs>(DEFAULT_INPUTS);

  const errors = useMemo(() => validateInputs(inputs), [inputs]);

  const result = useMemo(() => {
    if (errors.length) return null;
    try {
      return estimateDockCost(inputs);
    } catch (e) {
      console.error("Dock cost engine failure:", e);
      return null;
    }
  }, [inputs, errors]);

  const set = <K extends Field>(key: K, value: DockCostInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const num = (key: Field, value: string, fallback: number) => {
    const parsed = parseFloat(value);
    set(key, (Number.isFinite(parsed) ? parsed : fallback) as never);
  };

  return (
    <div className="calc">
      <div className="calc-grid">
        {/* ── INPUTS ── */}
        <form className="calc-form" onSubmit={(e) => e.preventDefault()} aria-label="Dock cost inputs">
          <fieldset>
            <legend>Your dock</legend>

            <label className="calc-label" htmlFor="dc-type">
              Dock type
            </label>
            <select
              id="dc-type"
              className="field"
              value={inputs.dockType}
              onChange={(e) => set("dockType", e.target.value as DockType)}
            >
              {dockTypes.map((v) => (
                <option key={v} value={v}>
                  {labelDockType(v)}
                </option>
              ))}
            </select>

            <div className="calc-row">
              <div>
                <label className="calc-label" htmlFor="dc-length">
                  Length (ft)
                </label>
                <input
                  id="dc-length"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={4}
                  max={300}
                  step={1}
                  value={inputs.lengthFt}
                  onChange={(e) => num("lengthFt", e.target.value, DEFAULT_INPUTS.lengthFt)}
                />
              </div>
              <div>
                <label className="calc-label" htmlFor="dc-width">
                  Width (ft)
                </label>
                <input
                  id="dc-width"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={3}
                  max={40}
                  step={1}
                  value={inputs.widthFt}
                  onChange={(e) => num("widthFt", e.target.value, DEFAULT_INPUTS.widthFt)}
                />
              </div>
              <div>
                <label className="calc-label" htmlFor="dc-depth">
                  Water depth (ft)
                </label>
                <input
                  id="dc-depth"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={25}
                  step={0.5}
                  value={inputs.waterDepthFt}
                  onChange={(e) => num("waterDepthFt", e.target.value, DEFAULT_INPUTS.waterDepthFt)}
                />
              </div>
            </div>

            <label className="calc-label" htmlFor="dc-bottom">
              Bottom
            </label>
            <select
              id="dc-bottom"
              className="field"
              value={inputs.bottom}
              onChange={(e) => set("bottom", e.target.value as Bottom)}
            >
              {bottoms.map((v) => (
                <option key={v} value={v}>
                  {labelBottom(v)}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>Materials</legend>

            <label className="calc-label" htmlFor="dc-decking">
              Decking
            </label>
            <select
              id="dc-decking"
              className="field"
              value={inputs.decking}
              onChange={(e) => set("decking", e.target.value as Decking)}
            >
              {deckings.map((v) => (
                <option key={v} value={v}>
                  {labelDecking(v)}
                </option>
              ))}
            </select>

            <label className="calc-label" htmlFor="dc-piling">
              Pilings
            </label>
            <select
              id="dc-piling"
              className="field"
              value={inputs.piling}
              onChange={(e) => set("piling", e.target.value as Piling)}
            >
              {pilings.map((v) => (
                <option key={v} value={v}>
                  {labelPiling(v)}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>Location</legend>
            <label className="calc-label" htmlFor="dc-county">
              County
            </label>
            <select
              id="dc-county"
              className="field"
              value={inputs.county}
              onChange={(e) => set("county", e.target.value as CountyKey)}
            >
              {counties.map((v) => (
                <option key={v} value={v}>
                  {labelCounty(v)}
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset>
            <legend>Add-ons</legend>
            <label className="calc-check">
              <input
                type="checkbox"
                checked={inputs.hasRoof}
                onChange={(e) => set("hasRoof", e.target.checked)}
              />
              Roof / boathouse cover
            </label>
            <label className="calc-check">
              <input
                type="checkbox"
                checked={inputs.hasWaterElectric}
                onChange={(e) => set("hasWaterElectric", e.target.checked)}
              />
              Water &amp; electric
            </label>
            <label className="calc-check">
              <input
                type="checkbox"
                checked={inputs.hasLighting}
                onChange={(e) => set("hasLighting", e.target.checked)}
              />
              Lighting
            </label>
            <label className="calc-check">
              <input
                type="checkbox"
                checked={inputs.hasKayakLaunch}
                onChange={(e) => set("hasKayakLaunch", e.target.checked)}
              />
              Kayak / jetski launch
            </label>
            <label className="calc-check">
              <input
                type="checkbox"
                checked={inputs.addBoatLift}
                onChange={(e) => set("addBoatLift", e.target.checked)}
              />
              Boat lift
            </label>
            {inputs.addBoatLift && (
              <div style={{ marginTop: 10 }}>
                <label className="calc-label" htmlFor="dc-lift">
                  Boat lift capacity (lb)
                </label>
                <input
                  id="dc-lift"
                  className="field"
                  type="number"
                  inputMode="numeric"
                  min={2000}
                  max={40000}
                  step={500}
                  value={inputs.boatLiftWeightLb}
                  onChange={(e) => num("boatLiftWeightLb", e.target.value, 10000)}
                />
              </div>
            )}
          </fieldset>

          {errors.length > 0 && (
            <div className="calc-errors" role="alert">
              <b>Please fix:</b>
              <ul>
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {/* ── RESULTS ── */}
        <aside className="calc-result" aria-live="polite">
          {result ? (
            <>
              <div className="calc-headline">
                <div className="calc-eyebrow">Estimated Tampa Bay dock cost</div>
                <div className="calc-range">
                  <span className="calc-low">{formatCurrency(result.low)}</span>
                  <span className="calc-dash">–</span>
                  <span className="calc-high">{formatCurrency(result.high)}</span>
                </div>
                <div className="calc-mid">
                  Median: <b>{formatCurrency(result.mid)}</b>
                </div>
              </div>

              <div className="calc-timeline">
                <div>
                  <span className="calc-tk">Permitting</span>
                  <b>
                    {result.timelineWeeks.permitting[0]}–{result.timelineWeeks.permitting[1]} weeks
                  </b>
                </div>
                <div>
                  <span className="calc-tk">Construction</span>
                  <b>
                    {result.timelineWeeks.construction[0]}–{result.timelineWeeks.construction[1]} weeks
                  </b>
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
                  <ul>
                    {result.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  Get 3 real quotes for this build →
                </Link>
                <p className="calc-cta-fine">Free. No obligation. Matched to licensed local builders only.</p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your project</h3>
              <p>Adjust the inputs on the left to see your estimate.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
