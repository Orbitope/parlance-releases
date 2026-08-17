---
title: Playtest & share
description: Play a scene with seeded dice and a rewindable transcript, edit it mid-session, force both check outcomes, and export a one-file playable share build.
---

# Playtest & share

**Goal:** play your scene like a player, bend the dice like a designer, and
export a playable file anyone can open. ~10 minutes.
Prereq: a scene with a check — [branching dialogue](/docs/get-started/branching-dialogue/)
built one, or use the demo's `dlg_examine_body`.

## 1. Start a session

Open the dialogue, click **▶ Play**. The inspector gives way to the Play panel
and its **Starting State** editor — every skill, flag, and text variable *this
scene references* is offered as an input:

- Set `rhetoric = 6` (make the check uncertain: `d20 + 6 vs 12`).
- Note the **Seed** — leave it; you'll want it reproducible in a moment.
- **Start at** defaults to the entry node; on a long scene, pick a node
  mid-stream to fast-forward straight to the beat you're iterating on.

**▶ Start Session.** The active node glows on the canvas; visited nodes dim.

## 2. Read the transcript like an instrument panel

Take the check choice. Each step logs everything that actually happened:

```
  check rhetoric: d20=9 + 6 = 15 vs 12   PASS
  + set_flag talked_past_gate = true
```

— roll, margin, and every applied effect (purple when it changed state, grey
when it was a no-op). The **State** table at the bottom tracks everything the
scene touches, highlighting what just changed.

## 3. Bend the outcome, three ways

- **↩ rewind here** on any past step truncates the timeline back to it —
  same seed, so replaying is *exact*.
- **⟳ Reroll** rewinds one step and re-runs the same choice with seed+1 — the
  quickest way to see the failure branch you didn't roll.
- **force ✓ / force ✗** beside any check choice take a branch unconditionally,
  marked as forced in the transcript — the systematic way to audit both sides.

Determinism is what makes all three trustworthy:
[same seed, same story](/docs/concepts/playtest-determinism/), every time.

## 4. Edit while playing

Leave the session running. Click your failure node on the canvas and sharpen
its line — the session keeps your accumulated state and re-reads the scene as
you save. Tweak, hear it in context, tweak again; no restarts. (If you delete
the node you're standing on, the session snaps safely back to entry with state
intact.)

And playtest is strictly read-only on your content: dialogue files are
byte-identical after any session, however hard you bent it.

## 5. When the scene ends, keep going

At a **— Conversation ended —** marker, the panel offers what the *game* would
offer next: an explicitly routed next scene (**Continue with…**), or the
**discovery pool** — every dialogue whose conditions pass in the current state.
Click through and your flags ride along: this is how you playtest a
[ladder](/docs/get-started/dialogue-ladders/) arc across scene boundaries
without re-entering state by hand.

## 6. Share build: one file, anyone, anywhere

Click **⇪ Share build**. You get `play-<dialogue-id>.html` — the scene as a
single self-contained file: same engine, checks rolling, gates evaluating,
scene routing, in any browser, no install. Send it to the person whose opinion
you need. ([The demo](/demo/) is exactly this export.)

## Where next

- [Quests & the journal](/docs/get-started/quests-and-journal/) — structure
  above the scene level.
- [Validate in CI](/docs/get-started/validate-in-ci/) — turn a good playthrough
  into a permanent regression test.
