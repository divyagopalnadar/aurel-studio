import { BoxIcon } from "@/lib/icons";

const COLUMNS: { title: string; links: string[] }[] = [
  { title: "Shop", links: ["New arrivals", "Headphones", "Wearables", "Tech", "Accessories"] },
  { title: "Company", links: ["About", "Design philosophy", "Sustainability", "Careers"] },
  { title: "Support", links: ["Help center", "Shipping", "Returns", "Warranty", "Contact"] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-edge">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-brand/15 text-brand-soft ring-1 ring-inset ring-brand/30">
                <BoxIcon className="size-5" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-[15px] font-semibold text-fg">Aurél</span>
                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-faint">
                  Studio
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Thoughtfully engineered objects for the way you live, work, and move.
              Designed in California, made to last.
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
            © {new Date().getFullYear()} Aurél Studio. A fictional store — all products are imaginary.
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
