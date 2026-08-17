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
  "steps": [{ "choiceId": "c_talk", "forced": "pass" }],
  "assertEnd": { "flags": { "talked_past_gate": true } }
}
```

Drop it at `tests/routes/rt_talk_past.json` and run:

```bash
parlance route --all --strict
```

Because play is [deterministic](/docs/concepts/playtest-determinism/), the
replay is exact every run. When next month's edit
accidentally gates your only route to `node_pass`, this fixture fails with the
step where the walk diverged. The demo ships four of these, including one
asserting the *failure* branch still works.

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
      - run: npx parlance ci-check . --strict
      - run: npx parlance route --all --strict
```

Now a pull request that breaks the story shows a red ✗ like any other broken
build — which changes the *social* contract: narrative edits get the same
review-and-green-check flow as code, and "it validates" stops being a claim
anyone has to take on faith. ([Why that matters](/docs/concepts/git-native/).)

No Node in your pipeline? The independent Python validator
([reference](/docs/reference/cli/#the-python-reference-validator)) reports the
same issues, enforced by a parity test.

## 4. Read failures fast

When CI goes red, the [validation checks reference](/docs/reference/validation-checks/)
is the decoder ring — every family, what it scans, and how to fix it. In the
editor, the same issues are clickable rows that navigate straight to the
offending entity.

## Where next

That's the full loop —
[author → validate → playtest → review → CI → engine](/docs/concepts/workflow/).
The remaining depth lives in the [editor guide](/docs/editor-guide/) and the
[reference pages](/docs/reference/shortcuts/).
