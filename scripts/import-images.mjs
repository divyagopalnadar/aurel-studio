/**
 * Imports product photos from incoming-images/ into public/images.
 *
 *   incoming-images/<slug>-1.(png|jpg|jpeg|webp)  -> public/images/products/<slug>-1.jpg
 *   incoming-images/<slug>-2.(png|jpg|jpeg|webp)  -> public/images/products/<slug>-2.jpg
 *   incoming-images/hero.(png|jpg|jpeg|webp)      -> public/images/hero.jpg
 *
 * Each image is centre-cropped to 4:5, resized to 1600 × 2000 and saved as an
 * optimised JPEG. Known slugs come from the generated placeholders
 * (public/images/products/<slug>-1.svg), which mirror data/products.ts.
 *
 * Exits with code 1 if any file name is not recognised (valid files are still
 * imported). Run: npm run images:import
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const INCOMING = path.join(ROOT, "incoming-images");
const PUBLIC_IMAGES = path.join(ROOT, "public/images");
const PRODUCTS = path.join(PUBLIC_IMAGES, "products");

const WIDTH = 1600;
const HEIGHT = 2000;
const QUALITY = 82;
const INPUT_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const rel = (p) => path.relative(ROOT, p);

function knownSlugs() {
  const slugs = new Set();
  for (const file of fs.readdirSync(PRODUCTS)) {
    const match = file.match(/^(.+)-[12]\.(svg|jpg)$/);
    if (match) slugs.add(match[1]);
  }
  return slugs;
}

/** Maps an incoming file name to its destination, or explains why it can't. */
function destinationFor(file, slugs) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, path.extname(file)).toLowerCase();
  if (!INPUT_EXTS.has(ext)) {
    return { error: `unsupported type "${ext || "none"}" (use png, jpg or webp)` };
  }
  if (base === "hero") return { dest: path.join(PUBLIC_IMAGES, "hero.jpg") };

  const match = base.match(/^(.+)-([12])$/);
  if (!match) {
    return { error: 'name must be "<slug>-1", "<slug>-2" or "hero"' };
  }
  const [, slug, n] = match;
  if (!slugs.has(slug)) return { error: `unknown product slug "${slug}"` };
  return { dest: path.join(PRODUCTS, `${slug}-${n}.jpg`) };
}

async function main() {
  if (!fs.existsSync(INCOMING)) {
    fs.mkdirSync(INCOMING, { recursive: true });
    console.log(
      `Created ${rel(INCOMING)}/. Drop <slug>-1/-2 and hero images there and run this again.`
    );
    return;
  }

  const slugs = knownSlugs();
  const files = fs
    .readdirSync(INCOMING)
    .filter((f) => !f.startsWith(".") && fs.statSync(path.join(INCOMING, f)).isFile());

  const imported = [];
  const rejected = [];
  const warnings = [];

  for (const file of files) {
    const { dest, error } = destinationFor(file, slugs);
    if (error) {
      rejected.push(`${file}: ${error}`);
      continue;
    }
    const src = path.join(INCOMING, file);
    try {
      const { width = 0, height = 0 } = await sharp(src).metadata();
      if (width < WIDTH || height < HEIGHT) {
        warnings.push(`${file} is ${width}×${height}; it will be upscaled to ${WIDTH}×${HEIGHT}.`);
      }
      await sharp(src)
        .rotate() // respect EXIF orientation
        .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(dest);
      imported.push(`${file} -> ${rel(dest)}`);
    } catch (e) {
      rejected.push(`${file}: could not be processed (${e.message})`);
    }
  }

  // Which expected photos are still missing (their placeholders stay in use)?
  const expected = ["hero.jpg", ...[...slugs].sort().flatMap((s) => [`products/${s}-1.jpg`, `products/${s}-2.jpg`])];
  const missing = expected.filter((f) => !fs.existsSync(path.join(PUBLIC_IMAGES, f)));

  console.log(`Imported ${imported.length} image(s).`);
  for (const line of imported) console.log(`  ✓ ${line}`);
  for (const line of warnings) console.log(`  ! ${line}`);

  if (missing.length) {
    console.log(`\n${missing.length} of ${expected.length} photos still missing (placeholders are shown):`);
    for (const f of missing) console.log(`  - public/images/${f}`);
  } else {
    console.log(`\nAll ${expected.length} photos are in place.`);
  }

  if (rejected.length) {
    console.error(`\n${rejected.length} file(s) not recognised:`);
    for (const line of rejected) console.error(`  ✗ ${line}`);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
