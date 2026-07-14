"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_INPUTS,
  formatLb,
  labelEngineType,
  labelLiftStyle,
  sizeBoatLift,
  validateInputs,
  type BoatLiftInputs,
  type EngineType,
  type LiftStyle,
} from "@/lib/boat-lift";

const engines: EngineType[] = ["outboard-single", "outboard-twin", "inboard", "io", "electric"];
const styles: LiftStyle[] = ["four-post", "elevator", "cradle", "pwc"];

type Field = keyof BoatLiftInputs;

export function BoatLiftSizer() {
  const [inputs, setInputs] = useState<BoatLiftInputs>(DEFAULT_INPUTS);
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => {
    if (errors.length) return null;
    try { return sizeBoatLift(inputs); } catch (e) { console.error(e); return null; }
  }, [inputs, errors]);

  const set = <K extends Field>(k: K, v: BoatLiftInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));
  const num = (k: Field, v: string, fb: number) => {
    const n = parseFloat(v);
    set(k, (Number.isFinite(n) ? n : fb) as never);
  };

  return (
    <div className="calc">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()} aria-label="Boat lift sizer inputs">
          <fieldset>
            <legend>Your boat</legend>
            <div className="calc-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div>
                <label className="calc-label" htmlFor="bl-len">Boat length (ft)</label>
                <input id="bl-len" className="field" type="number" min={8} max={60} step={0.5}
                  value={inputs.boatLengthFt} onChange={(e) => num("boatLengthFt", e.target.value, DEFAULT_INPUTS.boatLengthFt)} />
              </div>
              <div>
                <label className="calc-label" htmlFor="bl-dry">Dry weight (lb)</label>
                <input id="bl-dry" className="field" type="number" min={300} max={40000} step={50}
                  value={inputs.dryWeightLb} onChange={(e) => num("dryWeightLb", e.target.value, DEFAULT_INPUTS.dryWeightLb)} />
              </div>
            </div>

            <label className="calc-label" htmlFor="bl-eng">Engine setup</label>
            <select id="bl-eng" className="field" value={inputs.engineType} onChange={(e) => set("engineType", e.target.value as EngineType)}>
              {engines.map((v) => <option key={v} value={v}>{labelEngineType(v)}</option>)}
            </select>
          </fieldset>

          <fieldset>
            <legend>Fuel, water, gear</legend>
            <div className="calc-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div>
                <label className="calc-label" htmlFor="bl-fuel">Fuel (gal)</label>
                <input id="bl-fuel" className="field" type="number" min={0} max={400} step={1}
                  value={inputs.fuelCapGal} onChange={(e) => num("fuelCapGal", e.target.value, DEFAULT_INPUTS.fuelCapGal)} />
              </div>
              <div>
                <label className="calc-label" htmlFor="bl-water">Water (gal)</label>
                <input id="bl-water" className="field" type="number" min={0} max={200} step={1}
                  value={inputs.waterCapGal} onChange={(e) => num("waterCapGal", e.target.value, DEFAULT_INPUTS.waterCapGal)} />
              </div>
              <div>
                <label className="calc-label" htmlFor="bl-gear">Gear (lb)</label>
                <input id="bl-gear" className="field" type="number" min={0} max={3000} step={25}
                  value={inputs.gearWeightLb} onChange={(e) => num("gearWeightLb", e.target.value, DEFAULT_INPUTS.gearWeightLb)} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Lift preferences</legend>
            <label className="calc-label" htmlFor="bl-style">Lift style</label>
            <select id="bl-style" className="field" value={inputs.liftStyle} onChange={(e) => set("liftStyle", e.target.value as LiftStyle)}>
              {styles.map((v) => <option key={v} value={v}>{labelLiftStyle(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="bl-margin">Safety margin ({Math.round(inputs.safetyMarginPct * 100)}%)</label>
            <input id="bl-margin" className="field" type="range" min={0.1} max={0.5} step={0.05}
              value={inputs.safetyMarginPct} onChange={(e) => num("safetyMarginPct", e.target.value, DEFAULT_INPUTS.safetyMarginPct)} />
            <small style={{ color: "#5a6b6f" }}>Industry standard: 20–25%. Tampa Bay salt + storm risk: 25%+.</small>
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
                <div className="calc-eyebrow">Recommended lift class</div>
                <div className="calc-range" style={{ fontSize: "2.6rem" }}>
                  {formatLb(result.recommendedClass)}
                </div>
                <div className="calc-mid">
                  Fully loaded: <b>{formatLb(result.fullyLoadedLb)}</b> · Required with safety: <b>{formatLb(result.requiredCapacityLb)}</b>
                </div>
                <div className="calc-mid" style={{ color: result.isBorderline ? "#8a2b1e" : "#3aa681", marginTop: 6 }}>
                  Headroom: <b>{formatLb(result.headroomLb)} ({Math.round(result.headroomPct * 100)}%)</b>
                  {result.isBorderline ? " · borderline" : " · comfortable"}
                </div>
              </div>

              <h4>Weight breakdown</h4>
              <ul className="calc-breakdown">
                {result.breakdown.map((line) => (
                  <li key={line.label}>
                    <div><span className="calc-bd-label">{line.label}</span></div>
                    <b>{formatLb(line.amount)}</b>
                  </li>
                ))}
              </ul>

              {result.warnings.length > 0 && (
                <div className="calc-notes">
                  <h5>Watch out</h5>
                  <ul>{result.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
                </div>
              )}

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  Get quotes for a {formatLb(result.recommendedClass)} lift →
                </Link>
                <p className="calc-cta-fine">We match to lift installers who spec + install in your ZIP.</p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter your boat</h3>
              <p>Length, dry weight, fuel, and gear determine the lift class you need.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
