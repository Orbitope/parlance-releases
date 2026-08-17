# Parlance Editor — User Guide

A complete reference for the Parlance visual editor. The editor runs locally
against your project's `data/` directory; every change is written to disk as
human-readable JSON so your narrative data stays in git.

---

## Table of Contents

1. [Starting the editor](#1-starting-the-editor)
2. [Layout overview](#2-layout-overview)
3. [Entity types](#3-entity-types)
4. [Entity list & search](#4-entity-list--search)
5. [Entity detail — view & edit](#5-entity-detail--view--edit)
6. [Dialogue canvas](#6-dialogue-canvas)
7. [Quest canvas](#7-quest-canvas)
8. [Quest dependency graph](#8-quest-dependency-graph)
9. [Location map](#9-location-map)
10. [Validation panel](#10-validation-panel)
11. [Reports — coverage & reference index](#11-reports--coverage--reference-index)
12. [Playtest mode](#12-playtest-mode)
13. [Undo / redo and navigation history](#13-undo--redo-and-navigation-history)
14. [Data format & git workflow](#14-data-format--git-workflow)
15. [Localization & VO](#15-localization--vo)
16. [Review — reading someone else's branch](#16-review--reading-someone-elses-branch)

---

## 1. Starting the editor

From the `editor/` directory, run the dev server:

```bash
npm run dev
```

This starts two processes concurrently:

| Process | URL | Role |
|---------|-----|------|
| `host` (Fastify) | `http://localhost:8000` | Reads/writes your `data/` files, serves the API |
| `client` (Vite) | `http://localhost:5173` | Hot-reloading UI (proxies `/api` to the host) |

The host needs to know where your project lives. Pass it as an argument if it
doesn't auto-detect from the working directory:

```bash
PARLANCE_ROOT=/path/to/project npm run dev
```

In production (Electron app), the bundled host serves the built client from
the same process on port 8000.

---

## 2. Layout overview

```
┌────────────┬──────────────┬──────────────────────────────────────┐
│ Header: title, breadcrumb (Type › entity), ⌘K hint, Undo/Redo, AI │
├────────────┼──────────────┼──────────────────────────────────────┤
│ Type       │ Entity list  │ Main panel                           │
│ sidebar    │ pane         │ (fills remaining width)               │
│ (icon +    │ Search,      │                                      │
│ label +    │ group, +New, │ Entity detail form                   │
│ count per  │ entities     │   — or —                             │
│ type;      │              │ Dialogue canvas                      │
│ Reports    │              │   — or —                             │
│ pinned to  │              │ Quest canvas / dependency graph      │
│ the        │              │   — or —                             │
│ footer)    │              │ Location map / Reports panel         │
├────────────┴──────────────┴──────────────────────────────────────┤
│ Validation bar (collapsed to a status row by default; click to expand) │
└────────────────────────────────────────────────────────────────────────┘
```

The left side is a fixed **type sidebar** — one row per entity type, each
with an icon, label, and a live entity count, always in the same place (it
never reflows). **Reports** is pinned to the sidebar's footer, showing the
total error/warning count once the project has any. Click a row to load that
type's list in the pane beside it (search, group, create, and the entities
themselves). The **«** button collapses the whole panel — sidebar and list —
to a thin 32px rail to maximise canvas width; **»** expands it again. The
collapsed/expanded choice is remembered across sessions.

Selecting an entity from the list loads the main panel. For dialogues and
quests the main panel is a visual canvas rather than a form; for locations,
selecting no entity shows the location map (§9).

**Command palette (`Cmd/Ctrl+K`).** Opens a searchable palette from anywhere
in the app — even while a text field is focused. Type to fuzzy-match against
every entity across every type (by name, id, or title) and jump straight to
it, or run a curated action (`Create new <Type>`, `Open Reports`). This is
the fastest way to get anywhere once a project has more than a handful of
entities; ↑/↓ to move, Enter to open, Esc to close.

**Breadcrumb.** The header shows `<Type> › <entityId>` for whatever you're
currently viewing. Click the type segment to jump back to that type's list.

**Text Size.** The dropdown next to Undo/Redo (90%–150%) scales font size
across the whole editor — chrome, canvas, the Play panel transcript,
everything. It does **not** scale layout: buttons, icons, and panel widths
stay put, so at higher sizes a few fixed-width labels (the type sidebar's, in
particular) may elide with `…` rather than grow to fit. That's a deliberate
trade-off — the alternative is scaling the whole UI, which cannot be made to
render within the actual window at every size (ask if you want the history).

**Resizable side panels.** The node inspector and the Play panel (§6, §12)
both have a drag handle on their left edge — drag to resize, double-click to
reset to the default width, or focus it and use `←`/`→` (`Shift` for a bigger
step) and `Home` to reset. Width is remembered per panel across reloads. The
canvas always keeps a minimum width, so a dragged-wide panel yields if you
narrow the window.

**Persisted UI preferences.** Several view choices are saved to the browser's
`localStorage` so they stick across reloads: entity-panel collapsed state,
detail default (edit form vs. raw JSON), dialogue node density, per-canvas
minimap visibility (dialogue / quest / quest-dependency / location map), the
validation-bar collapsed state, Text Size, and both resizable panel widths.
(See the setup guide for the exact keys.)

---

## 3. Entity types

| Type | What it represents | Key fields |
|------|-------------------|------------|
| **Skills** | Stat names used in checks (`wit`, `empathy`, …) | `id`, `name`, `description`; optional `cluster` |
| **Variables** | Global state values — flags (bool), counters (int), text (string) | `id`, `kind`, `default` |
| **Factions** | Groups whose reputation the player can influence | `id`, `reputationRange.min/max` |
| **Characters** | NPCs and the player | `id`, optional `archetype`, optional `stats` (skill → int) |
| **Dialogues** | Conversation graphs | nodes, choices, checks, onEnter effects |
| **Quests** | Staged tasks with trigger/completion conditions | stages, outcomes, dependencies |
| **Locations** | Named places referenced from quests / lore | `id`, `name`, optional `zone` |
| **Endings** | Named story endings | `id`, `name`, `summary`, `unlockedBy`, optional `kind` (success / failure / neutral) |
| **Codex** | Player-facing knowledge entries (codex / bestiary / glossary) | `id`, `name`, `body`, optional `category`, `unlockedBy?` (absent = always unlocked) |
| **Items** | Things the player can carry. Possession is runtime state; this registry gives an item a player-facing identity | `id`, `name`; optional `description`, `tags` |
| **Portraits** | Character portrait registry (referenced from dialogue nodes) | `id`, `character`, `tags` |
| **Cutscenes** | Manifest: opaque engine asset key + effects applied on completion (effect-triggered via `play_cutscene`) | `id`, `asset`, `skippable`, `effectsOnComplete`, `entersDialogue?` |

All types share a stable string `id` used as the cross-reference key everywhere.
The sidebar row for each type shows a live count of how many entities it holds.

---

## 4. Entity list & search

- **Click** any type in the sidebar to load its list (or jump straight to an
  entity with `Cmd/Ctrl+K`).
- **Search** by id, name, or tag using the search box.
- **Group by** (characters only): group by faction, archetype, or whether a
  character has a dialogue assigned.
- **+ New**: opens an inline creation sheet. Type the new entity's `id`,
  optionally fill a name, and press Enter or click Create. The file is written
  to disk immediately.
- **Status badges** on character entries show `has dialogue` or `no dialogue`
  (a COVERAGE issue the validator tracks).

---

## 5. Entity detail — view & edit

Selecting any non-dialogue, non-quest entity opens the detail panel. The
toolbar's **JSON** / **Edit** toggle switches views; your choice persists
across reloads.

If the entity has a `loreRef` field pointing to a Markdown file, a **Lore**
button appears in the toolbar. Click it to open an inline Markdown viewer of
the referenced canon doc — useful for keeping the entity's narrative context
visible while editing.

### Edit mode (default)

Fields are grouped into labelled sections in a fixed order — **Identity**,
**Description**, **Relationships**, **Logic**, **Structure**, and (if the
type has them) a **Metadata** section that starts collapsed, since `loreRef`
and `tags` are low-priority housekeeping fields you don't need open by
default. Section headers only appear when a form genuinely has more than one
section, so small entities (e.g. a skill) still just show a flat list.

Most fields get a real editor, not a generic fallback:

- **String** fields → text inputs (or a serif prose field with a live
  word/char count for narrative text like `description`)
- **Boolean** fields → checkboxes
- **Number** fields → number inputs; a `min`/`max` pair (e.g.
  `reputationRange`) gets two side-by-side number inputs
- **Enum** fields → dropdowns
- **Reference** fields (e.g. `factionId`, `speakerId`) → a dropdown of
  the actual matching entities
- **Reference-list** fields (e.g. a faction's `opposes`/`alliedWith`) →
  removable chips plus an "add" dropdown
- **Dialogue ladder** (`Character.dialogues`) → a reorderable list of rungs,
  each a dialogue dropdown plus an optional `showIf` condition builder (empty =
  "always (fallthrough)"); ▲/▼ reorder because the ladder is first-match-wins
- **`loreRef`** → a dropdown of the real files under `lore/` (so you can't
  typo a path), an anchor text input, and an inline **Open** button that
  previews the file without leaving the form
- **Conditions / effects** (`availableWhen`, `onEnter`, …) → the structured
  condition/effect builders described in §6
- Location-specific structured fields (`spawns`, `exits`, `interactables`)
  get their own dedicated editors

Click **Save** to write the change to disk. If the file changed on disk since
you loaded it (e.g., another tool edited it), a 409 conflict error is shown
and the save is blocked — click **Reload** to see the latest version.

### JSON mode

Shows the entity's raw JSON with syntax colouring — useful for a quick
read-only glance, or for copying the exact on-disk representation. Below the
JSON, any validation issues scoped to that entity are listed.

Click **Delete** (then **Confirm delete**) to remove the entity permanently.

### Flow (flags, counters, items)

When the selected entity is a variable or an item, a **Flow** panel at the bottom of the
detail pane shows every place that variable is used, split by direction:

- **Set / Adjusted / Given by** — the effects that write it.
- **Checked / Compared by** — the conditions that read it.

Each row names the owning entity and the exact path (e.g.
`nodes/node_cleared/onEnter[0]`) and is clickable — it jumps you straight to
that entity. If a variable is only ever written or only ever read, the panel
says so: a flag nothing checks, or a condition that gates on a flag nothing
sets, is usually a wiring mistake worth catching early.

### Creating a flag inline

You don't have to define a flag before you can reference it. In any condition
or effect picker (a flag / counter / item field), type a name that doesn't
exist yet and choose the **＋ New flag "…"** row that appears. The name is
slugified to a valid id, the variable is created immediately, and the field is
set to it — no trip to the Variables list. Fill in its description later.

---

## 6. Dialogue canvas

### Flow map (all dialogues)

Selecting the **Dialogues** type without opening a specific dialogue shows the
**flow map** — every dialogue as a single node, laid out left-to-right, with
edges for the cross-scene jumps between them:

- **routes** — a `set_active_dialogue` effect re-points a character's ladder at
  another dialogue (grey edge).
- **cutscene chains** — a `play_cutscene` effect queues a cutscene that chains
  into another dialogue via its `entersDialogue` (violet dashed edge).

Each node shows the dialogue's title, id, speaker, and word count; a **START**
badge marks dialogues with no incoming jump (reached by a ladder default, a
quest, or a cutscene from elsewhere). Click a node to open that dialogue's node
graph. "Auto layout" re-runs the dagre arrangement; positions you drag are
saved. It's the project-level companion to the [quest dependency
graph](#8-quest-dependency-graph).

### Node graph (one dialogue)

Opening a dialogue from the entity list loads a **node graph**. Each node
represents a moment in the conversation; directed edges represent the paths
a player can take. The graph flows **left-to-right**: the entry node sits on
the left and the conversation reads forward across the canvas.

### Graph vs. Text

The **Graph · Text** toggle (toolbar, top-left) switches between the visual
canvas and an editable **script view** — the whole scene as text, for authors
who'd rather type than click. Node headers are `== node_id [entry] [end] ==`,
an optional author note is a `> …` line under the header, prose follows, choices
are `- choice_id: "text" -> target`, node/choice effects are `+ set_flag x = true`,
and checks are `check wit >= 12 -> pass / fail`.

The script is a **lossless** representation: saving reproduces the dialogue
exactly, changing only what you edited (a byte-level round-trip is enforced by
tests over every dialogue). A syntax error blocks the save and points at the
line — it never writes partial data. Rich logic (nested conditions, all effect
types) is expressible in the compact grammar, but the graph's builders remain
the friendliest way to author it; use whichever fits the moment.

### Canvas controls

| Action | How |
|--------|-----|
| Pan | Click and drag on empty canvas |
| Zoom | Scroll wheel, or use the Controls cluster (bottom-left) |
| Fit all | Fit-view button in Controls, or "Auto layout" in the toolbar |
| Select node | Click a node |
| Deselect | Click empty canvas |
| Drag node | Drag the node header to reposition (saved automatically) |
| Delete node | Select it → "Delete node" button in the toolbar |
| Delete edge | Select the edge → Delete key |
| Connect a `next` (choiceless advance) | Drag from the node's dedicated **continue** handle (only shown on nodes with no choices) to the target node |

**Node density toggle** (`Compact · Card · Script`) in the toolbar controls how
much of each node's text is shown:

- **Compact** — narrow nodes, single-line preview. Best for seeing the whole
  graph structure at a glance.
- **Card** (default) — up to ~4 lines of prose per node/choice, fading out
  if longer.
- **Script** — full untruncated text plus a speaker badge; the prose block
  scrolls internally if very long. Best for reading a scene like a script.

The chosen density is remembered across sessions. Switching density reflows
*new* / unpositioned nodes; nodes you've manually arranged keep their saved
positions — click **Auto layout** to reflow everything to the current density
and direction.

**Map** toggles the minimap (bottom-right) on/off — handy when it overlaps a
node you're working on. **Auto layout** re-runs the automatic left-to-right
layout for the whole graph.

Node positions are persisted per-dialogue in a `*.layout.json` sidecar file.
These sidecars are **gitignored** — your graph arrangement is a local,
personal concern that is never committed. Deleting one just makes the editor
re-run auto-layout next time.

### Share build

**⇪ Share build** (canvas toolbar) downloads a **self-contained HTML file** of
the current scene — `play-<id>.html`. It's a complete, serverless playable:
double-clicking it runs the scene in any browser, through the same core engine
the editor uses (checks roll, `showIf` gates, effects apply, scenes route). No
install, no host, nothing to set up. Hand it to a writer or playtester to get
feedback on a scene without walking them through running the editor.

### Adding nodes

Click **+ Node** in the toolbar. A new blank node appears to the right of the
graph. Click it to open the inspector, then fill in the text.

### Connecting nodes

Each choice has a **source handle** on its right side — a small dot. Drag
from that handle to the **target handle** (left edge) of the destination node.

- Plain choices have a single grey dot → creates a `goto` connection.
- Active-check choices have two dots: green (success) and red (failure) →
  drag each to its respective destination node.

A node with **no choices** instead shows a single **continue** handle — drag
it to another node to set that node's `next` field: a choiceless advance, for
a listen-only beat (narration, an overheard line) that shouldn't cost a
synthetic "Continue" choice. A node can have `next` or `choices` or be
`isEnd`, never more than one — the inspector's Next field disables itself
with a hint when the node already has choices, and vice versa. `next` edges
draw as a thin unlabelled line, distinct from `goto`/check edges, and — like
choice `goto`s — can point back at the node's own dialogue only; the runtime
never chases a `next` chain automatically, each advance is one discrete,
player-facing step (a **Continue →** button in Play mode, §12).

To remove a connection, select the edge and press Delete.

### Node inspector (right panel)

Click a node to open its inspector.

**Node section:**
- **Text** — the spoken / displayed text. Edited in a prose field (serif
  font, with a live word / character count in the corner). Saved on blur.
  This is **plain text** — write exactly what the player should read; do
  *not* type skill-check or condition markers into it (see the note below).
- **Speaker** — *who speaks this line — character or skill.* Defaults to
  **Inherit — `<dialogue's Default speaker, or "narration">`**: leave it
  alone and the line takes the dialogue's Default speaker (below), or reads
  as unattributed narration if the dialogue has none. Pick a character or a
  **skill** (an internal skill-voice) to override it for just this
  line — the canvas node then shows a small badge naming the override, so a
  multi-speaker scene (two NPCs talking, a skill-voiced aside, a narration
  beat) is legible at a glance without opening every node; nodes that
  inherit stay visually quiet. A node speaker resolving to neither a
  character nor a skill id, or matching both, is a validator error.
- **Notes** — an author-only annotation ("revisit this beat", "placeholder
  VO"). The player never sees it and the runtime ignores it; it's purely for
  you. Notes survive Text mode too, as a `> …` line under the node header.
- **Is End** — marks this as a valid conversation-end node (shown with an
  "end" badge). Conversations that reach an isEnd node with no choices end
  automatically.
- **Next** — *drag the canvas's continue handle to change.* A choiceless
  advance to another node in the same dialogue — see "Connecting nodes"
  above. Mutually exclusive with having choices or being marked Is End; the
  field disables itself with a hint when it doesn't apply.
- **Set as Start** — makes this node the `entry` point of the dialogue.
- **On Enter Effects** — effects that fire whenever the player arrives at
  this node. Add with the + button; each effect has a type selector and
  type-specific fields (see Effects reference below).

**Choice section:**
Select a choice to expand it.

- **Text** — what the player sees.
- **Show If** — an optional condition that gates visibility. If the condition
  is false at runtime, the choice is hidden. Supports `flag`, `skill`,
  `reputation`, `relationship`, `counter`, `item`, `quest`, and boolean
  `all`/`any`/`not` combinators.
- **Effects** — effects applied when this choice is selected.
- **Check** — optional skill check on this choice:
  - `passive` — always shown; displays a skill hint but doesn't roll.
  - `active` — rolls `d20 + skill_value ≥ difficulty`. Routes to `onSuccess`
    or `onFailure` node.
  - A **probability bar** previews P(success) at any given stat value.
- **Goto** — for non-check choices, the destination node id (set by dragging
  an edge on the canvas, or typed directly).
- Reorder choices with the ↑/↓ buttons; delete with ×.

> **Skill checks and conditions are shown automatically.** On the canvas, a
> choice with an active check shows a `skill / difficulty` badge (e.g.
> `wit / 10`), and a choice gated by a `showIf` shows a condition summary
> (e.g. `wit >= 6`), derived from the structured fields. You do **not** need
> to type a `[Wit]`-style prefix into the choice text — the badge is generated
> for you, and the text stays clean prose that serializes verbatim to JSON.

### Effects reference

| Type | What it does |
|------|-------------|
| `set_flag` | Sets a boolean flag to true/false |
| `adjust_reputation` | Adds a delta to a faction's reputation, clamped to its declared range |
| `adjust_counter` | Adds a delta to a named counter (unbounded) |
| `give_item` | Adds an item id to the player's inventory |
| `take_item` | Removes an item id from inventory (no-op if not held) |
| `advance_quest` | Marks a quest stage complete (engine handles progression; no-op in playtest) |
| `set_active_dialogue` | Queues a specific dialogue for a character (push-based scene switch) |
| `play_cutscene` | Queues a cutscene manifest (`pendingCutscene`); the host plays its `asset`, applies `effectsOnComplete`, then enters `entersDialogue` if set |
| `set_text` | Sets a text variable to a literal string, substituted wherever `{variable}` appears in player-facing text. Pick the variable from the dropdown (or create one inline) and type the value. |

### Dialogue metadata (inspector, top section)

- **Title** — display name for the entity list.
- **Default speaker** — *every node inherits this unless overridden.* The
  dialogue's fallback speaker (a character; not a skill — this field doubles
  as ownership for the character's dialogue ladder and discovery, so it stays
  character-only even though a node's own Speaker override can be a skill).
  Leave unset for a dialogue that's entirely narration/multi-speaker with no
  single default — see Speaker in the node inspector above. Don't confuse
  this with **Default for speaker** directly below — different field, similar
  name, unrelated concept.
- **Default for speaker** — this dialogue is the NPC's default when no
  other dialogue matches `availableWhen`.
- **Replayable** — the dialogue can be started again after it has been
  completed once.
- **Lore** button (toolbar, far right) — appears if the dialogue has a
  `loreRef`; opens the linked Markdown doc inline.
- **Delete dialogue** (toolbar, far right) — deletes the whole dialogue
  file with confirmation.

### Pacing (inspector, with no node selected)

Below the metadata, a **Pacing** grid gives the shape of the scene at a glance,
so you can tell a two-beat exchange from a sprawling branch without counting:

- **Size** — words, nodes, choices, and `ends` (nodes marked isEnd).
- **Branch shape** — max and average choices per node, and **dead ends**
  (non-end nodes with no way out — highlighted, since they're usually a mistake
  and the validator flags them too).
- **Depth** — the **longest path** in nodes from the entry to a terminal (a
  single playthrough's length; cycles are handled, not counted twice).
- **Check density** — how many choices carry a skill **check**, and how many
  are **gated** by a showIf condition.

---

## 7. Quest canvas

Selecting a quest from the entity list opens a **stage graph**. Stages flow
left-to-right; edges represent `after` dependencies between them. The quest
canvas shares the same dark controls and **Map** minimap toggle as the
dialogue canvas.

### Quest structure

A quest has:
- **Stages** — ordered steps, each with a `name`, optional `description`, and
  optional `requiredFlags`/`setsFlags` arrays.
- **Outcomes** — terminal results (success / failure / neutral), each with a
  `label` and optional `setsFlags`.

### Quest inspector

Click a stage or outcome node to open the inspector:

- Edit the name and description inline.
- Add / remove `requiredFlags` (conditions that must be true to unlock the
  stage) and `setsFlags` (flags this stage sets on completion).
- Stages show their `order` value (automatically managed).
- The **Add Stage** / **Add Outcome** buttons append new nodes.

### Journal objectives (stage inspector)

A stage's inspector has two prose fields, and the difference between them is the
whole point of the journal:

- **Description (retrospective)** — what the protagonist *did*, in her voice.
  Shown once the stage is complete.
- **Objectives (journal)** — what she *intends* to do. Shown while the stage is
  the current one.

Under **Objectives (journal)** each row carries:

| Control | What it does |
|---|---|
| ▲ / ▼ | reorder — array order is authoring order, and the journal renders in it |
| id field | unique within the stage; used by the validator and by diffs, never shown to the player |
| text area | the intention line, in the protagonist's voice |
| **show if** | optional visibility gate, using the same condition builder as everywhere else |

An objective with no `show if` reads "always visible". Gate on knowledge and
acquaintance — has she met this character, does she know this place — so a route
only appears if she could actually name it.

Objectives are **display-only**: there is deliberately no effects builder and no
goto here. **Complete When** below still decides when the stage is done, no
matter which route the player took.

Every edit — add, retype, reorder, delete — goes through the normal save path,
so <kbd>Cmd/Ctrl+Z</kbd> restores the previous JSON exactly.

Two warnings you may see in the validation panel:
- *"has completeWhen but no objectives"* — the journal will show an empty current stage.
- *"every objective is gated by showIf"* — there are states where the stage lists nothing.

Quest-level **Journal Name** (the player-facing title, falling back to `name`)
and **Tags** are edited on the quest's own entity form, not on the canvas. Tags
drive the journal's grouping — main vs. side is a tag, never a checkbox — and
are linted against a controlled vocabulary; an unrecognised tag is a warning.

---

## 8. Quest dependency graph

Selecting **Quests** in the sidebar without opening a specific quest shows
the **quest dependency graph** — all quests laid out in a DAG showing which
quests are prerequisites for others.

Each node shows:
- Quest id and name
- A badge if the quest has `availableWhen` conditions
- `GATE` / `CLOSED` markers for quests with prerequisites

Click a quest node to jump to that quest's detail canvas.

---

## 9. Location map

Selecting **Locations** in the sidebar without opening a specific location
shows the **location map** — every location laid out as a graph, mirroring
the quest dependency graph.

Edges represent traversal:
- **Exit** (blue) — a directed transition authored in a location's `exits`.
  If the exit carries a `gate` condition it's coloured **orange** and
  labelled with its `gateType` (e.g. `locked_door`).

Each node shows the location's id, name, zone, and exit count. Click a
node (or pick it from the entity list) to open its detail form. The map
shares the same **Auto layout** and **Map** minimap toggle as the other
canvases.

---

## 10. Validation panel

A bar at the bottom of the editor shows the live validation state. Every save
triggers a full re-validation of the project; results are pushed to all open
editor windows via WebSocket.

By default the bar is **collapsed** to a single status row — it still shows
the live error / warning counts and per-code filter chips, so project health
stays glanceable, but the issue list stays out of the way. **Click "Validation
▸"** (or any status chip) to expand it and see all issues; the expanded /
collapsed choice is remembered across sessions. Issues are sorted errors
first, then warnings. Each row shows:

- Severity badge (red = error, yellow = warning)
- Issue code (e.g., `[REF]`, `[COVERAGE]`, `[GATE]`)
- Human-readable message
- Click the row to **navigate** to the offending entity (selects it in the
  entity list and opens its detail)

Common codes:

| Code | Meaning |
|------|---------|
| `SCHEMA` | Field fails JSON Schema validation |
| `REF` | References an id that doesn't exist |
| `DUP` | Duplicate id detected (entity ids, dialogue nodes/choices, or a location's spawns/exits/interactables) |
| `FLOW` | Dialogue has an unreachable node or dead-end choice |
| `GATE` | Active check missing onSuccess / onFailure destination |
| `QUEST` | Quest stage issue — including stage/outcome effects with no `completeWhen`/`reachedWhen` (they can never fire; quest resolution only fires condition-gated items) |
| `FLAG` | Flag written but never read, or read but never written |
| `REP` | Reputation reference to unknown faction |
| `ENDING` | Ending is unreachable |
| `COVERAGE` | Character has no dialogue |
| `REACH` | Dialogue node unreachable from `entry` |
| `LORE` | `loreRef` points to a file that doesn't exist |
| `LOC` | Location graph issue — bad exit spawn, a spawn nothing arrives at, more than one default spawn, gate/gateType mismatch, unreachable location, npc interactable missing its character |
| `CUT` | Cutscene issue — unknown `entersDialogue`, never-triggered cutscene, or ambiguous ordering (two `play_cutscene` effects on one node) |
| `LADDER` | Character dialogue-ladder shape issue — a **dead rung** (an unconditional rung before the end shadows the rungs below it), a **stuck rung** (an unconditional, top-priority, effectful rung re-fires forever on every re-entry), or **no fallthrough** (the last rung is gated, so the character may resolve to no dialogue). A dangling `dialogues[].dialogue` is a `REF` error. All warning-level; none blocks a save. |
| `PROG` | Progression config (`progression.json`) issue — malformed thresholds (not strictly increasing), `pointsPerLevel`/`maxSkill` < 1 (error), a starting skill already at the ceiling, or the **soft-cap sanity** warning (authored XP grants enough points to max every skill). |
| `XP` | `grant_xp` issue — non-positive `amount` (warning), or `grant_xp` authored outside a quest outcome (advisory; the convention is XP from quests only). |
| `CHECK` | Priced/oneshot check discipline — a `priced` (default) active check whose failure doesn't proceed (no `onFailure` branch), or a priced-gate failure that sets a flag some character ladder reads (advisory). `oneshot` checks are exempt from the proceed requirement. |

The **Reports** row (sidebar footer) also shows the total issue count,
coloured red for errors or yellow for warnings.

---

## 11. Reports — coverage & reference index

Click **Reports** (pinned to the sidebar footer) to open the Reports panel.

The panel has two columns:

### Left — Coverage & structural issues

Issues are grouped by code category. Each row is clickable and navigates to
the affected entity (same as the validation panel). Use this view to:

- Find characters who have no dialogue assigned (`COVERAGE`)
- Find flags that are set but never tested, or tested but never set (`FLAG`)
- Find dialogue nodes unreachable from `entry` (`REACH`)
- Find endings with no path that leads to them (`ENDING`)

### Right — Reference index

A searchable index of every id in the project. Type a flag id, character id,
skill id, etc. to see:

- Where it is **defined** (entity type, entity id, JSON path)
- Every place it is **read** (conditions, showIf, availableWhen)
- Every place it is **written** (effects, setsFlags)

Each entry is clickable and navigates to the exact entity. This is the
"find usages" feature — useful for safely renaming or removing a variable.

---

## 12. Playtest mode

Playtest mode lets you walk through a dialogue interactively with a live
simulated `GameState`, right inside the canvas view.

### Opening playtest

1. Open any dialogue in the canvas.
2. Click the **▶ Play** button in the canvas toolbar (top-left).

The node inspector closes and a **Play panel** appears on the right side.
The active node is highlighted with a green glow on the canvas; visited nodes
are dimmed.

### Starting state editor

Before starting, the panel shows the **Starting State** editor:

- **Skills** — all skill ids referenced in this dialogue's checks or
  `showIf` conditions appear as number inputs. Set them to match your test
  scenario (e.g., `wit = 8`).
- **Flags** — all flag ids referenced in this dialogue appear as checkboxes.
  Defaults come from the project's variable declarations.
- **Text variables** — every text variable this dialogue writes with `set_text`
  or mentions as a `{placeholder}` gets a text box, pre-filled from its declared
  default. Type a value to exercise a placeholder without authoring an effect
  first. **Leave a box blank to mean "unset"** — the transcript then renders the
  raw `{placeholder}`, exactly as an unset variable would in-game.
- **Seed** — a numeric seed for the random number generator. The same seed
  always produces the same dice rolls, so a session is reproducible. Click
  **🎲** to randomize.
- **Start at** — which node the session begins on. Defaults to the entry node;
  pick any node to **fast-forward** straight into the middle of a scene (the
  chosen node's onEnter effects apply on arrival, as if you had walked in).
  Handy when the moment you're iterating on is ten choices deep.

Click **▶ Start Session** to begin. You can also click **▶ Play** again
(it acts as a toggle) to close the panel and return to the editor.

### Editing while playing (auto-reload)

A running session stays live when you edit the dialogue it's playing. Change
node text, add or delete a node, rewire an edge — the session keeps your
accumulated game state (flags, XP, quests, reputation) and re-reads the scene,
recomputing which choices are visible at the current node. If the node you were
standing on is deleted, the session snaps back to the entry node with state
intact rather than dead-ending. This makes the tight loop — tweak a line, see
it in context, tweak again — instant, without restarting from the top each time.

### Transcript

Once a session is running, the transcript shows each step top to bottom:

- **Node text** — the resolved speaker (character or skill; blank for
  narration) and the dialogue text, with any `{placeholder}` substituted from
  the state **at that step** — so rewinding shows the value the player would
  have seen at the time. Authored JSON always keeps the placeholder;
  substitution is render-only and never written back.
- **Visible choices** — only choices whose `showIf` condition is satisfied by
  the current state. Click a choice button to advance.
- **Continue →** — shown instead of choices on a node whose `next` field
  points to another node (a choiceless advance, §6). Click it to take the one
  discrete step; a chain of these plays out as a sequence of individual
  clicks, never automatically — every beat stays reachable, rewindable, and
  savable like any other step.
- **Check result** — for active-check choices, the result shows
  `d20=N + skill=N = total vs PASS/FAIL` in green or red.
- **Applied effects** — effects that fired on this transition (choice effects
  + onEnter effects of the arrived node), shown in purple if they changed
  state, grey if they were no-ops.
- **— Conversation ended —** — shown when the session reaches an `isEnd`
  node with no choices, or a terminal choice with no destination.

Past steps are shown above the current step. Each past step has a
**↩ rewind here** link that truncates the timeline back to that point.

### Continuing into the next scene

Once a conversation ends, if there's somewhere for the player to go next, a
section appears below the transcript:

- **Continue with…** — an explicit `set_active_dialogue` effect queued a
  specific dialogue for a character; click it to keep playing straight into
  that scene, carrying the accumulated game state forward.
- **Discover…** — no explicit route was queued, so this lists the discovery
  pool instead — dialogues whose `availableWhen` now matches the current
  state, the same set the game itself would offer.
- A queued cutscene with an `entersDialogue` shows as **▶ cutscene: `<name>`**
  — click to apply its `effectsOnComplete` and continue into that dialogue.
  One with no `entersDialogue` just plays in-engine; the panel notes it as
  queued with nothing further to click into here.

This is how you playtest across a scene boundary without manually reopening
the next dialogue and re-entering its starting state by hand.

### Check affordances

For active-check choices, two extra buttons appear alongside the normal choice
button:

- **force ✓** — take the `onSuccess` branch regardless of what the dice
  would roll. Marked as "forced" in the transcript.
- **force ✗** — take the `onFailure` branch regardless of the roll.

These let you test both branches of a check without needing to set skills to
extreme values.

### Toolbar controls (while session is running)

| Button | Action |
|--------|--------|
| `seed:XXXXXXXX` | Displays the current session seed (read-only) |
| **↺ Restart** | Resets to step 0, same seed and starting state |
| **⟳ Reroll** | Appears after a check step. Rewinds one step and re-runs the same choice with seed+1. Use this to flip a pass to a fail (or vice versa) without manually changing skills. |
| **✕ Stop** | Closes the play panel and returns to edit mode |

### State inspector

At the bottom of the play panel, a live **State** table shows the current
values of all flags, reputation, and skills referenced in the dialogue.
Values that changed on the most recent transition are highlighted in purple.

### Determinism guarantee

The session uses a **seeded RNG** (`mulberry32(seed + stepIndex)`). A session
is fully reproducible: given the same seed and starting state, every choice
leads to the same rolls and the same outcomes. Rewind + replay gives identical
results. The seed only changes when you click **⟳ Reroll** (seed+1) or
**🎲 Randomize** before a new session.

### What playtest does NOT change

Playtest is **read-only**. It never writes to any dialogue file or layout
file. You can verify this — the dialogue JSON and `.layout.json` are
byte-identical before and after any play session.

`advance_quest` effects fire in the transcript (they appear in the applied
list) but are a **no-op** in playtest — quest stage tracking is the
responsibility of the host game engine.

---

## 13. Undo / redo and navigation history

There are **two independent histories**, and they do different things:

**Undo / redo (edit history).** The **↩ Undo** and **↪ Redo** buttons in the
top toolbar undo/redo *saves* (`Cmd/Ctrl+Z`, `Shift+Cmd/Ctrl+Z`, or `Ctrl+Y`).
Up to 100 operations are kept per session. Each save records a
`{ before, after }` snapshot of the entity; Undo replays `before`, Redo
replays `after`. This history is in-memory only — it clears on page reload.
Canvas layout changes (node drag) are **not** in the undo stack — they write
directly to the layout sidecar and are not undoable.

**Back / forward (navigation history).** The **‹** and **›** buttons (next to
Undo/Redo) move through your *selection* history — which type and entity you
were viewing — like a browser's back/forward. Shortcuts: `Alt+←` / `Alt+→`, or
`Cmd/Ctrl+[` / `Cmd/Ctrl+]` (the Xcode/VS Code "Go Back" convention). This is
purely navigational: it changes what's shown, never your data.

For a third way to get around — jumping directly to a distant entity rather
than stepping through history — use the **command palette** (`Cmd/Ctrl+K`,
§2).

---

## 14. Data format & git workflow

### File layout

```
data/
  skills/          one JSON file per entity
  variables/
  factions/
  characters/
  dialogues/       dlg_arrival.json
                   dlg_arrival.layout.json            ← canvas positions (gitignored)
  quests/
  locations/
  endings/
  codex/
  items.json       flat registries (items, portraits)
  portraits.json
  cutscenes/       one JSON file per cutscene
tests/
  routes/          rt_*.json — scripted playthroughs with assertions
  snapshots/       snap_*.json — saved states to resume from
schema/            JSON Schemas; editor loads these for validation + forms
lore/              Markdown canon docs (read-only in the editor)
review/            review requests + comment threads (§16)
```

`data/` holds narrative content only. Routes and snapshots are regression
fixtures — a shipping game never loads them — so they live beside it rather
than inside it.

### Why this layout matters

- Every entity is its own file → git diffs are per-entity, not per-dump.
- The `*.layout.json` sidecars are editor metadata and are **gitignored**
  (`.gitignore` has `*.layout.json`). Your graph arrangement is therefore a
  local, personal concern — never committed, never shared, and safe to delete
  (the editor regenerates positions with auto-layout). This keeps `data/` as
  pure canonical content.
- No binary files, no proprietary formats. Any text editor can read or modify
  the data.

### Stale-load detection

If two editors (or a script) write to the same file concurrently, the host
detects the conflict via a hash check and returns a **409**. The editor
surfaces this as "File changed on disk — reload to see latest version". Reload
to pull the latest before saving again.

### Validation on every save

Every `PUT` re-runs the full validator and broadcasts updated issues to all
open editor windows via WebSocket. You always see live validation without
manually refreshing.

---

## 15. Localization & VO

The **Localization** entry in the sidebar footer (globe icon) opens the
translation and voice-over pipeline. It's a read-and-export surface: content
stays authored in the base language on the entities themselves, and localized
strings live in catalog files alongside your data.

### What it shows

- **Header** — the total count of player-facing strings and how many are
  **voiceable** (spoken dialogue lines and choices).
- **Locales** — one coverage bar per `data/locales/<lang>.json`, showing how
  many keys are translated (`done / total`), with any **stale** keys (entries
  whose content was renamed or removed) called out.
- **Voice-over** — the same, per `data/vo/<lang>.json`, measured only over
  voiceable strings.
- **Strings** — every extracted string with its stable key and source text;
  filter by kind, and click a row to jump to the owning entity. Voiceable
  lines carry a 🔊 marker.

### The pipeline

1. **Download source catalog** — a flat `key → source text` JSON of everything
   translatable, for translator reference.
2. Enter a language code and **Locale template** — a `key → ""` file (with any
   existing translations for that locale already filled in) to hand off.
3. Translators fill in the blanks and return the file; drop it at
   `data/locales/<lang>.json`. Reload — the coverage bar fills in.
4. **VO template** works the same way for `data/vo/<lang>.json`, mapping
   voiceable keys to opaque audio asset keys (the engine resolves them, exactly like
   cutscene manifest assets — Parlance never touches the audio).

### Keys

A string's key mirrors the reference-index path, e.g.
`dialogue/dlg_arrival/nodes/node_open/text` or
`quest/qst_inquest/summary`. Keys are stable as long as the underlying ids are;
renaming an entity, node, or choice id orphans its translation, which shows up
as a **stale** key on the coverage bar so you know to remap it.

---

## 16. Review — reading someone else's branch

The **Review** entry in the sidebar footer is where narrative work gets read,
questioned, and signed off. It needs nothing but git: comments live in the
repository, on the branch they are about, so a two-person team on plain clones
gets working review with no server anywhere.

### Author or reviewer is decided for you

There is no mode to switch. For whichever branch you pick as **Head**, you are
its **author** if it is the branch you currently have checked out, and a
**reviewer** if it isn't. The badge under the branch pickers says which, and
what follows from it:

| | AUTHORING (checked out) | REVIEWING (not checked out) |
|---|---|---|
| You are looking at | your working files | a read-only snapshot of the branch |
| Comments | written straight into `review/` | queued locally until you **Sync** |
| Story files | yours to edit | read-only |
| Suggestions | **Apply** in one click | propose only |
| Verdict | — (you don't sign off your own work) | Approve / Request changes |

Reviewers never check the branch out, so their own working copy stays clean and
on whatever they were doing. **Check out to edit** switches you to the branch
when you want to become its author; it refuses if you have uncommitted changes
rather than stashing them behind your back.

### Reading the changes

Pick a **Base** and **Head** and press **Show changes** for a narrative diff —
not a file diff. It reports what happened to the *story*: "2 nodes added, 1 line
edited, ladder reordered", each entity's before/after lines, flags introduced or
retired, and the validation delta. As the author you can press **Open** on any
dialogue to see the same changes marked on the canvas.

### Playing the branch

**Play the branch** runs the branch's own content — the snapshot read from git,
not your files. This is the point of reviewer mode: you hear the scene as it
actually plays before saying anything about it. Everything from Playtest mode
(§12) works here, including the seed, rewind, and forced check outcomes.

Expand **Log** under the transcript and each line grows a 💬. Clicking it opens
a comment already anchored to the node or choice you just heard, so the thread
lands on a spot in the story rather than on a line number.

### Comments, suggestions, verdicts

Comments hang on an **anchor** — a node, a choice, a field — or on the review
itself for notes that belong to no single line. Anchors use the same keys as
localization, so renaming a node doesn't silently orphan the discussion: the
thread is flagged **stale anchor** and listed under *Unanchored*, and Reports
carries the same warning.

On a text anchor you can attach a **suggested replacement**. That is the
reviewer's edit: they propose the words, and the author applies them with one
button. Reviewers cannot change story files directly — the branch isn't on their
disk, and keeping content edits to one writer is what keeps review data
conflict-free.

**Approve** or **Request changes** records a verdict against *the commit you
read*. If the author pushes more work afterwards, the review says so — "the
branch has moved since this verdict" — rather than showing a stale tick over
unread lines. Nothing enforces a verdict; with no server there is nothing that
could. It is a note between colleagues, and a record of who read what.

### Syncing, and merging

As a reviewer your comments sit in a local queue (inside `.git/`, so they can
never be committed by accident) and the review shows how many are **unsynced**.
**Sync comments** fetches, merges your notes into whatever is already on the
branch, commits, and pushes — your working tree is never touched. Concurrent
reviewers don't conflict: comment threads are separate files, and same-thread
replies merge by union.

Once a review is approved and you are on its **base** branch with a clean tree,
**Merge** brings the branch in and pushes. It merges cleanly or not at all — on
any conflict it aborts completely and asks you to resolve it in git, rather than
leaving a half-finished merge inside a narrative editor. A merged branch carries
its review files into the base branch; that is the archive, which is why reviews
are never deleted.

### What this deliberately isn't

Parlance is not a git client. It has no branch creation, no conflict resolution,
no history editing, and no GitHub pull-request sync. Branches, conflicts, and
history stay in the tools built for them.
