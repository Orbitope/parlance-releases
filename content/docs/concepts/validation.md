---
title: Validation
description: One validator, three surfaces — live as you save, headless in CI, and an independent Python reimplementation kept in enforced parity.
---

# Validation

A story-driven game fails in quiet ways: a choice that targets a deleted node,
a flag set that nothing ever reads, a quest whose completion condition can
never fire, an ending no path reaches. Parlance's position is that these are
**build errors** — findable statically, reportable precisely, and fixable
before a playtester ever trips over them.

## One validator, three surfaces

The same rule set runs in three places, and they are kept in agreement:

1. **On every save.** Each write triggers a full project validation, and the
   results are pushed over a WebSocket to every open editor window. The
   [validation bar](/docs/editor-guide/#10-validation-panel) shows live
   error/warning counts with per-code filters; each issue row navigates to the
   offending entity. You never refresh, and you never validate "later."

   The pass is *scheduled* rather than run inside the save itself: a save
   returns as soon as the bytes are on disk, and rapid saves coalesce into one
   validation instead of one each. On a small project the difference is
   invisible; on a large one it is the difference between a save that answers
   instantly and one that waits on a whole-project pass. See
   [Performance](/docs/concepts/performance/).
2. **In CI.** [`parlance ci-check`](/docs/reference/cli/) runs the identical
   code path headless: exit `1` on errors, `--strict` to fail on warnings too.
   See the [CI tutorial](/docs/get-started/validate-in-ci/).
3. **Independently.** `validate.py` is a standalone **Python
   reimplementation** of the same rules — usable in pipelines with no Node
   toolchain, and doubling as a second opinion on the rules themselves. A
   parity test in the main suite asserts both implementations report the same
   issues, so they can't drift apart silently.

## What gets checked

[Eighteen check families](/docs/reference/validation-checks/), spanning shape
(`SCHEMA`), wiring (`REF`, `DUP`), flow (`FLOW`, `REACH`, `GATE`), state
(`FLAG`, `REP`), structure (`QUEST`, `ENDING`, `COVERAGE`, `LOC`, `CUT`,
[`LADDER`](/docs/concepts/dialogue-laddering/)), content (`LORE`), and
progression math (`PROG`, `XP`, `CHECK`). The reference page lists every family
with what it scans and how to fix what it finds.

## Errors, warnings, and why saves never block

- **Errors** are broken wiring — a reference to something that doesn't exist,
  data that violates schema. CI fails on these.
- **Warnings** are story smells — a dead ladder rung, an unreachable ending, a
  write-only flag. They're often *work in progress*, which is exactly why the
  editor **never blocks a save on validation**: a half-built quest should be
  savable, committable, and shareable mid-thought. The discipline point is CI,
  where `--strict` draws whatever line your team wants.

## Beyond the checklist: Reports

The [Reports panel](/docs/editor-guide/#11-reports--coverage--reference-index)
is validation's exploratory twin:

- **Coverage & structure** — issues grouped by family, clickable through to
  each entity: characters with no dialogue, unreachable nodes, orphaned flags,
  endings with no path in.
- **The reference index** — for *any* id in the project: where it's defined,
  every place it's **read**, every place it's **written**, each entry one click
  from the spot. This is "find usages" for your story, and it's what makes
  renaming or retiring a variable safe. (Variables and items also get an inline
  [Flow panel](/docs/editor-guide/#flow-flags-counters-items) on their own
  detail page.)

## Validation as a feature of the *format*

Because the data is [schema-first](/docs/concepts/schema-first/) plain JSON
with published semantics, deep static analysis is possible at all — you can't
statically trace flag flow through a pile of engine-side script. The validator
is the payoff of the format's discipline, and via
[the open spec](/docs/spec/), third parties can implement the same checks.

**Next:** [wire it into CI in ten minutes](/docs/get-started/validate-in-ci/) ·
[every check family, explained](/docs/reference/validation-checks/)
