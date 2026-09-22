import type { NextConfig } from "next";

/**
 * Two build modes, selected by NEXT_PUBLIC_DATA_SOURCE (see lib/config.ts):
 *
 * - "prisma" (default): a regular Next.js server build backed by SQLite. The
 *   REST route handlers live in `route.prisma.ts` files, which are only picked
 *   up here because "prisma.ts" is added to `pageExtensions`.
 *
 * - "static": a static HTML export for GitHub Pages, served from a sub-path
 *   (PAGES_BASE_PATH, default "/aurel-studio"). The `route.prisma.ts` files
 *   are not route files in this mode, so the export has no request-dependent
 *   handlers. Images are served as-is because there is no image optimizer.
 *
 * Product imagery is local SVG/JPEG; next/image serves `.svg` sources as-is.
 */
const isStatic = process.env.NEXT_PUBLIC_DATA_SOURCE === "static";
const basePath = isStatic ? (process.env.PAGES_BASE_PATH ?? "/aurel-studio") : "";

const nextConfig: NextConfig = isStatic
  ? {
      output: "export",
      basePath,
      trailingSlash: true,
      images: { unoptimized: true },
      env: { NEXT_PUBLIC_BASE_PATH: basePath },
    }
  : {
      pageExtensions: ["prisma.ts", "tsx", "ts", "jsx", "js"],
    };

export default nextConfig;
