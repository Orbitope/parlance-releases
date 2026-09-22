---
title: Dialogue offers
description: Give a character a state-aware conversation in ten minutes — declare two offers, watch the live preview re-point, and trigger (then fix) a missing-fallback warning.
---

# Dialogue offers

**Goal:** a character whose conversation *changes when the world does* — plus a
deliberate offer mistake, caught by the validator, then fixed. ~10 minutes.
Concept background: [dialogue offers](/docs/concepts/dialogue-laddering/).

You need a character and two dialogues; the gatekeeper from the
[previous tutorial](/docs/get-started/branching-dialogue/) works. Create a
second dialogue for them, `dlg_gate_after` — what they say once you're known:
*"'Back again? Gate's open for you.'"*

## 1. Declare the offers

Each dialogue says when it should play — you set it on the dialogue, not on the
character. Open each dialogue's inspector and fill in its **Offer**:

1. `dlg_gate_after` → **offered when** flag `talked_past_gate` is `true`.
2. `dlg_gate_first` → leave **offered when** empty. That makes it the
   **fallback** — offered whenever nothing more specific applies.

(In `dlg_gate_first`, make sure some choice or end node actually **sets**
`talked_past_gate` — a flag read but never written is a `FLAG` warning, and
rightly so.)

There is no ordering to manage: an unknown player has only the fallback
available; a known one also has the gated offer, which is more specific, so it
wins. The engine picks — you just state each scene's situation.

## 2. Watch it resolve, live

Open the dialogue inspector's **resolution preview**. It shows the character's
offers, marks which are eligible right now, and highlights the one currently
winning — with quick toggles for the flags the offers read:

- `talked_past_gate` off → the fallback wins (`dlg_gate_first`)
- flip it on → the highlight *jumps* to `dlg_gate_after`

The preview runs the same `resolveCharacterDialogue` the engine runtime uses —
what you see is what ships.

## 3. Break it on purpose

Give `dlg_gate_first` a gate too — set its **offered when** to some flag that is
rarely set. Save, and look at the validation bar:

> ⚠ `[OFFER]` character has offers but none is unconditional — resolution
> returns no dialogue in states where every `when` fails (add a fallback offer
> with no `when`)

Now *both* offers are gated, so in the opening state — before anything is set —
the character has nothing to say and resolves to `null`. Instead of discovering
that in a playtest next month, you got told at save time. Clear the gate again;
the warning clears with it.

## 4. The idiom to keep

Most characters in most games are exactly this shape — a few gated offers over
one fallback:

```
dlg_confrontation   offered when the_big_flag     ← most specific
dlg_midgame_hints   offered when met_character
dlg_first_meeting   (no gate — the fallback)      ← safety net
```

There's no order to get right: each scene names its own situation, and the most
specific eligible one wins. Read the demo's three suspects for the pattern under
real pressure — evidence-gated offers over a fallback, so *talking to anyone
twice* feels alive.

## Where next

- [Playtest & share](/docs/get-started/playtest-and-share/) — play across the
  offers: finish the first scene, return, get the second.
- [Dialogue offers, the concept](/docs/concepts/dialogue-laddering/) — the
  resolution rule, the feed model, and the conformance guarantees.
- [Pattern cookbook](/docs/cookbook/) — offer recipes in full: reputation tone
  shifts, most-specific-wins (storylet) selection, and the say-it-once idiom.
