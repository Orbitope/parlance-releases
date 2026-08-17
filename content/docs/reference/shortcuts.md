---
title: Shortcuts & small features
description: The one-screen cheat sheet — every Parlance keyboard shortcut and the small affordances that are easy to miss: command palette, density toggles, panel tricks, inline flag creation.
---

# Shortcuts & small features

The editor's small affordances save the most time and are the easiest to never
discover. This page is the reminder; the [editor guide](/docs/editor-guide/)
is the explanation.

## Keyboard

| Keys | Does |
|---|---|
| <kbd>Cmd/Ctrl+K</kbd> | **Command palette** — fuzzy-jump to any entity (by name, id, or title) or run an action (`Create new <Type>`, `Open Reports`). Works even while a text field is focused. <kbd>↑</kbd>/<kbd>↓</kbd> move, <kbd>Enter</kbd> opens, <kbd>Esc</kbd> closes |
| <kbd>Cmd/Ctrl+Z</kbd> | Undo last save (up to 100 per session; in-memory, clears on reload) |
| <kbd>Shift+Cmd/Ctrl+Z</kbd> / <kbd>Ctrl+Y</kbd> | Redo |
| <kbd>Alt+←</kbd> / <kbd>Alt+→</kbd> | Navigation history — back/forward through *what you were viewing*, like a browser |
| <kbd>Cmd/Ctrl+[</kbd> / <kbd>Cmd/Ctrl+]</kbd> | Same, in the Xcode / VS Code "Go Back" convention |
| <kbd>Delete</kbd> (edge selected) | Remove a canvas connection |
| <kbd>←</kbd>/<kbd>→</kbd> on a panel divider | Resize the focused side panel (<kbd>Shift</kbd> = bigger steps, <kbd>Home</kbd> = reset) |
| <kbd>Enter</kbd> in the + New sheet | Create the entity |

Two histories, worth keeping straight: **undo/redo** replays *saves* (your
data); **back/forward** replays *selection* (your view). Canvas node drags are
in neither — layout writes straight to a gitignored sidecar.

## Canvas

| Affordance | Where / what |
|---|---|
| **Graph · Text toggle** | Edit the same scene as a node graph or as an editable script — lossless round-trip either way |
| **Node density** — `Compact · Card · Script` | One-line skeleton view ↔ ~4-line cards ↔ full untruncated script with speaker badges. Remembered across sessions |
| **Auto layout** | Re-run the left-to-right dagre arrangement; your hand-placed nodes otherwise keep their positions |
| **Map** | Toggle the minimap per canvas (dialogue, quest, dependency graph, location map are remembered separately) |
| **Continue handle** | A node with no choices grows a single handle — drag it to set `next`, the choiceless advance |
| **Two-dot check handles** | Active-check choices have green (success) and red (failure) source handles — one drag each |
| **Set as Start** | Any node can become the dialogue's entry point (inspector) |
| **Pacing panel** | Click empty canvas: scene size, branch shape, dead ends, longest path, check/gate density |
| **⇪ Share build** | Export the scene as one self-contained playable HTML file |

## Forms & lists

| Affordance | Where / what |
|---|---|
| **＋ New flag "…" inline** | In any flag/counter/item picker, type a name that doesn't exist and create it in place — no trip to Variables |
| **JSON / Edit toggle** | Raw syntax-colored JSON view of any entity, with its validation issues listed below; your default view choice persists |
| **Lore button** | Entities with a `loreRef` get an inline Markdown viewer of the canon doc |
| **Flow panel** | On a variable or item: every writer and reader of it, each row clickable |
| **Group by** (characters) | Group the list by faction, archetype, or has-dialogue |
| **Status badges** | Character rows show `has dialogue` / `no dialogue` at a glance |
| **Breadcrumb** | `Type › entityId` in the header — click the type to jump to its list |
| **Probability bar** | On active checks: P(success) previewed at any stat value |
| **Word / character counts** | Live, on every prose field |

## Play panel

| Affordance | What |
|---|---|
| **Start at** | Begin a session at any node — fast-forward past ten choices |
| **↩ rewind here** | On any past transcript step |
| **⟳ Reroll** | Re-run the last check with seed+1 — flip a pass to a fail |
| **force ✓ / ✗** | Take either check branch regardless of dice |
| **🎲** | Randomize the seed before a session |
| **Blank text-variable box** | Means *unset* — the transcript shows the raw `{placeholder}`, exactly as in-game |

## Layout & chrome

| Affordance | What |
|---|---|
| **« / »** | Collapse the whole entity panel (sidebar + list) to a 32px rail — maximum canvas |
| **Drag / double-click panel edges** | Resize the inspector and Play panel; double-click resets |
| **Text Size 90–150%** | Scales all text (not layout) — next to Undo/Redo |
| **Validation ▸** | The bar stays collapsed to a live status row until clicked; chips filter by check code |
| **Reports** (sidebar footer) | Total issue count, red for errors, yellow for warnings |

All of these view choices persist locally and are never written to the project
— the [full list of what persists where](/docs/reference/config/#view-preferences)
is in the configuration reference.
