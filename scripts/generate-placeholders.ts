/**
 * Generates the placeholder artwork shown until real product photos exist:
 *
 *   public/images/products/<slug>-1.svg   packshot placeholder
 *   public/images/products/<slug>-2.svg   detail placeholder
 *   public/images/hero.svg                editorial hero placeholder
 *   public/images/placeholder.svg         generic fallback
 *
 * Everything is portrait 4:5, in the brand palette, and drawn from the catalog
 * in data/products.ts so names, categories and colours stay in sync. Real
 * photos (<slug>-1.jpg etc.) take precedence at runtime; see lib/images.ts.
 *
 * Run: npm run images:placeholders
 */
import fs from "node:fs";
import path from "node:path";
import { products, type Product } from "../data/products";

const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_DIR = path.join(ROOT, "public/images/products");
const IMAGES_DIR = path.join(ROOT, "public/images");

const W = 800;
const H = 1000;
const IVORY = "#f3eee6";
const CHARCOAL = "#1f1d1a";
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// ---------- colour helpers ----------
const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = (rgb: number[]) =>
  "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
/** Mixes `amount` (0–1) of `a` into `b`. */
const mix = (a: string, b: string, amount: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex(ca.map((v, i) => v * amount + cb[i] * (1 - amount)));
};
const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- line-art silhouettes (drawn in a 200 × 200 box) ----------
type Part =
  | { kind: "body"; d: string; fill?: string } // filled with the product colour
  | { kind: "line"; d: string } // thin charcoal detail
  | { kind: "band"; d: string; w: number; stroke?: string } // thick coloured stroke
  | { kind: "dot"; x: number; y: number; r: number };

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

const COAT = "M72 28 L100 42 L128 28 L160 44 Q170 48 172 60 L182 150 L162 153 L152 92 L154 186 L46 186 L48 92 L38 153 L18 150 L28 60 Q30 48 40 44 Z";
const JACKET = "M72 38 L100 50 L128 38 L160 52 Q170 56 172 68 L182 150 L162 153 L152 100 L152 166 L48 166 L48 100 L38 153 L18 150 L28 68 Q30 56 40 52 Z";
const KNIT = "M68 34 Q100 50 132 34 L166 50 Q176 54 178 66 L188 156 L162 160 L150 94 L152 170 L48 170 L50 94 L38 160 L12 156 L22 66 Q24 54 34 50 Z";
const SHIRT = "M74 34 L100 46 L126 34 L158 48 Q166 52 168 62 L178 118 L158 122 L148 84 L148 182 Q100 190 52 182 L52 84 L42 122 L22 118 L32 62 Q34 52 42 48 Z";

