---
title: Dialogue laddering
description: How Parlance decides which dialogue a character plays — ordered, state-gated rungs resolved first-match-wins, with static checks for the classic ordering mistakes.
---

# Dialogue laddering

## The problem

The player walks up to a character. *Which conversation plays?*

Not "which conversations exist" — which one plays **right now**, given
everything that has happened: what the player knows, what they carry, what
they've done. Most tools answer with scripting: `if` chains in the engine, or
availability flags scattered across the dialogues themselves. Both drift, and
neither can be checked.

Parlance's answer is the **ladder**: each character owns an *ordered* list of
dialogues, each rung optionally gated on game state, resolved top-to-bottom,
**first match wins**.

## The mechanism

A character's `dialogues` field is an array of rungs, each
`{ dialogue, showIf? }`. Resolution is the entire rule — this is the actual
pseudocode from the runtime contract:

```
resolveCharacterDialogue(state, character, project):
  for rung in character.dialogues ?? []:
    if rung.showIf is absent or evaluate(rung.showIf, state, project): return rung.dialogue
  return null
```

Three consequences fall straight out:

- **Array order is significant.** Earlier rungs outrank later ones. The ladder
  reads top-down as "the most specific situation first."
- **A rung with no `showIf` always matches** — an unconditional **fallthrough**.
  Put one last and the character always has *something* to say.
- **Nothing matched → `null`.** The character has no dialogue right now. That's
  legal, but usually a mistake — see the checks below.

Re-entry needs no special code: talking to a character again just re-runs
resolution against current state, so once flags change, a different rung wins.

## A worked example

Aldous Wren, one of the demo's suspects — this is his actual character file:

```json
"dialogues": [
  {
    "dialogue": "dlg_wren_cornered",
    "showIf": { "type": "flag", "flag": "knows_wren_dismissed", "value": true }
  },
  { "dialogue": "dlg_wren_first" }
]
```

Talk to Wren early and rung 1 fails its gate — you get `dlg_wren_first`, the
polite apothecary. Learn that Vane dismissed him without a character
(`knows_wren_dismissed` set by another scene), come back, and rung 1 now wins:
you can corner him. Nobody scripted a transition; the ladder re-pointed.

<div class="dialogue-sample">
  <div class="speaker">Wren — rung 2, before you know</div>
  <p class="line">"I sell tinctures, magistrate. Nothing stronger."</p>
</div>
<div class="dialogue-sample">
  <div class="speaker">Wren — rung 1, once you know</div>
  <p class="line">"He dismissed you without a character, Mr. Wren. In spring.
  Shall we start again?"</p>
</div>

## Patterns

**The arc as a ladder.** Order rungs from most specific to least: the
confrontation gated on evidence at the top, mid-arc variations below it, an
unconditional greeting at the bottom. A character's ladder *is* their arc,
readable in one place.

**The feed model.** The effect `set_active_dialogue` doesn't write some hidden
override — it sets the flag `active_dialogue__{character}`, and the character's
ladder carries a high-priority rung gated on that flag. Scene routing is
therefore visible in the same ladder as everything else, not in a parallel
mechanism.

**NPC interactables** in locations resolve through exactly the same call — a
"forced" conversation is just a high-priority rung.

## The mistakes the validator catches

Ladders have four classic failure shapes. All are
[`LADDER` checks](/docs/reference/validation-checks/) — warnings on every save,
none blocking:

1. **Dead rung** — an unconditional rung that isn't last. Everything below it
   can never win:

   ```json
   "dialogues": [
     { "dialogue": "dlg_greeting" },
     { "dialogue": "dlg_confront", "showIf": { "type": "flag", "flag": "has_proof" } }
   ]
   ```
   > ⚠ `[LADDER]` rung 1 is unconditional — rungs below it can never be selected

2. **Stuck rung** — the *top* rung is unconditional **and** effectful: it wins
   forever and re-fires its effects on every re-entry.

3. **No fallthrough** — the *last* rung is gated, so there are states where the
   character resolves to `null` and has nothing to say.

4. **Stranded speakers** — a character with no ladder at all, whose dialogues
   also carry no `availableWhen`: unreachable content.

A rung pointing at a dialogue that doesn't exist is a hard `REF` **error**, not
a warning.

## Seeing it live

<img class="shot" src="/assets/images/editor-ladder.png" alt="The Dialogue Ladder editor on Aldous Wren's character form: rung 1 gated on knows_wren_dismissed, rung 2 marked always (fallthrough)" loading="lazy">
<p class="shot-caption">Wren's actual ladder in the editor — the worked example above, as you'd author it.</p>

The character form's **Dialogue Ladder** editor shows numbered rungs with ▲/▼
reordering and a per-rung condition builder (empty = "always (fallthrough)").
Beside it, the **ladder preview** re-runs `resolveCharacterDialogue` against
the current play state and highlights the winning rung — with quick flag
toggles, so you can flip `knows_wren_dismissed` and watch the highlight jump.
The preview calls the same resolution code the runtime uses, so what you see is
what ships. Try it in the [hands-on tutorial](/docs/get-started/dialogue-ladders/).

## The guarantees

- `resolveCharacterDialogue` is **the canonical mechanism** — the only dialogue
  selection with published conformance vectors, which every engine port must
  pass. The [Godot runtime](https://github.com/Orbitope/parlance-gdscript)
  passes all of them.
- Editor preview, playtest, and engine runtime share the same resolution
  semantics; they cannot disagree.
- `selectDialogue` (dialogues filtered by their own `availableWhen`) exists as
  a documented **escape hatch** for when availability genuinely belongs to the
  dialogue rather than the character's arc — it has no ordering guarantee and
  no vectors. Prefer the ladder.

**Next:** [build one in ten minutes](/docs/get-started/dialogue-ladders/), or
see how ladders slot into [the wider loop](/docs/concepts/workflow/).
