// Recapture the editor screenshots in assets/images/ against the live editor.
//
// Prereqs (from the private Orbitope/parlance repo):
//   cd editor && PARLANCE_ROOT=$PWD/../examples/mistfall-inn npm run dev
// then, from this repo (playwright is NOT a dependency here — install ad hoc):
//   npx -y playwright@latest install chromium
//   node build/capture-shots.mjs
//
// Output: assets/images/editor-{dialogue-canvas,playtest,ladder}.png at 1600px
// wide (captured 2x, downscaled by your image tool of choice — or keep 2x and
// let CSS size them; sips -Z 1600 <file> matches the committed versions).
//
// Notes:
// - "Auto layout" is clicked on the canvas shot, which rewrites the local
//   (gitignored) *.layout.json sidecar in the example project. Harmless.
// - Keep captures against mistfall-inn so shots show real, CC0 story data.

import { chromium } from "playwright";

const CLIENT = process.env.PARLANCE_CLIENT_URL || "http://localhost:5173/";
const OUT = new URL("../assets/images/", import.meta.url).pathname;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(CLIENT);
await page.waitForTimeout(2500);

// ---- editor-dialogue-canvas: Wren — The Yard, entity panel collapsed ----
await page.click("text=Dialogues");
await page.waitForTimeout(1500);
await page.click("text=Wren — The Yard");
await page.waitForTimeout(2500);
await page.click("text=Auto layout");
await page.waitForTimeout(1200);
await page.click("button:has-text('«')");
await page.waitForTimeout(800);
const fit = page.locator(".react-flow__controls-fitview").first();
if (await fit.count()) await fit.click();
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}editor-dialogue-canvas.png`, clip: { x: 0, y: 0, width: 1600, height: 990 } });

// ---- editor-playtest: Halloran Vane with a check taken ----
await page.click("button:has-text('»')");
await page.waitForTimeout(600);
await page.click("text=Halloran Vane");
await page.waitForTimeout(2000);
await page.click("text=▶ Play");
await page.waitForTimeout(1200);
const start = page.locator("button:has-text('Start Session')").first();
if (await start.count()) await start.click();
await page.waitForTimeout(1200);
const check = page.locator("button", { hasText: "Go over him properly" }).first();
if (await check.count()) await check.click();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}editor-playtest.png` });

// ---- editor-ladder: Aldous Wren, both rungs incl. fallthrough ----
await page.click("text=Characters");
await page.waitForTimeout(1200);
await page.click("text=Aldous Wren");
await page.waitForTimeout(1500);
const fall = page.locator("text=fallthrough").last();
if (await fall.count()) await fall.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}editor-ladder.png` });

await browser.close();
console.log("captured 3 shots ->", OUT);
