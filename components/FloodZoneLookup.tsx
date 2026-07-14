"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { lookupFloodZone, validateZip, type FloodZoneResult } from "@/lib/flood-zone";

export function FloodZoneLookup() {
  const [zip, setZip] = useState("33606");
  const [submitted, setSubmitted] = useState("33606");

  const validationError = useMemo(() => validateZip(submitted), [submitted]);

  const result: FloodZoneResult | null = useMemo(() => {
    if (validationError) return null;
    try {
      return lookupFloodZone(submitted);
    } catch (e) {
      console.error("Flood zone lookup failure:", e);
      return null;
    }
  }, [submitted, validationError]);

  return (
    <div className="calc">
      <div className="calc-grid">
        <form
          className="calc-form"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(zip.trim());
          }}
          aria-label="Flood zone lookup"
        >
          <fieldset>
            <legend>Look up your ZIP</legend>
            <label className="calc-label" htmlFor="fz-zip">Tampa Bay ZIP code</label>
            <input
              id="fz-zip"
              className="field"
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              placeholder="33606"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^\d]/g, "").slice(0, 5))}
            />
            <button type="submit" className="btn btn-ocean" style={{ marginTop: 14 }}>
              Look up
            </button>
            <p style={{ fontSize: "0.82rem", color: "#5a6b6f", marginTop: 12 }}>
              This tool covers ZIPs in Hillsborough, Pinellas, Manatee, and Sarasota counties. For an authoritative
              national reading, use{" "}
              <a href="https://msc.fema.gov/portal/home" target="_blank" rel="noopener noreferrer">
                FEMA MSC
              </a>
              .
            </p>
          </fieldset>

          {validationError && (
            <div className="calc-errors" role="alert">
              <b>Please fix:</b>
              <ul>
                <li>{validationError}</li>
              </ul>
            </div>
          )}
        </form>

        <aside className="calc-result" aria-live="polite">
          {result ? (
            <>
              <div className="calc-headline">
                <div className="calc-eyebrow">Estimated flood zone for {result.zip}</div>
                <div className="calc-range" style={{ fontSize: "2.4rem" }}>
                  {result.primary.code}
                </div>
                <div className="calc-mid">
                  {result.primary.name}
                  {result.secondary && (
                    <>
                      {" "}· secondary <b>{result.secondary.code}</b>
                    </>
                  )}
                </div>
                {result.bfeRange && (
                  <div className="calc-mid" style={{ marginTop: 4 }}>
                    Typical Base Flood Elevation: <b>{result.bfeRange[0]}–{result.bfeRange[1]} ft NAVD88</b>
                  </div>
                )}
              </div>

              <div className="fz-card">
                <h4>Risk level: {result.primary.risk}</h4>
                <p>{result.primary.description}</p>
              </div>
              <div className="fz-card">
                <h4>Insurance impact</h4>
                <p>{result.primary.insuranceImpact}</p>
              </div>
              <div className="fz-card">
                <h4>What you can build</h4>
                <p>{result.primary.buildRules}</p>
              </div>

              {result.localNotes && (
                <div className="calc-notes">
                  <h5>Local Tampa Bay note</h5>
                  <ul><li>{result.localNotes}</li></ul>
                </div>
              )}

              {!result.found && (
                <div className="calc-notes" style={{ background: "#fff2f0", borderColor: "#ffcac3" }}>
                  <h5 style={{ color: "#8a2b1e" }}>ZIP not in dataset</h5>
                  <p style={{ color: "#8a2b1e", fontSize: "0.85rem" }}>
                    We only maintain detailed data for Tampa Bay ZIPs. The result shown is a default — check FEMA MSC for a real reading.
                  </p>
                </div>
              )}

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  Get a Tampa Bay dock quote →
                </Link>
                <p className="calc-cta-fine">
                  Licensed builders here design for the actual BFE + wind rules on your lot.
                </p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Enter a ZIP</h3>
              <p>We&apos;ll show flood zone, BFE range, insurance impact, and what you can build.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
