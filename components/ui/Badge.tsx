import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "brand" | "green" | "amber" | "neutral" | "rose";

const tones: Record<Tone, string> = {
  brand: "bg-brand/15 text-brand-soft ring-brand/30",
  green: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/25 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/25",
  amber: "bg-amber-500/10 text-amber-600 ring-amber-500/25 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/25",
  neutral: "bg-fg/[0.06] text-fg/70 ring-edge",
  rose: "bg-rose-500/10 text-rose-600 ring-rose-500/25 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/25",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] ring-1 ring-inset backdrop-blur",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
