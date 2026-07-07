interface SparklineProps {
  seed: number;
  trend: number;
  width?: number;
  height?: number;
  points?: number;
  stroke?: string;
  fill?: string;
}

export default function Sparkline({
  seed,
  trend,
  width = 120,
  height = 32,
  points = 24,
  stroke,
  fill,
}: SparklineProps) {
  const positive = trend >= 0;
  const strokeColor = stroke ?? (positive ? "#4ade80" : "#ef4444");
  const fillColor = fill ?? (positive ? "rgba(74, 222, 128, 0.15)" : "rgba(239, 68, 68, 0.12)");

  let s = seed * 137 + 1;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const yearReturn = trend / 100;
  const monthly = yearReturn / 12;
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const growth = monthly + (rand() - 0.5) * 0.03;
    const v = i === 0 ? 100 : data[i - 1] * (1 + growth);
    data.push(v);
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (points - 1);
  const linePath = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none">
      <path d={areaPath} fill={fillColor} />
      <path d={linePath} fill="none" stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