const SHAPES: Record<string, Part[]> = {
  coat: [
    { kind: "body", d: COAT },
    { kind: "line", d: "M72 28 L88 92 L100 42 M128 28 L112 92 L100 42 M100 92 L100 186 M60 142 L80 142 M120 142 L140 142" },
    { kind: "dot", x: 100, y: 112, r: 2.4 },
    { kind: "dot", x: 100, y: 136, r: 2.4 },
    { kind: "dot", x: 100, y: 160, r: 2.4 },
  ],
  jacket: [
    { kind: "body", d: JACKET },
    { kind: "line", d: "M72 38 Q100 64 128 38 M100 52 L100 166 M58 106 h26 v18 h-26 Z M116 106 h26 v18 h-26 Z M58 136 h26 v18 h-26 Z M116 136 h26 v18 h-26 Z" },
  ],
  quilted: [
    { kind: "body", d: JACKET },
    { kind: "line", d: "M100 50 L100 166 M52 118 L84 150 M52 150 L68 166 M60 102 L100 142 M100 110 L148 158 M116 102 L148 134 M52 134 L84 102 M68 166 L100 134 M100 150 L148 102 M116 166 L148 134" },
  ],
  knit: [
    { kind: "body", d: KNIT },
    { kind: "line", d: "M68 34 Q100 60 132 34 M50 160 L150 160 M14 146 L38 150 M162 150 L186 146" },
  ],
  cardigan: [
    { kind: "body", d: KNIT },
    { kind: "line", d: "M68 34 L100 104 L132 34 M100 104 L100 170 M50 160 L150 160 M14 146 L38 150 M162 150 L186 146" },
    { kind: "dot", x: 106, y: 116, r: 2.4 },
    { kind: "dot", x: 106, y: 134, r: 2.4 },
    { kind: "dot", x: 106, y: 152, r: 2.4 },
  ],
  rollneck: [
    { kind: "body", d: KNIT },
    { kind: "body", d: "M72 16 L128 16 L132 40 Q100 52 68 40 Z" },
    { kind: "line", d: "M50 160 L150 160 M14 146 L38 150 M162 150 L186 146 M80 60 Q88 72 80 84 Q72 96 80 108 Q88 120 80 132 Q72 144 80 156 M120 60 Q128 72 120 84 Q112 96 120 108 Q128 120 120 132 Q112 144 120 156 M100 56 L100 156" },
  ],
  shirt: [
    { kind: "body", d: SHIRT },
    { kind: "line", d: "M74 34 L86 60 L100 46 L114 60 L126 34 M100 46 L100 186 M112 84 h20 v22 h-20 Z" },
    { kind: "dot", x: 100, y: 74, r: 2 },
    { kind: "dot", x: 100, y: 98, r: 2 },
    { kind: "dot", x: 100, y: 122, r: 2 },
    { kind: "dot", x: 100, y: 146, r: 2 },
  ],
  overshirt: [
    { kind: "body", d: SHIRT },
    { kind: "line", d: "M74 34 L86 60 L100 46 L114 60 L126 34 M100 46 L100 186 M62 78 h24 v26 h-24 Z M114 78 h24 v26 h-24 Z" },
    { kind: "dot", x: 100, y: 80, r: 2.4 },
    { kind: "dot", x: 100, y: 112, r: 2.4 },
    { kind: "dot", x: 100, y: 144, r: 2.4 },
  ],
  tee: [
    { kind: "body", d: "M70 36 Q100 50 130 36 L166 54 L182 90 L156 100 L148 84 L148 178 L52 178 L52 84 L44 100 L18 90 L34 54 Z" },
    { kind: "line", d: "M70 36 Q100 60 130 36" },
  ],
  tote: [
    { kind: "band", d: "M66 86 Q66 30 100 30 Q134 30 134 86", w: 7 },
    { kind: "body", d: "M40 84 L160 84 L170 182 L30 182 Z" },
    { kind: "line", d: "M39 98 L161 98" },
  ],
  crossbody: [
    { kind: "band", d: "M50 98 Q28 18 100 16 Q172 18 150 98", w: 4 },
    { kind: "body", d: "M52 92 L148 92 Q156 92 156 100 L156 168 Q156 176 148 176 L52 176 Q44 176 44 168 L44 100 Q44 92 52 92 Z" },
    { kind: "line", d: "M44 104 Q100 152 156 104" },
    { kind: "dot", x: 100, y: 128, r: 4 },
  ],
  weekender: [
    { kind: "band", d: "M72 78 Q72 40 100 40 Q128 40 128 78", w: 7, stroke: "#6b4a2e" },
    { kind: "body", d: "M30 96 Q30 76 50 76 L150 76 Q170 76 170 96 L176 170 Q176 180 166 180 L34 180 Q24 180 24 170 Z" },
    { kind: "line", d: "M36 94 L164 94 M62 76 L62 180 M138 76 L138 180" },
  ],
  hoops: [
    { kind: "band", d: circle(62, 110, 32), w: 9 },
    { kind: "band", d: circle(138, 110, 32), w: 9 },
  ],
  ring: [
    { kind: "band", d: circle(100, 122, 44), w: 11 },
    { kind: "body", d: "M70 72 Q70 54 100 54 Q130 54 130 72 Q130 90 100 90 Q70 90 70 72 Z" },
  ],
  pendant: [
    { kind: "band", d: "M40 20 Q62 102 100 114 Q138 102 160 20", w: 2 },
    { kind: "body", d: "M100 116 C114 116 116 132 114 140 C112 150 88 150 86 140 C84 130 88 116 100 116 Z", fill: "#f4efe6" },
  ],
  scarf: [
    { kind: "body", d: "M60 30 Q100 10 140 30 L136 160 L110 160 L104 62 L96 62 L90 176 L64 176 Z" },
    { kind: "line", d: "M68 176 v10 M74 176 v10 M80 176 v10 M86 176 v10 M113 160 v10 M119 160 v10 M125 160 v10 M131 160 v10 M60 30 Q100 50 140 30" },
  ],
  belt: [
    { kind: "body", d: "M16 92 L176 92 Q186 102 176 112 L16 112 Z" },
    { kind: "band", d: "M56 84 h30 v36 h-30 Z", w: 5, stroke: "#b8955a" },
    { kind: "line", d: "M70 102 L98 102" },
    { kind: "dot", x: 124, y: 102, r: 2.4 },
    { kind: "dot", x: 140, y: 102, r: 2.4 },
    { kind: "dot", x: 156, y: 102, r: 2.4 },
  ],
  sunglasses: [
    { kind: "body", d: "M26 82 Q26 72 36 72 L80 72 Q92 72 92 84 L90 108 Q88 128 64 128 L50 128 Q28 128 26 108 Z" },
    { kind: "body", d: "M108 84 Q108 72 120 72 L164 72 Q174 72 174 82 L174 108 Q172 128 150 128 L136 128 Q112 128 110 108 Z" },
    { kind: "line", d: "M92 84 Q100 76 108 84 M26 80 L10 76 M174 80 L190 76" },
  ],
};

