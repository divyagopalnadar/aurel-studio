const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Shop", links: ["New arrivals", "Outerwear", "Knitwear", "Bags", "Jewelry"] },
  { title: "Studio", links: ["Our story", "Materials", "Responsibility", "Stores"] },
  { title: "Client care", links: ["Contact", "Shipping", "Returns", "Repairs", "Size guide"] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-edge">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-[26px] font-semibold leading-none tracking-tight text-fg">
                Aurél
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-faint">
                Studio
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Clothing and accessories in natural materials, made in small runs
              by people who take their time. Designed to be worn for years.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-semibold text-fg/90">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-fg"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-edge/70 pt-6 sm:flex-row">
          <p className="text-[12px] text-faint">
            © {new Date().getFullYear()} Aurél Studio. A fictional store; all products are imaginary.
          </p>
          <div className="flex items-center gap-5 text-[12px] text-faint">
            <a href="#" className="transition-colors hover:text-fg">Privacy</a>
            <a href="#" className="transition-colors hover:text-fg">Terms</a>
            <span className="text-faint/70">/</span>
            <span className="font-mono text-faint">EST. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
