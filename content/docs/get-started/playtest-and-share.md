---
title: Playtest & share
description: Play a scene with seeded dice and a rewindable transcript, edit it mid-session, force both check outcomes, and export a one-file playable share build.
---

# Playtest & share

**Goal:** play your scene like a player, bend the dice like a designer, and
export a playable file anyone can open. ~10 minutes.
Prereq: a scene with a check. This page uses the gatekeeper scene that
[branching dialogue](/docs/get-started/branching-dialogue/) built
(`rhetoric` vs 12); the demo's `dlg_examine_body` works too — its check is
`observation` vs 9, so set that skill instead.

## 1. Start a session

Open the dialogue, click **▶ Play**. The inspector gives way to the Play panel
and its **Starting State** editor — every skill, flag, and text variable *this
scene references* is offered as an input:

- Set `rhetoric = 6` (make the check uncertain: `d20 + 6 ≥ 12` passes 75%
  of the time).
- Look at the **Seed**. It reads *(random each run)*: every **▶ Start
  Session** and **↺ Restart** rolls a fresh one. Click 🔓 to pin it (🔒) when
  you want a restart to reproduce the same rolls — typing a seed pins it too,
  and 🎲 picks a new one.
- **Start at** defaults to the entry node; on a long scene, pick a node
  mid-stream to fast-forward straight to the beat you're iterating on.

**▶ Start Session.** The active node glows on the canvas; visited nodes dim.

## 2. Read the transcript like an instrument panel

Take the check choice. Each step logs everything that actually happened:

```
1d20=9 + 6 = 15 vs ✓ PASS
Gatekeeper: 'Go on through, then.'
set talked_past_gate = true
```

— the roll, your skill, the total and the verdict (the difficulty is on the
choice's badge, not repeated here), the line you arrived at, and every applied
effect (purple when it changed state, grey when it was a no-op). The **State** table at the bottom tracks everything the
scene touches, highlighting what just changed.

## 3. Bend the outcome, three ways

- **↩ rewind here** on any past step truncates the timeline back to it —
  same seed, so replaying is *exact*.
- **⟳ Reroll**, right after a check, rewinds one step and re-runs the same
  choice with seed+1 — the quickest way to see the failure branch you didn't
  roll.
- **force ✓ / force ✗** beside any check choice take a branch unconditionally,
  marked as forced in the transcript — the systematic way to audit both sides.

Determinism is what makes all three trustworthy:
[same seed, same story](/docs/concepts/playtest-determinism/), every time.

## 4. Edit while playing

Leave the session running. While Play is open the inspector gives way to the
panel, but the canvas still takes structural edits — drag a new connection,
add or delete a node — and the session re-reads the scene as each one saves,
keeping your accumulated state. It re-reads it when the dialogue file changes
on disk, too, so a line sharpened in your text editor (or by an agent over
MCP) shows up in context without a restart. (If you delete the node you're
standing on, the session snaps safely back to entry with state intact.
Closing Play or switching to Text ends the session.)

And playtest is strictly read-only on your content: dialogue files are
byte-identical after any session, however hard you bent it.

## 5. When the scene ends, keep going

At a **— Conversation ended —** marker, the panel offers what the *game* would
offer next: an explicitly routed next scene (**Continue with…**), or the
**discovery pool** — every dialogue whose conditions pass in the current state.
Click through and your flags ride along: this is how you playtest a
character's [offers](/docs/get-started/dialogue-ladders/) across scene boundaries
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
