---
title: Quests & the journal
description: Build a staged quest with journal objectives in the protagonist's voice, wire dialogue effects to advance it, and read the quest dependency graph.
---

# Quests & the journal

**Goal:** a two-stage quest with real journal writing, advanced by your
dialogue, visible in the dependency graph. ~15 minutes.
Prereq: [branching dialogue](/docs/get-started/branching-dialogue/).

## 1. Create the quest

**Quests** → **+ New** → `qst_past_the_gate`. The main panel becomes the
**stage graph** — stages flow left-to-right, edges are dependencies.

Add two stages with **Add Stage**:

- `stage_reach_gate` — name it *Reach the gate*
- `stage_get_through` — *Get through*

and one outcome with **Add Outcome**: `outcome_inside`, kind **success**.

## 2. Write the journal — intent vs. retrospect

Open a stage's inspector. Two prose fields, and the difference is the whole
point of the journal:

- **Objectives (journal)** — what the protagonist *intends*, in her voice,
  shown while the stage is current: *"Talk my way past the gatekeeper — or
  find papers that will."*
- **Description (retrospective)** — what she *did*, shown once it's complete:
  *"The gatekeeper waved me through. I didn't ask what changed his mind."*

Objectives are rows: reorderable (the journal renders in your order), each with
an id (for diffs and the validator — the player never sees it) and an optional
**show if** gate. Gate on knowledge — has she met this person, does she know
this place — so a route only appears if she could actually name it. An
objective with no gate reads "always visible".

Objectives are display-only — deliberately no effects, no goto. **Complete
When** below decides when the stage is done, whatever route the player took.
Two warnings worth knowing on sight: *"has completeWhen but no objectives"*
(an empty journal for the current stage) and *"every objective is gated"*
(states where the stage lists nothing).

## 3. Wire completion to your scene

Give `stage_reach_gate` a **Complete When** of flag `talked_past_gate` — the
flag [your dialogue sets](/docs/get-started/branching-dialogue/). Chain
`stage_get_through` `after` it, and give the outcome a **Reached When**.

Two runtime facts save real confusion later (they're spelled out in
[the engine contract](/docs/concepts/engine-contract/)):

- Stage/outcome **effects fire through quest resolution**, which the *host
  engine* runs — condition-gated, once per playthrough, to a fixpoint. An
  effectful stage with no condition **never fires**, and the `QUEST` validator
  warns about it.
- In [playtest](/docs/concepts/playtest-determinism/), `advance_quest` shows in
  the transcript but is a no-op — stage tracking belongs to the engine.

## 4. Name it for the journal, tag it for the grouping

On the quest's entity form (not the canvas): **Journal Name** is the
player-facing title, and **Tags** drive the journal's grouping — main vs. side
is a tag, never a checkbox, and tags are linted against a controlled
vocabulary, so `sidequest` vs `side-quest` drift gets flagged instead of
splitting your journal.

## 5. Zoom out

Select **Quests** in the sidebar with no quest open: the **dependency graph**
shows every quest as a DAG — `GATE`/`CLOSED` badges for prerequisites, click
any node to dive in. It's the producer's view of the game: what gates what,
and where the critical path runs. (Locations get the
[same treatment](/docs/editor-guide/#9-location-map).)

For the full structure — `requiredFlags`/`setsFlags`, outcome kinds, stage
ordering — see the [quest canvas chapter](/docs/editor-guide/#7-quest-canvas).
The demo's `qst_inquest` shows the finished pattern: three stages, three
outcomes, one per ending.

## Where next

- [Validate in CI](/docs/get-started/validate-in-ci/) — including the `QUEST`
  checks that catch never-firing stages.
