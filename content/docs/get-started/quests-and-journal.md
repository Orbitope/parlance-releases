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
**stage graph** — stages flow left-to-right in their order, and outcomes sit
beside them. The **Quest** section at the top of the inspector holds the quest
itself, and every change there saves as you make it: set
**Name** to *Past the Gate* and tick **Starts available** (without it, or an
**Available When**, nothing ever opens the quest, and the `QUEST` validator
says so).

A new quest already has one stage, `stage_1`. Add a second with **+ Stage**
(it becomes `stage_2`, next in order) and one outcome with **+ Outcome**
(`outcome_1`). Select the outcome and set its **Kind** to **success**.

Stage and outcome ids are generated and there's no name field: the text the
player reads is the journal writing below. This page keeps the placeholder ids
so the steps stay easy to follow, but in your own project give them names that
mean something: select the stage, click **Rename id…** in its inspector
heading, type the new id, and **Preview** lists every file that mentions it —
quest conditions, **advance quest** effects, test routes, translations. Click
**Rename** and every one of them follows. Only this quest's stage is renamed;
a `stage_1` in another quest keeps its id and its references.

New stages run in the order you added them — each follows the one before it.
To change that, select a stage and use **▲ Earlier** / **▼ Later** beside its
position (*2 of 2*). Take care here: a quest condition compares stages by
**order**, not by id — `>= stage_1` means "at or past `stage_1`" — so a move
can change what a gate means without touching a single reference. When it
would, the inspector says how many conditions change meaning and where they
are, and nothing is written until you click **Move anyway**.

## 2. Write the journal — intent vs. retrospect

Click `stage_1` to open its inspector. Two prose fields, and the difference is
the whole point of the journal:

- **Objectives (journal)** — what the protagonist *intends*, in their own voice,
  shown while the stage is current. Click **+ Add objective** and write:
  *"Talk my way past the gatekeeper — or find papers that will."*
- **Description (retrospective)** — what they *did*, shown once it's complete:
  *"The gatekeeper waved me through. I didn't ask what changed his mind."*

Objectives are rows: reorderable with ▲ ▼ (the journal renders in your order),
each with an id (`objective_1` — for diffs and the validator; the player never
sees it) and an optional **show if** gate. Gate on knowledge — have they met this
person, do they know this place — so a route only appears if they could
actually name it. An objective with no gate reads "always visible".

Objectives are display-only — deliberately no effects, no goto. **Complete
When** below decides when the stage is done, whatever route the player took.
Two warnings worth knowing on sight: *"has completeWhen but no objectives"*
(an empty journal for the current stage) and *"every objective is gated"*
(states where the stage lists nothing).

Give `stage_2` its own objective and retrospective the same way — say,
*"See what's past the gate."* and *"Past the gate, a bell was counting the
hour."*

## 3. Wire completion to your scene

Each stage completes on a fact your dialogue establishes:

- `stage_1` → **Complete When** flag `talked_past_gate` — the flag
  [your dialogue sets](/docs/get-started/branching-dialogue/#6-effects-if-youre-ready)
  when the player talks their way past.
- `stage_2` → a new fact to wire. In `dlg_gate_first`, give the bell node
  (`node_4`) an **On Enter** effect: set flag `heard_the_bell` (use
  **＋ New flag** to create it), value `true`. Back on the quest, set
  `stage_2`'s **Complete When** to flag `heard_the_bell`.
- `outcome_1` → **Reached When** flag `heard_the_bell` too: the player is
  through the gate.

Two runtime facts save real confusion later (they're spelled out in
[the engine contract](/docs/concepts/engine-contract/)):

- Stage/outcome **effects** (**On Complete Effects**, **Effects**) fire through
  **quest resolution** — condition-gated, once per playthrough, run to a
  fixpoint after every state change. Your engine runs it through the runtime,
  and [playtest](/docs/concepts/playtest-determinism/) runs it too, so a
  firing shows in the transcript labelled with its quest and stage. An
  effectful stage with no **Complete When** **never fires**, and the `QUEST`
  validator warns about it.
- An **advance quest** effect only *records* a stage as the quest's current
  one. It doesn't fire that stage's effects — those wait for the stage's own
  **Complete When**.

## 4. Name it for the journal, tag it for the grouping

Click empty canvas so no stage or outcome is selected: the inspector shows
the quest itself. Two fields there are for the player's journal:

- **Journal Name** — the player-facing title. Type *Through the Gate*. Leave
  it empty and the journal shows **Name** instead.
- **Tags** — drive the journal's grouping. Type `main` and press Enter (×
  removes a tag). Main vs. side is a tag, never a checkbox.

Journal Name saves when you leave the field, a tag as soon as you add it. If
the project declares a controlled vocabulary (`rules.quest.tagVocabulary`),
tags are linted against it, so `sidequest` vs `side-quest` drift gets flagged
instead of splitting your journal.

## 5. Zoom out

Select **Quests** in the sidebar with no quest open: the **dependency graph**
shows every quest as a DAG — a **start** badge on quests that start available,
**gated** on those with an **Available When**, **closes** on those with a
**Closed When** — and a click on any node dives in. It's the producer's view
of the game: what gates what, and where the critical path runs. (Locations get
the [same treatment](/docs/editor-guide/#9-location-map).)

For the full structure — outcome kinds, stage ordering, objectives — see the
[quest canvas chapter](/docs/editor-guide/#7-quest-canvas). The demo's
`qst_inquest` shows the finished pattern: three stages, three outcomes, one per
ending.

## Where next

- [Validate in CI](/docs/get-started/validate-in-ci/) — including the `QUEST`
  checks that catch never-firing stages.
