const ITEMS = [
  "Complimentary shipping over $200",
  "Free returns within 30 days",
  "Natural fibres",
  "Free repairs for life",
  "Responsibly made in small runs",
  "Gift wrapping on request",
];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-edge bg-fg/[0.02] py-3.5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {row.map((item, i) => (
          <span
            key={i}
            // The second copy exists only for the seamless loop.
            aria-hidden={i >= ITEMS.length || undefined}
            className="flex items-center gap-10 text-[12px] font-medium uppercase tracking-[0.16em] text-faint"
          >
            {item}
            <span className="size-1 rounded-full bg-brand/60" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
