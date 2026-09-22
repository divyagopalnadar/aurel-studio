/**
 * Build-time data source switch.
 *
 *   NEXT_PUBLIC_DATA_SOURCE=prisma (default)
 *     SQLite via Prisma, REST API routes (app/api/**\/route.prisma.ts) and
 *     server-side admin writes. Used by `npm run dev` / `npm run build`.
 *
 *   NEXT_PUBLIC_DATA_SOURCE=static
 *     Reads the catalog document (data/catalog.json) at build time and exports
 *     plain HTML for GitHub Pages. No server, no database, no API routes; the
 *     admin panel edits a copy of the catalog stored in the browser.
 *     Used by `npm run dev:static` / `npm run build:static`.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so this also works in
 * client components and lets the bundler drop the unused implementation.
 */
export type DataSource = "prisma" | "static";

export const DATA_SOURCE: DataSource =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "static" ? "static" : "prisma";

export const IS_STATIC = DATA_SOURCE === "static";

/** Sub-path the site is served from (e.g. "/aurel-studio" on GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixes a root-relative public path with the base path. next/link and the
 * framework's own assets handle this automatically, but `next/image` with
 * `unoptimized` and plain <img> tags use `src` verbatim.
 */
export function withBasePath(src: string): string {
  if (!BASE_PATH || !src.startsWith("/") || src.startsWith(`${BASE_PATH}/`)) {
    return src;
  }
  return `${BASE_PATH}${src}`;
}
