type Stage = "aware" | "consider" | "decide";

const colors: Record<Stage, [string, string]> = {
  aware: ["#6fc5bc", "#15808f"],
  consider: ["#e8a33d", "#d98a1f"],
  decide: ["#f2683c", "#d9512a"],
};

export function ThumbSVG({ stage }: { stage: Stage }) {
  const [c0, c1] = colors[stage];
  const gid = `g-${stage}`;
  return (
    <svg viewBox="0 0 400 168" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c0} />
          <stop offset="1" stopColor={c1} />
        </linearGradient>
      </defs>
      <rect width="400" height="168" fill={`url(#${gid})`} />
      <path
        d="M0,120 C90,150 150,90 240,115 C320,138 360,100 400,118 L400,168 L0,168 Z"
        fill="rgba(255,255,255,.18)"
      />
      <path
        d="M0,138 C100,165 180,110 260,135 C330,156 370,128 400,140 L400,168 L0,168 Z"
        fill="rgba(255,255,255,.25)"
      />
      <g stroke="#fff" strokeWidth={3} fill="none" opacity={0.85}>
        <path d="M150,95 h100 M165,95 v-30 l35-18 35,18 v30" />
      </g>
    </svg>
  );
}
