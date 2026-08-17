# Parlance — public site and releases

Parlance's public face: the front page, feature tour, tutorials, concept docs,
and product manual — plus the app's downloadable builds. The site serves via
GitHub Pages; the binaries are GitHub Releases on this same repository, so
there is one public repo rather than two.

Site URL is derived in [`site.config.mjs`](site.config.mjs): with `customDomain`
empty it serves at `https://orbitope.github.io/<repoName>/`; set `customDomain`
and it serves at that domain's root instead (the build then emits a `CNAME`, and
the same value must be set in Settings → Pages → Custom domain).

This is a **hybrid** repository: most content is authored here normally; the
product manual is generated output pushed from the private Parlance repo.

| What | Where | Edit it… |
|---|---|---|
| Marketing pages, tutorials, concepts, reference pages | `content/`, `templates/` | **here**, like any repo |
| Build pipeline, styles, brand assets | `build/`, `assets/`, `site.config.mjs` | **here** |
| Product manuals + demo build + sync manifest | `synced/` | **never here** — in the Parlance repo; the sync overwrites this directory ([details](synced/README.md)) |

## Build

```bash
npm install
npm run build     # renders _site/ and fails on any broken internal link/anchor
npm run serve     # serves at the same base path production uses
```

Deployment is GitHub Actions → Pages artifact
([workflow](.github/workflows/deploy.yml)); `_site/` is never committed.
One-time repo setting: **Settings → Pages → Source: GitHub Actions**.

The page manifest and docs sidebar live in [`site.config.mjs`](site.config.mjs).
Editor screenshots in `assets/images/` are real captures of the editor on the
mistfall-inn demo — regenerate them with
[`build/capture-shots.mjs`](build/capture-shots.mjs) (requires the private
repo's editor running; instructions in the script header).
Styling uses the Parlance app's own design tokens —
[`assets/css/tokens.css`](assets/css/tokens.css) is a verbatim copy from the
app; re-copy it when the app's tokens change, and put site styling in
`site.css`.

## The sync (private → public)

A workflow in the Parlance repository copies `tooling/EDITOR_GUIDE.md` and
`tooling/SETUP_AND_MANAGEMENT.md` (plus the demo share build) into `synced/`
byte-for-byte, stamps `synced/manifest.json` with the source commit, and
pushes. If you edit anything under `synced/` here, the next sync overwrites
it — and until then the docs disagree with their source. Fix the source
instead.

Format and runtime documentation is a different audience and a different
licence — it is published separately, MIT, at
[`Orbitope/parlance-spec`](https://github.com/Orbitope/parlance-spec).

## Licensing

The documentation is **not** open source. See [LICENSE](LICENSE).

This surprises people, so: Parlance's *specification* is MIT and meant to be
copied — the schema, the conformance vectors, the reference validator. The
*product's manual* is not part of that grant. Publishing it is not licensing it.