/** Picks a silhouette from keywords in the slug, falling back to the category. */
function shapeFor(p: Product): Part[] {
  const bySlug: [RegExp, string][] = [
    [/quilted/, "quilted"],
    [/overcoat|coat/, "coat"],
    [/jacket/, "jacket"],
    [/cardigan/, "cardigan"],
    [/rollneck|fisherman/, "rollneck"],
    [/overshirt/, "overshirt"],
    [/tee|t-shirt/, "tee"],
    [/shirt/, "shirt"],
    [/crossbody/, "crossbody"],
    [/weekender|duffle/, "weekender"],
    [/tote/, "tote"],
    [/hoop|earring/, "hoops"],
    [/ring/, "ring"],
    [/pendant|necklace/, "pendant"],
    [/scarf/, "scarf"],
    [/belt/, "belt"],
    [/sunglasses|glasses/, "sunglasses"],
  ];
  const match = bySlug.find(([re]) => re.test(p.slug));
  const byCategory: Record<string, string> = {
    Outerwear: "coat",
    Knitwear: "knit",
    "Shirts & Tops": "shirt",
    Bags: "tote",
    Jewelry: "ring",
    Accessories: "scarf",
  };
  return SHAPES[match?.[1] ?? byCategory[p.category] ?? "tote"];
}

function renderParts(parts: Part[], colour: string) {
  const outline = mix(CHARCOAL, colour, 0.55);
  return parts
    .map((part) => {
      switch (part.kind) {
        case "body":
          return `<path d="${part.d}" fill="${part.fill ?? colour}" stroke="${outline}" stroke-width="1.3" stroke-linejoin="round"/>`;
        case "line":
          return `<path d="${part.d}" fill="none" stroke="${outline}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>`;
        case "band":
          return `<path d="${part.d}" fill="none" stroke="${outline}" stroke-width="${part.w + 2}" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/><path d="${part.d}" fill="none" stroke="${part.stroke ?? colour}" stroke-width="${part.w}" stroke-linecap="round" stroke-linejoin="round"/>`;
        case "dot":
          return `<circle cx="${part.x}" cy="${part.y}" r="${part.r}" fill="${outline}"/>`;
      }
    })
    .join("\n    ");
}

