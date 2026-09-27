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
17. [Getting help & sending feedback](#17-getting-help--sending-feedback)
18. [Bringing in a story from another tool](#18-bringing-in-a-story-from-another-tool)

---

## 1. Starting the editor

Launch Parlance and point it at a **project folder**. A project is just a
directory of narrative files — most often the `data/` directory inside your
game's own repository, so the story is versioned alongside the game that reads
it. Nothing is imported and nothing is copied into a library: the editor reads
and writes those files in place.

A folder counts as a project if it contains a `parlance.config.json`, a `data/`
directory, or a `schema/` directory. **New Project…** offers a starting point:
**Blank** lays down the standard empty layout, and **First conversation** seeds a
tiny working sketch — one character and a branching dialogue that remembers
whether you accepted their help — so your first project isn't an empty directory.
The command line mirrors this with `parlance init <dir> [--template first-conversation]`
(the default is `blank`). Opening an empty folder still scaffolds the layout on
first save, exactly as before.

### Start with the demo

**The Mistfall Inn** ships with the editor: a complete, tiny murder mystery —
one night, one body, three suspects, three endings — with no art and no engine
required. It exists so your first session is spent on something real instead of
an empty directory.

In the desktop app, choose **File ▸ Open the Demo**, or **Open the demo** on the
welcome screen. The first time, Parlance copies the demo to
`Documents/Parlance/The Mistfall Inn` and opens that copy — the copy is yours to
edit, break and play with, and the app's bundled original is never touched.
Every later **Open the Demo** reopens the same copy, edits and all; it is never
overwritten. To start over, delete or rename that folder and choose it again.
(On Linux, "Documents" is your XDG Documents directory, or your home folder if
none is set.) The copy is an ordinary folder, not a git repository — the same as
a **New Project…**.

Start with **The Common Room** under Locations, or go straight to
`dlg_examine_body` and press **▶ Play**. Each of its parts is demonstrating
something specific; the `README.md` in the demo's folder
(`examples/mistfall-inn/README.md` in a source checkout) maps features to the
scenes that show them off.

### Where your files live

```
<your game repo>/
  data/    the narrative — what your game reads at runtime
  tests/   route fixtures; a shipping game never loads these
  lore/    Markdown canon docs, edited on the Lore surface; never shipped
  review/  review threads; invisible to the runtime and the validator
```

Full detail, including how to relocate any of those directories, is in §14 and
in the setup guide's per-project configuration section.

### Running from source

Contributors and self-hosters can run the editor as a local host plus web client
instead of the packaged app. That path — prerequisites, the two dev-server
processes and their ports, pointing the host at a project, production builds,
and packaging — is documented in
[`SETUP_AND_MANAGEMENT.md`](SETUP_AND_MANAGEMENT.md) §§2–3, which is where the
build-level detail lives so this guide can stay about *using* the editor.

Everything in this guide applies identically either way: the same editor, the
same validator, the same files on disk.

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
│ Custom     │              │   — or —                             │
│ types;     │              │ Quest canvas / dependency graph      │
│ Reports,   │              │   — or —                             │
│ Lore … in  │              │ Location map / custom-type grid /    │
│ the footer)│              │ Reports / Lore / other surfaces      │
├────────────┴──────────────┴──────────────────────────────────────┤
│ Validation bar (appears only when there are issues; click to expand)   │
└────────────────────────────────────────────────────────────────────────┘
```

The left side is a fixed **type sidebar** — one row per entity type, each
with an icon, label, and a live entity count, always in the same place (it
never reflows). Below the built-in types, a **Custom** heading lists the
project's own types from `data/types.json`, each opening as a grid; its **+**
declares a new one (§3, *Custom types — the grid*). Click a row to load that
type's list in the pane beside it (search, group, create, and the entities
themselves).

The sidebar's footer holds the surfaces that are not entity types:
**Reports** (§11), showing the total error/warning count once the project has
any; **Localization** (§15); **Lore**, the project's Markdown canon under
`lore/`, which you read and edit there (§5, *Lore — linked Markdown
documents*); **Drafts**, your own draft branches (§16); and **Review** (§16), with
a badge counting reviews waiting for you. The **«** button collapses the whole panel — sidebar and list —
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

### Custom types — the grid

A project can declare its own types in `data/types.json` — weapons, loot
tables, recipes, anything a designer would otherwise keep in a spreadsheet beside
the repo. Each field has a type (`string`, `number`, `boolean`, `enum`,
`reference`, `array`), and both validators check every row against it, including
that a `reference` names an entity that exists. The demo declares two: open
`examples/mistfall-inn` and look under **Custom** in the sidebar. **Drink** keeps its
rows in one file, `data/drinks.json`. **Supplier** keeps one file per row in
`data/suppliers/`, and its `stocks` field is a list of references to drinks.

```json
{
  "drink": {
    "name": "Drink",
    "plural": "drinks",
    "fields": {
      "price": { "type": "number", "required": true },
      "strength": { "type": "enum", "options": ["small", "house", "strong"], "default": "house" },
      "servedBy": { "type": "reference", "target": "character" }
    }
  }
}
```

Rows live in `data/<plural>.json` (`{ "drinks": [ … ] }`) or one file per row in
`data/<plural>/`. The single file is the safer choice for a table edited in bulk:
a grid save rewrites it in one step, all rows or none. With one file per row, each
row is written whole, but if the editor is killed mid-save some rows can land and
others not. Reopen the grid to see exactly what was saved, and save again.

**Declaring a type.** Click **+** beside **Custom** in the sidebar. Give it a name.
The id (what references use) and the file it's stored in follow from the name until
you edit them. The new type opens as an empty grid with its **Fields** panel open.

**Fields.** The **Fields** button on any grid opens the type's declaration:

- add a field, pick its type, and mark it required;
- enums take comma-separated options; a reference, or a list of references, needs a
  target type (a built-in type or another custom type);
- a default applies to new rows.

**Renaming a field renames it in every row**, so its values go with it. **Removing
a field deletes its values from every row**, and the panel says so before you save.
Save the declaration and the rows together. The editor refuses a declaration that
would misbehave: an id that shadows a built-in type, a file name another type or a
built-in folder already uses, or a reference to a type that doesn't exist. **Delete
type** is available once a type has no rows and no other type references it. The
panel is locked while the grid has unsaved cell edits. Editing `types.json` by hand
still works, and the editor picks it up as soon as the file is saved.

A custom type opens as a **grid**: one row per entity, one column per field,
`id` first.

- **Edit** a cell by double-clicking it, pressing Enter, or just typing. Enter
  moves down, Tab moves right, Esc cancels. Enum and true/false fields open a
  picker. Array fields take comma-separated values. Put an item that contains a
  comma in double quotes (`"salt, coarse", water`); the grid quotes such items
  itself when it shows them. Clearing a cell removes the
  field, so a required one shows up as a validation error rather than an empty
  value. A value that doesn't fit the field (letters in a number) stays in the
  cell, outlined, until you fix it.
- **Select** with a click and extend with Shift+click or Shift+arrows.
  **Copy** and **paste** work as they do in a spreadsheet: paste a block copied
  from Excel, Sheets or Numbers at the selected cell. Cells that don't fit their
  field are skipped and listed.
- **Reference cells** suggest the ids of their target type as you type, matching
  the id or the name. Arrow keys and Enter pick one. In a list of references
  the suggestions complete the last item and skip ids already listed.
- **Sort** by clicking a column heading (again to reverse, a third time to
  clear). **Filter** with the search box: a bare word matches any cell, and
  `column:value` matches one column (`strength:strong`).
- **Add row** takes a new id. **×** on a row marks it for deletion (↺ keeps it).
- Changed cells are highlighted, and nothing is written until **Save**, which
  writes every changed row at once (Cmd/Ctrl+S works too). You can keep editing
  while a save runs. **Cmd/Ctrl+Z** steps back through your unsaved edits
  (Shift+Cmd/Ctrl+Z or Ctrl+Y steps forward) and never touches other entities.
  **Revert** drops all unsaved changes. **Undo save** puts back the rows the last
  save changed.
- Validation problems underline the cell they belong to. Hover it for the message.
- Large tables stay fast: only the rows on screen are drawn, so a table of tens of
  thousands of rows scrolls like a short one. Saving revalidates only custom rows,
  not the whole project.

**Everywhere else in the editor.** Custom rows are first-class outside the grid too:

- **Search** (Cmd/Ctrl+Shift+F) matches row names and text fields (and lists of
  text), grouped under the type's name. Enum values and reference ids are not
  searched, as ids are not for built-in types.
- **Validation problems**, search hits and **Open** in a review diff jump to the
  grid, select the row and put the cursor on the field. A problem with a
  declaration in `types.json` opens that type's grid.
- **Review and drafts** list changed rows as `custom:<type>` and changed
  declarations as `types`, field by field.
- **Find usages and renaming** already covered references to and from custom rows.
- **Prose** treats row names as canon. A line that mentions `Emberwine` is spelled
  right if a drink is called that.
- **Agents** read and write custom rows and declarations through the MCP server's
  `list_custom_types`, `get_custom_rows`, `save_custom_rows` and
  `declare_custom_type` tools. They go through the same locks and hash checks as
  the grid, so an agent can't overwrite a row you just saved.
- **⇩ .csv / .json** on the grid toolbar downloads the saved rows (see
  [Export](#export--word-screenplay--excel-line-sheet)).

If a row changed on disk while you were editing it (a teammate's pull, an agent,
a text editor), the grid re-reads it and keeps your edits on top of the new
version. If the save gets there first, nothing is written and a notice lists the
rows. Your edits are still there, applied over the new versions. Check them and
save again. If someone else created a row with the same id as one you added, your
row is not saved over theirs: remove yours or add it under another id. A save
never quietly overwrites someone else's change.

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
- **Dialogue offer** (`Dialogue.offer`) → the offer editor (dialogues open on
  the canvas, so it lives in the dialogue inspector — see §5): an "offered by"
  character dropdown (defaults to the speaker), a priority-tier number, and an
  "offered when" condition builder (empty = "always (fallback)"). There is
  nothing to reorder — resolution ranks by tier, then specificity, then id
- **`loreRef`** → a dropdown of the real files under `lore/` (so you can't
  typo a path), an anchor text input, and an inline **Open** button that
  previews the file without leaving the form
- **Conditions / effects** (`showIf`, `onEnter`, …) → the structured
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
that place: the dialogue node (and choice) selected on the canvas, the quest
stage selected on the quest canvas, or the entity's form. If a variable is only
ever written or only ever read, the panel says so: a flag nothing checks, or a
condition that gates on a flag nothing sets, is usually a wiring mistake worth
catching early.

A **faction** and a **character** carry the same panel for their reputation and
relationship state — **Reputation / Relationship checked by** (`reputation` and
`relationship` conditions) and **adjusted by** (`adjust_reputation`,
`adjust_relationship` effects) — whenever anything checks or adjusts it. That is
where a `REP` or `REL` warning in the Validation panel (§10) takes you.

### Creating a flag inline

You don't have to define a flag before you can reference it. In any condition
or effect picker (a flag / counter / item field), type a name that doesn't
exist yet and choose the **＋ New flag “…”** row that appears (**New counter**
or **New item** in those fields). The row already shows the name slugified to a
valid id — type `Talked past gate` and it reads `New flag “talked_past_gate”`.
The variable is created immediately, and the field is set to it — no trip to the Variables list. Fill in its description later.

### Exclusive flag groups

Some flags describe one choice among several: the player sided with the guard,
*or* the thief, *or* neither. Nothing in the format stops a single effect list
from setting two of them, and a game that later tests one of them reads a state
the story never meant to allow. Declare such sets in `data/rules.json`:

```json
{ "flag": { "exclusiveGroups": [["sided_guard", "sided_thief", "sided_neither"]] } }
```

Each group lists at least two flag ids. When one effect list — a node's
`onEnter`, a choice's effects, a quest stage's `onComplete`, a quest outcome's
effects, or a cutscene's `effectsOnComplete` — sets two flags of the same group
to `true`, validation reports a `FLAG` error naming them. The check is per
effect list: it does not follow the player across nodes, so clearing the old
flag before setting the new one elsewhere in the story is still your job.
There is no form for `rules.json` in the editor; edit the file directly, and
the next validation pass picks it up. Renaming a flag (§5) rewrites its
entries in these groups too.

### Lore — linked Markdown documents

`lore/*.md` is your canon: character bios, faction histories, the world bible.
It never ships to the game and the validator never reads its content. The
**Lore** row at the bottom of the sidebar lists every lore file (except
`lore/dictionary.md`, the prose dictionary — §11) and edits them in place.

**Links.** Link an entity with an ordinary Markdown link using the `parlance:`
scheme and the singular entity type:

```markdown
[Mara](parlance:character/mara) keeps the ledger at [the inn](parlance:location/inn).
```

Types: `character`, `faction`, `quest`, `location`, `item`, `skill`,
`dialogue`, `codex`, `ending`, `cutscene`, `variable`, and any custom entity
type by its id. The file stays plain Markdown — it reads normally on GitHub or
in any viewer; the editor makes the links live. Links inside backticks or a
fenced code block are examples, not links.

**The editor** is the Text view's editor: syntax colour, a line gutter, **⌘F**
find & replace, and autocomplete — type `](` and pick `parlance:`, then a type,
then an id (**Ctrl+Space** re-opens the list). Save with **⌘S** or **Save**;
unsaved lore is guarded like an unsaved script, so navigating away asks first.
If the file changed on disk since you opened it (a git pull, another editor),
the save is refused rather than overwriting it: the banner reports it and you
choose **Discard mine, load the file** or **Keep mine, overwrite**. **Preview**
renders the file with live links; **+ New file** creates one (lowercase name,
`-` and `_` allowed).

**Unlinked mentions.** An entity's name written as plain text (`Mara`, `the
Mistfall Inn`) is underlined, and listed under the editor with a **Link**
button that turns it into `[Mara](parlance:character/mara)` in one click. With
the caret inside a mention the toolbar offers the same. Names that are ordinary
English words on their own (a character called "Hawk") are not flagged.

**Mentioned in lore.** An entity's detail panel lists every lore line that
links to it; click one to open the file at that line. The entity's `loreRef`
stays its one canonical document — backlinks are everything else. Links are
usages like any other: they show in **Find usages** (§11), and ⌘⇧F content
search covers lore text too.

**Deleting** an entity lists everything that refers to it — data and lore
links — in the confirm step. It is a warning, never a block: the lore links go
dangling (lore about a cut character is normal) and show up in the prose
report as **Dangling lore links**.

### Renaming an id

**Rename id…** in the entity's detail header (or **Rename id of …** in the ⌘K
palette, for whatever is selected — dialogues and quests included) changes an
entity's id and rewrites every reference to it in the same operation:

- other entities — conditions, effects, speakers, offers, gates, exits,
  interactables, portraits, custom-type reference fields, `{variable}`
  placeholders in text;
- route and snapshot fixtures in `tests/`, `progression.json` starting skills
  and `rules.json` exclusive flag groups;
- localization and VO catalog keys (`dialogue/<id>/nodes/…`) and asset-binding
  keys, so translations and recordings stay attached;
- `parlance:` links in lore;
- review threads anchored to the entity or anything inside it;
- editor layout (a dialogue's node positions, a quest or location's place on
  its map).

A character rename also renames its routing flag, `active_dialogue__<id>`,
because `set_active_dialogue` writes that flag by name.

**Preview first.** Type the new id (checked as you type, with the same rules as
creating an entity), then **Preview**. The preview counts what changes per
category, lists every lore line it will rewrite as before → after, and expands
to every file it touches. **Rename** stays disabled until you have previewed the
exact id in the box. If anything changed between the preview and the confirm (a
save, a pull, a lore edit), the rename is refused with *The project changed
since the preview — preview again.* and the fresh plan is shown instead, so you
never confirm one list of changes and get another.

Refused: an id that already exists in the same type, an invalid id, and a
character's `active_dialogue__` flag on its own (rename the character). An id
that also names an entity of a different type is allowed with a warning.
Also refused, before anything is written: a rename whose new file name is
already taken by a file holding something else (*file … already exists (it
holds id '…'); rename would overwrite it*), and a rename that would have to
save an entity whose own id is invalid — the entity being renamed or any
referrer (*'Mara' is not a valid id; rename can't fix invalid ids yet — edit
the file by hand*).

A file named for a different id than the one inside it is fine, and renaming
the entity to match its file name is how to tidy it up: `quests/old_name.json`
holding `task_new`, renamed to `old_name`, is rewritten in place — the preview
lists it as one update, and the file keeps its name.

**Quest stages and outcomes** are the one id *inside* an entity that can be
renamed, because other entities name them: quest conditions
(`{type:"quest", stage}`, `{type:"questOutcome", outcome}`), `advance_quest`'s
`toStage`, and the `questStages` / `questFired` entries of routes and
snapshots. Select the stage or outcome on the quest canvas and use **Rename
id…** in its inspector (see *Renaming a stage or outcome id* in §7). The rename
is scoped to its quest — a stage called `stage_1` in another quest, and every
reference to *that* one, is left alone — and it rewrites, in the same
operation, every reference above, the localization and VO keys under the stage
(`quest/<quest>/stages/<id>/…`, objectives included), review threads anchored to
it, and its position on the canvas. The new id must be valid and unique among
that quest's stages (or outcomes); a stage and an outcome may share an id,
because every reference says which one it means.

**Not renamed:** other ids *inside* an entity — dialogue node and choice ids,
objective ids, exit and spawn ids — and custom entities themselves (a custom
entity that *refers* to a renamed one is rewritten). VO asset file names stay
as they are: they are paths on disk, not keys.

The same rename runs from a terminal — `parlance rename characters mara
mara_vell --dry-run` prints the plan, lore lines included; drop `--dry-run` to
apply — and from an agent through the MCP server's `rename_entity` tool. A
stage or outcome is addressed as `<quest>/<id>` with the type `questStages` or
`questOutcomes`: `parlance rename questStages task_pick_side/stg_commit
stg_chose_side`.

---

## 6. Dialogue canvas

### Flow map (all dialogues)

Selecting the **Dialogues** type without opening a specific dialogue shows the
**flow map** — every dialogue as a single node, laid out left-to-right, with
edges for the cross-scene jumps between them:

- **routes** — a `set_active_dialogue` effect forces a character's next dialogue
  to another one (grey edge).
- **cutscene chains** — a `play_cutscene` effect queues a cutscene that chains
  into another dialogue via its `entersDialogue` (violet dashed edge).

Each node shows the dialogue's title, id, speaker, and word count; a **START**
badge marks dialogues with no incoming jump (reached by an offer, a
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
who'd rather type than click. Node headers are `== node_id [entry] [end] ==`
(the brackets mark optional words: write `== node_open entry ==`, not
`[entry]`), an optional author note is a `> …` line under the header, prose follows, choices
are `- choice_id: "text" -> target`, node/choice effects are `+ set_flag x = true`,
and checks are `check wit >= 12 -> pass / fail` — with a conditional modifier written on an
indented `bonus <±n> ["label"] ? <condition>` line under the check:

```
- ch_bribe: "Slip him a coin."
    check wit >= 12 -> win / lose
    bonus +2 "Coin purse" ? has coin_purse
    bonus -3 ? flag drunk
```

The script is a **lossless** representation: saving reproduces the dialogue
exactly, changing only what you edited (a byte-level round-trip is enforced by
tests over every dialogue).

A running [playtest](#12-playtest-mode) survives the switch: the Play panel
stays beside the script, and a save re-reads the scene into the session.

The text is syntax-highlighted as you type: `~` directives, `==` node fences and
the `-` / `+` markers in one colour, node ids and `-> targets` in another, ids that
refer to other entities (flags, items, skills, characters) in a third, quoted text,
numbers and grammar keywords each their own, and `> notes` in a muted italic. A
keyword the grammar does not know is marked red at the word, and any line the
parser rejects is underlined — the same lines the error list below the text
points at. The highlighting is a layer painted over the text, never part of it:
what you type is exactly what is saved.

Three more affordances ride on that layer:

- **Line numbers** in a gutter on the left; the number of the line your caret is on
  is brighter, and a line with a parse error gets a red number.
- **Find & replace** (⌘F, or the **Find** button). Plain text, no escaping; **Aa**
  toggles case sensitivity. Matches are shaded in the text, Enter / Shift+Enter step
  through them, **Replace** rewrites the current one and **Replace all** every one.
  Both go through the text box itself, so ⌘Z undoes them like any keystroke.
- **Autocomplete**, as you type or on Ctrl+Space. Where the grammar expects an id the
  list offers the project's: flags after `flag` / `set_flag`, counters after
  `counter`, skills after `check` / `skill`, factions after `rep`, characters after
  `rel` / `route` / `speaker`, items after `has` / `give`, quests after `quest` /
  `advance` (and that quest's stages after `->`), cutscenes, dialogues, portraits,
  and this dialogue's node ids after `->` or `next=`. Where it expects a keyword —
  after `~`, `+`, `?`, or on an indented line — it offers the grammar's, each with a
  one-line reminder of the form. ↑ ↓ pick, Enter or Tab insert, Esc dismisses.

A node's display gate (conditional narration) rides in the script as a `~ showIf:`
directive on the line after the node header — the same compact condition syntax choices
already use after `?`:

```
== n_aside next=n_close ==
~ showIf: flag met_keeper
You have been here before, and they know it.
```

An older editor build that predates the directive rejects it with a parse error and blocks
the save — loud by design, never a silent drop of the gate. A syntax error blocks the save and points at the
line — it never writes partial data. Rich logic (nested conditions, all effect
types) is expressible in the compact grammar, but the graph's builders remain
the friendliest way to author it; use whichever fits the moment.

### Line tags and engine commands

Two hand-offs to the game engine, both opaque to Parlance:

- **Tags on a line or a choice**, e.g. `mood:angry` or `sfx:door`. Edit them in the node
  inspector's **Tags** row (node section, and again in the choice section). The canvas
  shows a tagged node's first tag and a count, and a tagged choice gets a small chip.
  Playtest prints the current line's tags after its text. The `.xlsx` line sheet has a
  **Tags** column. No rule reads tags; the engine gets them on the step.
- **Engine commands**: the *engine command* effect type, e.g. `shake` with args `0.5`.
  Playtest lists it among the applied effects marked **→ engine**, because it changes no
  state here by design.

In the Text view:

```
== n_door ==
~ tags: mood:angry, sfx:door
The door slams.
+ engine shake 0.5
- c_calm: "Easy." -> n_next ? flag met #tone:calm #"vo skip"
    + engine play_sfx door_creak 0.8
```

A node's tags are a `~ tags:` line under its header, in the same list form as the
dialogue's. A tag holding a comma or a quote is written `"quoted"`. A choice's tags trail
its line as `#tag` tokens after any `?` gate; a `#` inside the quoted choice text is never
a tag, and a tag with a space is `#"quoted"`. An engine command's args are typed by token:
a number, `true`/`false`, a bare word (a string), or a `"quoted"` string. Anything that
would read back as a different type is quoted. Autocomplete offers the project's existing
tags after `~ tags:` or `#`, and declared engine commands after `+ engine`.

To catch typos, declare the commands your engine handles in `data/rules.json`:

```json
{ "engine": { "commands": { "shake": { "args": 1, "description": "camera shake" }, "play_sfx": { "args": "any" } } } }
```

**Patterns.** For the recurring shapes these pieces compose into — say-it-once
re-entry, one-shot choices, hub-and-spoke topic menus, reputation tone shifts,
quest state machines, storylet selection — see the [Pattern cookbook](COOKBOOK.md).
Each is a copyable recipe with the pitfalls that bite, and an *also known as* map
to Ink, Yarn Spinner, Twine, and Ren'Py for authors arriving from another tool.

### Canvas controls

| Action | How |
|--------|-----|
| Pan | Click and drag on empty canvas |
| Zoom | Scroll wheel, or use the Controls cluster (bottom-left) |
| Fit all | Fit-view button in Controls, or "Auto layout" in the toolbar |
| Select node | Click a node (with Play open, this also opens the node in the Play column's **✎ Edit** tab — §12) |
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

New nodes get generated ids (`node_1`, `node_2`, …), and the inspector shows
the id read-only in its title (**Node: node_3**) — there is no id field in the
graph view. To give a node a meaningful id, edit its header line in the
**Text** view, along with any `->` lines that point at it (see *Graph vs.
Text*). The same goes for choices: **+ Add
choice** names them `ch_1`, `ch_2`, … per node.

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
- **Show If** — an optional condition that gates whether this node's line is
  **displayed**. This is *conditional narration*: a line that appears only in some
  world states. On a plain narration node (no choices, not an end node), when the
  condition fails the node is skipped entirely — no line, no effects, no transcript
  entry — and the dialogue continues at **Next**. On a node with choices or an end
  node, a failed gate hides only the line; see "Gated choice or end node" below.

  Read that twice, because it is the one thing here that surprises people:
  a skipped node's **On Enter Effects do not fire**. A skipped node did not
  happen. If a flag must be set whether or not the line shows, put it on the
  node the gate falls through *to*.

  Use it for a beat that depends on what the player already knows. It is not a
  choice — a choice would fabricate a decision the player never made — and it is
  not a branch, because a node advances to one fixed **Next**.

  The control is only offered where a gate is legal: the node needs a line, and
  a narration node also needs a **Next** to fall through to. Where it isn't legal
  the row says *"unavailable here"* and gives the reason, rather than letting you
  author a gate the validator would then reject. The hint beside **Show If** says
  whether a failed gate skips the node or hides only its line. The rules are
  enforced by the `COND` validator code (see §10), which also warns if you put
  effects on a gated narration node.

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
Below the node fields, **+ Add choice** appends a choice (and selects it), and
**✨ Draft** opens AI drafting for this node (see *AI drafting — suggested
player choices* below). The node's choices are listed under **Choices**, in
the order the player sees them; click one to open its fields. The **↑** / **↓**
buttons beside each choice move it one place up or down (disabled at the
ends), and with a choice focused, **Alt+↑** / **Alt+↓** does the same from the
keyboard. Each move is one save and one undo step. Edges, routes and
localization keys all follow a choice by its id, so a move rewires nothing. It
changes only the order the choices are offered in, in Play and in the game.

- **Text** — what the player sees.
- **Tags** — opaque labels on this choice, passed through to the engine (see
  *Line tags and engine commands*).
- **Show If** — an optional condition that gates visibility. If the condition
  is false at runtime, the choice is hidden. Supports `flag`, `skill`,
  `reputation`, `relationship`, `counter`, `item`, `quest`, and boolean
  `all`/`any`/`not` combinators.
- **Fallback** / **When locked** / **Locked text** — see *Fallback and locked
  choices* below.
- **Skill Check** — **+ Add skill check** attaches one; a mode (`active` /
  `passive`), a skill, a difficulty, and an optional per-check dice override
  (blank uses the project default). **Remove check** takes it off.
  - `active` — rolls `d20 + skill_value ≥ difficulty` (or the dice in effect).
    Routes to the `onSuccess` or `onFailure` node, which you wire with the
    choice's green and red handles.
  - `passive` — never rolls. The choice leads to its ordinary destination, like
    a plain choice. The check is a **reveal threshold** your game applies: the
    runtime's `passiveCheckPasses` is true when `skill + Σbonus ≥ difficulty`,
    and a game that shows passive-check options only to qualified players uses
    that rule to decide. The runtime itself still lists the choice whenever its
    **Show If** passes, and so does Play in the editor, which offers the choice
    whatever the skill and logs it as *(passive reveal)*. See the runtime
    contract (`tooling/RUNTIME_CONTRACT.md`, `passiveCheckPasses`).
    Because the runtime counts a passive choice as visible even when it is
    unrevealed, a node whose **every** non-fallback choice is a passive check
    gets a `FLOW` warning: a game that hides unrevealed passive choices can show
    the player nothing to click there, and any **Fallback** on that node stays
    suppressed. Give the node at least one choice without a passive check.
    Showing the passive choice greyed (**When locked**) does not help, because a
    greyed choice is never selectable.
  - A **probability bar** (active checks only) shows P(success) for a stat
    value you type into **Preview stat**, computed from the check's dice,
    difficulty and the project's critical-roll rule. The bar is the base chance,
    with no modifier applying. When the check has modifiers, a line under it
    gives the range they can reach, e.g. *"with modifiers 30–75% (−3 to +6)"*:
    every penalty applying at the low end, every bonus at the high end.
  - **Modifiers** *(new in 0.14.0)* — conditional bonuses on the roll (or, for a
    passive check, the reveal threshold). See **Conditional check modifiers**
    below.
- **Effects** — effects applied when this choice is selected.
- **Delete choice** removes it.

The inspector has no destination field. A plain choice's `goto` is set only by
dragging its handle to a node on the canvas (see *Connecting nodes*), or by
editing the `-> target` in the Text view. In the Text view you can also reorder
choices by moving their `- choice` lines.

> **Skill checks and conditions are shown automatically.** On the canvas, a
> choice with an active check shows a `skill / difficulty` badge (e.g.
> `wit / 10`), and a choice gated by a `showIf` shows a condition summary
> (e.g. `wit >= 6`), derived from the structured fields. You do **not** need
> to type a `[Wit]`-style prefix into the choice text — the badge is generated
> for you, and the text stays clean prose that serializes verbatim to JSON.

### AI drafting — suggested player choices

Optional, and off until you configure a provider. **AI drafting proposes player
choices for one node** — the options the player picks from at that line. It
never writes an NPC's reply, a node's text, or new nodes; the NPC's side of the
scene stays yours to write.

**Set up.** Click **⚙ AI** in the header to open **AI Provider Settings**:
**Provider** (*Anthropic (Claude)* or *OpenAI-compatible (Ollama, OpenRouter,
etc.)*, which also takes a **Base URL**), **Model** and your API key. Settings
are stored on your machine in `parlance-settings.json` (the desktop app's
user-data folder, or `~/.config/parlance/`), readable only by you; the key is
never sent back to the page in full.

**Draft.** Select a node and click **✨ Draft** under its fields. The **✨ AI
Draft** panel opens with a **Count** (1–5, default 3); press **Draft**, and
**Regenerate** for a fresh set. Each candidate card shows the choice text, its
id (`ch_…`, generated by the model), and any check, **Show If** or effects the
model proposed. **Add ↓** appends it to the node's choices and selects it.

**What it checks, and what it leaves to you.** The model may only use skill,
flag, faction and character ids that already exist. Every candidate is
validated against your project before you see it: one that would add a
validation error (an unknown id, a malformed condition, a duplicate choice id)
is shown as **Invalid candidate**, with the reason one click away, after one
automatic retry. Wiring is not the model's job: a candidate never carries a
destination, and a check comes without its success and failure targets. Those
`FLOW` and `GATE` problems are ignored when judging a candidate, so an added
choice is a dead end — a `FLOW` error in the validation bar — until you drag its
handle to a node on the canvas.

Once added, a drafted choice is an ordinary choice. The purple marking lives on
the candidate cards only; nothing in the saved data records that a choice was
drafted by AI.

**What leaves your machine**, and only when you press **Draft** or
**Regenerate**, sent to the provider you configured with your key:

- the node's speaker (id, name and archetype — or the skill, for a
  skill-voiced line), the node's text, and the choices already at that node
  (id, text, and check skill);
- lists of up to 50 ids each of your project's skills, flags, factions and
  characters (the ones this dialogue already uses first), so the model can only
  reference ids that exist;
- the instructions for the task.

Nothing else from the project is sent — not other nodes or dialogues, not
`lore/`, and not the character's description or `dialogueStyle`.

### Fallback and locked choices, text-less and gated choice nodes

- **Fallback.** Tick **Fallback** on a choice to offer it only when no other choice
  on the node is visible — a "Walk away" under two gated options. A node whose every
  other choice is gated stops getting the *player may be stuck* warning once it has an
  ungated fallback. The canvas marks it with a dashed `fallback` tag. A passive-check
  choice counts as visible here even when the game hides it, so a fallback beside
  nothing but passive-check choices is never offered; the validator warns about
  that node (see the `passive` bullet above).
- **When locked.** A gated choice is hidden when its **Show If** fails. Set **When
  locked** to *show greyed out* (or set the project default, `rules.choices.
  whenLockedDefault`) to present it disabled instead, with optional **Locked text**
  such as `[Requires Engineering 3]`. It is never selectable. Play shows it greyed
  with a lock; the canvas tags it `🔒 shown`. Locked text is exported for translation
  under `…/choices/<id>/lockedText`.
- **Gated choice or end node.** A **Show If** on a node with choices, or on an end
  node, hides only its line when it fails — the choices still appear, the dialogue
  still ends, and its On Enter effects still run. (On a plain narration node it still
  skips the node entirely.) The inspector's hint says which one you are getting.
- **Text-less node.** A node with choices may have no text: clear the Text field and it
  presents only its options — the canvas shows *(options only)*. In the Text view it is
  a node header followed directly by its `- choice` lines; the tags read
  `- id: "Text" -> target fallback locked=show lockedText="…" ? <condition>`.

### Conditional check modifiers

*New in 0.14.0.* A check's odds can shift with the situation. Under a choice's
**Check**, **Modifiers** are conditional bonuses — each a `when` condition and a
signed `bonus`, with an optional label: "+2 with the crowbar", "−1 while drunk".
Every modifier whose condition holds contributes its bonus, and they sum.

- **What moves is the roll, not the bar.** `difficulty` stays the fixed DC; the
  bonus changes what the player brings to it. An active check resolves
  `d20 + skill + Σbonus ≥ difficulty`; a passive reveal, `skill + Σbonus ≥
  difficulty`. A negative bonus makes the check harder.
- **Per-check, not global.** A modifier lives on the one check that declares it —
  there is no equipment layer applying a bonus everywhere. If an item should help
  every rhetoric check, it goes on each of them; the editor invents no global
  bonus.
- **The probability bar shows their range, not their conditions.** The inspector
  has no game state, so it cannot know which modifiers hold. The bar is the base
  chance for the stat you type, and the line under it gives the range across
  every combination: all penalties at the low end, all bonuses at the high end.
  To see a bonus actually applied, use **▶ Play**: the check line
  reads `1d20=… + skill + N (mods) = total`, and the choice's check tag in Play
  includes the bonus that holds in the current state.
- **In the Text view**, a modifier is an indented `bonus <±n> ["label"] ?
  <condition>` line under the check (see **Graph vs. Text**).

The cookbook's skill-check recipe (recipe 16 in `tooling/COOKBOOK.md`) works a
full example and lists the mistakes to avoid.

### Effects reference

The effect picker offers twelve types. The dropdown shows the label in the
second column; the data stores the `type` in the first.

| Type | Label | What it does |
|------|-------|-------------|
| `set_flag` | set flag | Sets a boolean flag to true/false |
| `adjust_reputation` | adjust reputation | Adds a delta to a faction's reputation, clamped to its declared range |
| `adjust_relationship` | adjust relationship | Adds a delta to one character's relationship with the player. Unclamped — a character declares no range |
| `adjust_counter` | adjust counter | Adds a delta to a named counter (unbounded) |
| `give_item` | give item | Adds an item id to the player's inventory |
| `take_item` | take item | Removes an item id from inventory (no-op if not held) |
| `advance_quest` | advance quest | Records the stage id you type as the quest's current stage (what a `quest` condition reads). It does not itself fire the stage's **On Complete Effects** — those fire when the stage's **Complete When** holds |
| `grant_xp` | grant XP | Adds to the player's total earned XP (levels and skill points derive from it; see `progression.json`). By convention it goes on quest outcomes — the `XP` check notes one anywhere else |
| `set_active_dialogue` | set active dialogue | Queues a specific dialogue for a character (push-based scene switch): it sets the flag `active_dialogue__<character>`, which the target dialogue's forced offer reads (see *Offers*) |
| `play_cutscene` | play cutscene | Queues a cutscene manifest (`pendingCutscene`); the host plays its `asset`, applies `effectsOnComplete`, then enters `entersDialogue` if set |
| `set_text` | set text | Sets a text variable to a literal string, substituted wherever `{variable}` appears in player-facing text. Pick the variable from the dropdown (or create one inline) and type the value. |
| `engine` | engine command | **Engine command.** A command for the game engine (camera shake, a sound cue), handed over in order among the other effects. It changes no state in Parlance. Type the command name (suggested from `rules.engine.commands` when the project declares them) and the args on one line: `0.5 camera_main true "two words"`. See *Line tags and engine commands* below. |

### Dialogue metadata (inspector, top section)

- **Title** — display name for the entity list.
- **Default speaker** — *every node inherits this unless overridden.* The
  dialogue's fallback speaker (a character; not a skill — this field also
  supplies the default `offer.character` for offer resolution, so it stays
  character-only even though a node's own Speaker override can be a skill).
  Leave unset for a dialogue that's entirely narration/multi-speaker with no
  single default — see Speaker in the node inspector above.
- **Offer** — whether and how this dialogue offers itself for selection: an
  "offered by" character (defaults to the speaker), a priority tier, and an
  "offered when" gate. An offer with no gate is the **fallback** — the NPC's
  default when no more specific or higher-tier offer applies. A dialogue with
  no offer at all is reached only by `goto`/route/cutscene/world placement.
- **Replayable** — off by default. A dialogue that is **not** replayable drops
  out of offer resolution once the player has played it, so after one visit its
  character falls through to the next offer — or to nothing, if it was their
  only one. Tick it for anything the player should be able to hear again: a
  fallback greeting, a shopkeeper, or a gatekeeper who turns the player away
  until they come back with the right papers. The validator cannot see this
  case: a character whose only unconditional offer is a one-shot passes the
  `OFFER` no-fallback check and still says nothing on the second visit.
- **Lore** button (toolbar, far right) — appears if the dialogue has a
  `loreRef`; opens the linked Markdown doc inline.
- **Delete dialogue** (toolbar, far right) — deletes the whole dialogue
  file with confirmation.

### Offers — which dialogue a character opens with

When the player talks to a character, the game asks: *of everything this
character could say right now, what is the most relevant?* Offers are how a
dialogue answers "me, when…". There is no list to keep in order — each dialogue
carries its own claim, and the engine ranks the claims.

*New in 0.14.0 — offers replace the character `dialogues` ladder; see "Coming
from a 0.13 project" at the end of this section to migrate.*

**The model, in four rules.**

1. **A dialogue opts in by carrying an offer.** No offer means it is never
   presented on its own; it is reached only by a `goto`, a route, a cutscene,
   or a place in the world (an interactable). Click **+ Offer this dialogue**
   in the inspector to opt in.
2. **An offer with no gate is the fallback.** It is what the character says
   when nothing more specific applies. Every character with offers should have
   exactly one; the validator warns (`OFFER`) when there is none (a character
   whose every offer is a forced routing target is exempt: resolving to nothing
   outside a routed beat is the intent).
3. **Among offers whose gate passes, the most specific wins.** Specificity is
   how many conditions the gate carries: a single `flag` is 1, an `all` of
   three is 3, an `any` counts its weakest side. So "betrayed me AND mid-quest"
   beats "mid-quest" beats the fallback, with no ordering on your part.
4. **A priority tier beats specificity.** Set **priority** above 0 only when one
   scene must win regardless — a forced next beat queued by
   `set_active_dialogue` is the standard case (tier 1, gated on the
   `active_dialogue__<character>` flag the effect sets). A tier above 0 with no
   gate wins forever, which is almost never what you mean; the validator says so.

Two offers with the same tier and specificity are a **tie**, and the lower id
wins. The validator names the winner in an `OFFER` warning, unless it can
prove the two can never both apply: opposite values of one flag or item, or
ranges of one counter (or reputation, relationship, skill) that do not
overlap, which is why a sequence gated `== 0`, `== 1`, `== 2` on one counter
is silent. Break a real tie on purpose: raise a tier, or add the dominant
fact to the gate so it is more specific. A dialogue that has been played and is
not **Replayable** drops out of the running (the preview in Play ignores that,
so a played one-shot can still show as the winner there).

**Where you set it.** Open the dialogue on the canvas; with no node selected,
the inspector's top section shows **Offer**:

- **offered by** — the character who presents it. Defaults to the dialogue's
  speaker; set it only for a scene the player carries (a hub the *player*
  opens) or that someone other than the speaker should present.
- **priority** — the tier, normally 0.
- **offered when** — the gate, built with the same condition builder as a
  choice's `showIf`. Empty means fallback.
- **Stop offering** — removes the offer; the dialogue stays reachable by jumps.

In the **Text** view the same fields are header directives under the title
line: a bare `~ offer` opts in as a fallback; `~ offer by: npc_wren`,
`~ offer priority: 1`, and `~ offer: flag betrayed_wren` set the three fields
(the condition uses the same syntax as `~ showIf:`). Deleting the lines removes
the offer.

**How to see what will happen.** There are two previews. The quick one is in
the inspector itself: under **Offer**, a line ranks this dialogue among its
character's offers (*"Ranks #2 of 3 for Wren — …"*), and an open **Resolution
preview** lists that character's offers in rank order with the winner marked,
resolved against the project's default starting state, with toggles for the
flags the gates read. The fuller one is in Play: open **▶ Play** on any dialogue
and expand **Dialogue Offers** above the transcript. Pick a character (it opens on the
first with offers); it lists every offer of that character in rank order, marks the one that wins against the current state,
and shows each offer's tier and condition count — the two numbers that decide.
Flip the flags the gates read, right there, and watch the winner change. On the
flow map, a dialogue with an offer carries an **offered** badge; one with no
offer and no incoming jump is marked **orphan**, because nothing presents it.

**Patterns.** The cookbook (`tooling/COOKBOOK.md`) builds the common shapes out of
offers: say-it-once (recipe 1), the salience greeting (12), and push versus pull
for a queued next scene (14).

**Coming from a 0.13 project.** The old character `dialogues` ladder is
converted for you: the Validation panel's **Convert ladders to offers** button
turns each rung into an offer that resolves exactly as the ladder did, and
prints a report of the few places worth a look (a rung that needed a tier,
a rung that was already shadowed).

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

Selecting a quest from the entity list opens a **stage graph**. Stages are
chained in play order (`order`); outcomes stand beside them. The quest canvas
shares the same dark controls and **Map** minimap toggle as the dialogue canvas.

### Quest structure

A quest has:
- **Stages** — steps in play order (`order`), each with a retrospective
  `description`, an optional **Complete When** condition, **On Complete**
  effects and journal **objectives**.
- **Outcomes** — terminal results (success / failure / neutral), each with a
  `description`, an optional **Reached When** condition and effects.

### Quest inspector

With nothing selected the inspector shows the quest itself:

| Field | What it is |
|---|---|
| **Name** | the authoring-facing label |
| **Journal Name** | the player-facing title in the journal; leave it empty and the journal shows **Name**. `{variable}` placeholders are filled at runtime. Emptying it removes the field. |
| **Summary** | one or two lines for the journal |
| **Tags** | free labels the journal groups and prioritises by — main vs. side is a tag, never a checkbox. Type and press Enter; × removes one. Linted against `rules.quest.tagVocabulary` when the project declares one (an unrecognised tag is a warning). |
| **Starts available**, **Available When**, **Closed When** | when the quest enters and leaves the journal |

Click a stage or outcome node to add its own section below: description,
conditions and effects, and — for a stage — its journal objectives and its
place in play order. **+ Stage** / **+ Outcome** append new nodes with
placeholder ids (`stage_N`, `outcome_N`); rename them with **Rename id…**.
With a node selected, **Delete stage** / **Delete outcome** removes it after a
confirm. Every change is written to disk as you make it (*"Saved automatically ·
⌘Z to undo"*).

### Renaming a stage or outcome id

**Rename id…** in a stage's (or outcome's) inspector heading opens the same
preview-then-confirm dialog as an entity rename (§5, *Renaming an id*). Type the
new id — it is checked as you type: valid, and unique among this quest's stages
(or outcomes) — then **Preview** lists every file the rename touches: the quest
itself, every entity whose quest condition or `advance_quest` names the stage,
`tests/` routes and snapshots, localization keys, review threads. **Rename**
applies exactly that list; the node keeps its place on the canvas and stays
selected under its new id. Only this quest's stage is renamed — a same-named
stage in another quest keeps its id and its references.

### Stage order

A stage's inspector shows its position (*2 of 4*) with **▲ Earlier** and
**▼ Later**. A move swaps the stage with its neighbour in play order and
renumbers every stage's `order` 1, 2, 3… (the array is kept in the same order,
so the validator's *stages not in ascending order* warning never appears).

Quest conditions compare stages by **order**, not by id — `>= stg_commit` means
"at or past stg_commit" — so moving a stage can change game logic without
touching a single reference. Before such a move is written, a one-line warning
names how many existing quest conditions would change meaning and where they
are (*Moving stg_commit earlier changes what 2 quest conditions mean — they
compare stage order (dialogues/dlg_x, codex/cx_y).*). **Move anyway** writes
it; **Cancel** writes nothing. A move that changes no condition's meaning (and
`==` comparisons never do) is saved immediately. Like every canvas edit, a move
is one step on the undo stack.

### Journal objectives (stage inspector)

A stage's inspector has two prose fields, and the difference between them is the
whole point of the journal:

- **Description (retrospective)** — what the protagonist *did*, in their own voice.
  Shown once the stage is complete.
- **Objectives (journal)** — what they *intend* to do. Shown while the stage is
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
and **Tags** are edited in the quest inspector with nothing selected (see
*Quest inspector* above). Tags drive the journal's grouping — main vs. side is a
tag, never a checkbox — and are linted against a controlled vocabulary; an
unrecognised tag is a warning.

---

## 8. Quest dependency graph

Selecting **Quests** in the sidebar without opening a specific quest shows
the **quest dependency graph** — all quests laid out in a DAG showing which
quests are prerequisites for others.

Each node shows:
- Quest id and name
- **start** — the quest has **Starts available** ticked
- **gated** — the quest has an **Available When** condition
- **closes** — the quest has a **Closed When** condition

Edges are drawn from flags. An **opens** edge (grey, labelled `opens: <flags>`)
runs from a quest whose stage or outcome effects set a flag to a quest whose
**Available When** reads it. A **closes** edge (orange, dashed, labelled
`closes: <flags>`) does the same for **Closed When**. A flag read only under a
`not` draws no edge. Quests caught in a circular dependency (a `QUEST` error)
have their edges drawn red. **Auto layout** re-arranges the graph.

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
triggers a re-validation — incremental, so only the changed entities and
whatever references them are re-checked (a full pass runs when project-wide
configuration like `rules.json` changes) — and the pass runs off the editor's
serving thread, so even very large projects stay responsive while you type.
Results are pushed to all open editor windows via WebSocket.

**On a clean project there is no bar at all.** It appears as soon as there is
at least one error or warning, and disappears again when the last one is fixed
— so a missing bar means "no issues", not "not checking". (The one exception:
if the live connection to the host drops, the bar stays up and says *"live
validation disconnected — counts may be stale"*, with a **Retry** button.)

By default the bar is **collapsed** to a single status row — it still shows
the live error / warning counts and per-code filter chips, so project health
stays glanceable, but the issue list stays out of the way. **Click "Validation
▸"** to expand it and see all issues; the expanded / collapsed choice is
remembered across sessions. The error and warning chips filter the list by
severity, and each code chip (`FLAG 3`) filters it to that code; **clear**
removes the filters. Issues are listed entity by entity, errors before
warnings within each entity; the rare issue that belongs to no entity (a file
the editor could not read at all) comes first. Each row shows:

- Severity colour (red = error, yellow = warning)
- Issue code (e.g., `[REF]`, `[COVERAGE]`, `[GATE]`)
- Human-readable message, and the entity id when there is one
- Click the row to go **to the place the issue is about**, not just the entity
  (hover a row to see where it will land):
  - **A dialogue node or choice** — the dialogue opens on the canvas with that
    node selected and scrolled into view; for a choice-level issue (a dead-end
    choice, a `goto` to a missing node, a check problem) the choice is opened
    in the inspector too. This covers `SCHEMA` problems inside a node, which
    the validator reports by position (the third node, its second choice).
  - **A quest stage, outcome or objective** — the quest canvas opens with that
    stage or outcome selected, and the objective scrolled into view in the
    inspector.
  - **Any other entity** — the entity opens in its form with the field the
    issue is about outlined and focused (a location's **Exits** for an exit
    issue, a character's **Portrait** …), opening the collapsed **Metadata**
    section first when the field lives there.
  - **A custom-type row** — its grid opens at the row and column.
  - **`FLAG`, `REP`, `REL`** — the flag's variable, the faction or the
    character opens with its **Flow** panel (§5), which lists every place that
    checks and changes it. A flag read but never set is fixed at one of the
    *Checked by* sites or by setting it somewhere, so that list is the thing to
    act on; each of its rows jumps to the node in turn.

  If the node or choice was deleted after validation ran, the dialogue still
  opens, with nothing selected. Issues about project-wide configuration
  (`progression.json`, `rules.json`) have no entity to open and stay plain
  text.

**+ Add condition**, **+ Add effect** and **+ Add modifier** do not save a blank
entry. The new entry stays in the inspector, marked *Not saved yet — choose a
flag* (or item, quest…), and is saved when its reference is picked. Removing it
before then writes nothing. An edit that blanks a saved entry is held back the
same way. Switching a condition's type, for example, keeps the saved condition
in force until the new one is complete. The one effect with no reference,
**grant XP**, saves as soon as you choose it.

Common codes:

| Code | Meaning |
|------|---------|
| `SCHEMA` | Field fails JSON Schema validation |
| `REF` | References an id that doesn't exist |
| `DUP` | Duplicate id detected (entity ids, dialogue nodes/choices, or a location's spawns/exits/interactables) |
| `COND` | A node's `showIf` breaks a conditional-narration rule — a gated narration node (no choices, not an end) must have `next`, a gate needs a line to hide, a `next` chain must not end at a gated node, and gated nodes must not form a ring. Also warns when a skippable gated node carries `onEnter`, since those effects do not fire when it is skipped |
| `FLOW` | A dialogue's flow is broken or suspicious. Errors: a dead-end choice (no `goto`, no check, not `isEnd`), a node with no choices, no `next` and not `isEnd` (the player is stuck), a node with **no text and no choices**, `next` together with `choices` or `isEnd`, a `next` cycle, and a node named `end` (reserved). Warnings: every choice on a node has `showIf` and none is a fallback (the player may be stuck), **more than one fallback** choice on a node, a **fallback with no gated sibling** (it is always offered, so the flag does nothing), **`whenLocked`/`lockedText` on a choice with no `showIf`** (it can never be locked), and a node whose **every non-fallback choice is a passive check** (the runtime counts them as visible even when unrevealed, so a game that hides unrevealed passive choices can show nothing clickable there and the node's fallback, if any, is suppressed; the warning fires whatever the difficulty, because no skill has a floor and every modifier is gated, so no reveal is guaranteed) |
| `GATE` | Active check missing onSuccess / onFailure destination |
| `QUEST` | Quest stage issue — including stage/outcome effects with no `completeWhen`/`reachedWhen` (they can never fire; quest resolution only fires condition-gated items) |
| `FLAG` | Flag written but never read, read but never written, or declared but never used (warnings). An error when one effect list sets two flags of the same `rules.flag.exclusiveGroups` group to `true` — see [Exclusive flag groups](#exclusive-flag-groups) |
| `REP` | A faction's reputation is checked but never adjusted |
| `REL` | A character's relationship is checked but never adjusted |
| `ENDING` | Ending is unreachable |
| `CODEX` | A codex entry's `unlockedBy` needs a flag nothing sets, so it may never unlock |
| `LOGIC` | A faction lists itself in `opposes` |
| `COVERAGE` | Character has no dialogue |
| `REACH` | Dialogue node unreachable from `entry` |
| `LORE` | `loreRef` points to a file that doesn't exist |
| `PORT` | Portrait issue — a character or node names a portrait that is not in `portraits.json`, a portrait names an unknown character, or a registered portrait is never used (warning) |
| `TEXT` | A `{placeholder}` in node text, choice text, a choice's `lockedText`, or a quest's journal name, stage description or objective text is not a registered `text` variable (error); or a `text` variable is declared but never referenced (warning) |
| `OBJ` | Journal objective issue — a duplicate objective id within a stage (error); a stage with `completeWhen` but no objectives, or one whose every objective is gated by `showIf`, so the journal can show an empty stage (warnings) |
| `RULES` | Malformed dice notation in `rules.check.dice` or in one check's `dice` |
| `ROUTE` | A route in `tests/routes/` names an unknown snapshot, dialogue, choice, quest or ending, or its `startState` names an unregistered flag, counter or item |
| `SNAP` | A snapshot in `tests/snapshots/` names an unknown quest, stage, outcome, cutscene or dialogue in its state |
| `LOC` | Location graph issue — bad exit spawn, a spawn nothing arrives at, more than one default spawn, gate/gateType mismatch, unreachable location, npc interactable missing its character |
| `CUT` | Cutscene issue — unknown `entersDialogue`, never-triggered cutscene, or ambiguous ordering (two `play_cutscene` effects on one node) |
| `OFFER` | Dialogue-offer selection issue — **no fallback** (a character has offers but none is unconditional, so resolution can return nothing — silent for a routing-only character whose every offer is forced through its `active_dialogue__` flag), **names no character** (an offer on a dialogue with neither a speaker nor `offer.character`, so nothing ever presents it), a **prioritized fallback** (an offer with `priority > 0` and no `when` shadows every lower tier forever and re-fires on re-entry), an **unbreakable tie** (two of one character's offers share priority and specificity and aren't provably exclusive, so the id decides — provable means opposite values of one flag or item, disjoint ranges of one counter/reputation/relationship/skill, each also under a `not`, or an OR whose every side is), an **offer-only stranded** speaker dialogue (nothing offers it and it has no world placement), a **`set_active_dialogue` target with no forced offer** (the named dialogue carries no offer for that character gated on `active_dialogue__<character>`, so the flag routes nothing), or a **forced offer that can be out-ranked** (an ordinary offer of the same character beats it while the flag is set, so routing plays the wrong scene — raise its tier). A dangling `offer.character`/`offer.when` ref is a `REF` error. All warning-level; none blocks a save. |
| `MIGRATE` | A stale project still carrying the retired `character.dialogues` ladder (Parlance 0.13). An error; the Validation panel shows a **Convert ladders to offers** button that rewrites every ladder into dialogue offers and prints the conversion report (`parlance migrate <project>` does the same from a terminal, and `tooling/scripts/migrate_ladders.py` without the editor). |
| `PROG` | Progression config (`progression.json`) issue — malformed thresholds (not strictly increasing), `pointsPerLevel`/`maxSkill` < 1 (error), a starting skill already at the ceiling, or the **soft-cap sanity** warning (authored XP grants enough points to max every skill). |
| `XP` | `grant_xp` issue — non-positive `amount` (warning), or `grant_xp` authored outside a quest outcome (advisory; the convention is XP from quests only — silent in a project with no quests). |
| `ENGINE` | `engine` effect issue. A command name that is not lowercase snake_case is an error. Once `rules.engine.commands` declares the project's commands, a command outside that set (a typo is otherwise a silent no-op in the game) or a call with the wrong number of args is a warning. |
| `CHECK` | Priced/oneshot check discipline — a `priced` (default) active check whose failure doesn't proceed (no `onFailure` branch), or a priced-gate failure that sets a flag some `offer.when` reads (advisory). `oneshot` checks are exempt from the proceed requirement. |

Spelling is deliberately **not** in this table. Prose findings carry the code
`SPELL`, they are never produced by validation, and they never appear in this
panel or block a save — they live in **Reports → Prose** (§11). The reason is
that spelling is editorial rather than structural: it says nothing about whether
a project conforms to the format, so it is not part of the published contract and
the reference validator (`tooling/validate.py`) does not implement it.
The lore findings are the same kind of thing: `LORE_LINK` (a `parlance:` link
in lore that names nothing) and `LORE_MENTION` (a name that could be a link)
live in **Reports → Prose** too, and never here — lore never ships. So does
`CODEX_MENTION` (a codex entry's name used in play text), an information note
of the same pass.

The **Reports** row (sidebar footer) also shows the total issue count,
coloured red for errors or yellow for warnings.

---

## 11. Reports — coverage & reference index

Click **Reports** (pinned to the sidebar footer) to open the Reports panel.

The panel has six tabs — **Issues**, **Prose**, **Explore**, **Find usages**,
**Flag flow** and **Speakers** — plus **Search text**, which opens the shared full-text
overlay (⌘⇧F).

The **Issues** tab has two columns:

### Left — Coverage & structural issues

Issues are grouped by code category. Each row is clickable and navigates to
the affected entity (same as the validation panel). Use this view to:

- Find characters who have no dialogue assigned (`COVERAGE`)
- Find flags that are set but never tested, or tested but never set (`FLAG`)
- Find dialogue nodes unreachable from `entry` (`REACH`)
- Find endings with no path that leads to them (`ENDING`)

### Right — Reference index

A searchable index of every id in the project, shown beside every tab of the
panel (the **Find usages** tab itself only points you at it). Type part of a
flag id, character id, skill id, etc. — it matches ids, and lists the first 30
— to see:

- Where it is **defined** (entity type and id)
- Every place it is **written** (effects)
- Every place it is **read** (conditions, showIf, offer.when, quest availableWhen)
- Any other reference, and links to it from `lore/`

Each row names the entity (`dialogues/dlg_arrival`) and the JSON path. The rows
are a read-out, not links: only a **lore** row (`lore/x.md:L12`) is a button,
which opens the file on the Lore surface at that line. To jump from a
variable's usages to the entities themselves, use the **Flow** panel on the
variable's own detail page (§5), whose rows are clickable. This is the "find
usages" feature — useful for safely renaming or removing a variable.

### Flag flow

The **Flag flow** tab answers one question about one flag: where is it set, and
where is it tested? Type in the search box (it suggests the project's flags)
and pick one. The tab lists it in two halves:

- **Sets (Effects)** — every effect that writes the flag.
- **Reads (Gates)** — every condition that reads it.

Each row names the owning entity, its type and the JSON path. An empty half is
the finding: "never explicitly set" is a gate that cannot open unless the game
sets the flag itself, and "never used as a gate" is state nothing reads. The
`FLAG` warnings report the same two cases project-wide; this tab is for
following one flag through the story. The **Flow** panel on a variable's detail
page (§5) shows the same split with clickable rows.

### Prose — spelling & canon names

The **Prose** tab checks the words themselves. It runs on demand (never on save)
and reports findings grouped by kind:

| Finding | What it means |
|---------|---------------|
| **Canon near-miss** | A word within two edits of one of your own names — `Mistfal` where the location is `Mistfall`. Usually a misspelling of it. |
| **Canon capitalization** | One of your names written in lowercase — `calloway` where the character is `Calloway`. |
| **Unknown words** | Not in the dictionary. On a fresh project most of these are proper nouns, not typos. |
| **Repeated words** | The same word twice in a row (`and and`). Punctuation-separated repeats ("No, no") are not flagged. |
| **Unbalanced quotes/brackets** | An odd number of `"`, or mismatched `(` `)` / `[` `]` / `“` `”`. |
| **Double spaces** | Two or more spaces mid-line. |
| **Quote style** | A straight quote in a project that otherwise uses curly ones, or vice versa — only when one style is clearly dominant. |
| **Unparsed dictionary lines** | A line in `lore/dictionary.md` that looked like an entry but parsed as nothing. |
| **Dangling lore links** | A `parlance:` link in lore that names nothing — an unknown type, or an id no entity has (renamed or deleted). Code `LORE_LINK`. |

Rows navigate to the entity like every other report row, and unknown words carry
a **+ dictionary** button.

#### Lore is part of the corpus

Every `lore/*.md` file except the dictionary is checked with the same rules
(quote style excepted — lore is authoring text, not player-facing), with link
targets and code masked out. Lore rows read `lore/factions.md:L12` and open the
Lore surface at that line.

**Unlinked lore mentions** are listed below the findings as *notes* (code
`LORE_MENTION`): an entity's name written as plain text in lore. They are
suggestions, not problems — they never count as findings and never fail
`--check`. Open one and the editor offers **Link**.

`LORE_LINK` and `LORE_MENTION` are editorial, like `SPELL`: produced by this pass
only, never by validation, and not part of the published format's rule set.

#### Where the words come from

Three layers, checked in order:

1. **Your project's own names**, derived automatically from character, faction,
   item, location, skill, codex, ending and quest-journal names. Nothing to
   maintain — rename a character and the check follows. This layer is
   case-sensitive, which is what makes the near-miss and capitalization findings
   possible.
2. **`lore/dictionary.md`** — words you add by hand or with the **+ dictionary**
   button. It lives in `lore/` because it is authoring canon that never ships to
   the game.
3. **The English dictionary** bundled with the editor.

One deliberate limitation: a name that is *also* an ordinary English word — a
character called "Hawk", a faction called "The Order" — is not treated as a canon
name, because nothing can tell "the hawk circled" from "the Hawk circled". Those
words are simply spell-checked normally.

#### `lore/dictionary.md`

Plain Markdown, so a writer can edit it without touching JSON:

```markdown
## Locale

- en-US

## Words

- Vashti — the merchant. Not "Vashi".
- gaolhouse

## Style

- grey → gray
- OK -> okay — house style
```

The `## Locale` section sets the language for the check (English only today).
Notes after an em dash are for humans and are ignored.

#### While you type

Prose fields underline findings inline as you write, with a heavier underline for
canon near-misses and capitalization than for ordinary unknown words. The word and
character count below each field also reports the number of prose notes; hover it
to read them.

#### From the command line

```bash
npm run prose                        # report on the project
npm run prose -- --check             # exit non-zero if anything is found (CI)
npm run prose -- --write-dictionary  # seed lore/dictionary.md from the unknown words
```

`--check` runs in CI, so a new typo fails the build.

#### Sorting the first run with AI (optional)

The first run on a large project surfaces a lot of unknown words, most of them
names. **Sort these with AI** groups them into names, jargon, dialect and real
typos so the names can be accepted in one click. It uses the API key configured in
**⚙ AI** (header) and is entirely optional — everything above works offline and free.

The model only *classifies* words that were already found; it never edits your
prose, and typos are never added to the dictionary. Nothing is written until you
accept the result.

### Codex mentions — terms the player could look up

Below the prose findings, **Codex mentions** lists every place a codex entry's
name appears as plain text in dialogue (node and choice lines), quest journal
text (journal title, stage, objective and outcome descriptions) or a location
description, grouped by the entry. It is the glossary report: the terms your
codex explains, and where the player meets them — worth a look when deciding
which entries to unlock early, or which lines could carry a hover definition
in your engine.

Rows open the entity that owns the line. The matching follows the lore
mention rules exactly: whole names on word boundaries, case-insensitive, the
longest name winning, and a single-word name that is also an ordinary English
word (an entry called "Order") is never matched. Codex bodies, entry names and
ending text are not searched — an entry naming itself is not a term to
explain.

Code `CODEX_MENTION`. Like `LORE_MENTION` it is an information *note*, never a
finding: it is not produced by validation, never fails `npm run prose --
--check`, and is not part of the published format's rule set.

### Speakers — lines & words per character

The **Speakers** tab is the casting and budgeting table: one row per resolved
speaker with its **lines**, **words**, the number of **dialogues** it appears
in, and its **voiceable** lines. Rows are sorted most words first; click a
character or skill to open it. **⇩ CSV** downloads the table.

Speakers resolve the way the transcript and the Word/Excel exports resolve
them — a node's own speaker, else the dialogue's default, else *Narration* —
so the table agrees with the line sheet row for row. Two attributions are
worth knowing:

- A **check choice** is a skill-voiced line, so its words count for the
  skill (*Empathy*, *Observation*…), not the player. Plain choices count
  for **Player**.
- **Voiceable** counts spoken node lines only, the same rule the Localization
  panel's VO coverage uses. Choice text is selection UI and is never
  voiceable, so *Player* always shows 0 there and a skill's voiceable count
  covers only the nodes it narrates.

The words column sums to the project word count in the stats bar above.

### Explore — playthrough explorer & route coverage

The **Explore** tab plays the project instead of reading it. Every other check is
static — `REACH` walks the node graph, the `FLOW` "all choices have showIf — may be
stuck" warning reasons about the data — so none of them knows which states a player
can actually reach. Explore does: press **Run** and the editor plays N seeded random
runs, then (with **exhaustive** on) every reachable state, forking at every visible
choice, at *both* outcomes of every active check, at every continuation and cutscene
chain, with a cache of visited states so loops terminate. It starts from every
dialogue's entry, from the project defaults — and, with **from snapshots too**, from
each snapshot in `tests/snapshots`.

When a scene ends, the player is not limited to the continuations the feed offers:
they can walk the location map and open a scene placed there, **again**, with whatever
the story has changed since. Explore follows the runtime's rules for that — an object
or environment interactable plays its dialogue whenever its `showIf` passes (placed
scenes have no one-shot filter; that belongs to offers), an npc interactable resolves
the character's offer with the seen set, so a played non-`replayable` offer does not
come back, and an exit whose gate fails plays its `denialDialogue`. Where the player
may stand starts at the locations tagged `start` (every location, if none is) and
grows through every exit whose gate passes and every cutscene's `arrivesAt`. So a
"look again" line gated on what the first look found, or an arrival scene gated on
evidence gathered elsewhere, is reached — before this was modelled, the demo reported
six such nodes unreached even after a complete search.

The banner above the results is the part to read first. **Complete** means every
reachable state was visited, so "unreached" below means no path exists from any
start. **Bounded** names what stopped the search (states, depth, random-run steps)
and means an unreached node may still be reachable — raise **max states** and run
again. The report never calls a node unreachable when it only ran out of budget. A
random run that hits its step limit does not make a complete search bounded: with
return visits a run never ends by itself, and the exhaustive phase has seen
everything the run could have gone on to see.

A state is counted once however it was reached, and "the same state" means the same
for everything that can decide a move — a flag only an XP-granting quest outcome
reads, the XP itself, or a text variable never changes what a player may do next, so
states differing only there are one. A scene is played once per distinct situation
it can see and re-used for every other state that looks the same to it. That is why
**max states** stays at 5,000 by default: the demo completes in about 3,500, and this
repository's own `data/` in about 1,800.

| List | What it means |
|------|---------------|
| **Dead ends** | States the engine reported a problem in: a node with choices none of which were visible and no `next` (`stuck` — the FLOW warning confirmed, with the exact state), a `goto` or `next` to a missing node, a check whose taken branch has no target. **Load into Play** saves that state as a snapshot and opens the Play panel on it; **Copy state JSON** copies it. |
| **Unreached nodes / choices** | Never shown on any explored path. Click a row to land on the node with the inspector open. |
| **Never ends** | Dialogues entered on some path but never seen ending — meaningful only when the search was complete. |

Two things the explorer does not model, on purpose. Rolls: every check is taken both
ways, so a node behind a check is reachable regardless of luck. Where exactly the
player stands: the map is walked as a set of places the player *may* be in, and a
place once reachable stays so — a door that locked behind the player may leave them
on the far side — so where the map is uncertain Explore assumes the player could be
there, and never calls a node unreachable because it assumed a door was shut. An
`on_enter` scene is treated like any other placed scene: something the player can
open, not something that must play first.

**Route coverage**, below the explorer, replays every route in `tests/routes` and
lists, per dialogue, how many of its nodes some passing route stands on and which
routes they are — and the dialogues no route touches at all. A route that fails to
replay covers nothing and is listed as failing. **Show on map** opens the dialogue
flow map with every covered scene marked, using the same trail the Play panel draws
for a loaded route.

The same two reports run headlessly:

```bash
parlance explore [--runs N] [--seed S] [--exhaustive | --no-exhaustive] [--max-states N] [--max-depth N] [--from-snapshots] [--json]
parlance route --all --coverage
```

`parlance explore` exits 1 when it finds a dead end, so it can gate CI beside
`parlance ci-check`; `--json` prints the whole report. The exhaustive phase is on
by default (`--exhaustive` says so explicitly); `--no-exhaustive` keeps only the
random runs, and `--max-depth` caps how deep one path may go.

### Export — Word screenplay & Excel line sheet

For the people who read the script outside the editor — a VO director, a
proofreader, a producer — dialogues export to two Office formats:

| Format | What you get |
|--------|--------------|
| **.docx** screenplay | A heading per dialogue, then each line as a speaker cue and the text beneath it, with gates, notes and on-enter effects as italic parentheticals and each choice listed as `→ text {if gate} [check] → target`. Paragraph styles (*Character*, *Dialogue*, *Parenthetical*, *Choice*) are named, so the whole script restyles from Word's styles pane. |
| **.xlsx** line sheet | One row per line and per choice. Columns, in order: Dialogue, Title, Node, Choice, Kind (line or choice), Speaker, Text, Condition, Check, Effects, Tags, Next, Notes, Entry, End, **Loc key** and **VO key**. Header frozen, filters on. |

Speakers are resolved to names the way the Play transcript shows them — the
character or skill name, **Narration** for a line with no speaker, **Player**
for a plain choice, and the skill for a check choice. The **Loc key** column is
the same key the Localization catalog uses, and **VO key** is filled on exactly
the lines the Localization panel counts as voiceable, so the sheet lines up
with a VO manifest row for row.

Two places to export from:

- **Canvas toolbar → ⇩ Export .docx / .xlsx** — the dialogue you have open.
  The buttons are there in the **Graph** view only; switch back from **Text**
  to see them.
- **Reports header → ⇩ Export script .docx / .xlsx** — every dialogue in the
  project.

And from the command line, run in the project folder:

```bash
parlance export --format docx --out script.docx                   # every dialogue
parlance export --format xlsx --out lines.xlsx --dialogue dlg_arrival
```

Exit codes: `0` written, `1` unknown dialogue, `2` bad usage or not a project.

#### Custom-type tables

A custom type exports as a table: **⇩ .csv / .json** on its grid toolbar, or

```bash
parlance export --format csv --type drink --out drinks.csv
parlance export --format json --type drink --out drinks.json
```

(exit `1` for a type `types.json` does not declare). The CSV has a header row
(`id`, `name`, the declared fields in the order `types.json` lists them, then any fields rows carry that the
type does not declare), one row per entity in id order. List cells are written
the way the grid shows them, so a column copied from the export pastes back into
the grid. Text that a spreadsheet would run as a formula (starting with `=`, `+`,
`-` or `@`) gets a leading `'`, so opening a file from someone else's project
can't run anything. JSON is the lossless form: the type's declaration and every
row as stored. Unsaved grid edits are not included.

Export is **one-way**. Nothing reads a .docx or .xlsx back into the project;
edits made in Word or Excel have to be carried back by hand (or through a
translation catalog, for text — see [Localization & VO](#15-localization--vo)).

---

## 12. Playtest mode

Playtest mode lets you walk through a dialogue interactively with a live
simulated `GameState`, right inside the canvas view.

### Opening playtest

1. Open any dialogue in the canvas.
2. Click the **▶ Play** button in the canvas toolbar (top-left).

A **Play panel** takes the node inspector's place on the right side, under two
tabs: **▶ Play** (the panel) and **✎ Edit** (the node inspector — see [Editing
while playing](#editing-while-playing-auto-reload)). The active node is
highlighted with a green glow on the canvas; visited nodes are dimmed.

### Starting state editor

Before starting, the panel shows the **Starting State** editor:

- **Skills** — all skill ids referenced in this dialogue's checks or
  `showIf` conditions appear as number inputs. Set them to match your test
  scenario (e.g., `wit = 8`).
- **Flags** — all flag ids referenced in this dialogue appear as checkboxes.
  Defaults come from the project's variable declarations.
- **Reputation** — every faction whose reputation a condition in this scene
  reads gets a number input, starting at the faction's default (the middle of
  its `reputationRange`) and kept inside that range, as the runtime clamps it.
- **Relationships** — every character whose relationship a condition reads gets
  a number input, starting at 0. Relationships have no declared range.
- **Quest stages** — every quest whose stage a condition reads gets a picker
  listing its stages in their `order`, plus **— not started —**. A
  `questOutcome` gate is answered by the outcome's own `reachedWhen`, so
  whatever that condition reads gets an input too.
- **Text variables** — every text variable this dialogue writes with `set_text`
  or mentions as a `{placeholder}` gets a text box, pre-filled from its declared
  default. Type a value to exercise a placeholder without authoring an effect
  first. **Leave a box blank to mean "unset"** — the transcript then renders the
  raw `{placeholder}`, exactly as an unset variable would in-game.
Every group above is scoped to what the scene reads, **and what it can be
routed into**: a dialogue a `set_active_dialogue` effect queues, or one a
played cutscene enters, is followed (transitively), so a gate one scene on can
be set before you press Start. Scenes that are only *discovered* by their offer
are not followed, because nearly any scene could be one. Loading a snapshot
fills these inputs from it; changing one afterwards overrides just that value.

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

You make those edits without leaving Play:

- **Click a node on the canvas** while Play is open and the right-hand column
  switches to its **✎ Edit** tab, showing that node in the full node inspector —
  text, notes, tags, speaker, effects, choices. The node's section comes first,
  above the dialogue-level settings, so the line you came to change is at the top.
- **✎ Edit with nothing selected** opens the line the session is standing on.
  With another node selected, **Edit current line** at the top of the tab jumps
  back to it.
- **Save as usual** — a field saves when you leave it — then click **▶ Play**.
  It is the same session: same step, same history, same state, with the new
  text in place. Switching tabs never ends or restarts it.
- **Delete node** works mid-session too; deleting the node you are standing on
  snaps the session back to the entry with its state intact, as above.

The session also survives a switch to the **Text** view: the Play panel stays
open beside the script, and saving the script re-reads the scene into the
session the same way. (There is no Edit tab in the Text view — the script is
the editor.) Only closing Play (**▶ Play** in the toolbar) or opening another
dialogue ends the session.

While a session has continued into *another* dialogue, the canvas shows that
dialogue's graph and the Edit tab is not offered — the inspector edits the
dialogue you opened. Open the other dialogue to edit its lines.

### Transcript

Once a session is running, the transcript shows each step top to bottom:

- **Node text** — the resolved speaker (character or skill; blank for
  narration) and the dialogue text, with any `{placeholder}` substituted from
  the state **at that step** — so rewinding shows the value the player would
  have seen at the time. Authored JSON always keeps the placeholder;
  substitution is render-only and never written back.
- **Visible choices** — only choices whose `showIf` condition is satisfied by
  the current state, and — for a passive check — whose reveal holds (see
  *Passive checks* below). Click a choice button to advance. A choice whose
  `showIf` fails and whose `whenLocked` is `show` is listed greyed with its
  `lockedText`, and cannot be clicked.
- **Continue →** — shown instead of choices on a node whose `next` field
  points to another node (a choiceless advance, §6). Click it to take the one
  discrete step; a chain of these plays out as a sequence of individual
  clicks, never automatically — every beat stays reachable, rewindable, and
  savable like any other step.
- **Check result** — for active-check choices, the result shows
  `d20=N + skill=N = total vs PASS/FAIL` in green or red. When check modifiers
  applied, each one is its own term, named by its label — or by its condition
  when it has no label: `d20=9 + 3 + 2 (Bribed the guard) − 1 (rep fac_watch < 0)
  = 13 vs ✓ PASS`.
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
- **Discover…** — no explicit route was queued, so this lists the eligible
  offers instead — dialogues whose `offer.when` now matches the current
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

### Passive checks

A passive check never rolls. The game shows its choice only when the player's
skill plus every modifier that applies reaches the difficulty
(`passiveCheckPasses` in the runtime contract), and Play does the same:

- **Revealed** — the choice is offered like any other, tagged
  `[skill / DC · revealed]`.
- **Not revealed** — the choice is hidden, as in the game. If its `whenLocked`
  is `show` (or the project's default is), it is listed greyed instead, with its
  `lockedText`, and cannot be clicked.

Spending a skill point mid-scene (the progression row) re-checks the reveal at
once. To see what a higher skill would reveal without changing it, tick
**Show what a higher skill would reveal** under the choices. It lists the
hidden passive choices greyed, with how much more skill each needs. It is
Play-only and off by default, and those choices can never be clicked.

If the reveal leaves a node with nothing to click, Play says so. When the node
has a fallback choice it is still not offered: the runtime counts the hidden
passive choice as visible, and a fallback is only offered when nothing else is.
The notice names the fallback so you can see why.

In the **Log**, a passive choice reads `(passive reveal)`. A replayed route can
still walk a passive choice its state would not reveal, and the log marks that
one `(passive — not revealed at this skill)`.

### Toolbar controls (while session is running)

| Button | Action |
|--------|--------|
| `seed:XXXXXXXX` | Displays the current session seed (read-only) |
| **↺ Restart** | Resets to step 0, same seed and starting state |
| **⟳ Reroll** | Appears after a check step. Rewinds one step and re-runs the same choice with seed+1. Use this to flip a pass to a fail (or vice versa) without manually changing skills. |
| **✕ Stop** | Closes the play panel and returns to edit mode |

### State inspector

At the bottom of the play panel, a live **State** table shows the current
values of all flags, reputation, relationships and skills referenced in the
dialogue, then every **counter**, the **inventory** (held items by name, or
*(empty)*) and quest stages. Values that changed on the most recent transition
are highlighted in purple.

### Determinism guarantee

The session uses a **seeded RNG** (`mulberry32(seed + stepIndex)`). A session
is fully reproducible: given the same seed and starting state, every choice
leads to the same rolls and the same outcomes. Rewind + replay gives identical
results. The seed only changes when you click **⟳ Reroll** (seed+1) or
**🎲 Randomize** before a new session.

### Snapshots, recorded routes, and imported saves

A play session is throwaway by default. Three buttons make one permanent:

| Button | What it writes |
|--------|----------------|
| **💾 Snapshot** | `tests/snapshots/<id>.json` — the current game state as a named, reusable starting point |
| **⦿ Save route** | `tests/routes/<id>.json` — the steps you just walked, plus the assertions you tick, as a regression test |
| **⤓ Import save file…** | `tests/snapshots/snap_<file name>.json` — a save file written by the *game*, turned into a snapshot |

The id for a snapshot or route is the name you type, lowercased with spaces
and punctuation turned into `_`: "Bragg two scenes" is saved as
`tests/routes/bragg_two_scenes.json`. No `rt_` or `snap_` prefix is added —
only a name that doesn't start with a letter gets one (`2nd visit` →
`rt_2nd_visit`), and a name already taken gets `_2`, `_3`. If you want the
prefixes as a convention, type them into the name. (Find a path here and
Explore's **Load into Play** do prefix their files: `snap_witness_…`,
`rt_witness_…`, `snap_deadend_…`.)

**Load saved state (snapshot)** at the top of the Starting State editor picks a
snapshot to start from; the state inputs below hydrate from it, so you can load a
baseline and then tweak one flag.

A snapshot also remembers **which dialogues had already been seen** when it was
taken. That matters more than it sounds: a dialogue that is not `replayable`
stops being offered once it has been played, so a baseline that forgot its own
history would offer you — and any route starting from it — content the player at
that point could never see again. Saving a snapshot mid-session records the
session's seen set; loading one restores it.

**Importing a save** is the way a bug found in the actual game becomes something
the editor can open. Point it at a save file the game wrote and you get a
snapshot you can start playing from immediately, carrying the state and the seen
set.

The import is refused if the save names content this project does not have — an
unregistered flag, an unknown item, a dialogue from another build. That is not
fussiness: a snapshot referring to something undeclared is a validation *error*,
so importing it would hand you a red project and a fixture that fails CI. If the
save came from a newer build, import it from the branch that has the content it
refers to.

The same import is available from the command line, which is what a build box or
a bug-report triage script wants:

```bash
parlance save import path/to/slot1.json --id snap_bug_41 --name "Bug 41 repro"
parlance route rt_bug_41
```

On a build box without the desktop app, `parlance` is the published CLI —
`npx @orbitope/parlance-cli save import …` (or `… route …`) runs the same verbs.

A route that was fast-forwarded with **Start at** cannot be saved: a route always
replays from the dialogue's entry node, so it would fail on its first step. The
**⦿ Save route** button is disabled for such a session and its tooltip says why —
restart from *Entry* to record one.

### Replaying a saved route

**Replay a saved route**, in the Starting State editor under the snapshot picker,
lists the routes that start in this dialogue. Loading one starts the session from
exactly the state the headless runner uses — the route's snapshot, its start-state
overrides and its seed — and shows the route's steps with a cursor:

| Control | What it does |
|---------|--------------|
| **Step** | Applies the next step: a choice (forced if the route forced it), a continuation into the next scene, a cutscene, or a run of *Continue* hops |
| **Play all** | Steps until the route ends, then checks its end assertions |
| **Show on map** | Opens the dialogue flow map with the route's scenes highlighted in order |
| **Stop replay** | Leaves replay mode; the session stays, as an ordinary one |

The canvas follows the replay exactly as it follows a live session, including into
other dialogues.

When an edit has broken the route, the replay **stops at the first step that no
longer holds** and says why — *Step 2: choice 'ch_press_check' not found in dialogue
…*, or *End: …* when every step ran but an assertion no longer holds. Nothing else
happens: the session is left live where it broke, so you can play on by hand from
there. Then:

- **Update route** rewrites the route with the steps you actually played, keeping
  its id, description and start. If the file changed on disk since you loaded it
  the update is refused, and nothing is saved — load the route again, or:
- **Save as new** writes a new route with the same start.

Editing the dialogue *during* a replay pauses it, since the remaining steps were
recorded against the old version. **Resume** re-checks them against your edit,
from where the replay stopped.

The replay and `parlance route` are the same engine, so a route that passes here
passes in CI, and `parlance route` reports a failure as `FAIL at step N: …` with
the same step number.

On the dialogue flow map, a route's scenes carry a *route N* badge (a scene
the route visits twice shows both positions). A jump between two scenes that the
map has no edge for — a scene reached because its offer became available, which
no effect names — is drawn as a dotted *discovered* edge. **Clear route** in the
map's toolbar removes the trail.

### Find a path here — the witness solver

Select a node and the inspector offers **Find a path here**. The editor searches the
same state graph the Explore report walks — return visits included — breadth-first, so
the first path found is a shortest one, for a way from the project's start to that
node, and shows the moves: choices (with the check outcome they force), continuations
into other scenes, cutscenes, Continue runs. Tick **from this dialogue's entry only** to
search from the current scene rather than from every dialogue. **max states** is the
search budget, the same one Explore uses and with the same default; when the budget is
what stopped a search, the result offers **Search again with** a larger one (up to the
editor's ceiling of 20,000; the command line takes more).

A found path can be kept three ways:

| Button | What it writes |
|--------|----------------|
| **Save as snapshot** | `tests/snapshots/snap_witness_<node>.json` — the state *on arrival* at the node, after its `onEnter` effects, with the seen set |
| **Save as route** | `tests/routes/rt_witness_<node>.json` — a route that replays from the project defaults (recorded as its `startState`) to the node; only offered when the walker has verified it ends there. If the path walks back to a scene a place opens — something no route step can say — the route starts *in* that scene instead, from `tests/snapshots/snap_witness_<node>_start.json`, the exact state the player opened it with; the panel says so, and saving the route saves that snapshot too |
| **Load into Play** | saves the snapshot and opens the Play panel loaded on it, so playing a late branch no longer means playing to it by hand |

"No path found" with *the search was complete* means no start reaches the node under
the engine's rules; with *bounded* it means the budget ran out first. From the command
line, `parlance witness <dialogueId> <nodeId> [--from <dialogueId>] [--max-states N] [--max-depth N] [--save-snapshot <id>] [--save-route <id>] [--json]`
does the same and exits 1 when nothing is found; `--from` searches from one
dialogue's entry, like the checkbox, and `--max-states` / `--max-depth` are Explore's
budget flags with Explore's meaning. A bounded result names the flag to raise.

### What playtest does NOT change

Playtest is **read-only**. It never writes to any dialogue file or layout
file. You can verify this — the dialogue JSON and `.layout.json` are
byte-identical before and after any play session.

The one thing a session can write is placeholder voice audio, and only when you
ask for it: **Generate** in the voice row saves to the gitignored `tts/` folder,
never to `data/` (see [Placeholder voice (TTS)](#placeholder-voice-tts)).

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
  routes/          *.json — scripted playthroughs with assertions
  snapshots/       *.json — saved states to resume from
schema/            JSON Schemas; editor loads these for validation + forms
lore/              Markdown canon docs (the Lore surface, §5; never shipped)
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

Every save re-validates and broadcasts updated issues to all open editor windows
via WebSocket, so you always see live validation without manually refreshing.

The save itself never waits on validation: the moment your change is on disk the
editor is ready for the next edit, and the problems panel catches up a moment
later. Validation is **incremental** — a save re-checks only the entity you
changed and the entities that reference it, not the whole project — and runs on
a background thread, so typing stays responsive no matter how large the project
grows. In practice the panel refreshes within a few tens of milliseconds of a
save; only an unusually large *single* dialogue (many hundreds of nodes) adds a
noticeable lag to that refresh, and even then it is the squiggles catching up,
never the typing.

You don't need to configure any of this. For debugging, a few environment
variables on the host change the behavior: `PARLANCE_VALIDATE_WORKER=0` runs
validation in-process instead of on the worker thread, `PARLANCE_VALIDATE_INCREMENTAL=0`
forces a full re-validation on every save, and `PARLANCE_VALIDATE_CHECK=1`
cross-checks every incremental pass against a full one (on by default in dev
builds).

---

## 15. Localization & VO

The **Localization** entry in the sidebar footer (globe icon) opens the
translation and voice-over pipeline. It's a read-and-export surface: content
stays authored in the base language on the entities themselves, and localized
strings live in catalog files alongside your data.

### What it shows

- **Header** — the total count of player-facing strings and how many are
  **voiceable**: every dialogue node line, narration included. Choice text
  (and a choice's locked text) is selection UI and is never voiceable — the
  same rule as the **Speakers** report (§11).
- **Locales** — one coverage bar per `data/locales/<lang>.json`, showing how
  many keys are translated and current (`done / total`), with any **outdated**
  keys (translated from English that has since been edited), **stale** keys
  (entries whose content was renamed or removed) and **unverified** translations
  called out — see [Outdated translations](#outdated-translations) below.
- **Voice-over** — the same, per `data/vo/<lang>.json`, measured only over
  voiceable strings.
- **Strings** — every extracted string with its stable key and source text;
  filter by kind, and click a row to jump to the owning entity. Voiceable
  lines carry a 🔊 marker.

### The pipeline

1. **Download source catalog** — a flat `key → source text` JSON of everything
   translatable, for translator reference.
2. Enter a language code and **Locale template** — a `key → ""` file (with any
   existing translations for that locale already filled in) to hand off. It
   also records which English each line is to be translated from, and lists the
   lines whose English changed since they were translated under `@outdated`.
3. Translators fill in the blanks, revise the `@outdated` lines (deleting each
   from the list once it's done), and return the file; drop it at
   `data/locales/<lang>.json`. Reload — the coverage bar fills in.
4. **VO template** works the same way for `data/vo/<lang>.json`, mapping
   voiceable keys to opaque audio asset keys (the engine resolves them, exactly like
   cutscene manifest assets). Parlance never touches recorded masters; it can
   generate throwaway placeholder audio on your own provider, kept out of `data/`
   and out of git — see [Placeholder voice (TTS)](#placeholder-voice-tts) below.

### Keys

A string's key mirrors the reference-index path, e.g.
`dialogue/dlg_arrival/nodes/node_open/text` or
`quest/qst_inquest/summary`. Keys are stable as long as the underlying ids are.
Renaming an entity with **Rename id…** (§5) rewrites its keys in every catalog,
so translations follow; changing a node or choice id by hand orphans its
translation, which shows up as a **stale** key on the coverage bar so you know
to remap it.

Translations only arrive as files: the panel reads and exports, and has no
field for typing a translation in. Fill `data/locales/<lang>.json` outside the
editor (or have your translators return it) and drop it in place.

### Outdated translations

Editing an English line after it was translated makes that translation
**outdated**: the key still exists, but the text it was translated from does not.
Each locale file records a short fingerprint of the English each translation was
made from, under an `@sourceHashes` entry at the top of the file:

```json
{
  "@outdated": ["dialogue/dlg_arrival/nodes/node_open/text"],
  "@sourceHashes": {
    "dialogue/dlg_arrival/nodes/node_open/text": "3f0a91c2",
    "dialogue/dlg_arrival/nodes/node_close/text": "c81e7d04"
  },
  "dialogue/dlg_arrival/nodes/node_close/text": "Adieu.",
  "dialogue/dlg_arrival/nodes/node_open/text": "Bonjour, voyageur."
}
```

A line is outdated when its recorded fingerprint no longer matches the current
English, or while it is listed in `@outdated`. The coverage bar counts it apart
from `done` and lists it under **N outdated**; click a row to jump to the line.

- **You don't write the fingerprints.** The locale template records them for
  every line it hands off, so a returned file already says what it was
  translated from.
- **`@outdated` is the translator's to-do list.** The template lists the lines
  whose English changed, keeping the old translation for reference. A line stays
  outdated until it is deleted from the list — returning the file untouched does
  not clear it.
- **Catalogs from before fingerprints are unverified, not outdated.** A
  translation with no recorded fingerprint is counted as translated and shown as
  **N unverified**; nothing is flagged on upgrade.
- **Mark current** (on the coverage bar) records the English as it stands for
  every translation in that language and clears `@outdated`. Use it once to
  adopt an older catalog, or after an English edit that needs no re-translation,
  such as a typo fix. It asks first; it is the one place the editor writes a
  locale file.
- **Rename id…** moves fingerprints with their keys, and renaming a variable,
  which rewrites `{placeholders}` in both languages, keeps a current translation
  current.

Keys starting with `@` are metadata. No string key starts with `@`, so a game
loading the catalog should skip them. VO manifests (`data/vo/`) have no
fingerprints; a recorded take is not flagged when its line changes.

### Placeholder voice (TTS)

Before a line is recorded you can still **hear** it in playtest. The Play panel
shows a voice row under the current line:

| Control | What it does |
|---------|--------------|
| Status pill | **Recorded** (the VO manifest points at an audio file in the project), **Placeholder** (generated audio exists for this exact text), or **None** |
| **▶ Play** | Plays the recorded take if there is one, else the placeholder |
| **🔈 Generate** | Synthesizes a placeholder for the line on your TTS provider. Disabled, with the reason in its tooltip, when no provider is configured |
| Language | `base` (the text on the entity) or any language that has a `data/locales/` or `data/vo/` file. A locale language speaks the translation, falling back to the base text |
| **Auto-play** | Plays each new line as you step: the recorded take, else a cached placeholder, else nothing |
| **auto-generate** | Shown once Auto-play is on, and off by default because it spends your provider credits: also generates a missing placeholder as you step |

The line spoken is exactly the one shown, **including interpolated values**, so a
line that reads differently depending on game state gets one placeholder per
variant.

**Recorded takes.** A `data/vo/<lang>.json` value that is a relative path to a
`.wav`, `.mp3`, `.ogg`, `.m4a` or `.flac` file inside the project plays directly.
Anything else — a `res://` path, an engine asset key, an absolute path, a URL —
is the engine's to resolve, and the row shows no recorded take for it.

**Choosing a provider.** Click **⚙ AI** in the header to open **AI Provider
Settings** (the same dialog as AI drafting) and fill in the **Voice (placeholder TTS)** section:

- **OpenAI-compatible speech API** — anything that serves `POST /audio/speech`:
  OpenAI itself (leave the Base URL blank for `https://api.openai.com/v1`, model
  `tts-1`), or a local server such as Kokoro or openedai-speech (set its Base URL;
  the key can be blank). Voice defaults to `alloy`.
- **Local command** — a speech program on your machine, as one line split on
  spaces and run **without a shell**. The line's text arrives on standard input;
  the audio is read from standard output (`espeak-ng --stdout`), or from the file
  named by the token `{out}` if you use it (`say -o {out} --data-format=LEI16@22050`).
  `{voice}` is replaced by the Voice field.

There is **one voice for the whole project**: the Voice field applies to every
line, whoever speaks it. There is no per-character or per-speaker voice
mapping, so to hear two characters differently, change the voice between
takes (each voice caches its own placeholders).

The key is stored with the AI key — locally, owner-only, never sent to the
client in full. **Clear voice provider** removes it.

**Where the audio goes.** Placeholders are written to `tts/<lang>/` at the project
root, named by a hash of the language, voice, provider and text, with an
`index.json` beside them recording which line each file belongs to. `parlance init`
adds `tts/` to the project's `.gitignore`. Nothing is written to `data/`, no VO
manifest or binding is touched, and **VO coverage never counts a placeholder** —
it only ever reads `data/vo/`. Editing a line changes its hash, so the old
placeholder simply stops matching; stale audio is never played. Deleting `tts/`
at any time is safe.

**Privacy.** Parlance runs no voice service. A line's text leaves your machine only
when you press Generate (or turn on auto-generate), and only to the provider you
configured — a local command never leaves the machine at all.

---

## 16. Review — reading someone else's branch

The **Review** entry in the sidebar footer is where narrative work gets read,
questioned, signed off and published. It needs nothing but git: comments live in
the repository, on the branch they are about, so a two-person team on plain
clones gets working review with no server anywhere.

The panel has three columns: **Reviews waiting for you** on the left, the
branch's **Changes** (or **Play the branch**) in the middle, and **Comments** —
the verdict, the comment composer and the threads — on the right.

### Drafts — how a writer's work reaches Review

Writers don't need to handle branches themselves. **Drafts** (sidebar footer)
does it for them: **New draft** asks *"What are you writing?"* and **Start**
creates a branch for the draft (`writer/<name>/<id>`, cut from the remote's
default branch) and switches the project to it. If you have unsaved changes,
**Start the draft with these changes** carries them onto it. Each draft row
shows its state — *Drafting*, *In review*, *Changes requested*, *Approved —
waiting to be published*, *In the game* — with the actions that apply:

- **Open** switches to that draft, and brings down any comments and verdicts
  reviewers have sent on it. Uncommitted work on the draft you are leaving is
  committed onto that draft's own branch first, never stashed. **Open** is
  offered only for drafts other than the one you are on.
- **Get review notes** is the same pull for the draft you are *in*, once it has
  been sent: it fetches the reviewer's latest comments, suggestions and verdict
  without switching away. It says *"You're up to date"* when there is nothing
  new, and reloads the project when notes arrived. If you have changes you
  haven't sent and the reviewer has added notes since, it refuses and changes
  nothing — **Send** your changes first, which brings the notes in too.
- **Send for review** (later **Send changes** or **Send update**) opens a dialog
  with a **Title** and an optional **Note for the reviewer**, then commits the
  project, pushes the branch and files the review request. The note is stored
  with the request, but the Review panel does not display it at present, so put
  anything the reviewer must read in a comment as well.
- **Clean up** deletes a draft's branch once its work is in the game. It
  refuses a branch that is not fully merged.
- **Discard** deletes a draft that was never sent, after a confirm
  (*"Everything written in it is lost for good."*).

Drafts needs a git remote; without one the panel says why it isn't available.

### Author or reviewer is decided for you

There is no mode to switch. For the branch you are looking at, you are its
**author** if it is the branch you currently have checked out, and a
**reviewer** if it isn't. The badge at the top says which — **AUTHORING** or
**REVIEWING** — and what follows from it. A review opened from **Reviews
waiting for you** is always REVIEWING, even when it is your own draft: the inbox
never checks anything out.

| | AUTHORING (checked out) | REVIEWING (not checked out) |
|---|---|---|
| You are looking at | your working files | a read-only snapshot of the branch |
| Comments | written straight into `review/` | queued locally, sent by **Sync comments** or a verdict |
| Story files | yours to edit | read-only |
| Suggestions | **Apply suggestion** | propose only |
| Verdict and publish | — (you don't sign off your own work) | **Approve & publish…**, **Approve only**, **Request changes** |

Reviewers never check the branch out, so their own working copy stays clean and
on whatever they were doing. **Check out to edit** (shown in REVIEWING mode on a
branch picked under *Advanced*) switches you to the branch when you want to
become its author; it refuses if you have uncommitted changes rather than
stashing them behind your back.

### Reading the changes

**Reviews waiting for you** is the front door. It lists open review requests by
title, author and age, grouped by what needs doing: **Waiting for you** (not yet
reviewed), **Ready to publish** (approved), **Waiting on the writer** (changes
requested) and **Published recently**. **Refresh** fetches the latest. Click a
row and the **Changes** tab loads that draft's narrative diff by itself — not a
file diff. It reports what happened to the *story*: "2 nodes added, 1 line
edited, offer changed", each entity's before/after lines, flags introduced or
retired, and the validation delta.

To compare any two branches by name instead, open **Advanced: compare any two
branches**: pick a **Base** and **Head**, press **Show changes**, and **Fetch**
to pull the latest branch list from the remote. Both pickers are searchable:
type any part of a name — several words, in any order. Local branches are listed
before remote ones, and the branch you have checked out is marked, since `main`
and `origin/main` are otherwise the same word and picking the wrong one silently
swaps AUTHORING for REVIEWING. Under the pickers, **Reviews on this branch**
lists the review requests on the Head branch (**Archive** shows merged and
abandoned ones), and **New** opens a review of it.

Each changed entity carries a button to open it. As the **author** that is
**Open**, which draws the dialogue on the canvas with this branch's changes
marked. As a **reviewer** the canvas can't help — it draws your checked-out
working tree, which is a different branch — so the button is **Play**, and it
takes you to the scene read-only in the tab beside it. Entity types with no
read-only viewer yet (characters, quests, …) show the button disabled.

### Playing the branch

**Play the branch** runs the branch's own content — the snapshot read from git,
not your files. This is the point of reviewer mode: you hear the scene as it
actually plays before saying anything about it. Everything from Playtest mode
(§12) works here, including the seed, rewind, and forced check outcomes.

The **Scene** picker offers every dialogue on the branch, searchable by title
or id. Once the branch's changes are loaded, the ones this branch touched are
grouped first and annotated with what happened to them ("1 line edited") — the
annotation is searchable too, so typing *line edited* narrows the list to just
those scenes.

The rest of the project stays in the list on purpose. A branch that edits a
quest, a flag, or a dialogue's offer changes how a scene *behaves* without
touching that scene's own file, so the dialogues worth playing are often ones
that show up as unchanged — and reading an edit in context usually means
playing the scenes on either side of it.

When the scene you are playing is one the branch changed, its before/after
lines sit above the transcript, so you can watch it play and see what moved
without switching back to **Changes**.

Expand **Log** under the transcript and each line grows a 💬. Clicking it opens
a comment already anchored to the node or choice you just heard, so the thread
lands on a spot in the story rather than on a line number.

### Comments, suggestions, verdicts

Comments hang on an **anchor** — a node, a choice, a field — or on the review
itself for notes that belong to no single line. Anchors use the same keys as
localization, so renaming a node doesn't silently orphan the discussion: the
thread is flagged **stale anchor** and listed under *Unanchored*, and Reports
carries the same warning.

On a text anchor you can attach a **Suggested replacement**. That is the
reviewer's edit: they propose the words, and the author applies them. Reviewers
cannot change story files directly — the branch isn't on their disk, and keeping
content edits to one writer is what keeps review data conflict-free.

**Applying a suggestion** needs AUTHORING mode, which the inbox never gives you.
As the writer: have the draft open (Drafts → **Open**), then in Review open
**Advanced: compare any two branches**, set **Head** to that branch (the one
marked as checked out), and pick the review under **Reviews on this branch**.
Each thread with a suggestion now shows **Apply suggestion**, which writes the
suggested text into the story file. This reads the review from your own copy
of the branch, so it shows only comments that have reached your disk: opening
the draft from **Drafts** brings them down, but there is no button that does so
for the draft you already have open — pull the branch with git (or open another
draft and come back) to see comments sent since.

A verdict records a sign-off against *the commit you read*. The buttons depend
on where the review stands:

- **Not yet approved** — **Approve & publish…**, **Approve only**, **Request
  changes**.
- **Approved** — **Publish…** and **Request changes**.
- **Approved, but the branch moved since** — the bar says *"The draft changed
  since it was approved."* and offers **Approve again & publish…**. (The same
  wording currently appears when the earlier verdict was **Request changes**
  and the writer has since sent an update.)

A reviewer's verdict is sent right away (it syncs like **Sync comments**); if
that fails, it stays queued and the panel says so. If the author pushes more
work afterwards, the review says so — *"The branch has moved since this
verdict"* — rather than showing a stale tick over unread lines. Nothing
enforces a verdict beyond the publish rule below; with no server there is
nothing that could. It is a note between colleagues, and a record of who read
what.

### Comments on lore paragraphs

Lore can be reviewed too. With a review open (pick it in **Review**), go to
**Lore**, open the file, and switch to **Preview**: every paragraph carries a
**💬 Comment** button (a heading and a fenced code block each count as one
paragraph). Clicking it takes you back to Review with the composer already
anchored — "on lore/the-order.md ¶3" — and, like a text field, the comment can
carry a **suggested replacement** for the whole paragraph. Save the file first;
a comment anchors to the saved text, so the button waits while the buffer is
unsaved. Paragraphs that have threads show a count badge, and each lore thread
in Review has **Open ¶n**, which lands on that paragraph in the preview.

Markdown has no ids, so the anchor is the paragraph's position *plus the words
you commented on*. When the file changes, the editor compares the two and says
what happened rather than guessing:

- **resolved** — the paragraph still reads as it did.
- **moved to ¶n** — someone inserted or removed paragraphs above it; the same
  words are further down. The thread is not moved for you: **Re-anchor to ¶n**
  does that, in one click.
- **stale** — the paragraph was rewritten or deleted. The thread goes under
  *Unanchored*; **Keep on ¶n** pins it to the paragraph as it now reads, if
  the comment still applies.
- **orphaned** — the lore file itself is gone.

All three are warnings in Reports, never errors. A suggestion is applied only
to a paragraph that resolves — on a moved one, re-anchor first, so the new
words never land on whichever paragraph slid into the old slot. Applying goes
through the same guarded write as saving the file, so it is refused, not
merged, if the file changed on disk in the meantime.

One caveat for **reviewers**: the Lore surface edits *your* checked-out files,
while a thread is judged against the lore on the branch under review. When the
two differ, a fresh comment can show as moved or stale straight away — the
same reason the canvas can't show a branch you haven't checked out.

Lore files named outside the new-file rule (lowercase letters, digits, `-` and
`_`) cannot take paragraph comments; the preview says so. The **Changes** tab
lists what the branch did to lore, paragraph by paragraph, below the entity
changes — old words beside new — with **Open** to jump to the file.

### Syncing, and merging

As a reviewer your comments sit in a local queue (inside `.git/`, so they can
never be committed by accident) and the review shows how many are **unsynced**.
**Sync comments** fetches, merges your notes into whatever is already on the
branch, commits, and pushes — your working tree is never touched. A verdict
syncs the same way on its own. Concurrent reviewers don't conflict: comment
threads are separate files, and same-thread replies merge by union.

**Publishing** is how an approved draft goes into the game: **Approve &
publish…** (approve and publish in one step), or **Publish…** once it is
approved. Both ask first — *"Publish “…” into the game? The app can’t undo
this."* — and publishing is refused unless the review is approved.

Publishing works from whatever branch you are on, with uncommitted changes in
your working copy: it never checks anything out and never touches your files.
It merges the draft into the base branch **on the remote** and pushes. Your own
local copy of the base branch is not moved; pull it when you want the published
work on your disk. It merges cleanly or not at all — on any conflict nothing is
written anywhere and the panel names the overlapping files, so the two can be
combined in git by someone who chose to. It needs a git name and email set, and
git 2.38 or newer. A published branch carries its review files into the base
branch; that is the archive, which is why reviews are never deleted.

### What this deliberately isn't

Parlance is not a git client. The only branches it creates are writers'
drafts (above), and it deletes one only after merging, once git confirms the
work is in. Beyond that it has no conflict resolution, no history editing, and
no GitHub pull-request sync. Conflicts and history stay in the tools built for
them.

---

## 17. Getting help & sending feedback

**Help ▸ Send Feedback** opens the feedback page in your browser. That page is
the whole process: bug reports and feature requests go to public GitHub issues,
and anything you can't say in public — security, licensing, or a bug you could
only demonstrate with unreleased story content — goes to
`orbitopegames@gmail.com` instead.

Parlance has no telemetry and no crash reporter. Nothing about your session,
your project, or your machine is ever sent anywhere. The trade is that a bug you
don't report is a bug nobody knows about, so please report them.

The two things that make a report actionable are the **version** (*Parlance ▸
About Parlance*) and whether the problem **reproduces on the bundled demo
project** — a demo repro is one anyone can run, and one you can paste in full
without revealing anything about your own game.

---

## 18. Bringing in a story from another tool

If your story is already written in **Yarn Spinner**, **Ink**, **Twine**
(Harlowe or SugarCube), **ChoiceScript**, **Arcweave** or **Ren'Py**, you do not
have to retype it. Seven importers convert a story into a Parlance project, and
they are published — with their source, their gate, and five worked migrations of
real stories (ChoiceScript and Arcweave have test fixtures only) — at
[github.com/orbitope/parlance-spec](https://github.com/orbitope/parlance-spec)
under `importers/`.

They are not part of the editor. Nothing is installed with Parlance and nothing
runs unless you run it; they are optional Claude Code skills you copy into a
project, MIT-licensed and meant to be forked when your story uses a dialect they
do not.

### What they promise, and what they do not

**They convert. They never rewrite.** Every player-facing string in the output
came from your file byte for byte, and that is enforced rather than intended: a
content check compares the result against the source and refuses to finish if a
line went missing, and stops outright — permanently — if a line appears that you
did not write. Nothing fills in a `summary`, invents a variable, or rephrases a
line that did not quite fit.

**What the format cannot carry is declared, never quietly dropped.** Each import
ends with a report that leads with what was lost, names the construct and the
source line, and says which losses you could fix by moving a line and which are
real gaps.

### Read the last number in the report

An import can preserve every word of your story and still hand you something a
player cannot walk through. That is not a contradiction: the content check proves
no prose was lost, and it is blind to whether the story still hangs together. A
single condition the format cannot express, sitting on a link everyone passes
through, cuts off everything behind it.

So every report states **how many nodes a player can actually reach**, and that
is the number to look at first. Of the five worked migrations, the Yarn one
reaches 87% of its story, the Ink one 74% and the Harlowe one 48%, while the
smaller Ren'Py and SugarCube stories reach all of theirs — every one of them
having preserved every line.

### Before you start

The importers' own [fit guide](https://github.com/orbitope/parlance-spec)
(`importers/IMPORTERS.md`) answers whether your story will survive the trip, and
it turns on one question: **how does your story move forward?**

- The player picks from options you wrote — it will carry well.
- The engine works out where to go — a call that returns, a jump chosen by a
  condition, a gate on how many times something has been seen — it will not.
  Parlance is a data format, and nothing in it decides where the story goes at
  play time except the player choosing or a check you authored.

Then read a worked migration under `importers/examples/`. Each one holds the
author's original file beside the imported project, so you can run the check
yourself and see what the honest result of a real conversion looks like before
committing your own story to one.
