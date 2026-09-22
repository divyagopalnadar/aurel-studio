import fs from "node:fs";
import path from "node:path";

/** Generic fallback for products with no usable image at all. */
export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

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
 * returned unchanged. Runs on the server only (it reads the filesystem), so
 * dropping photos into `public/images` needs no database or code change.
 */
export function resolveImage(src: string): string {
  if (!src.startsWith("/")) return src;
  const normalized = path.posix.normalize(src);
  if (normalized.includes("..")) return PLACEHOLDER_IMAGE;

  const stem = normalized.replace(/\.[a-z0-9]+$/i, "");
  for (const candidate of [`${stem}.jpg`, normalized, `${stem}.svg`]) {
    if (existsInPublic(candidate)) return candidate;
  }
  return PLACEHOLDER_IMAGE;
}

/** The editorial image used on the home page hero. */
export const heroImage = () => resolveImage("/images/hero.jpg");
