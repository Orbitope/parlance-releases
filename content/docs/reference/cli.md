---
title: CLI
description: The parlance command reference — init, ci-check, route — plus the independent Python reference validator and when to use which.
---

# CLI reference

The `parlance` command ships with the host package. Every subcommand resolves
the project root the same way: explicit path argument → `PARLANCE_ROOT` env
var → current directory ([details](/docs/reference/config/)).

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
