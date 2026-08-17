# synced/ — DO NOT EDIT

Everything in this directory is **generated output pushed from the private
`Orbitope/parlance` repository**. Edits made here will be overwritten by the
next sync and are lost. Fix the source instead:

| File here | Source in `Orbitope/parlance` |
|---|---|
| `editor-guide.md` | `tooling/EDITOR_GUIDE.md` |
| `play-mistfall.html` | share build of `examples/mistfall-inn` (host `/api/playbuild?dialogue=dlg_examine_body` — scenes with `next` beats are avoided until the standalone player handles them) |
| `manifest.json` | written by the sync itself: source repo, commit, timestamp, file list |

**`SETUP_AND_MANAGEMENT.md` is deliberately NOT synced.** It is contributor and
maintainer documentation — architecture, dev servers, production builds, the
packaging and release pipeline, and the "adding an entity type" checklist that
names internal files. The public site sells the shipped application, so its
user-facing content is covered by authored pages instead
(`content/docs/install.md` and `content/docs/reference/config.md`). If that doc
is ever split upstream into a public "install & configure" half, add the half
here — not the whole file.

The sync contract: files are copied byte-for-byte (markdown in — this repo's
build renders it), the manifest records the source commit, and the commit
message is `sync: product manuals from parlance@<short-sha>`. Until the
private repo's sync workflow exists, the same contract is run by hand.

Everything *outside* this directory (marketing pages, tutorials, concept docs,
the build pipeline) is authored in this repo normally — see the root README.
