---
title: The engine contract
description: A contract, not an exporter — engines read the files the editor writes, semantics are published, and ports prove correctness against conformance vectors.
---

# The engine contract

Most narrative tools connect to engines through an **exporter**: authoring
format in, engine format out, and a translation layer in between that must be
kept honest by hand. Parlance replaces the exporter with a **contract**.

## No export step

A shipping game loads `data/` — the same per-entity JSON files the editor
writes — and nothing else. There is no bake, no conversion, no moment where
the authored truth and the shipped truth can diverge. (Route and snapshot
fixtures live in `tests/` beside it precisely so the game never reads them.)

For this to be safe, "what the data means when executed" can't live in one
implementation's head. So it's published in two layers:

1. **The runtime contract** — a document defining the execution semantics
   precisely: how conditions evaluate, how effects apply, how checks roll
   (`d20 + skill ≥ difficulty` on a seeded `mulberry32` RNG), how
   [ladders resolve](/docs/concepts/dialogue-laddering/), how quest resolution
   fires effects to a fixpoint, what happens on every edge case (unknown ids,
   unadvanced quests, cycles) — the boring cases spelled out, because the
   boring cases are where ports drift.
2. **Conformance vectors** — machine-readable test cases for each runtime
   function: given this state and this input, exactly this output. A port
   doesn't argue it's correct; it *passes*.

Both layers, with the schemas and the reference validator, are
[MIT-licensed](/docs/spec/) — deliberately more open than the tool itself, so
your data's meaning never depends on our goodwill.

## Ports prove themselves

The TypeScript runtime in `@parlance/core` powers the editor's own playtest —
which means every scene you play in-editor is exercising the same contract
your engine implements. The public
[Godot/GDScript runtime](https://github.com/Orbitope/parlance-gdscript) ships
its conformance scoreboard in the README:

```
PASS  evaluate                    53 vectors
PASS  applyEffect                 27 vectors
PASS  resolveCheck                18 vectors
PASS  stepDialogue                 8 vectors
PASS  resolveCharacterDialogue     6 vectors
...
136 passed, 0 failed, 19 skipped (not yet ported)
```

Note the honesty of `SKIP`: unported functions are declared, not fudged. A
Unity/C# port, a Rust port, a bespoke-engine port all follow the same path —
implement the contract, run the vectors, ship when green. The
[integration guide](/docs/integrations/) covers the practical steps.

## The division of labor

The contract is also explicit about what the **host engine** owns: playing
cutscene assets, running quest resolution after state transitions, persistence,
presentation. Parlance defines *narrative meaning*; your engine owns
*everything it's better at*. The boundary is documented per-function, so
"whose bug is this?" has an answer.

## What this buys you

- **No drift** between what writers played and what players get.
- **No lock-in**: your data is readable JSON with an open, testable meaning.
  Worst case, you keep the files and an MIT runtime.
- **Trustable ports**: "does our engine run it correctly?" is a test suite,
  not a feeling.

**Next:** [engine integrations](/docs/integrations/) ·
[the open spec](/docs/spec/) · [schema-first data](/docs/concepts/schema-first/)
