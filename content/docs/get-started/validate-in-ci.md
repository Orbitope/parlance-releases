---
title: Validate in CI
description: Gate your game repo on story correctness — run parlance ci-check locally, add route fixtures with assertions, and wire a GitHub Actions workflow that fails on narrative regressions.
---

# Validate in CI

**Goal:** a repo where a broken story fails the build — dangling references,
unwinnable quests, and regressed playthroughs all caught by CI. ~10 minutes.

## 1. Run the validator headless

From your project directory:

```bash
parlance ci-check .
```

Same validator the editor runs on every save — headless. It prints a project
summary (dialogue/node/choice/word counts) and every issue grouped by family,
then exits:

| Exit code | Meaning |
|---|---|
| `0` | clean |
| `1` | validation errors (with `--strict`: errors *or* warnings) |
| `2` | not a Parlance project |

Start CI with plain `ci-check` (errors only) so in-progress warnings don't
block the team; graduate to `--strict` when the backlog is clean — the demo
project stays `--strict`-clean permanently, and it's a good standard to covet.

## 2. Turn a playthrough into a test

Validation proves the story is *well-formed*; **route fixtures** prove specific
playthroughs still *work*. A route is a scripted walk — which choices to take,
with check outcomes forced so the walk is dice-independent — plus assertions
about where you end up:

```json
{
  "id": "rt_talk_past",
  "description": "Talking past the gatekeeper marks you as known at the gate.",
  "dialogueId": "dlg_gate_first",
  "steps": [{ "choiceId": "ch_1", "forced": "pass" }],
  "assertEnd": { "flags": { "talked_past_gate": true } }
}
```

Drop it at `tests/routes/rt_talk_past.json` and run:

```bash
parlance route --all --strict
```

Because play is [deterministic](/docs/concepts/playtest-determinism/), the
replay is exact every run. When next month's edit
accidentally gates your only route to the success node, this fixture fails
with the step where the walk diverged. (`ch_1` is the choice id from the
[branching tutorial](/docs/get-started/branching-dialogue/); use your own if
you renamed it.) The demo ships five of these, including one asserting the
*failure* branch still works.

Routes live in `tests/`, not `data/`, deliberately: a shipping game never
loads them ([layout reference](/docs/reference/config/#project-layout)).

## 3. Wire it into GitHub Actions

```yaml
name: narrative
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npx @orbitope/parlance-cli ci-check . --strict
      - run: npx @orbitope/parlance-cli route --all --strict
```

**Or use the reusable action.** The same `ci-check` is packaged as a composite
action, pinned to a release tag so the check matches that release exactly:

```yaml
      - uses: Orbitope/parlance-releases/validate@vX.Y.Z
        with:
          project-dir: .
          strict: "true"
```

Pin `vX.Y.Z` to the latest release — it runs the matching `@orbitope/parlance-cli`
version, so your CI never drifts from the release you pinned. The action wraps
`ci-check`; keep the `route` step above if you also gate on route fixtures.

Now a pull request that breaks the story shows a red ✗ like any other broken
build — which changes the *social* contract: narrative edits get the same
review-and-green-check flow as code, and "it validates" stops being a claim
anyone has to take on faith. ([Why that matters](/docs/concepts/git-native/).)

No Node in your pipeline? The independent Python validator
([reference](/docs/reference/cli/#the-python-reference-validator)) reports the
same issues, enforced by a parity test.

## 4. Read failures fast

On GitHub Actions you usually don't need the log. `ci-check` (and the
reusable action) marks each issue on the file and line that caused it, so the
pull request's **Files changed** tab shows the error on the choice, node or
registry entry itself, titled with the check code (`REF`, `SCHEMA`, ...) and
carrying the same message as the log.

This turns on by itself when `GITHUB_ACTIONS=true`, so no setup is needed.
GitHub shows at most 10 errors and 10 warnings per step; the complete list is
in the step's log. To turn it off, pass `--annotations none`, or set
`annotations: "false"` on the action
([details](/docs/reference/cli/#parlance-ci-check)).

When CI goes red, the [validation checks reference](/docs/reference/validation-checks/)
is the decoder ring — every family, what it scans, and how to fix it. In the
editor, the same issues are clickable rows that navigate straight to the
offending entity.

## Where next

That's the full loop —
[author → validate → playtest → review → CI → engine](/docs/concepts/workflow/).
The remaining depth lives in the [editor guide](/docs/editor-guide/) and the
[reference pages](/docs/reference/shortcuts/).
