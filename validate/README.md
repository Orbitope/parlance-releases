# Parlance validate — GitHub Action

Gate your game repo's CI on the same checks the Parlance editor runs. The action
runs [`@orbitope/parlance-cli`](https://www.npmjs.com/package/@orbitope/parlance-cli)
`ci-check` and fails the job on errors.

## Usage

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

Pin the action to a release tag (replace `vX.Y.Z` with the latest release). By
default it runs the CLI version matching that tag, so the checks never drift from
the release you pinned.

## Inputs

| Input | Default | Description |
|-------|---------|-------------|
| `project-dir` | `.` | Directory with `data/` or `parlance.config.json`. |
| `strict` | `"false"` | `"true"` also fails on warnings, not just errors. |
| `version` | (tag) | Override the CLI version (e.g. `0.12.0`). Defaults to the tag the action was referenced at. |

## Requirements

The runner needs Node.js 18+ (every GitHub-hosted runner has it). The action
invokes the CLI with `npx`; no separate install step is needed.

## Exit behavior

Non-zero exit fails the job: `1` for validation errors (or warnings under
`strict`), `2` for a missing/invalid project. See the
[CLI README](https://www.npmjs.com/package/@orbitope/parlance-cli) for details.
