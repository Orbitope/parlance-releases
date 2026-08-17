---
title: How it all fits together
description: One dialogue edit traveling the whole Parlance loop — author, validate, playtest, share, review, CI, engine — and where each feature lives along the way.
---

# How it all fits together

Parlance's features make sense individually, but the tool is really one loop.
This page follows a single change — editing one suspect's dialogue in the demo
mystery — all the way around it.

```
 author ──▶ validate ──▶ playtest ──▶ share ──▶ review ──▶ merge ──▶ CI ──▶ engine
   ▲                                                                          │
   └────────────────────────── the same JSON files ◀──────────────────────────┘
```

## 1. Author

You open `dlg_wren_first` on the [dialogue canvas](/docs/editor-guide/#6-dialogue-canvas)
and sharpen a line. The change is written to
`data/dialogues/dlg_wren_first.json` — a plain JSON file in your repo. No
database, no project binary; the file *is* the story.
([Schema-first data](/docs/concepts/schema-first/) is why the form knew how to
edit it and why bad data can't be saved.)

## 2. Validate — instantly, on save

The save re-runs the full validator and pushes results to every open editor
window. If your edit orphaned a node or gated a choice on a flag nothing sets,
the [validation bar](/docs/editor-guide/#10-validation-panel) says so *now*,
while the context is still in your head.
([The validation model](/docs/concepts/validation/) · [check reference](/docs/reference/validation-checks/))

## 3. Playtest — in place, deterministically

You hit **▶ Play** and walk the scene with a live game state: set
`observation = 7`, seed the dice, fail the check on purpose with **force ✗**,
rewind, try again. You edit the line again *mid-session* — the session keeps
your state and re-reads the scene. ([Playtest & determinism](/docs/concepts/playtest-determinism/))

## 4. Share — one file, no install

The scene needs a writer's ear. **⇪ Share build** exports a single
self-contained HTML file that plays in any browser through the same runtime.
You send it; they play it; nobody installs anything.
([Share builds](/docs/editor-guide/#share-build) — the [demo](/demo/) is one.)

## 5. Review — on a branch, like code

You push the change on a branch. A colleague opens
[Review](/docs/editor-guide/#16-review--reading-someone-elses-branch), reads the
**narrative diff** ("1 line edited in `dlg_wren_first`"), **plays the branch's
own content** without checking it out, and leaves a comment anchored to the
node — with a suggested replacement you can apply in one click. Verdicts are
recorded against the commit they read. All of it lives in git; there is no
server. ([Git-native workflow](/docs/concepts/git-native/))

## 6. Merge & CI

The branch merges. CI runs [`parlance ci-check --strict`](/docs/reference/cli/)
— the same validator, headless — plus your
[route fixtures](/docs/get-started/validate-in-ci/): scripted playthroughs with
assertions, reproducible because play is seeded. A story regression fails the
build like any other regression.

## 7. Engine — the same files, verbatim

The game engine loads `data/` directly. There is no export step to run and no
drift to chase: the runtime behavior is a published contract, and engine ports
prove themselves against conformance vectors.
([The engine contract](/docs/concepts/engine-contract/) · [integrations](/docs/integrations/))

## The point

Every stop on the loop reads or writes the same per-entity JSON files. That's
the whole trick: because the story is plain versioned data with a published
meaning, each feature — validation, playtest, review, CI, the engine itself —
is just a different consumer of one truth, and none of them can disagree with
the others.

**Next:** run the loop yourself, starting with
[your first project](/docs/get-started/first-project/).
