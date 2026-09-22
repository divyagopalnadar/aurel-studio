/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/images/products");
fs.mkdirSync(OUT, { recursive: true });

// Slug -> meta (kept in sync with data/products.ts)
const META = [
  { slug: "aurelia-wireless-headphones", glyph: "headphones", hue: 230 },
  { slug: "echolink-earbuds-pro", glyph: "earbuds", hue: 210 },
  { slug: "pulsebeat-speaker", glyph: "speaker", hue: 190 },
  { slug: "lumina-smartwatch", glyph: "watch", hue: 245 },
  { slug: "halo-fitness-ring", glyph: "ring", hue: 265 },
  { slug: "neoeeyes-camera", glyph: "camera", hue: 205 },
  { slug: "terraplant-planter", glyph: "planter", hue: 150 },
  { slug: "driftwood-diffuser", glyph: "diffuser", hue: 330 },
  { slug: "mercury-wireless-mouse", glyph: "mouse", hue: 225 },
  { slug: "keywave-mechanical-keyboard", glyph: "keyboard", hue: 175 },
  { slug: "aerolite-carry-bag", glyph: "bag", hue: 30 },
  { slug: "hydra-smart-bottle", glyph: "bottle", hue: 200 },
  { slug: "soundwave-studio-headphones", glyph: "headphones", hue: 205 },
  { slug: "orbit-4k-drone", glyph: "drone", hue: 220 },
  { slug: "glowthal-table-lamp", glyph: "lamp", hue: 40 },
  { slug: "solace-earbuds-lite", glyph: "earbuds", hue: 205 },
  { slug: "swift-usb-c-hub", glyph: "hub", hue: 260 },
  { slug: "ember-smart-clock", glyph: "alarm", hue: 100 },
  { slug: "nova-charging-dock", glyph: "dock", hue: 285 },
  { slug: "frost-insulated-bottle", glyph: "bottle", hue: 210 },
];

// s and l are percentages (0–100), matching CSS hsl().
function hsl(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * col)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const fmt = (n) => Math.round(n * 100) / 100;

// ---------- Backgrounds ----------
function baseGradient(hue, floor) {
  const c0 = hsl(hue + 90, 42, 14);
  const c1 = hsl(hue + 20, 46, 8);
  return `
  <radialGradient id="bg" cx="50%" cy="${fmt(48 - floor)}%" r="85%">
    <stop offset="0%" stop-color="${hsl(hue, 55, floor + 16)}"/>
    <stop offset="60%" stop-color="${c0}"/>
    <stop offset="100%" stop-color="${c1}"/>
  </radialGradient>`;
}

function glowGradient(hue) {
  return `
  <radialGradient id="glow" cx="50%" cy="42%" r="60%">
    <stop offset="0%" stop-color="${hsl(hue, 90, 62)}" stop-opacity="0.55"/>
    <stop offset="55%" stop-color="${hsl(hue, 80, 48)}" stop-opacity="0.14"/>
    <stop offset="100%" stop-color="${hsl(hue, 70, 40)}" stop-opacity="0"/>
  </radialGradient>`;
}

function bodyGrad(id, hue, l1, l2, s = 55) {
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${hsl(hue, s, l1)}"/>
    <stop offset="100%" stop-color="${hsl(hue, s, l2)}"/>
  </linearGradient>`;
}

function metalGrad(id, hue, light = 82, dark = 34) {
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${hsl(hue, 12, light)}"/>
    <stop offset="100%" stop-color="${hsl(hue, 26, dark)}"/>
  </linearGradient>`;
}

