// Static site build for the Parlance public site.
//
// Pipeline: read the page manifest from site.config.mjs, render each markdown
// source into templates/shell.html (or pass templates/home.html through),
// generate sidebar + on-page ToC, copy assets and fonts, emit sitemap/robots,
// then link-check every internal href and #anchor in the output. A broken
// link — including one inside the synced manuals — fails the build.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import GithubSlugger from "github-slugger";
import hljs from "highlight.js/lib/core";
import hljsJson from "highlight.js/lib/languages/json";
import hljsBash from "highlight.js/lib/languages/bash";
import hljsJs from "highlight.js/lib/languages/javascript";
import hljsTs from "highlight.js/lib/languages/typescript";
import hljsPython from "highlight.js/lib/languages/python";
import hljsDiff from "highlight.js/lib/languages/diff";
import hljsYaml from "highlight.js/lib/languages/yaml";
import { parseFrontMatter } from "./lib/frontmatter.mjs";
import config from "../site.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "_site");

hljs.registerLanguage("json", hljsJson);
hljs.registerLanguage("bash", hljsBash);
hljs.registerLanguage("javascript", hljsJs);
hljs.registerLanguage("typescript", hljsTs);
hljs.registerLanguage("python", hljsPython);
hljs.registerLanguage("diff", hljsDiff);
hljs.registerLanguage("yaml", hljsYaml);

// Links inside synced manuals that point at private-repo files which have a
// home on this site. Applied to href values on synced pages only.
//
// SETUP_AND_MANAGEMENT is contributor documentation and is deliberately not
// published (see synced/README.md), so its links are redirected to the authored
// page covering the same ground for someone using the shipped app. A reader of
// the manual inside the private repo follows the real file; a reader on this
// site lands somewhere that exists.
const SYNCED_LINK_MAP = {
  "EDITOR_GUIDE.md": "/docs/editor-guide/",
  "SETUP_AND_MANAGEMENT.md": "/docs/install/",
};

// Output paths the checker tolerates missing, with a warning. The demo share
// build arrives via the private-repo sync; the site must not hard-fail while
// it hasn't been pushed yet.
const OPTIONAL_TARGETS = new Set(["play/mistfall.html"]);

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), "utf8");
}

function write(rel, content) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

function copyDir(fromRel, toRel) {
  const from = path.join(ROOT, fromRel);
  if (!fs.existsSync(from)) return;
  fs.cpSync(from, path.join(OUT, toRel), { recursive: true });
}

