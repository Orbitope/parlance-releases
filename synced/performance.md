# Performance at scale

Parlance is built to stay responsive on a full-length game — roughly 500,000 to 1,000,000
words of branching narrative. This page reports how it actually performs at that size,
measured rather than assumed.

## How it's measured

`make_scale_fixture.py` inflates a real project into a synthetic one at a target word count,
keeping its shape: N "volumes", each a full copy of the source's structure with every id
namespaced, sharing one global skill set and progression curve. Prose comes from a bigram
model trained on the source's own text, so vocabulary and word-frequency shape survive —
which is what makes search and prose timings meaningful. The fixture is a **valid** project
(both validators accept it with zero issues), so the numbers time real work, never error paths.

To reproduce on your own machine:

```bash
python3 tooling/scripts/make_scale_fixture.py --words 1000000
cd editor && npm run bench:scale -- ../.scale-fixtures/mc-scaled
```

## Baseline

A 1.02M-word project — 5,152 dialogues, 13,616 nodes, 1,426 characters, 15.5 MB on disk —
with two small real projects alongside it for scale:

| operation | small (2.7k words) | medium (5.5k) | full game (1.02M) |
|---|---|---|---|
| load project (cold) | 1.8 ms | 17.6 ms | 690 ms |
| validate (whole project) | 5.6 ms | 31.3 ms | 1.31 s |
| build reference index | 0.1 ms | 0.5 ms | 46 ms |
| extract localization strings | 0 ms | 0.1 ms | 14 ms (29,486 keys) |
| search (term absent) | 0 ms | 0.1 ms | 17 ms |
| serialize whole project | 0.4 ms | 1.5 ms | 120 ms (17.4 MB) |
| reference validator (`validate.py`) | 0.22 s | 0.36 s | 7.2 s |
| prose / spelling check | 2.7 ms | — | 845 ms |

## What the numbers say

**Everything is linear in project size.** Across a 5 / 12 / 24 / 46-volume curve, 2.40× the
words cost 2.41× the validation — there is no quadratic path at this scale.

**Saves stay fast regardless of size.** A full whole-project validate is ~1.3 s at a million
words, but that no longer runs on every keystroke. The editor revalidates only the entities
you changed and the ones that reference them, on a worker thread off the main loop — a single
edit is dozens of times cheaper than a full pass, so typing stays smooth in a project of any
size. A full pass still runs when a project loads and whenever you ask for one.

**The one place size shows through is a single enormous dialogue.** Re-checking the entity you
just edited re-runs its schema parse, which scales with *that* entity's node count — a few
milliseconds for a normal scene, more for one 5,000-node chapter, because at that point the
project effectively *is* that single dialogue. Splitting a very large dialogue keeps edits
snappy.

## A note on these numbers

They are one machine, one day — a baseline to compare against as the project and the editor
change, not a guaranteed spec. Re-run the benchmark on your own hardware and your own project
rather than trusting the table; that is what the fixture generator is for.