function whoosh(id, c) {
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="${c}" stop-opacity="0"/>
    <stop offset="50%" stop-color="${c}" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
  </linearGradient>`;
}

function glassReflect() {
  return `<linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0.32"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02"/>
  </linearGradient>`;
}

const defs = (hue, floor = 16) => {
  // Shared paints referenced by every glyph painter and the glass overlay.
  const extra = `
    ${metalGrad("metal", hue + 12, 78, 30)}
    ${metalGrad("metalSoft", hue + 12, 66, 24)}
    ${bodyGrad("acc", hue, 62, 42)}
    ${bodyGrad("accLight", hue, 78, 60)}
    ${bodyGrad("unit", hue, 34, 18, 48)}
    ${bodyGrad("unitSoft", hue, 28, 16, 44)}
    ${whoosh("sheen", "#ffffff")}
    ${glassReflect()}`;
  return baseGradient(hue, floor) + glowGradient(hue) + extra;
};

const softFilter = `<filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur stdDeviation="18"/>
</filter>`;

const glass = `<rect x="10" y="10" width="880" height="880" rx="48" fill="url(#glass)" opacity="0.5"/>`;

// ---------- Glyph painters (each draws product centered ~ [150,150,600,600]) ----------
const G = {
  headphones(hue, accent) {
    const body = bodyGrad("ph", hue, 40, 22, 46);
    const pad = bodyGrad("pad", hue + 20, 20, 12, 50);
    const accFill = accent ? `url(#acc)` : hsl(hue, 60, 55);
    return `
      <defs>${body}${pad}</defs>
      <ellipse cx="230" cy="430" rx="52" ry="120" transform="rotate(-18 230 430)" fill="url(#ph)" />
      <path d="M268 420 A232 232 0 0 1 632 420" stroke="${accFill}" stroke-width="26" fill="none" stroke-linecap="round"/>
      <path d="M238 320 C238 240 330 180 450 180 C570 180 662 240 662 320"
            stroke="url(#metalSoft)" stroke-width="26" fill="none" stroke-linecap="round"/>
      <ellipse cx="662" cy="430" rx="52" ry="120" transform="rotate(18 662 430)" fill="url(#ph)" />
      <rect x="222" y="354" width="36" height="150" rx="18" fill="url(#pad)"/>
      <rect x="642" y="354" width="36" height="150" rx="18" fill="url(#pad)"/>
      <path d="M300 470 C300 520 360 560 450 560 C540 560 600 520 600 470"
            stroke="url(#metalSoft)" stroke-width="20" fill="none" stroke-linecap="round"/>
      <ellipse cx="340" cy="470" rx="14" ry="34" fill="#ffffff" opacity="0.12"/>
      <ellipse cx="560" cy="470" rx="14" ry="34" fill="#ffffff" opacity="0.12"/>
      <path d="M250 430 M586 430" stroke="url(#sheen)" stroke-width="40" opacity="0.4"/>
    `;
  },
  earbuds(hue, accent) {
    const accFill = accent ? `url(#acc)` : hsl(hue, 60, 55);
    return `
      <path d="M300 520 Q120 520 150 360 Q180 220 305 360 Q430 220 455 360 Q485 520 310 520 Z"
            fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <rect x="196" y="250" width="88" height="150" rx="44" fill="${accFill}"/>
      <rect x="323" y="250" width="88" height="150" rx="44" fill="${accFill}"/>
      <circle cx="240" cy="270" r="20" fill="url(#unit)"/>
      <circle cx="367" cy="270" r="20" fill="url(#unit)"/>
      <rect x="458" y="420" width="150" height="84" rx="30" fill="url(#metalSoft)"/>
      <rect x="470" y="446" width="126" height="34" rx="17" fill="url(#accLight)"/>
      <circle cx="520" cy="440" r="16" fill="url(#acc)" opacity="0.5"/>
    `;
  },
  speaker(hue, accent) {
    return `
      <rect x="300" y="200" width="260" height="360" rx="96" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <circle cx="430" cy="380" r="120" fill="url(#unitSoft)"/>
      <circle cx="430" cy="380" r="120" fill="none" stroke="url(#acc)" stroke-width="6" opacity="0.9"/>
      <circle cx="430" cy="380" r="52" fill="url(#acc)"/>
      <circle cx="430" cy="300" r="26" fill="url(#accLight)"/>
      <path d="M430 226 L430 550" stroke="url(#sheen)" stroke-width="14" opacity="0.35"/>
    `;
  },
  watch(hue, accent) {
    return `
      <rect x="400" y="170" width="100" height="200" rx="26" fill="url(#metalSoft)"/>
      <path d="M400 260 H360 V560 H400" stroke="url(#metalSoft)" stroke-width="34" fill="none" stroke-linecap="round"/>
      <path d="M500 260 H540 V560 H500" stroke="url(#metalSoft)" stroke-width="34" fill="none" stroke-linecap="round"/>
      <rect x="360" y="250" width="180" height="330" rx="46" fill="url(#metal)"/>
      <rect x="378" y="272" width="144" height="286" rx="34" fill="url(#unit)"/>
      <circle cx="450" cy="360" r="44" fill="url(#acc)"/>
      <rect x="392" y="500" width="116" height="10" rx="5" fill="url(#accLight)"/>
      <rect x="422" y="478" width="56" height="6" rx="3" fill="#ffffff" opacity="0.5"/>
    `;
  },
  ring(hue, accent) {
    return `
      <circle cx="450" cy="320" r="150" fill="none" stroke="url(#metal)" stroke-width="56" />
      <circle cx="450" cy="320" r="150" fill="none" stroke="url(#metalSoft)" stroke-width="18" opacity="0.6"/>
      <circle cx="450" cy="320" r="124" fill="none" stroke="url(#acc)" stroke-width="10" opacity="0.85"/>
      <circle cx="450" cy="320" r="150" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.35"/>
      <path d="M450 150 L450 320" stroke="#ffffff" stroke-width="8" opacity="0.4"/>
      <ellipse cx="450" cy="600" rx="170" ry="14" fill="#000000" opacity="0.3" filter="url(#soft)"/>
    `;
  },
  camera(hue, accent) {
    return `
      <rect x="230" y="300" width="440" height="180" rx="34" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <path d="M320 300 L350 230 H550 L580 300" fill="url(#unitSoft)" stroke="url(#metalSoft)" stroke-width="6"/>
      <circle cx="450" cy="390" r="88" fill="url(#unitSoft)"/>
      <circle cx="450" cy="390" r="88" fill="none" stroke="url(#metal)" stroke-width="10"/>
      <circle cx="450" cy="390" r="52" fill="url(#acc)"/>
      <circle cx="450" cy="390" r="26" fill="url(#unit)"/>
      <rect x="330" y="330" width="26" height="16" rx="6" fill="url(#accLight)"/>
      <ellipse cx="590" cy="330" rx="8" ry="6" fill="url(#metalSoft)"/>
    `;
  },
  planter(hue, accent) {
    return `
      <path d="M420 300 Q330 300 330 228 Q330 150 420 150 Q510 150 510 228 Q510 300 420 300 Z"
            fill="url(#unitSoft)"/>
      <path d="M420 300 Q360 300 400 258 Q360 258 420 340 Q480 258 440 258 Q480 300 420 300 Z"
            fill="url(#acc)" opacity="0.9"/>
      <path d="M360 250 Q350 180 380 160 M480 250 Q490 180 460 160 M420 260 Q420 170 420 150"
            stroke="url(#unit)" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M300 300 H540" stroke="url(#metalSoft)" stroke-width="26" stroke-linecap="round"/>
      <rect x="282" y="312" width="276" height="160" rx="26" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <circle cx="360" cy="392" r="18" fill="url(#accLight)"/>
      <circle cx="450" cy="392" r="18" fill="url(#accLight)"/>
      <circle cx="540" cy="392" r="18" fill="url(#accLight)"/>
    `;
  },
  diffuser(hue, accent) {
    return `
      <path d="M360 330 Q360 286 450 286 Q540 286 540 330 L560 470 Q560 520 450 520 Q340 520 340 470 Z"
            fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <path d="M350 470 Q450 380 550 470" fill="url(#glass)"/>
      <path d="M350 430 Q450 350 550 430" fill="none" stroke="url(#accLight)" stroke-width="6" opacity="0.7"/>
      <circle cx="450" cy="420" r="10" fill="url(#accLight)"/>
      <path d="M440 260 Q440 140 420 120" stroke="#ffffff" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M430 180 L470 160 M450 160 L480 190" stroke="url(#accLight)" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
    `;
  },
  mouse(hue, accent) {
    return `
      <path d="M340 320 Q330 220 430 210 Q530 220 520 320 L540 500 Q545 560 435 570 Q325 560 330 500 Z"
            fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <path d="M415 210 Q415 240 415 320" stroke="#1a1d24" stroke-width="10" stroke-linecap="round" opacity="0.6"/>
      <circle cx="430" cy="380" r="16" fill="url(#acc)"/>
      <line x1="430" y1="396" x2="430" y2="330" stroke="url(#sheen)" stroke-width="8" opacity="0.4"/>
    `;
  },
  keyboard(hue, accent) {
    let keys = "";
    const a = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","M"];
    let i = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 12; c++) {
        keys += `<rect x="${136 + c * 60}" y="${266 + r * 54}" width="48" height="42" rx="9" fill="url(#unitSoft)" stroke="url(#metalSoft)" stroke-width="3"/>`;
      }
    }
    return `
      <rect x="120" y="240" width="860" height="252" rx="26" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <line x1="120" y1="424" x2="980" y2="424" stroke="#000000" stroke-width="8" opacity="0.4"/>
      ${keys}
      <rect x="826" y="546" width="200" height="66" rx="30" fill="url(#unitSoft)" stroke="url(#acc)" stroke-width="6"/>
      <circle cx="910" cy="536" r="14" fill="url(#acc)" opacity="0.8"/>
    `;
  },
  bag(hue, accent) {
    return `
      <path d="M320 380 H620 Q655 380 675 560 L690 720 Q690 760 620 760 H340 Q270 760 270 720 L285 560 Q305 380 320 380 Z"
            fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <path d="M400 380 Q420 300 460 300 Q500 300 520 380" fill="none" stroke="url(#metalSoft)" stroke-width="22" stroke-linecap="round"/>
      <rect x="436" y="470" width="48" height="18" rx="9" fill="url(#accLight)"/>
      <path d="M420 400 H500" stroke="#000000" stroke-width="8" opacity="0.5"/>
      <path d="M380 560 H520" stroke="#ffffff" stroke-width="8" opacity="0.25"/>
    `;
  },
  bottle(hue, accent) {
    return `
      <path d="M420 190 Q420 150 450 140 Q480 150 480 190 L490 560 Q495 640 450 640 Q405 640 410 560 Z"
            fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <rect x="412" y="210" width="76" height="46" rx="16" fill="url(#accLight)"/>
      <circle cx="450" cy="500" r="54" fill="url(#acc)" opacity="0.85"/>
      <circle cx="450" cy="500" r="28" fill="url(#unit)"/>
      <path d="M450 236 L450 470" stroke="url(#sheen)" stroke-width="16" opacity="0.3"/>
    `;
  },
  drone(hue, accent) {
    return `
      <ellipse cx="290" cy="300" rx="70" ry="24" fill="url(#unitSoft)" opacity="0.8"/>
      <ellipse cx="610" cy="300" rx="70" ry="24" fill="url(#unitSoft)" opacity="0.8"/>
      <path d="M290 300 L400 360 L500 360 L610 300" stroke="url(#metalSoft)" stroke-width="22" fill="none" stroke-linecap="round"/>
      <rect x="340" y="330" width="220" height="120" rx="40" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <circle cx="450" cy="380" r="58" fill="url(#acc)"/>
      <circle cx="450" cy="380" r="26" fill="url(#unit)"/>
      <path d="M340 296 V200 Q450 160 560 200 V296" fill="none" stroke="url(#accLight)" stroke-width="10"/>
    `;
  },
  lamp(hue, accent) {
    return `
      <path d="M430 500 H380 L410 360 H490 L520 500 H470" fill="url(#metalSoft)"/>
      <path d="M410 360 Q450 250 490 360 Z" fill="url(#acc)" opacity="0.95"/>
      <circle cx="450" cy="330" r="70" fill="url(#glow)" opacity="0.8"/>
      <path d="M430 500 H470" stroke="url(#unit)" stroke-width="5"/>
      <rect x="412" y="540" width="76" height="22" rx="11" fill="url(#unitSoft)"/>
    `;
  },
  hub(hue, accent) {
    return `
      <rect x="330" y="240" width="440" height="64" rx="20" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <rect x="330" y="300" width="240" height="48" rx="16" fill="url(#metalSoft)"/>
      <rect x="586" y="300" width="60" height="48" rx="16" fill="url(#metalSoft)"/>
      <rect x="360" y="336" width="60" height="16" rx="8" fill="#0a0b0e"/>
      <rect x="440" y="336" width="60" height="16" rx="8" fill="#0a0b0e"/>
      <circle cx="620" cy="324" r="10" fill="url(#accLight)"/>
      <rect x="420" y="260" width="60" height="8" rx="4" fill="url(#acc)" opacity="0.8"/>
    `;
  },
  alarm(hue, accent) {
    return `
      <rect x="310" y="330" width="280" height="170" rx="30" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <circle cx="340" cy="330" r="26" fill="url(#metalSoft)"/>
      <circle cx="560" cy="330" r="26" fill="url(#metalSoft)"/>
      <path d="M450 150 L450 210 M450 280 H360 M450 280 H540" stroke="url(#metalSoft)" stroke-width="22" stroke-linecap="round"/>
      <path d="M450 330 C500 330 520 360 520 400 C520 430 500 460 450 468 C400 460 380 430 380 400 C380 360 400 330 450 330 Z"
            fill="url(#unitSoft)" stroke="url(#acc)" stroke-width="10"/>
      <circle cx="450" cy="400" r="52" fill="none" stroke="url(#accLight)" stroke-width="8" opacity="0.6"/>
    `;
  },
  dock(hue, accent) {
    return `
      <ellipse cx="450" cy="388" rx="200" ry="120" fill="url(#unitSoft)"/>
      <ellipse cx="450" cy="360" rx="200" ry="120" fill="url(#unit)" stroke="url(#metalSoft)" stroke-width="6"/>
      <ellipse cx="450" cy="360" rx="120" ry="72" fill="url(#unitSoft)"/>
      <path d="M404 330 V250 M496 330 V250" stroke="url(#metalSoft)" stroke-width="20" stroke-linecap="round"/>
      <line x1="360" y1="330" x2="540" y2="330" stroke="url(#sheen)" stroke-width="10" opacity="0.35"/>
    `;
  },
};

