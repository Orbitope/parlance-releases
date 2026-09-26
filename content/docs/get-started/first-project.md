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

To start from nothing, use **File ▸ New Project…** and pick **Blank**, or
scaffold the [standard layout](/docs/reference/config/#project-layout) from the
command line:

```bash
parlance init my-story
```

Either way you get a `data/` folder with a subdirectory or registry file for
each entity type, ready to open. (Parlance never scaffolds a folder you
*open*: one without a `data/` directory, a `parlance.config.json` or a
`schema/` directory is refused as not a project, so you can't accidentally
seed your Downloads folder.)

## 2. Learn the four regions

The editor is one screen with four fixed regions:

1. **Type sidebar** (far left) — one row per entity type with a live count.
   **Reports** is pinned to its footer.
2. **Entity list** — search, group, and a **+ New** button for the selected type.
3. **Main panel** — a form for most entities; a *canvas* for dialogues and
   quests; an overview when no entity is selected (the scene flow for
   Dialogues, the dependency graph for Quests, the map for Locations), and
   Reports from the sidebar footer.
4. **Validation bar** (bottom) — live error/warning counts, collapsed to a
   status row until you click it.

Press <kbd>Cmd/Ctrl+K</kbd> now — the **command palette** fuzzy-matches every
entity and action in the project and is the fastest way anywhere. Make it a
habit on day one.

## 3. Create a character

1. Select **Characters** in the sidebar, click **+ New**.
2. The box takes just an id: type `npc_gatekeeper` and press Enter (or
   **Create**). The file `data/characters/npc_gatekeeper.json` now exists on
   disk; check your git status if you want proof.
3. The form you're looking at is
   [generated from the character schema](/docs/concepts/schema-first/) —
   every field validated, references offered as dropdowns. The new character
   is called *New Character*: set **Name** to *Gatekeeper* and click **Save**
   (the form holds your edits until you do).

Notice the validation bar: the project now has a `COVERAGE` warning —
*character has no dialogue*. The validator noticed before you did; it's that
kind of colleague. Leave it for a moment.

## 4. Create a dialogue

1. **Dialogues** → **+ New** → id `dlg_gate_first`.
2. The main panel is now the **dialogue canvas**, with one entry node,
   `node_start`. Click it and replace the placeholder in the inspector's
   **Text** field with *"The gatekeeper looks you over."* — notice it's a
   serif prose field with a live word count: narrative text is
   [typographically first-class](/docs/editor-guide/#node-inspector-right-panel).
3. At the top of the inspector, in its **Dialogue** section, set
   **Default speaker** to the Gatekeeper. The gatekeeper now speaks a
   dialogue, so the `COVERAGE` warning clears — and an `OFFER` warning takes
   its place: *1 speaker dialogue(s) are offered by nothing and have no world
   placement — unreachable*. Speaking a scene doesn't make it playable; the
   game also has to know when to start it.
4. In the same section, click **+ Offer this dialogue**. Leave **offered when**
   empty — it reads *always (the fallback)*. The gatekeeper now presents this
   scene whenever the player approaches, and the `OFFER` warning clears.

## 5. Watch validation work for you

Delete the dialogue (toolbar → **Delete dialogue** → **Confirm delete**) and
watch the validation bar: the character's only dialogue went with it, so
`npc_gatekeeper` has nothing to say — a `COVERAGE` warning naming the exact
character. Click the issue
row: it navigates straight to them. Undo the deletion with <kbd>Cmd/Ctrl+Z</kbd>;
the warning clears. That save-validate-navigate loop is
[the core of how Parlance feels](/docs/concepts/validation/) — nothing broken
gets to hide.

## 6. Open something real

An empty project teaches layout; a real one teaches craft. Open
**The Mistfall Inn** — the demo mystery behind the [playable demo](/demo/) on
this site — and poke around. (Its project files aren't bundled with the app;
[Install & run](/docs/install/) says where to get a copy.) Three characters with
[offers](/docs/concepts/dialogue-laddering/), a quest with three outcomes,
route fixtures, zero validation issues under `--strict`.

## Where next

- [Branching dialogue](/docs/get-started/branching-dialogue/) — the canvas in
  earnest: choices, checks, script view.
- [Shortcuts & small features](/docs/reference/shortcuts/) — five minutes that
  pay for themselves daily.
- [How it all fits together](/docs/concepts/workflow/) — the loop you just
  entered, end to end.
