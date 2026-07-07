interface DataPoint {
  label: string;
  invested: number;
  value: number;
}

interface GrowthChartProps {
  data: DataPoint[];
  height?: number;
}

const fmt = (n: number) => {
  if (n >= 10_000_000) return `৳${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000) return `৳${(n / 100_000).toFixed(1)}L`;
  if (n >= 1000) return `৳${(n / 1000).toFixed(0)}k`;
  return `৳${Math.round(n)}`;
};

export default function GrowthChart({ data, height = 260 }: GrowthChartProps) {
  if (data.length === 0) return null;
  const width = 640;
  const padL = 44;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

  const max = Math.max(...data.map((d) => d.value)) * 1.05;
  const min = 0;
  const range = max - min || 1;

  const x = (i: number) => padL + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padT + innerH - ((v - min) / range) * innerH;

  const linePath = (key: "invested" | "value") =>
    data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`)
      .join(" ");
  const areaPath = `${linePath("value")} L ${x(data.length - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  const gridLines = 4;
  const gridStep = max / gridLines;

  const labelStep = Math.max(1, Math.floor(data.length / 6));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: "block" }}>
      {/* grid + y labels */}
      {Array.from({ length: gridLines + 1 }, (_, i) => {
        const v = min + gridStep * i;
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={padL} x2={width - padR} y1={yy} y2={yy} stroke="#1a2338" strokeWidth={1} />
            <text x={padL - 8} y={yy + 3} textAnchor="end" className="mono" fill="#6b7898" fontSize="10">
              {fmt(v)}
            </text>
          </g>
        );
      })}

      {/* value area */}
      <path d={areaPath} fill="rgba(74, 222, 128, 0.15)" />

      {/* invested line (dashed) */}
      <path
        d={linePath("invested")}
        fill="none"
        stroke="#6b7898"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        strokeLinecap="round"
      />

      {/* value line */}
      <path d={linePath("value")} fill="none" stroke="#4ade80" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />

      {/* end dot */}
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].value)} r={4} fill="#4ade80" stroke="#05070d" strokeWidth={2} />

      {/* x labels */}
      {data.map((d, i) =>
        i % labelStep === 0 || i === data.length - 1 ? (
          <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fill="#6b7898" fontSize="10">
            {d.label}
          </text>
        ) : null
      )}
    </svg>
  );
}
