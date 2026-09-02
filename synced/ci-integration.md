# Continuous integration — validate your narrative on every push

Parlance publishes the exact checks the editor runs as a standalone command-line tool and a
reusable GitHub Action, so your game repository can catch a broken conversation — a dangling
`goto`, an unreachable node, a reference to a character that no longer exists — before it
merges, with no editor and no checkout of Parlance itself.

## The one-liner

```bash
npx @orbitope/parlance-cli ci-check --strict
```

`ci-check` runs the editor's own validator over the project in the current directory
(honouring its `parlance.config.json`, lore files, and rules), prints a summary and any
issues grouped by code, and sets the exit status:

| exit code | meaning |
|---|---|
| `0` | clean |
| `1` | validation failed — errors, or (under `--strict`) warnings too |
| `2` | the directory is not a Parlance project |

Drop `--strict` to fail only on errors, or pass a path (`ci-check path/to/project`) to check a
project that is not the working directory.

## GitHub Actions

A reusable action wraps the same command. Add one workflow to your game repo:

```yaml
# .github/workflows/parlance.yml
name: Validate narrative
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: Orbitope/parlance-releases/validate@vX.Y.Z
        with:
          project-dir: .
          strict: "true"
```

Pin the action to a release tag (`vX.Y.Z` — use the latest release). By default it runs the
CLI version matching that tag, so your CI never drifts from the release you pinned. It is the
same rule a runtime port follows: pin an exact tag, never a range or a branch.

### Inputs

| input | default | description |
|---|---|---|
| `project-dir` | `.` | Directory with `data/` or `parlance.config.json`. |
| `strict` | `"false"` | `"true"` also fails the job on warnings, not just errors. |
| `version` | (the tag) | Override the CLI version (e.g. `0.13.0`); defaults to the tag the action was referenced at. |

The runner needs Node.js 18 or newer, which every GitHub-hosted runner already has; the action
invokes the CLI through `npx`, so there is no install step.

## Beyond validation

The same CLI carries a few more headless verbs, useful in CI or a Makefile:

- **`parlance route --all [--strict]`** — runs your project's saved route regression tests
  (scripted play-throughs that assert a path still reaches the beats it should). Gate a pull
  request on these to catch a change that quietly breaks a questline.
- **`parlance init <dir> [--template <id>]`** — scaffolds a new project (`blank`, or
  `first-conversation` for a tiny working starter).
- **`parlance save import <file>`** — imports a writer's submission into project data.

Run `npx @orbitope/parlance-cli --help` for the full list.

## Which validator is this?

`ci-check` is the editor's TypeScript validator compiled to a lean CLI — the same code path,
the same rules, and the same results you see in the app's Validation panel. A separate Python
reference implementation of the rules exists for third-party tooling and is kept in lockstep by
a parity test; for gating your own repo, the CLI is the one to reach for.
