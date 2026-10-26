import type { MetadataRoute } from "next";

// Makes the hub installable: "Add to Home Screen" on phones, "Install app" in
// Edge and Chrome. Paths carry the sub-folder when served from GitHub Pages.
const base = process.env.PAGES_BASE_PATH || "";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: `${base}/`,
    name: "DigiBlu Learning Experience Knowledge Hub",
    short_name: "Knowledge Hub",
    description: "Courses, certifications and free learning for everyone at DigiBlu, by area and role.",
    lang: "en-GB",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    categories: ["education", "productivity"],
    icons: [
      { src: `${base}/app-icons/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${base}/app-icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${base}/app-icons/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Browse courses", url: `${base}/courses/` },
      { name: "Learning", url: `${base}/areas/` },
      { name: "My list", url: `${base}/my-list/` },
    ],
  };
}