// Intrinsic size of a PNG, straight from the IHDR chunk. og:image:width and
// og:image:height let Slack/Discord reserve the card's space before the image
// loads, but only if they are true — so they are measured, never assumed. This
// also gives the only existence check the og:image gets: checkLinks() skips
// absolute https URLs, so a typo in an ogImage path would otherwise ship a card
// that silently 404s.
function pngSize(rel) {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error(`${rel}: not a PNG (og:image must be a PNG)`);
  }
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function highlight(code, lang) {
  if (lang && hljs.getLanguage(lang)) {
    return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`;
  }
  const md = new MarkdownIt();
  return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
}

function makeRenderer() {
  const slugger = new GithubSlugger();
  const md = new MarkdownIt({ html: true, linkify: true, highlight });
  md.use(anchor, {
    level: [1, 2, 3, 4, 5, 6],
    slugify: (s) => slugger.slug(s),
    tabIndex: false,
  });
  return md;
}

function extractToc(html) {
  const toc = [];
  const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let m;
  while ((m = re.exec(html))) {
    const text = m[3].replace(/<[^>]+>/g, "").trim();
    toc.push({ level: Number(m[1]), id: m[2], text });
  }
  return toc;
}

function tocHtml(toc) {
  if (toc.length < 2) return "";
  const items = toc
    .map(
      (t) =>
        `<li class="toc-h${t.level}"><a href="#${t.id}">${t.text}</a></li>`,
    )
    .join("\n");
  return `<nav class="toc" aria-label="On this page"><div class="toc-title">On this page</div><ul>\n${items}\n</ul></nav>`;
}

function pageHref(out) {
  // "docs/editor-guide/index.html" -> "docs/editor-guide/", "404.html" -> "404.html"
  return out.endsWith("/index.html") ? out.slice(0, -"index.html".length) : out === "index.html" ? "" : out;
}

function rootPrefix(out) {
  const depth = out.split("/").length - 1;
  return "../".repeat(depth);
}

function sidebarHtml(currentHref, root) {
  const groups = config.docsSidebar
    .map((g) => {
      const items = g.items
        .map((it) => {
          const active = it.href === currentHref ? ' class="active" aria-current="page"' : "";
          return `<li><a${active} href="${root}${it.href}">${it.label}</a></li>`;
        })
        .join("\n");
      return `<div class="sidebar-group"><div class="sidebar-group-title">${g.group}</div><ul>\n${items}\n</ul></div>`;
    })
    .join("\n");
  return `<nav class="sidebar" id="sidebar" aria-label="Documentation">${groups}</nav>`;
}

function headerNavHtml(currentHref, root) {
  return config.header
    .map((h) => {
      const active =
        currentHref === h.href || (h.href !== "docs/" && currentHref.startsWith(h.href)) ||
        (h.href === "docs/" && currentHref.startsWith("docs/") && !currentHref.startsWith("docs/get-started"))
          ? ' class="active"'
          : "";
      return `<a${active} href="${root}${h.href}">${h.label}</a>`;
    })
    .join("\n");
}

function gaSnippet() {
  if (!config.gaId) return "";
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${config.gaId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${config.gaId}');</script>`;
}

function syncedFooterHtml(manifest) {
  if (!manifest) return "";
  const short = (manifest.sourceSha || "").slice(0, 7);
  const when = (manifest.syncedAt || "").slice(0, 10);
  return `<div class="synced-footer">Generated from <code>${manifest.sourceRepo}</code>${short ? ` @ <code>${short}</code>` : ""}${when ? ` on ${when}` : ""} — <a href="https://github.com/Orbitope/parlance-docs#readme">do not edit on this site</a>.</div>`;
}

function fillTemplate(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in vars ? vars[k] : ""));
}

// Rewrite site-root-relative hrefs ("/foo/") to page-relative, and apply the
// synced-manual link map. Leaves protocol links and pure #anchors alone.
function rewriteLinks(html, root, synced) {
  return html.replace(/(href|src)="([^"]*)"/g, (whole, attr, url) => {
    if (synced) {
      const [pathPart, hash] = url.split("#");
      if (SYNCED_LINK_MAP[pathPart]) {
        url = SYNCED_LINK_MAP[pathPart] + (hash ? `#${hash}` : "");
      }
    }
    if (url.startsWith("/") && !url.startsWith("//")) {
      return `${attr}="${root}${url.slice(1)}"`;
    }
    return whole;
  });
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const shell = read("templates/shell.html");
  let manifest = null;
  try {
    manifest = JSON.parse(read("synced/manifest.json"));
  } catch {
    console.warn("! synced/manifest.json missing or unreadable — synced footers omitted");
  }

  for (const page of config.pages) {
    const raw = read(page.src);
    const { meta, body } = parseFrontMatter(raw);
    const href = pageHref(page.out);
    // The 404 page is served by GitHub Pages at arbitrary depths, so its
    // asset/nav links must be absolute rather than page-relative.
    const root = page.out === "404.html" ? `${config.siteUrl}/` : rootPrefix(page.out);
    const isDocs = href.startsWith("docs/");

    let contentHtml;
    let toc = [];
    if (page.template === "home" || page.src.endsWith(".html")) {
      contentHtml = body;
    } else {
      contentHtml = makeRenderer().render(body);
      toc = extractToc(contentHtml);
    }

    // Pages may override the site-wide card; most don't.
    const ogImage = page.ogImage || config.ogImage;
    const ogSize = pngSize(ogImage);

    const title = meta.title || page.title || config.siteName;
    const fullTitle =
      page.out === "index.html" ? `${config.siteName} — git-native narrative design` : `${title} · ${config.siteName}`;
    const vars = {
      root,
      title: fullTitle,
      description: meta.description || page.description || config.defaultDescription,
      canonical: `${config.siteUrl}/${href}`,
      ogimage: `${config.siteUrl}/${ogImage}`,
      ogimagew: String(ogSize.w),
      ogimageh: String(ogSize.h),
      ogimagealt: page.ogImageAlt || config.ogImageAlt,
      sitename: config.siteName,
      content: contentHtml,
      headernav: headerNavHtml(href, root),
      github: config.githubUrl,
      ga: gaSnippet(),
      sidebar: isDocs ? sidebarHtml(href, root) : "",
      toc: isDocs ? tocHtml(toc) : "",
      syncedfooter: page.synced ? syncedFooterHtml(manifest) : "",
      bodyclass: [
        page.template === "home" ? "page-home" : "page-content",
        isDocs ? "page-docs" : "",
        page.synced ? "page-synced" : "",
      ]
        .filter(Boolean)
        .join(" "),
    };

    let html;
    if (page.template === "home") {
      html = fillTemplate(shell, { ...vars, content: fillTemplate(body, vars) });
    } else {
      html = fillTemplate(shell, vars);
    }
    html = rewriteLinks(html, root, Boolean(page.synced));
    write(page.out, html);
  }

  // Assets.
  copyDir("assets/css", "assets/css");
  copyDir("assets/js", "assets/js");
  copyDir("assets/brand", "assets/brand");
  copyDir("assets/images", "assets/images");
  for (const f of config.fonts) {
    const from = path.join(ROOT, "node_modules", f.pkg, f.file);
    const to = path.join(OUT, "assets/fonts", path.basename(f.file));
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }

  // Playable demo, delivered by the private-repo sync when present.
  const demo = path.join(ROOT, "synced/play-mistfall.html");
  if (fs.existsSync(demo)) {
    fs.mkdirSync(path.join(OUT, "play"), { recursive: true });
    fs.copyFileSync(demo, path.join(OUT, "play/mistfall.html"));
  }

  // sitemap + robots.
  const urls = config.pages
    .filter((p) => p.out !== "404.html")
    .map((p) => `  <url><loc>${config.siteUrl}/${pageHref(p.out)}</loc></url>`)
    .join("\n");
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);

  // GitHub Pages reads CNAME from the published artifact; without it a deploy
  // can clear a custom domain configured in repo settings.
  if (config.customDomain) write("CNAME", `${config.customDomain}\n`);

  checkLinks();
  console.log(`Built ${config.pages.length} pages -> ${path.relative(ROOT, OUT)}/`);
}

