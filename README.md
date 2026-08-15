# Parlance documentation site

**Generated. Do not edit here.**

This repository holds the built documentation site for
[Parlance](https://parlance.dev) and serves it via GitHub Pages. Every page is
produced by a workflow in the Parlance repository and pushed here; the prose
lives there, next to the software it describes.

If you edit a page in this repository, the next build overwrites it — and worse,
for the interval before that, the docs disagree with themselves. Fix the source
instead.

## Where the source lives

| Page | Source |
|---|---|
| Editor guide | `tooling/EDITOR_GUIDE.md` (Parlance repo) |
| Setup & self-hosting | `tooling/SETUP_AND_MANAGEMENT.md` (Parlance repo) |

Format and runtime documentation is a different audience and a different licence —
it is published separately, MIT, at
[`parlance-spec`](https://github.com/Orbitope/parlance-spec).

## Licensing

The documentation is **not** open source. See [LICENSE](LICENSE).

This surprises people, so: Parlance's *specification* is MIT and meant to be
copied — the schema, the conformance vectors, the reference validator. The
*product's manual* is not part of that grant. Publishing it is not licensing it.
