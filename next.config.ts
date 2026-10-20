import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Version 1 is a static site: `npm run build` writes plain HTML/CSS/JS to `out/`,
  // which any static web host can serve. Remove `output` when the hub gains
  // sign-in or a database and moves to a host that runs Node.js.
  output: "export",
  // Set only when the site is served from a sub-folder, e.g. "/DigiBlu-LXP-Hub" on
  // GitHub Pages (the deploy workflow sets it). Empty on its own domain.
  basePath: process.env.PAGES_BASE_PATH || "",
  // Emit /courses/index.html rather than /courses.html so every static host
  // resolves the URLs without rewrite rules.
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
