import fs from "node:fs";
import path from "node:path";
import { withBasePath } from "./config";
import { PLACEHOLDER_IMAGE } from "./placeholder";

export { PLACEHOLDER_IMAGE };

const PUBLIC_DIR = path.join(process.cwd(), "public");

function existsInPublic(publicPath: string): boolean {
  try {
    return fs.statSync(path.join(PUBLIC_DIR, publicPath)).isFile();
  } catch {
    return false;
  }
}

/**
 * Resolves a local image path to the best file that exists under `public/`:
 * a real photo (`<name>.jpg`) wins, then the path as given, then the generated
 * placeholder (`<name>.svg`), then the generic placeholder. Remote URLs are
 * returned unchanged. Runs on the server only (it reads the filesystem; in the
 * static build that happens at build time), so dropping photos into
 * `public/images` needs no database or code change. The result includes the
 * base path when the site is served from a sub-path (GitHub Pages).
 */
export function resolveImage(src: string): string {
  if (!src.startsWith("/")) return src;
  const normalized = path.posix.normalize(src);
  if (normalized.includes("..")) return withBasePath(PLACEHOLDER_IMAGE);

  const stem = normalized.replace(/\.[a-z0-9]+$/i, "");
  for (const candidate of [`${stem}.jpg`, normalized, `${stem}.svg`]) {
    if (existsInPublic(candidate)) return withBasePath(candidate);
  }
  return withBasePath(PLACEHOLDER_IMAGE);
}

/** The editorial image used on the home page hero. */
export const heroImage = () => resolveImage("/images/hero.jpg");
