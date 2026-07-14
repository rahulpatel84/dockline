"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import checklist from "@/data/storm-checklist.json";

type PhaseId = string;
type ItemId = string;
type CheckedMap = Record<PhaseId, Record<ItemId, boolean>>;

const STORAGE_KEY = "mdg_storm_checklist_v1";

function loadState(): CheckedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as CheckedMap;
  } catch (e) {
    console.error("Failed to load storm checklist state:", e);
  }
  return {};
}

function saveState(state: CheckedMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save storm checklist state:", e);
  }
}

export function StormChecklist() {
  const [checked, setChecked] = useState<CheckedMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(checked);
  }, [checked, hydrated]);

  const toggle = (phase: PhaseId, item: ItemId) => {
    setChecked((prev) => ({
      ...prev,
      [phase]: { ...(prev[phase] ?? {}), [item]: !prev[phase]?.[item] },
    }));
  };

  const resetPhase = (phase: PhaseId) => {
    setChecked((prev) => ({ ...prev, [phase]: {} }));
  };

  const resetAll = () => setChecked({});

  const stats = useMemo(() => {
    return checklist.phases.map((phase) => {
      const total = phase.items.length;
      const done = phase.items.filter((it) => checked[phase.id]?.[it.id]).length;
      return { id: phase.id, done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  }, [checked]);

  const overall = useMemo(() => {
    const total = checklist.phases.reduce((s, p) => s + p.items.length, 0);
    const done = stats.reduce((s, p) => s + p.done, 0);
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [stats]);

  return (
    <div className="storm-tool">
      <div className="storm-header">
        <div className="storm-progress">
          <div className="storm-progress-track">
            <div className="storm-progress-fill" style={{ width: `${overall.pct}%` }} />
          </div>
          <div className="storm-progress-label">
            <b>{overall.pct}%</b> — {overall.done} of {overall.total} tasks complete
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
            Print
          </button>
          <button type="button" className="btn btn-ghost" onClick={resetAll}>
            Reset all
          </button>
        </div>
      </div>

      {!hydrated && (
        <p style={{ color: "#5a6b6f", fontSize: "0.85rem" }}>Loading your saved progress...</p>
      )}

      {checklist.phases.map((phase, idx) => {
        const stat = stats[idx];
        return (
          <section key={phase.id} className="storm-phase">
            <header className="storm-phase-head">
              <div>
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
              </div>
              <div className="storm-phase-stat">
                <span>{stat.done}/{stat.total}</span>
                <button type="button" className="storm-phase-reset" onClick={() => resetPhase(phase.id)}>
                  Reset
                </button>
              </div>
            </header>
            <ul className="storm-items">
              {phase.items.map((item) => {
                const on = !!checked[phase.id]?.[item.id];
                return (
                  <li key={item.id} className={on ? "is-done" : ""}>
                    <label>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(phase.id, item.id)}
                      />
                      <span>{item.text}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="storm-cta">
        <h3>Need repairs before season?</h3>
        <p>If you spot damage or wear during your inspection, get quotes now — Tampa Bay marine contractors are booked solid by August.</p>
        <Link href="/quote" className="btn btn-coral">Get 3 free quotes →</Link>
      </div>
    </div>
  );
}
