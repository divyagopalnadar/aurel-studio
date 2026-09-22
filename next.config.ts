import type { NextConfig } from "next";

// Product imagery is local SVG. next/image serves `.svg` sources as-is
// (unoptimized) by default, so `images.dangerouslyAllowSVG` is not needed.
const nextConfig: NextConfig = {};

export default nextConfig;
