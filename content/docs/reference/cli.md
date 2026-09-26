---
title: CLI
description: The parlance command reference — init, ci-check, route, explore, witness, rename, export — plus the independent Python reference validator and when to use which.
---

# CLI reference

The `parlance` command ships with the host package. Every subcommand resolves
the project root the same way: explicit path argument → `PARLANCE_ROOT` env
var → current directory ([details](/docs/reference/config/)).

For CI and other headless use without the editor, the same commands are published
as a standalone npm package, **`@orbitope/parlance-cli`** — run any subcommand with
`npx @orbitope/parlance-cli <command>` (no install, no editor). Examples below use
the short `parlance` form, which assumes it's on your `PATH`.

Running `parlance` with no subcommand starts the editor host itself; if the
target directory isn't a Parlance project, it says so and suggests
`parlance init` rather than scaffolding on its own.

## parlance init

```bash
parlance init [dir]
```

Scaffolds a new project: the [standard directory tree](/docs/reference/config/#project-layout),
ready for the editor. Guarded by the project marker — it won't scaffold over a
directory that already is a project, and the editor won't silently seed a
random folder.

## parlance ci-check

```bash
parlance ci-check [project-dir]            # exit 1 on errors
parlance ci-check [project-dir] --strict   # exit 1 on errors OR warnings
```

Runs the full validator — the same code path as the editor's on-save
validation, honoring `parlance.config.json`, lore files, and rules — and
prints a project summary (dialogue / node / choice / word counts) plus issues
grouped by [check family](/docs/reference/validation-checks/).

| Exit | Meaning |
|---|---|
| `0` | clean |
| `1` | validation failed |
| `2` | not a Parlance project |

The [CI tutorial](/docs/get-started/validate-in-ci/) shows the GitHub Actions
wiring.

## parlance route

```bash
parlance route [project-dir] [route-id]    # one fixture
parlance route [project-dir] --all         # every fixture
parlance route ... --strict
```

Replays route fixtures — scripted playthroughs with assertions from
`tests/routes/rt_*.json` — and exits non-zero when a walk diverges or an
assertion fails. Deterministic play is what makes the replay exact; see the
[fixture format and workflow](/docs/get-started/validate-in-ci/).

`--coverage` adds route coverage: per dialogue, how many of its nodes some passing
route stands on, and which dialogues no route touches at all.

## parlance explore

```bash
parlance explore [--runs N] [--seed S] [--no-exhaustive] [--max-states N]
                 [--max-depth N] [--from-snapshots] [--json]
```

Plays the project instead of reading it: seeded random runs, then an exhaustive
pass that takes every visible choice and both outcomes of every active check. It
reports dead ends, unreached nodes and choices, and dialogues that never end, and
says whether the search was complete or bounded — a bounded search never calls a
node unreachable. The same engine as **Reports → Explore** in the editor
([details](/docs/editor-guide/#explore--playthrough-explorer--route-coverage)).

| Exit | Meaning |
|---|---|
| `0` | no dead ends |
| `1` | dead ends found |
| `2` | not a Parlance project |

## parlance witness

```bash
parlance witness <dialogueId> <nodeId> [--from <dialogueId>] [--max-states N]
                 [--save-snapshot <id>] [--save-route <id>] [--json]
```

Finds a shortest path from the project's start to one node and prints the moves,
optionally saving it as a snapshot or a route. The headless form of
[**Find a path here**](/docs/editor-guide/#find-a-path-here--the-witness-solver).
Exits `0` when a path is found, `1` when none is, `2` on a usage error.

## parlance rename

```bash
parlance rename <type> <from> <to> [--dry-run]
```

Changes an entity's id and rewrites every reference to it — other entities,
localization and VO keys, bindings, test routes and snapshots, `parlance:` links in
lore, review threads and canvas layout. `--dry-run` prints the plan without writing.
Nested ids (dialogue nodes, choices, quest stages) and custom rows can't be renamed
this way ([details](/docs/editor-guide/#renaming-an-id)).

## parlance export

```bash
parlance export --format docx|xlsx --out <path> [--dialogue <id>]
parlance export --format csv|json --out <path> --type <typeId>
```

The first form writes a Word screenplay or an Excel line sheet, for one dialogue or
the whole project
([details](/docs/editor-guide/#export--word-screenplay--excel-line-sheet)). The
second writes one custom type's rows. Office export is one-way: nothing reads a
`.docx` or `.xlsx` back into the project.

## parlance save import

```bash
parlance save import <file> [--id <id>]
```

Imports an **engine save file** as a playtest snapshot — so a save the game itself
wrote (the file proving a bug a tester hit) can be opened and replayed in the
editor instead of reproduced by hand. It shares one implementation with the
editor's `POST /api/saves/import`, so the CLI and the editor can't disagree about
what a save means.

## The Python reference validator

An independent **reimplementation** of the same validation rules in Python —
no Node toolchain required — published in the MIT
[spec repository](/docs/spec/) alongside the schemas and conformance vectors:

```bash
python3 validate.py --root /path/to/project --strict
```

It reads the project's `parlance.config.json` for `data`/`schema` overrides and
falls back to the bundled schemas when the project vendors none.

Use it when your pipeline is Python-shaped, or as a second opinion: a parity
test in the main suite asserts it reports the same issue set as the TypeScript
validator, so the two can't drift silently.
([Why two implementations](/docs/concepts/validation/).)

## Environment

| Variable | Effect |
|---|---|
| `PARLANCE_ROOT` | Project root when no path argument is given |
| `PORT` | Host port (the config file's `port` wins) |
