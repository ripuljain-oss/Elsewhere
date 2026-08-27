import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite copies public/ to dist root, but this app is served under base /travel/.
// Emit sitemap/robots at dist/travel/* so /travel/sitemap.xml is a real static
// file on Vercel (filesystem hit) instead of only existing via the prefix rewrite.
function emitSeoFilesUnderBase() {
  return {
    name: "emit-seo-files-under-base",
    writeBundle() {
      const dist = join(process.cwd(), "dist");
      const destDir = join(dist, "travel");
      mkdirSync(destDir, { recursive: true });
      for (const file of ["sitemap.xml", "robots.txt"]) {
        const src = join(dist, file);
        if (!existsSync(src)) {
          throw new Error(`Expected public/${file} to be copied to dist/${file}`);
        }
        copyFileSync(src, join(destDir, file));
      }
    },
  };
}

export default defineConfig({
  base: "/travel/",
  plugins: [react(), emitSeoFilesUnderBase()],
});

