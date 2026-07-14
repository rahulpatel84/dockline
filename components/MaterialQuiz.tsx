"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DEFAULT_INPUTS,
  labelAesthetic,
  labelCleaning,
  labelLongevity,
  labelMaterial,
  labelPriority,
  labelSun,
  labelTraffic,
  recommendMaterial,
  validateInputs,
  type Aesthetic,
  type Cleaning,
  type Longevity,
  type Priority,
  type QuizInputs,
  type Sun,
  type Traffic,
} from "@/lib/material-picker";

type Field = keyof QuizInputs;

const priorities: Priority[] = ["cheap-now", "cheap-lifetime", "premium-look"];
const longevities: Longevity[] = ["10-year", "20-year", "40-year"];
const suns: Sun[] = ["shaded", "mixed", "full-sun"];
const cleanings: Cleaning[] = ["never", "yearly", "monthly"];
const traffics: Traffic[] = ["light", "medium", "heavy"];
const aesthetics: Aesthetic[] = ["traditional", "modern", "warm"];

export function MaterialQuiz() {
  const [inputs, setInputs] = useState<QuizInputs>(DEFAULT_INPUTS);
  const errors = useMemo(() => validateInputs(inputs), [inputs]);
  const result = useMemo(() => {
    if (errors.length) return null;
    try { return recommendMaterial(inputs); } catch (e) { console.error(e); return null; }
  }, [inputs, errors]);

  const set = <K extends Field>(k: K, v: QuizInputs[K]) => setInputs((p) => ({ ...p, [k]: v }));

  return (
    <div className="calc">
      <div className="calc-grid">
        <form className="calc-form" onSubmit={(e) => e.preventDefault()} aria-label="Material recommender">
          <fieldset>
            <legend>Priorities</legend>

            <label className="calc-label" htmlFor="mq-prio">What matters most on cost?</label>
            <select id="mq-prio" className="field" value={inputs.priority} onChange={(e) => set("priority", e.target.value as Priority)}>
              {priorities.map((v) => <option key={v} value={v}>{labelPriority(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="mq-long">Longevity horizon</label>
            <select id="mq-long" className="field" value={inputs.longevity} onChange={(e) => set("longevity", e.target.value as Longevity)}>
              {longevities.map((v) => <option key={v} value={v}>{labelLongevity(v)}</option>)}
            </select>
          </fieldset>

          <fieldset>
            <legend>Environment</legend>

            <label className="calc-label" htmlFor="mq-sun">Sun exposure</label>
            <select id="mq-sun" className="field" value={inputs.sun} onChange={(e) => set("sun", e.target.value as Sun)}>
              {suns.map((v) => <option key={v} value={v}>{labelSun(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="mq-clean">Maintenance appetite</label>
            <select id="mq-clean" className="field" value={inputs.cleaning} onChange={(e) => set("cleaning", e.target.value as Cleaning)}>
              {cleanings.map((v) => <option key={v} value={v}>{labelCleaning(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="mq-traf">Traffic level</label>
            <select id="mq-traf" className="field" value={inputs.traffic} onChange={(e) => set("traffic", e.target.value as Traffic)}>
              {traffics.map((v) => <option key={v} value={v}>{labelTraffic(v)}</option>)}
            </select>

            <label className="calc-label" htmlFor="mq-aes">Aesthetic preference</label>
            <select id="mq-aes" className="field" value={inputs.aesthetic} onChange={(e) => set("aesthetic", e.target.value as Aesthetic)}>
              {aesthetics.map((v) => <option key={v} value={v}>{labelAesthetic(v)}</option>)}
            </select>
          </fieldset>

          {errors.length > 0 && (
            <div className="calc-errors" role="alert">
              <b>Answer all questions:</b><ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
            </div>
          )}
        </form>

        <aside className="calc-result" aria-live="polite">
          {result ? (
            <>
              <div className="calc-headline">
                <div className="calc-eyebrow">Your best-fit dock material</div>
                <div className="calc-range" style={{ fontSize: "1.8rem" }}>
                  {labelMaterial(result.primary.material)}
                </div>
                <div className="calc-mid">{result.summary}</div>
              </div>

              {result.primary.reasons.length > 0 && (
                <div className="fz-card">
                  <h4>Why it fits you</h4>
                  <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6, color: "#3d4a4d" }}>
                    {result.primary.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              <div className="fz-card">
                <h4>Runner-up: {labelMaterial(result.secondary.material)}</h4>
                <p style={{ margin: 0, color: "#3d4a4d" }}>
                  A close second if you want to reconsider — many builders will quote both.
                </p>
              </div>

              <h4>All materials, scored</h4>
              <ul className="calc-breakdown">
                {result.scores.map((s) => (
                  <li key={s.material}>
                    <div><span className="calc-bd-label">{labelMaterial(s.material)}</span></div>
                    <b>{s.score > 0 ? "+" : ""}{s.score}</b>
                  </li>
                ))}
              </ul>

              <div className="calc-cta">
                <Link href="/quote" className="btn btn-coral" style={{ width: "100%", justifyContent: "center" }}>
                  {result.ctaText}
                </Link>
                <p className="calc-cta-fine">Free. Matched to Tampa Bay builders who work with this material.</p>
              </div>
            </>
          ) : (
            <div className="calc-empty">
              <h3>Answer the questions</h3>
              <p>We&apos;ll score every material against your priorities and recommend the best fit.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
