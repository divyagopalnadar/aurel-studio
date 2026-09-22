import type { Colour } from "@/data/products";

/** Validates a JSON array of strings from a request body. */
export function parseStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  if (v.some((x) => typeof x !== "string")) return null;
  return v;
}

const HEX = /^#[0-9a-f]{3}([0-9a-f]{3})?$/i;

/** Validates a JSON array of `{ name, hex }` colour objects. */
export function parseColourArray(v: unknown): Colour[] | null {
  if (!Array.isArray(v)) return null;
  const valid = v.every(
    (c) =>
      typeof c === "object" &&
      c !== null &&
      typeof (c as Colour).name === "string" &&
      typeof (c as Colour).hex === "string" &&
      HEX.test((c as Colour).hex)
  );
  return valid ? (v as Colour[]).map(({ name, hex }) => ({ name, hex })) : null;
}
