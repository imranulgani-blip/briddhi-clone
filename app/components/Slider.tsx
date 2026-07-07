"use client";

interface SliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  hint?: string;
}

export default function Slider({ label, value, onChange, min, max, step, format, hint }: SliderProps) {
  const formatted = format ? format(value) : value.toString();
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm text-ink-300">{label}</label>
        <div className="mono text-lg font-semibold text-neon-400">{formatted}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex items-center justify-between text-xs text-ink-500 mt-1 mono">
        <span>{format ? format(min) : min}</span>
        {hint && <span className="text-ink-400">{hint}</span>}
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}