function render(slug, glyph, hue, variant) {
  // variant: 1 = hero, 2 = accent flip + rotate, 3 = detail zoom
  const { rotation, scale } =
    variant === 1
      ? { rotation: 0, scale: 1 }
      : variant === 2
      ? { rotation: 6, scale: 1.04 }
      : { rotation: -3, scale: 1.4 };

  const floor = 15 + (variant === 3 ? 12 : 0);
  const body = G[glyph](hue, variant === 2 || variant === 3);

  const floorShadow = `<ellipse cx="450" cy="792" rx="150" ry="13" fill="#000000" opacity="0.42" filter="url(#soft)"/>`;

  const contentGroup = `<g transform="translate(450 450) rotate(${rotation}) scale(${scale * 0.7}) translate(-450 -450)">
  <g transform="translate(54 126) scale(0.72)">${body}</g>
</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900">
  <defs>
    ${defs(hue, floor)}
    ${softFilter}
  </defs>
  <rect width="900" height="900" fill="url(#bg)"/>
  <rect width="900" height="900" fill="url(#glow)"/>
  ${glass}
  ${floorShadow}
  ${contentGroup}
  <rect x="1" y="1" width="898" height="898" rx="48" fill="#ffffff" opacity="0.03"/>
  <rect x="1" y="1" width="898" height="898" rx="48" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
</svg>`;
  return svg;
}

for (const item of META) {
  for (let v = 1; v <= 3; v++) {
    const svg = render(item.slug, item.glyph, item.hue, v);
    fs.writeFileSync(path.join(OUT, `${item.slug}-${v}.svg`), svg);
  }
}
console.log(`Generated ${META.length * 3} SVGs in ${OUT}`);
