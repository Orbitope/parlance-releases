// Rasterize the Open Graph cards: assets/brand/og-*.svg -> og-*.png.
//
//   npm run og
//
// The PNGs are committed, because the Pages build must not depend on a browser
// being installed on the runner. Re-run this after editing a card's SVG and
// commit both files.
//
// Headless Chrome, not qlmanage: qlmanage -s scales the artwork to fill a
// square thumbnail rather than honouring the SVG's 1200x630 viewBox, so its
// output is a zoomed crop. Point CHROME at a binary if yours lives elsewhere.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND = path.join(ROOT, "assets/brand");

const CANDIDATES = [
  process.env.CHROME,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const chrome = CANDIDATES.find((c) => fs.existsSync(c));
if (!chrome) {
  console.error("No Chrome/Chromium found. Set CHROME=/path/to/binary.");
  process.exit(1);
}

// Render at the size the SVG declares, so the card is never letterboxed or
// cropped. Both cards are 1200x630, the Open Graph standard.
function sizeOf(svg) {
  const src = fs.readFileSync(svg, "utf8");
  const m = src.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!m) throw new Error(`${path.basename(svg)}: no viewBox to size from`);
  return { w: m[1], h: m[2] };
}

const cards = fs
  .readdirSync(BRAND)
  .filter((f) => f.startsWith("og-") && f.endsWith(".svg"))
  .sort();

if (!cards.length) {
  console.error(`No og-*.svg cards in ${path.relative(ROOT, BRAND)}/.`);
  process.exit(1);
}

for (const card of cards) {
  const svg = path.join(BRAND, card);
  const png = svg.replace(/\.svg$/, ".png");
  const { w, h } = sizeOf(svg);
  execFileSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${w},${h}`,
      `--screenshot=${png}`,
      `file://${svg}`,
    ],
    { stdio: ["ignore", "ignore", "ignore"] },
  );
  if (!fs.existsSync(png)) throw new Error(`${card}: render produced no file`);
  console.log(`${card} -> ${path.basename(png)} (${w}x${h})`);
}
