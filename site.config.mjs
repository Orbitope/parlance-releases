// Site-wide configuration and the page manifest.
// The manifest is the single source of truth for which pages exist, where
// their source lives (authored content/ vs. synced/), and how the docs
// sidebar is ordered. Per-page title/description live in each file's front
// matter (or the <title> placeholder for HTML templates).

export default {
  // Custom domain for the Pages site. When set, the build writes a CNAME file
  // and the site serves at the ROOT of that domain (no /repo/ path prefix) —
  // set it in Settings → Pages → Custom domain as well, and point DNS at
  // GitHub (subdomain: CNAME to orbitope.github.io; apex: the four A records).
  // Leave empty to serve from the default project-pages path below.
  customDomain: "",

  // Repository name, used only to derive the default project-pages URL and the
  // local preview prefix. Ignored when customDomain is set.
  repoName: "parlance-releases",
  // The org site (orbitope.github.io) has the custom domain orbitope.com, so
  // project sites are served beneath it as orbitope.com/<repo>/.
  orgPagesHost: "orbitope.com",

  get siteUrl() {
    return this.customDomain
      ? `https://${this.customDomain}`
      : `https://${this.orgPagesHost}/${this.repoName}`;
  },
  // Path the site is served under. "/" for a custom domain, "/<repo>/" otherwise.
  get basePath() {
    return this.customDomain ? "/" : `/${this.repoName}/`;
  },

  siteName: "Parlance",
  defaultDescription:
    "Parlance is a git-native narrative design tool for story-driven games. Schema-first, engine-agnostic: your story is plain JSON in your repo.",
  // GA4 measurement id for Parlance's OWN property (not the Orbitope org tag —
  // every Orbitope project shares the orbitope.github.io hostname, so reusing
  // that tag would blend this product's metrics with every other project).
  // Paste the "G-XXXXXXXXXX" id from the property's web data stream here.
  // Empty string disables the snippet entirely — no gtag, no cookies.
  gaId: "G-QBW6GG8D1J",
  ogImage: "assets/brand/og-default.png",
  // Alt text for the card. Describes the image, not the page — per-page
  // context already rides along in og:title and og:description.
  ogImageAlt: "Parlance — git-native narrative design for story-driven games",

  // Header navigation. hrefs are site-root-relative; the build prefixes {{root}}.
  header: [
    { href: "features/", label: "Features" },
    { href: "compare/", label: "Compare" },
    { href: "docs/", label: "Docs" },
    { href: "docs/get-started/", label: "Get started" },
    { href: "demo/", label: "Demo" },
  ],
  githubUrl: "https://github.com/Orbitope/parlance-spec",

  // Docs sidebar groups. Every href must correspond to a page in `pages`.
  docsSidebar: [
    {
      group: "Start",
      items: [
        { href: "docs/", label: "Docs home" },
        { href: "docs/install/", label: "Install & run" },
        { href: "docs/get-started/", label: "Get started" },
        { href: "docs/get-started/first-project/", label: "Your first project" },
        { href: "docs/get-started/branching-dialogue/", label: "Branching dialogue" },
        { href: "docs/get-started/dialogue-ladders/", label: "Dialogue ladders" },
        { href: "docs/get-started/playtest-and-share/", label: "Playtest & share" },
        { href: "docs/get-started/quests-and-journal/", label: "Quests & journal" },
        { href: "docs/get-started/validate-in-ci/", label: "Validate in CI" },
      ],
    },
    {
      group: "Guides",
      items: [{ href: "docs/editor-guide/", label: "Editor guide" }],
    },
    {
      group: "Concepts",
      items: [
        { href: "docs/concepts/workflow/", label: "How it fits together" },
        { href: "docs/concepts/dialogue-laddering/", label: "Dialogue laddering" },
        { href: "docs/concepts/schema-first/", label: "Schema-first data" },
        { href: "docs/concepts/git-native/", label: "Git-native workflow" },
        { href: "docs/concepts/validation/", label: "Validation" },
        { href: "docs/concepts/at-scale/", label: "Working at scale" },
        { href: "docs/concepts/performance/", label: "Performance" },
        { href: "docs/concepts/playtest-determinism/", label: "Playtest & determinism" },
        { href: "docs/concepts/engine-contract/", label: "The engine contract" },
      ],
    },
    {
      group: "Reference",
      items: [
        { href: "docs/reference/shortcuts/", label: "Shortcuts & small features" },
        { href: "docs/reference/config/", label: "Configuration" },
        { href: "docs/reference/cli/", label: "CLI" },
        { href: "docs/reference/validation-checks/", label: "Validation checks" },
        { href: "docs/reference/mcp/", label: "MCP server" },
      ],
    },
    {
      group: "Ecosystem",
      items: [
        { href: "docs/integrations/", label: "Engine integrations" },
        { href: "docs/spec/", label: "The open spec" },
      ],
    },
  ],

  // Every page on the site. `src` is repo-relative; `out` is _site-relative.
  // `template`: "shell" (default) or "home". `synced: true` marks pages whose
  // markdown is pushed from the private Orbitope/parlance repo. `ogImage` and
  // `ogImageAlt` override the site-wide social card for one page — worth it for
  // a page people link to directly, not for every page.
  pages: [
    { src: "templates/home.html", out: "index.html", template: "home" },
    { src: "content/features.md", out: "features/index.html" },
    {
      src: "content/compare.md",
      out: "compare/index.html",
      ogImage: "assets/brand/og-compare.png",
      ogImageAlt: "Parlance and the alternatives — articy:draft, Twine, ink, Yarn Spinner",
    },
    { src: "content/demo.md", out: "demo/index.html" },
    { src: "content/download.md", out: "download/index.html" },
    { src: "content/releases.md", out: "releases/index.html" },
    { src: "content/license.md", out: "license/index.html" },
    { src: "content/faq.md", out: "faq/index.html" },
    { src: "content/404.md", out: "404.html" },

    { src: "content/docs/index.md", out: "docs/index.html" },
    { src: "content/docs/install.md", out: "docs/install/index.html" },
    {
      src: "synced/editor-guide.md",
      out: "docs/editor-guide/index.html",
      synced: true,
      title: "Editor guide",
      description: "The complete Parlance editor reference — layout, entity types, dialogue and quest canvases, validation, playtest, localization, and review.",
    },

    { src: "content/docs/get-started/index.md", out: "docs/get-started/index.html" },
    { src: "content/docs/get-started/first-project.md", out: "docs/get-started/first-project/index.html" },
    { src: "content/docs/get-started/branching-dialogue.md", out: "docs/get-started/branching-dialogue/index.html" },
    { src: "content/docs/get-started/dialogue-ladders.md", out: "docs/get-started/dialogue-ladders/index.html" },
    { src: "content/docs/get-started/playtest-and-share.md", out: "docs/get-started/playtest-and-share/index.html" },
    { src: "content/docs/get-started/quests-and-journal.md", out: "docs/get-started/quests-and-journal/index.html" },
    { src: "content/docs/get-started/validate-in-ci.md", out: "docs/get-started/validate-in-ci/index.html" },

    { src: "content/docs/concepts/workflow.md", out: "docs/concepts/workflow/index.html" },
    { src: "content/docs/concepts/dialogue-laddering.md", out: "docs/concepts/dialogue-laddering/index.html" },
    { src: "content/docs/concepts/schema-first.md", out: "docs/concepts/schema-first/index.html" },
    { src: "content/docs/concepts/git-native.md", out: "docs/concepts/git-native/index.html" },
    { src: "content/docs/concepts/at-scale.md", out: "docs/concepts/at-scale/index.html" },
    { src: "content/docs/concepts/validation.md", out: "docs/concepts/validation/index.html" },
    { src: "content/docs/concepts/performance.md", out: "docs/concepts/performance/index.html" },
    { src: "content/docs/concepts/playtest-determinism.md", out: "docs/concepts/playtest-determinism/index.html" },
    { src: "content/docs/concepts/engine-contract.md", out: "docs/concepts/engine-contract/index.html" },

    { src: "content/docs/reference/shortcuts.md", out: "docs/reference/shortcuts/index.html" },
    { src: "content/docs/reference/config.md", out: "docs/reference/config/index.html" },
    { src: "content/docs/reference/cli.md", out: "docs/reference/cli/index.html" },
    { src: "content/docs/reference/validation-checks.md", out: "docs/reference/validation-checks/index.html" },
    { src: "content/docs/reference/mcp.md", out: "docs/reference/mcp/index.html" },

    { src: "content/docs/integrations.md", out: "docs/integrations/index.html" },
    { src: "content/docs/spec.md", out: "docs/spec/index.html" },
  ],

  // Font files copied from node_modules/@fontsource into _site/assets/fonts.
  fonts: [
    { pkg: "@fontsource/inter", file: "files/inter-latin-400-normal.woff2" },
    { pkg: "@fontsource/inter", file: "files/inter-latin-500-normal.woff2" },
    { pkg: "@fontsource/inter", file: "files/inter-latin-600-normal.woff2" },
    { pkg: "@fontsource/inter", file: "files/inter-latin-700-normal.woff2" },
    { pkg: "@fontsource/jetbrains-mono", file: "files/jetbrains-mono-latin-400-normal.woff2" },
    { pkg: "@fontsource/lora", file: "files/lora-latin-400-normal.woff2" },
    { pkg: "@fontsource/lora", file: "files/lora-latin-400-italic.woff2" },
    { pkg: "@fontsource/lora", file: "files/lora-latin-600-normal.woff2" },
  ],
};
