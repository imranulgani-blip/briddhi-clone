import { FUNDS } from "../data/funds";

// A market-terminal-style scrolling NAV feed. Pure CSS marquee, pauses on hover.
export default function TickerTape() {
  const items = FUNDS.map((f) => ({
    symbol: f.shortName,
    nav: f.current_nav,
    change: f.annual_return,
  }));
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...items, ...items];

  return (
    <div className="group/ticker relative border-y border-ink-700/40 bg-ink-900/50">
      <div className="marquee-mask overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-8 py-2.5">
          {loop.map((it, i) => {
            const up = it.change >= 0;
            return (
              <div key={i} className="flex items-center gap-2 whitespace-nowrap text-sm">
                <span className="font-semibold text-ink-200">{it.symbol}</span>
                <span className="mono text-ink-400">{it.nav.toFixed(3)}</span>
                <span className={`mono font-medium ${up ? "text-neon-400" : "text-rose-400"}`}>
                  {up ? "▲" : "▼"} {Math.abs(it.change).toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
