---
title: Branching dialogue
description: Build a branching scene on the dialogue canvas — choices, a skill check with success and failure routes, choiceless beats, and the text script view.
---

# Branching dialogue

**Goal:** a scene with a real branch — a skill check whose failure still moves
the story — plus the canvas skills you'll use every day. ~15 minutes.
Prereq: [your first project](/docs/get-started/first-project/).

## 1. Lay down the beats

Open your dialogue and click **+ Node** three times. You get blank nodes to the
right of the graph. Click each and fill its **Text** in the inspector:

- `node_open` (your entry node) — *"The gatekeeper looks you over."*
- `node_pass` — *"'Go on through, then.'"*
- `node_fail` — *"'Papers. Real ones. Come back with them.'"*

Drag nodes by their headers to arrange them; positions save automatically to a
gitignored sidecar, so your layout never pollutes
[the content diff](/docs/concepts/git-native/). **Auto layout** reflows
everything left-to-right whenever things get messy.

## 2. Add a choice

Select `node_open` and add a choice: *"Talk your way past."* Every choice has a
small **source handle** dot on its right edge — drag from it to the left edge
of a target node to wire a `goto`. That's the whole connection model.

## 3. Turn it into a check

Expand the choice and add a **Check**:

- kind: **active** — rolls `d20 + skill ≥ difficulty` at runtime
- skill: `rhetoric`, difficulty: `12`

The choice now shows **two** handles — green (success) and red (failure). Drag
green → `node_pass`, red → `node_fail`. On the canvas the choice wears a
generated `rhetoric / 12` badge — don't type `[Rhetoric]` into the choice text;
badges derive from the data and the prose stays clean.

The inspector's **probability bar** previews P(success) at any stat value —
difficulty tuning without spreadsheets.

> **Failure is content.** `node_fail` isn't a dead end — give it its own
> choices (bribe? climb the wall?). The demo's body-examination scene is the
> pattern done well: failing the check costs a detail, never the plot.

## 4. Add a choiceless beat

Add a node `node_bell` — *"Somewhere beyond the gate, a bell counts four."* —
and note it has a single **continue** handle (it has no choices). Drag it to
`node_pass`: that's a **`next`** — a listen-only narration beat the player
advances with one **Continue →** click. A node can have choices *or* `next`
*or* be an end, never two of the three; the inspector disables what doesn't
apply.

Mark the final nodes **Is End** so the conversation can actually finish — an
unmarked dead-end node is a `FLOW` warning, and the **Pacing** panel (click
empty canvas) counts your dead ends alongside scene size, branch shape, and
check density.

## 5. Meet the script view

Flip the toolbar's **Graph · Text** toggle. Your scene, as editable text:

```
== node_open [entry] ==
The gatekeeper looks you over.
- c_talk: "Talk your way past." check rhetoric >= 12 -> node_pass / node_fail
```

The script is a **lossless** representation — saving reproduces the JSON
byte-for-byte except what you edited, and a syntax error blocks the save
pointing at the line. Some scenes are faster typed than clicked; use whichever
fits the moment.

## 6. Effects, if you're ready

Anything a choice *does* to the world — set a flag, adjust reputation, give an
item — is an **effect** on the choice (or **On Enter** effects on the node it
reaches). Add one: effect type `set_flag`, and use the **＋ New flag** row in
the picker to create the flag inline without a side trip. The
[effects reference](/docs/editor-guide/#effects-reference) lists all nine types.

## Where next

- [Dialogue ladders](/docs/get-started/dialogue-ladders/) — make *which scene
  plays* depend on that flag you just set.
- [Playtest & share](/docs/get-started/playtest-and-share/) — roll that check
  with real dice.
- [Pattern cookbook](/docs/cookbook/) — the recipes these pieces build into:
  one-shot options, hub-and-spoke topic menus, skill-check forks, and letting
  the world react to a flag you set.