// ---- Link + anchor checker ------------------------------------------------

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function checkLinks() {
  const files = walk(OUT);
  const emitted = new Set(files.map((f) => path.relative(OUT, f)));
  const idsByFile = new Map();
  const htmlFiles = files.filter((f) => f.endsWith(".html"));

  for (const f of htmlFiles) {
    const ids = new Set();
    const html = fs.readFileSync(f, "utf8");
    for (const m of html.matchAll(/ id="([^"]+)"/g)) ids.add(m[1]);
    idsByFile.set(path.relative(OUT, f), ids);
  }

  const errors = [];
  const warnings = [];
  for (const f of htmlFiles) {
    const from = path.relative(OUT, f);
    const html = fs.readFileSync(f, "utf8");
    for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|data:|\/\/)/.test(url)) continue;
      const [rawPath, hash] = url.split("#");
      let targetFile = from;
      if (rawPath) {
        const resolved = path
          .normalize(path.join(path.dirname(from), rawPath))
          .replace(/\\/g, "/");
        targetFile = resolved.endsWith("/") || resolved === "." ? path.join(resolved, "index.html").replace(/\\/g, "/").replace(/^\.\//, "") : resolved;
        if (targetFile.startsWith("..")) {
          errors.push(`${from}: link escapes site root: ${url}`);
          continue;
        }
        if (!emitted.has(targetFile)) {
          if (OPTIONAL_TARGETS.has(targetFile)) {
            warnings.push(`${from}: optional target not yet synced: ${url}`);
            continue;
          }
          errors.push(`${from}: broken link: ${url}`);
          continue;
        }
      }
      if (hash && idsByFile.has(targetFile) && !idsByFile.get(targetFile).has(hash)) {
        errors.push(`${from}: broken anchor: ${url}`);
      }
    }
  }

  for (const w of warnings) console.warn(`! ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`✗ ${e}`);
    console.error(`\n${errors.length} broken link(s)/anchor(s).`);
    process.exit(1);
  }
  console.log(`Link check passed (${htmlFiles.length} pages).`);
}

build();
