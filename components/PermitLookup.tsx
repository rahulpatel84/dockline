"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  COUNTY_KEYS,
  DEFAULT_INPUTS,
  PROJECT_KEYS,
  labelCounty,
  labelProjectType,
  lookupPermits,
  validateInputs,
  type CountyKey,
  type PermitInputs,
  type ProjectType,
} from "@/lib/permit-lookup";

export function PermitLookup() {
  const [inputs, setInputs] = useState<PermitInputs>(DEFAULT_INPUTS);
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => {
    if (errors.length) return null;
    try { return lookupPermits(inputs); } catch (e) { console.error(e); return null; }
  }, [inputs, errors]);

  return (
    <div className="calc">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()} aria-label="Permit lookup inputs">
          <fieldset>
            <legend>Your project</legend>

            <label className="calc-label" htmlFor="pl-county">County</label>
            <select id="pl-county" className="field" value={inputs.county}
              onChange={(e) => setInputs((p) => ({ ...p, county: e.target.value as CountyKey }))}>
              {COUNTY_KEYS.map((v) => <option key={v} value={v}>{labelCounty(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="pl-project">Project type</label>
            <select id="pl-project" className="field" value={inputs.projectType}
              onChange={(e) => setInputs((p) => ({ ...p, projectType: e.target.value as ProjectType }))}>
              {PROJECT_KEYS.map((v) => <option key={v} value={v}>{labelProjectType(v)}</option>)}
            </select>
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
                <div className="calc-eyebrow">Permits you&apos;ll need</div>
                <div className="calc-range" style={{ fontSize: "1.5rem" }}>
                  {result.agencies.length} {result.agencies.length === 1 ? "agency" : "agencies"}
                </div>
                <div className="calc-mid">
                  Typical review window: <b>{result.totalWeeks[0]}–{result.totalWeeks[1]} weeks</b>
                </div>
              </div>

              <ul className="permit-list">
                {result.agencies.map((a) => (
                  <li key={a.name}>
                    <a href={a.url} target="_blank" rel="noopener noreferrer">
                      <b>{a.name}</b>
                    </a>
                    <small>Typical review: {a.typicalWeeks[0]}–{a.typicalWeeks[1]} weeks</small>
                    {a.note && <p>{a.note}</p>}
                  </li>
                ))}
              </ul>

              {result.notes.length > 0 && (
                <div className="calc-notes">
                  <h5>What most people miss</h5>
                  <ul>{result.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                </div>
              )}

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  Get a builder to handle the permits →
                </Link>
                <p className="calc-cta-fine">Most licensed builders pull all permits as part of their scope. Ask us to match you.</p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Pick your county and project</h3>
              <p>We&apos;ll list every agency you need + typical review timelines.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
