---
title: Configuration
description: The parlance.config.json reference — every key and default, project-root and schema resolution order, the standard data layout, canonical serialization, and what persists where.
---

# Configuration reference

Parlance projects need **zero configuration** — every setting below has a
default. Configure only what you're deliberately changing.

## parlance.config.json

An optional file at the project root:

```json
{
  "data":   "data",
  "schema": "schema",
  "lore":   "lore",
  "tests":  "tests",
  "port":   8000
}
```

| Key | Default | Controls |
|---|---|---|
| `data` | `"data"` | Narrative content directory — the files your game ships |
| `schema` | `"schema"` | JSON Schema directory (see resolution order below) |
| `lore` | `"lore"` | Markdown canon docs (read-only in the editor) |
| `tests` | `"tests"` | Route & snapshot fixtures — regression tests a shipping game never loads |
| `port` | `8000` (or `$PORT`) | Host port |

All paths resolve relative to the project root. Absent or malformed file →
every field falls back to its default, silently.

## How the project root is found

In order: explicit CLI argument → `PARLANCE_ROOT` environment variable →
current working directory.

A directory *counts* as a project (the `IS_PROJECT` check) when it has a
`parlance.config.json`, a `data/` directory, or a `schema/` directory. The
editor and `parlance init` use this to refuse scaffolding into somewhere
unintentional — your Downloads folder stays unseeded.

## How schemas are resolved

1. An explicit `schema` path in config — **honored even if it doesn't exist**,
   so a typo surfaces as a loud failure instead of a silent fallback;
2. else a vendored `./schema` directory in the project;
3. else the editor's **bundled** schemas (announced, not hidden).

You don't need to vendor schemas. Do it only to pin a specific contract
version — see [schema-first data](/docs/concepts/schema-first/).

## Project layout

The standard tree ([why it's shaped this way](/docs/concepts/git-native/)):

```
<project root>/
  parlance.config.json     optional
  data/                    narrative content ONLY — what the game reads
    skills/  variables/  factions/  characters/
    dialogues/             dlg_*.json  (+ dlg_*.layout.json, gitignored)
    quests/                qst_*.json  (+ _graph.layout.json, gitignored)
    locations/  endings/  codex/  cutscenes/
    items.json  portraits.json  progression.json     flat registries
  tests/
    routes/                rt_*.json — scripted playthroughs with assertions
    snapshots/             snap_*.json — saved states to resume from
  schema/                  only if pinning a contract version
  lore/                    *.md canon docs
  review/                  review requests + comment threads
```

The four-way split is load-bearing:

- **`data/`** is the game. Nothing else in the tree ships.
- **`tests/`** is regression fixtures — the editor and CI read them; a runtime
  never should.
- **`lore/`** is prose canon, referenced by `loreRef` and rendered read-only.
- **`review/`** is invisible to the runtime, the loaders, *and* the validator —
  a stale comment can never fail a narrative build.
- `*.layout.json` sidecars (canvas positions) are **gitignored** — layout is
  personal, content is shared.

## Canonical serialization

Every file the editor writes: **sorted keys, 2-space indent, LF line endings,
literal UTF-8**. This is what keeps a one-line edit a one-line diff.

```bash
npm run normalize              # rewrite all project files to canonical form
npm run normalize -- --check   # report drift without writing (CI runs this)
```

Hand-authored and script-generated files are the usual drift source —
Python's `json.dumps` escapes non-ASCII by default, for example.

## Environment variables

| Variable | Effect |
|---|---|
| `PARLANCE_ROOT` | Project root (when no CLI arg is given) |
| `PORT` | Host port (config `port` beats it) |

## What persists where

| Kind of state | Lives in |
|---|---|
| Story content | `data/` — versioned, shared |
| Canvas layout | `*.layout.json` sidecars — local, gitignored |
| View preferences (densities, collapsed panels, text size, minimaps…) | Local app storage, never in the project — see below |
| Reviewer's unsynced comments | A local queue inside `.git/` — can't be committed by accident |

### View preferences

These are stored locally under `parlance:` keys and never written to your
project, so they can't cause a diff or a merge conflict — and clearing them
resets your view to defaults:

`entityPanelCollapsed` · `validationCollapsed` · `detailMode` (form vs. raw
JSON) · `dialogueDensity` (compact / card / script) · `textScale` · minimap
visibility per canvas (`dialogueMiniMap`, `questMiniMap`, `questDepMiniMap`,
`locationMapMiniMap`) · inspector and play-panel widths.

**Related:** [Install & run](/docs/install/) ·
[CLI reference](/docs/reference/cli/) · [MCP server](/docs/reference/mcp/)
