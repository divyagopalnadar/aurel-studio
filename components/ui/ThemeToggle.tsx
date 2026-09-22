"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/lib/icons";

const THEME_KEY = "aurel-theme";

type Theme = "dark" | "light";

// The <html> "dark" class is set before hydration by the inline script in
// app/layout.tsx, so it is the source of truth. Subscribing to it through
// useSyncExternalStore lets the server render a stable default and the client
// switch to the real theme right after hydration, without a mismatch.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const getServerSnapshot = (): Theme => "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  // keep color-scheme in sync for scrollbars/inputs
  root.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable (private mode) */
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => applyTheme(theme === "dark" ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className="grid size-10 place-items-center rounded-xl text-fg/60 transition-all duration-200 hover:bg-surface hover:text-fg"
    >
      {theme === "dark" ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  );
}
