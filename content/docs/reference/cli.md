---
title: CLI
description: The parlance command reference — init, ci-check, route, explore, witness, rename, export — plus the independent Python reference validator and when to use which.
---

# CLI reference

The `parlance` command is published as a standalone npm package,
**`@orbitope/parlance-cli`**, for CI and other headless use. It needs no editor
and no install: run any subcommand with `npx @orbitope/parlance-cli <command>`.
Examples below use the short `parlance` form, which assumes the package is
installed and on your `PATH`.

**Which project it acts on.** `ci-check` and `migrate` take an optional project
directory as their first argument. Every other subcommand (`route`, `explore`,
`witness`, `rename`, `export`, `save import`) acts on the **current directory**
and has no project argument, so `cd` into the project first (or set
`working-directory` on the CI step). `init` takes the directory to create.

The CLI doesn't start the editor. Running `parlance` with no subcommand prints
the usage and exits `2` (a bare `parlance` in a CI step is almost always a
forgotten verb). `parlance --help` prints the same usage and exits `0`, and
`parlance --version` prints the package version. Editing happens in the
[desktop app](/docs/install/).

## parlance init

```bash
parlance init [dir] [--template blank|first-conversation]
```

Scaffolds a new project in `dir` (default: the current directory): the
[standard directory tree](/docs/reference/config/#project-layout), ready for the
editor. `--template` picks the starting content:

| Template | What you get |
|---|---|
| `blank` (default) | Empty folders and registries, a `parlance.config.json`, a lore placeholder |
| `first-conversation` | A tiny working project: one character and a branching dialogue that remembers a choice |

These are the same two templates as **File ▸ New Project…** in the desktop app.
An unknown template id fails with the list of known ones.

`init` doesn't check whether `dir` is already a project, so run it on an empty
or new folder. With `blank` it only creates files that are missing; with
`first-conversation` it copies the starter's files over any existing files with
the same names.

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
parlance route <route-id>        # one fixture
parlance route --all             # every fixture
parlance route --all --strict
parlance route --all --coverage
```

`route` runs against the project in the current directory. Its first
positional argument is always the route id, so `parlance route . rt_x` looks
for a route named `.`.

Replays route fixtures — scripted playthroughs with assertions from
`tests/routes/rt_*.json` — and exits non-zero when a walk diverges or an
assertion fails. Deterministic play is what makes the replay exact; see the
[fixture format and workflow](/docs/get-started/validate-in-ci/).

`--coverage` adds route coverage: per dialogue, how many of its nodes some passing
route stands on, and which dialogues no route touches at all.

## parlance migrate

```bash
parlance migrate [project-dir]           # rewrite character ladders as dialogue offers
parlance migrate [project-dir] --check   # report only; exit 1 if anything needs migrating
```

The one-time 0.13 → 0.14 migration from character dialogue ladders to
[dialogue offers](/docs/concepts/dialogue-laddering/). Without `--check` it
rewrites the files and exits `0`.

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
parlance save import <file> [--id <id>] [--name "..."] [--force]
```

Imports an **engine save file** as a playtest snapshot — so a save the game itself
wrote (the file proving a bug a tester hit) can be opened and replayed in the
editor instead of reproduced by hand. It shares one implementation with the
editor's `POST /api/saves/import`, so the CLI and the editor can't disagree about
what a save means.

The snapshot id defaults to `snap_` plus the file name, snake_cased
(`slot1.json` becomes `snap_slot1`); `--id` sets it instead. `--name` sets the
snapshot's display name. An import that would replace an existing snapshot is
refused unless you pass `--force`. A save that names content the project doesn't
have is refused.

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

The npm CLI reads no environment variable for the project root. It sets
`PARLANCE_ROOT` itself, from the project argument or the current directory,
before every subcommand, so a `PARLANCE_ROOT` you export has no effect on it.
To point it at another project, pass the path (`ci-check`, `migrate`) or `cd`
there first.
