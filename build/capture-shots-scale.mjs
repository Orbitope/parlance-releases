// Recapture the AT-SCALE editor screenshots in assets/images/.
//
// These are deliberately captured against a LARGE project — the views they
// show (flow map, quest dependency graph, find-usages, coverage) say nothing
// useful about a thirteen-dialogue example. Mistfall Inn keeps the close-up
// shots where a reader reads the actual prose; this covers the ones where the
// point is scale and structure.
//
// Prereqs:
//   cd <parlance>/editor && \
//     PARLANCE_ROOT=<path>/parlance-monte-cristo npm run dev
//   node build/capture-shots-scale.mjs
//
// Output: assets/images/scale-{flow-map,quest-graph,find-usages,
//         coverage,location-map,entity-filter}.png
import { chromium } from "playwright";

const CLIENT = process.env.PARLANCE_CLIENT_URL || "http://localhost:5173/";
const OUT = new URL("../assets/images/", import.meta.url).pathname;
// A SMALLER viewport, not a larger one. These images are displayed a few
// hundred pixels wide in the docs; capturing 1600px of UI and scaling it down
// makes every label unreadable. 1200x750 at 2x gives the same sharpness with
// each element occupying proportionally more of the frame.
const W = 1200, H = 750;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.goto(CLIENT);
await page.waitForTimeout(4500);

const shot = async (name) => {
  await page.screenshot({ path: `${OUT}${name}.png` });
  console.log("  ->", name);
};
const fit = async () => {
  const f = page.locator(".react-flow__controls-fitview").first();
  if (await f.count()) { await f.click(); await page.waitForTimeout(900); }
};
// Fitting 112 nodes makes each one a smudge. Zoom back in afterwards so the
// cards are legible — a readable portion of a big graph communicates more
// than an unreadable whole, and the sidebar count carries the scale.
const zoomIn = async (n) => {
  const z = page.locator(".react-flow__controls-zoomin").first();
  for (let i = 0; i < n && await z.count(); i++) { await z.click(); await page.waitForTimeout(400); }
  await page.waitForTimeout(600);
};
// The entity list eats a third of the width. Graph shots are about the graph,
// so collapse it, fit again, and give the canvas the whole frame.
const collapse = async () => {
  const c = page.locator("button:has-text('«')").first();
  if (await c.count()) { await c.click(); await page.waitForTimeout(700); }
};
const expand = async () => {
  const e = page.locator("button:has-text('»')").first();
  if (await e.count()) { await e.click(); await page.waitForTimeout(700); }
};

// ---- flow map: 112 dialogues, routes and cutscene chains as edges ----------
await page.click("text=Dialogues");
await page.waitForTimeout(2000);
const auto = page.locator("button:has-text('Auto layout')").first();
if (await auto.count()) { await auto.click(); await page.waitForTimeout(2500); }
await collapse();
await fit();
await zoomIn(4);
await shot("scale-flow-map");
await expand();

// ---- entity filter: the same list narrowed by a tag ------------------------
const search = page.locator("input[placeholder*='Search']").first();
await search.click();
await search.fill("gossip");
await page.waitForTimeout(1500);
await shot("scale-entity-filter");
await search.fill("");
await page.waitForTimeout(800);

// ---- node graph: one dialogue, readable, with a check and a next-chain ----
const searchDetail = page.locator("input[placeholder*='Search']").first();
await searchDetail.click();
await searchDetail.fill("caderousse_diamond");
await page.waitForTimeout(1200);
await page.click("text=Caderousse — the inn at Pont du Gard");
await page.waitForTimeout(2500);
const dauto = page.locator("button:has-text('Auto layout')").first();
if (await dauto.count()) { await dauto.click(); await page.waitForTimeout(1800); }
await collapse();
await fit();
await zoomIn(1);
await shot("scale-node-graph");
await expand();
await searchDetail.fill("");
await page.waitForTimeout(800);

// ---- quest dependency graph ------------------------------------------------
await page.click("text=Quests");
await page.waitForTimeout(2200);
const qauto = page.locator("button:has-text('Auto layout')").first();
if (await qauto.count()) { await qauto.click(); await page.waitForTimeout(2200); }
await collapse();
await fit();
await zoomIn(1);   // 2 clips the fan-out, which is the whole point here
await shot("scale-quest-graph");
await expand();

// ---- location map ----------------------------------------------------------
await page.click("text=Locations");
await page.waitForTimeout(2200);
const lauto = page.locator("button:has-text('Auto layout')").first();
if (await lauto.count()) { await lauto.click(); await page.waitForTimeout(2200); }
await collapse();
await fit();
await zoomIn(2);
await shot("scale-location-map");
await expand();

// ---- reports: coverage clean, then find-usages on a busy flag --------------
await page.click("text=Reports");
await page.waitForTimeout(2500);
await shot("scale-coverage");

const usages = page.locator("button:has-text('Find usages')").first();
if (await usages.count()) { await usages.click(); await page.waitForTimeout(1200); }
const ref = page.locator("input[placeholder*='Search by id']").first();
if (await ref.count()) {
  await ref.click();
  await ref.fill("identity_count");
  await page.waitForTimeout(2000);
}
await shot("scale-find-usages");

await browser.close();
console.log("captured 6 scale shots ->", OUT);
