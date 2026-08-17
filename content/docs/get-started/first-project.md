---
title: Your first project
description: Run the Parlance editor, scaffold a project, tour the layout, and create your first character and dialogue — with live validation reacting as you type.
---

# Your first project

**Goal:** a running editor, a scaffolded project, one character, one dialogue —
and a feel for where everything lives. ~10 minutes.

## 1. Open a project

Launch Parlance and point it at a project folder — most often the directory of
the game repository your story belongs to. ([Install & run](/docs/install/)
covers getting the app and what it writes where.)

To start from nothing, scaffold the
[standard layout](/docs/reference/config/#project-layout) first:

```bash
parlance init my-story
```

That creates the `data/` subdirectories for each entity type, ready to open.
(It refuses to scaffold into a directory that doesn't look intentional, so you
can't accidentally seed your Downloads folder.)

## 2. Learn the four regions

The editor is one screen with four fixed regions:

1. **Type sidebar** (far left) — one row per entity type with a live count.
   **Reports** is pinned to its footer.
2. **Entity list** — search, group, and a **+ New** button for the selected type.
3. **Main panel** — a form for most entities; a *canvas* for dialogues and
   quests; the location map or Reports when no entity is selected.
4. **Validation bar** (bottom) — live error/warning counts, collapsed to a
   status row until you click it.

Press <kbd>Cmd/Ctrl+K</kbd> now — the **command palette** fuzzy-matches every
entity and action in the project and is the fastest way anywhere. Make it a
habit on day one.

## 3. Create a character

1. Select **Characters** in the sidebar, click **+ New**.
2. Give it an id — `npc_gatekeeper` — and a name. Enter. The file
   `data/characters/npc_gatekeeper.json` now exists on disk; check your git
   status if you want proof.
3. The form you're looking at is
   [generated from the character schema](/docs/concepts/schema-first/) —
   every field validated, references offered as dropdowns.

Notice the validation bar: the project now has a `COVERAGE` warning —
*character has no dialogue*. The validator noticed before you did; it's that
kind of colleague. Leave it for a moment.

## 4. Create a dialogue

1. **Dialogues** → **+ New** → id `dlg_gate_first`.
2. The main panel is now the **dialogue canvas**. Click the entry node and
   write a line in the inspector's **Text** field — notice it's a serif prose
   field with a live word count: narrative text is
   [typographically first-class](/docs/editor-guide/#node-inspector-right-panel).
3. Set the dialogue's **Default speaker** to `npc_gatekeeper`.
4. In the character's **Dialogue Ladder** field, add a rung pointing at
   `dlg_gate_first`. The `COVERAGE` warning clears — your character can now
   actually speak.

## 5. Watch validation work for you

Delete the dialogue (toolbar → **Delete dialogue**, confirm) and watch the
validation bar: the ladder rung you just authored is now a dangling reference —
a red `REF` error naming the exact spot. Click the issue row: it navigates
straight to the character. Undo the deletion with <kbd>Cmd/Ctrl+Z</kbd>; the
error clears. That save-validate-navigate loop is
[the core of how Parlance feels](/docs/concepts/validation/) — nothing broken
gets to hide.

## 6. Open something real

An empty project teaches layout; a real one teaches craft. Open
**The Mistfall Inn** — the demo project that ships with Parlance, and the
[playable demo](/demo/) on this site — and poke around: three characters with
[ladders](/docs/concepts/dialogue-laddering/), a quest with three outcomes,
route fixtures, zero validation issues under `--strict`.

## Where next

- [Branching dialogue](/docs/get-started/branching-dialogue/) — the canvas in
  earnest: choices, checks, script view.
- [Shortcuts & small features](/docs/reference/shortcuts/) — five minutes that
  pay for themselves daily.
- [How it all fits together](/docs/concepts/workflow/) — the loop you just
  entered, end to end.
