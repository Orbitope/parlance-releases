---
title: Playtest & determinism
description: Seeded, rewindable play sessions inside the editor — edit while playing, force check outcomes, continue across scenes, and export one-file playable builds.
---

# Playtest & determinism

Writing branching content without playing it is guesswork. Parlance puts a
full play session *inside* the canvas — with one design decision underneath
that makes the rest possible: **play is deterministic**.

## The determinism guarantee

Every session runs on a seeded RNG (`mulberry32(seed + stepIndex)`). Same seed,
same starting state → same rolls, same outcomes, every time. Rewind and replay
are exact. The seed changes only when you ask (🎲 randomize, or **⟳ Reroll** =
seed+1).

That single guarantee is what buys:

- **Rewind** — every past transcript step has *↩ rewind here*; the timeline
  truncates and replays identically.
- **Reroll** — flip a passed check to a failed one (or back) by nudging the
  seed, without touching your stats.
- **[Route fixtures](/docs/get-started/validate-in-ci/)** — scripted
  playthroughs with assertions that CI replays byte-for-byte. Deterministic
  play is why a "story test" can exist at all.

## A session, end to end

<img class="shot" src="/assets/images/editor-playtest.png" alt="A running playtest session: the active node highlighted on the canvas, a passed Observation check with its d20 roll, applied effects, the discovery pool, and the live state table" loading="lazy">
<p class="shot-caption">A live session on the demo's body-examination scene: the roll, the effects
it fired, the discovery pool, and the state it changed — all in one panel.</p>

Open any dialogue, hit **▶ Play**
([manual](/docs/editor-guide/#12-playtest-mode)):

- **Starting state editor** — every skill, flag, and text variable *this scene
  actually references* is offered as an input, pre-filled from declared
  defaults. **Start at** any node to fast-forward ten choices deep without
  clicking there.
- **The transcript** shows each beat: resolved speaker and line (with
  `{placeholders}` substituted from state *at that step*), the visible choices,
  check results as `d20 + skill vs difficulty`, and every applied effect —
  purple if it changed state, grey if it was a no-op.
- **force ✓ / force ✗** on any active check take the success/failure branch
  regardless of dice — test both sides of a branch in seconds.
- **State inspector** — live values of everything the scene touches,
  highlighting what just changed.
- **Cross-scene continuation** — when a conversation ends, continue straight
  into an explicitly routed next scene, or pick from the *discovery pool* (the
  dialogues whose conditions now pass — the same set the game itself would
  offer), carrying accumulated state forward.

## Edit while playing

A running session survives edits to the scene it's playing. Reword a line, add
a node, rewire an edge — state (flags, XP, reputation) carries over and the
session re-reads the content, recomputing visible choices where you stand. The
loop becomes: hear the beat, fix the beat, hear it again — seconds, not
restarts.

## Read-only, and honestly so

Playtest never writes to dialogue or layout files — content is byte-identical
before and after any session. `advance_quest` effects appear in the transcript
but are no-ops in playtest (quest stage tracking belongs to the host engine —
see [the engine contract](/docs/concepts/engine-contract/)).

## Share builds: playtesting beyond the editor

**⇪ Share build** exports the current scene as a **single self-contained HTML
file** — the same core engine, checks rolling, gates evaluating, scenes
routing, in any browser with no install. It's the handoff format for "just
play this and tell me if the confession lands": send one file to a writer, a
tester, a designer on another team. [The demo](/demo/) is exactly such a build.

**Next:** [the hands-on tutorial](/docs/get-started/playtest-and-share/) ·
[turn transcripts into CI tests](/docs/get-started/validate-in-ci/)