// ---------- tiles ----------
const svg = (body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n${body}\n</svg>\n`;

function productTile(p: Product, variant: 1 | 2) {
  const colour = p.colors[0]?.hex ?? "#cdb994";
  const top = mix(colour, IVORY, variant === 1 ? 0.12 : 0.2);
  const bottom = mix(colour, IVORY, variant === 1 ? 0.22 : 0.3);
  const band = mix(CHARCOAL, IVORY, 0.03);

  // Packshot: whole item centred. Detail: the upper part of the item, close up.
  const transform =
    variant === 1
      ? "translate(170 130) scale(2.3)"
      : "translate(40 40) scale(3.6)";
  const caption = variant === 1 ? "Packshot · photo coming soon" : "Detail · photo coming soon";

  return svg(`  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${variant === 1 ? `<ellipse cx="400" cy="576" rx="200" ry="11" fill="${CHARCOAL}" opacity="0.1" filter="url(#soft)"/>` : ""}
  <g transform="${transform}">
    ${renderParts(shapeFor(p), colour)}
  </g>
  <rect y="800" width="${W}" height="200" fill="${band}" opacity="0.9"/>
  <text x="400" y="862" text-anchor="middle" font-family="${SANS}" font-size="17" letter-spacing="6" fill="${CHARCOAL}" fill-opacity="0.5">${escape(p.category.toUpperCase())}</text>
  <text x="400" y="912" text-anchor="middle" font-family="${SERIF}" font-size="40" font-weight="600" fill="${CHARCOAL}" fill-opacity="0.85">${escape(p.name)}</text>
  <text x="400" y="952" text-anchor="middle" font-family="${SANS}" font-size="13" letter-spacing="3" fill="${CHARCOAL}" fill-opacity="0.38">${escape(caption.toUpperCase())}</text>`);
}

function heroTile() {
  const sand = "#e4d9c6";
  const coat = SHAPES.coat;
  return svg(`  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ece4d6"/>
      <stop offset="1" stop-color="#d9cdb8"/>
    </linearGradient>
    <linearGradient id="arch" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6f1e8"/>
      <stop offset="1" stop-color="${sand}"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-200%" width="140%" height="500%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <path d="M170 1000 L170 420 A230 230 0 0 1 630 420 L630 1000 Z" fill="url(#arch)"/>
  <ellipse cx="400" cy="714" rx="210" ry="12" fill="${CHARCOAL}" opacity="0.12" filter="url(#soft)"/>
  <g transform="translate(160 256) scale(2.4)">
    ${renderParts(coat, "#b8875a")}
  </g>
  <text x="400" y="110" text-anchor="middle" font-family="${SANS}" font-size="18" letter-spacing="8" fill="${CHARCOAL}" fill-opacity="0.6">AURÉL STUDIO</text>
  <text x="400" y="170" text-anchor="middle" font-family="${SERIF}" font-size="44" font-style="italic" fill="${CHARCOAL}">Autumn / Winter 2026</text>
  <text x="400" y="212" text-anchor="middle" font-family="${SANS}" font-size="14" letter-spacing="3" fill="${CHARCOAL}" fill-opacity="0.4">EDITORIAL · PHOTO COMING SOON</text>`);
}

function genericTile() {
  return svg(`  <rect width="${W}" height="${H}" fill="${IVORY}"/>
  <text x="400" y="500" text-anchor="middle" font-family="${SERIF}" font-size="72" font-weight="600" fill="${CHARCOAL}" fill-opacity="0.35">Aurél</text>
  <text x="400" y="550" text-anchor="middle" font-family="${SANS}" font-size="16" letter-spacing="4" fill="${CHARCOAL}" fill-opacity="0.35">IMAGE UNAVAILABLE</text>`);
}

// ---------- write ----------
fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
const expected = new Set<string>();
for (const p of products) {
  for (const variant of [1, 2] as const) {
    const file = `${p.slug}-${variant}.svg`;
    expected.add(file);
    fs.writeFileSync(path.join(PRODUCTS_DIR, file), productTile(p, variant));
  }
}
fs.writeFileSync(path.join(IMAGES_DIR, "hero.svg"), heroTile());
fs.writeFileSync(path.join(IMAGES_DIR, "placeholder.svg"), genericTile());

// Remove placeholders for products that no longer exist (photos are untouched).
const stale = fs
  .readdirSync(PRODUCTS_DIR)
  .filter((f) => f.endsWith(".svg") && !expected.has(f));
for (const f of stale) fs.unlinkSync(path.join(PRODUCTS_DIR, f));

console.log(
  `Wrote ${expected.size} product placeholders, hero.svg and placeholder.svg` +
    (stale.length ? `; removed ${stale.length} stale SVGs.` : ".")
);
