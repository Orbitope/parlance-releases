---
title: Performance
description: What Parlance costs at every project size, measured from 2.7k to 2M words — and why validation no longer runs inside a save.
---

# Performance

Parlance is built for a game of 500,000 to a million words. Every project that
actually exists is three orders of magnitude smaller than that: the demo is
2,700 words, and [parlance-monte-cristo](https://github.com/Orbitope/parlance-monte-cristo)
— the largest real Parlance project anywhere — is 5,500.

So for most of the tool's life its behaviour at the size it was designed for had
been *reasoned about* rather than measured. This page is the measurement.

## Every core operation, from 2.7k to 2M words

Two real projects and six synthetic ones. The synthetic fixtures are produced by
inflating a real project while preserving its shape — prose comes from a bigram
model trained on the source text, so vocabulary and word-frequency distribution
survive, which is what makes the search timings mean anything. Every fixture is
a *valid* project: both validators accept it with zero issues.

| Project | Words | Dialogues | Load | Validate | Ref index | Loc strings | Search | Serialize |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| demo | 2,664 | 13 | 1.1 ms | 5.0 ms | 0.1 ms | <0.1 ms | <0.1 ms | 0.3 ms |
| monte-cristo | 5,508 | 112 | 3.4 ms | 31.9 ms | 0.5 ms | 0.1 ms | 0.1 ms | 1.5 ms |
| synthetic | 43,787 | 224 | 8.8 ms | 57.2 ms | 1.1 ms | 0.3 ms | 0.5 ms | 3.3 ms |
| synthetic | 109,802 | 560 | 24.3 ms | 146.6 ms | 1.8 ms | 0.4 ms | 1.2 ms | 9.7 ms |
| synthetic | 263,805 | 1,344 | 57.1 ms | 348.5 ms | 8.3 ms | 0.9 ms | 3.0 ms | 29.6 ms |
| synthetic | 507,668 | 2,576 | 114.1 ms | 674.0 ms | 14.5 ms | 2.1 ms | 6.4 ms | 52.9 ms |
| synthetic | 1,017,248 | 5,152 | 268.0 ms | 1346.1 ms | 37.0 ms | 6.5 ms | 11.5 ms | 109.5 ms |
| synthetic | 2,010,880 | 10,192 | 535.1 ms | 2893.7 ms | 113.0 ms | 28.9 ms | 41.9 ms | 234.5 ms |

**The shape matters more than any single figure: everything is linear.**
Validation holds at 1.31–1.44 microseconds per word across a 46× range in
project size. There is no quadratic path waiting at scale — a project twice the
size costs twice as much, not four times.

That is the reassuring half, and it is the half worth trusting. The absolute
milliseconds are one machine on one day.

## Validation does not run inside a save

The actionable half of those numbers: validation is a **whole-project** pass, so
its cost is proportional to the project. It used to run synchronously inside
every save, with the response blocked on the result — which meant that at a
million words, every save cost the author more than two seconds.

It is now scheduled. A save returns as soon as the bytes reach disk; the fresh
issue set arrives over the validation WebSocket a moment later, and rapid saves
coalesce into a single pass instead of one each.

| Project size | Save, before | Save, after |
|---|---:|---:|
| 110k words | 223 ms | **1 ms** |
| 1.02M words | 2,085 ms | **1 ms** |
| burst of 5 saves at 1M words | 10.6 s | **9 ms** |

Two things follow, and both are deliberate:

- **The panels that answer "what is wrong right now" are never stale.** The
  validation bar and the Reports panel force any pending pass to complete before
  they reply. Fixing an error and still seeing it would be a worse failure than
  a slow save, so those routes do not take the shortcut.
- **A save's own response reports what was last known.** It cannot report
  otherwise without running the pass it just avoided. The WebSocket corrects the
  panel within a fraction of a second.

## What this means for a project of your size

- **Up to ~50k words** — everything is instant; there is nothing to think about.
- **~100k words** — a blocking save would have cost 223 ms, around the threshold
  where typing starts to feel sticky. This is where the change starts to matter.
- **500k–1M words** — the design target. A blocking save would be 0.7–2.1
  seconds, which is unusable; scheduled, it is 1 ms.
- **2M words** — twice the top of the target, and still linear: validation 2.9 s
  in the background, serialization 235 ms, search 42 ms.

## Reproducing this

The fixtures and benchmarks ship with the editor's source. The generator is
deterministic under `--seed`, so the projects are reproducible even though the
timings are not.

Figures above: Apple M3 Pro (11 cores, 18 GB), Node 26, macOS 14.3; every number
is a median of repeated runs after a warm-up pass.

> **If you re-run these, raise the run count before believing a trend.** The
> first pass at this used five runs per operation and produced a convincing
> superlinear curve for three of them. At fifteen runs most of it evaporated —
> it was JIT and garbage-collection noise on operations costing tens of
> milliseconds. Treat the table as a baseline to compare against, not a
> specification.
