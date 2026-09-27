---
title: Branching dialogue
description: Build a branching scene on the dialogue canvas — choices, a skill check with success and failure routes, choiceless beats, and the text script view.
---

# Branching dialogue

**Goal:** a scene with a real branch — a skill check whose failure still moves
the story — plus the canvas skills you'll use every day. ~15 minutes.
Prereq: [your first project](/docs/get-started/first-project/) — this picks up
the gatekeeper and `dlg_gate_first` from there.

## 1. Lay down the beats

A check needs a skill to roll against, and a new project has none. Select
**Skills** → **+ New** → id `rhetoric`, then set its **Name** to *Rhetoric* and
**Save**.

Now open `dlg_gate_first`. Its entry node, `node_start`, already carries the
gatekeeper's opening line — *"The gatekeeper looks you over."* Click **+ Node**
twice. You get two blank nodes to the right of the graph; click each and fill
its **Text** in the inspector:

- `node_2` — *"'Go on through, then.'"*
- `node_3` — *"'Papers. Real ones. Come back with them.'"*

The canvas names nodes for you — `node_2`, `node_3`, and so on — and the
inspector shows the id read-only; the [script view](#5-meet-the-script-view)
is where you can rename them. Both new nodes show red in the validation bar for
now: a node nothing leads to is unreachable, and one that leads nowhere
strands the player. Wiring fixes both.

Drag nodes by their headers to arrange them; positions save automatically to a
gitignored sidecar, so your layout never pollutes
[the content diff](/docs/concepts/git-native/). **Auto layout** reflows
everything left-to-right whenever things get messy.

## 2. Add a choice

Select `node_start`. It was created as an end node, so first untick **Is End**
— this node branches onward now. Then click **+ Add choice** and type the
choice's **Text**: *"Talk your way past."* (Its id, `ch_1`, is generated too.)

Every choice has a small **source handle** dot on its right edge — drag from it
to the left edge of a target node to wire a `goto`. That's the whole connection
model. Don't wire this one yet: the check below replaces a plain `goto` with two
routes.

## 3. Turn it into a check

With the choice selected, click **+ Add skill check** and set:

- mode: **active** — rolls `d20 + skill ≥ difficulty` at runtime
- skill: **Rhetoric**, difficulty: `12`

The choice now shows **two** handles — green (success) and red (failure). Drag
green → `node_2`, red → `node_3`. On the canvas the choice wears a
generated `rhetoric / 12` badge — don't type `[Rhetoric]` into the choice text;
badges derive from the data and the prose stays clean.

The inspector's **probability bar** previews P(success) at any stat value —
difficulty tuning without spreadsheets.

> **Failure is content.** `node_3` isn't a dead end in the story — give it its
> own choices when you're ready (bribe? climb the wall?). The demo's
> body-examination scene is the pattern done well: failing the check costs a
> detail, never the plot.

## 4. Add a choiceless beat

Click **+ Node** once more for `node_4` — *"Somewhere beyond the gate, a bell
counts four."* Now look at `node_2`: it has no choices, so it shows a single
**continue** handle. Drag it to `node_4`: that's a **`next`** — a listen-only
narration beat the player advances with one **Continue →** click. The player
who talks their way past hears the bell; the order matters, because a beat
nothing leads *to* is unreachable.

A node either advances with `next` or offers choices, never both, and a node
with a `next` can't also be an end. The canvas only shows the continue handle
on a node with no choices that isn't marked **Is End**.

Last, tick **Is End** on `node_3` and `node_4` so the conversation can actually
finish. An unmarked dead end — no choices, no `next`, not an end — is a
`FLOW` **error** ("player stuck"), and it keeps the validation bar red until
you fix it. The **Pacing** panel (click empty canvas) counts your dead ends
alongside scene size, branch shape, and check density.

## 5. Meet the script view

Flip the toolbar's **Graph · Text** toggle. Your scene, as editable text:

```
~ speaker: npc_gatekeeper
~ offer

== node_start entry ==
The gatekeeper looks you over.
- ch_1: "Talk your way past."
    check rhetoric >= 12 -> node_2 / node_3

== node_2 next=node_4 ==
'Go on through, then.'

== node_3 end ==
'Papers. Real ones. Come back with them.'

== node_4 end ==
Somewhere beyond the gate, a bell counts four.
```

Node attributes sit bare inside the `== … ==` header (`entry`, `end`,
`next=…`), and a check goes on its own indented line under its choice, with the
success and failure targets after the arrow.

The script is a **lossless** representation — saving reproduces the JSON
byte-for-byte except what you edited, and a syntax error blocks the save
pointing at the line. It's also where you give nodes readable ids: change
`node_2` to `node_pass` in its header *and* everywhere it's targeted (here, the
check line), then save. Some scenes are faster typed than clicked; use
whichever fits the moment.

## 6. Effects, if you're ready

Anything a choice *does* to the world — set a flag, adjust reputation, give an
item — is an **effect** on the choice, or an **On Enter** effect on a node.
Record that the player talked their way past: select `node_2`, and under
**On Enter Effects** click **+ Add effect**. The type is already **set flag**;
in the flag picker type `talked_past_gate` and pick the
**＋ New flag “talked_past_gate”** row to create the flag inline, value `true`.
(Until something reads the flag, it's a `FLAG` warning — *set but never read*.
The next tutorial reads it.)

There are twelve effect types: set flag, adjust reputation, adjust
relationship, adjust counter, give item, take item, advance quest, grant XP,
set active dialogue, play cutscene, set text, and engine command. The
[effects reference](/docs/editor-guide/#effects-reference) covers each.

## Where next

- [Dialogue offers](/docs/get-started/dialogue-ladders/) — make *which scene
  plays* depend on that flag you just set.
- [Playtest & share](/docs/get-started/playtest-and-share/) — roll that check
  with real dice.
- [Pattern cookbook](/docs/cookbook/) — the recipes these pieces build into:
  one-shot options, hub-and-spoke topic menus, skill-check forks, and letting
  the world react to a flag you set.
