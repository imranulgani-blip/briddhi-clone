// Subtle Bangladeshi banknote watermark tucked into every page corner.
// Fixed, non-interactive, very low opacity so it reads on both the light
// pages and the dark portal without disturbing content.

function Note({ denom }: { denom: string }) {
  return (
    <svg viewBox="0 0 300 150" width="300" height="150" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="294" height="144" rx="14" strokeWidth="2" />
      <rect x="12" y="12" width="276" height="126" rx="9" strokeOpacity="0.5" />
      <g strokeOpacity="0.45">
        <ellipse cx="150" cy="75" rx="72" ry="42" />
        <ellipse cx="150" cy="75" rx="56" ry="31" />
        <ellipse cx="150" cy="75" rx="40" ry="20" />
      </g>
      <circle cx="58" cy="75" r="30" strokeOpacity="0.7" />
      <text x="238" y="70" textAnchor="middle" fontSize="30" fontWeight="800" fill="currentColor" stroke="none">
        ৳{denom}
      </text>
      <text x="238" y="90" textAnchor="middle" fontSize="11" fontWeight="700" letterSpacing="2" fill="currentColor" stroke="none">
        TAKA
      </text>
      <text x="150" y="129" textAnchor="middle" fontSize="10" letterSpacing="3" fill="currentColor" stroke="none">
        BANGLADESH
      </text>
      <text x="26" y="34" fontSize="15" fontWeight="700" fill="currentColor" stroke="none">
        {denom}
      </text>
      <text x="274" y="140" textAnchor="end" fontSize="15" fontWeight="700" fill="currentColor" stroke="none">
        {denom}
      </text>
    </svg>
  );
}

export default function CornerNotes() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
      <div className="absolute -left-16 -top-10 rotate-[-16deg] text-emerald-500 opacity-[0.08]">
        <Note denom="500" />
      </div>
      <div className="absolute -right-16 -top-8 rotate-[14deg] text-violet-500 opacity-[0.08]">
        <Note denom="1000" />
      </div>
      <div className="absolute -bottom-12 -left-20 rotate-[13deg] text-violet-500 opacity-[0.08]">
        <Note denom="1000" />
      </div>
      <div className="absolute -bottom-10 -right-16 rotate-[-15deg] text-emerald-500 opacity-[0.08]">
        <Note denom="500" />
      </div>
    </div>
  );
}
