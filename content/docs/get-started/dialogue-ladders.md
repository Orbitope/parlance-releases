---
title: Dialogue ladders
description: Give a character a state-aware conversation in ten minutes — build a two-rung ladder, watch the live preview re-point, and trigger (then fix) a dead-rung warning.
---

# Dialogue ladders

**Goal:** a character whose conversation *changes when the world does* — and a
deliberate ladder mistake, caught by the validator, then fixed. ~10 minutes.
Concept background: [dialogue laddering](/docs/concepts/dialogue-laddering/).

You need a character and two dialogues; the gatekeeper from the
[previous tutorial](/docs/get-started/branching-dialogue/) works. Create a
second dialogue for them, `dlg_gate_after` — what they say once you're known:
*"'Back again? Gate's open for you.'"*

## 1. Build the ladder

Open the character. The **Dialogue Ladder** field is a reorderable list of
rungs — each a dialogue plus an optional condition:

1. **Add rung** → `dlg_gate_after`, and give it a **show if** condition:
   flag `talked_past_gate` is `true`.
2. **Add rung** → `dlg_gate_first` — leave its condition empty. The row reads
   **— always (fallthrough)**.

(In `dlg_gate_first`, make sure some choice or end node actually **sets**
`talked_past_gate` — a flag read but never written is a `FLAG` warning, and
rightly so.)

Top-to-bottom, first match wins: an unknown player falls through to the first
meeting; a known one hits the gated rung. The order **is** the logic — which
is why the rows reorder with ▲/▼ instead of asking you to write priorities.

## 2. Watch it resolve, live

Open the **ladder preview** on the dialogue surface. It shows every rung and
highlights the one currently winning, with quick toggles for the flags the
ladder reads:

- `talked_past_gate` off → rung 2 highlighted (`dlg_gate_first`)
- flip it on → the highlight *jumps* to rung 1

The preview runs the same `resolveCharacterDialogue` the engine runtime uses —
what you see is what ships.

## 3. Break it on purpose

Drag the fallthrough rung (**`dlg_gate_first` — always**) to the **top** with ▲.
Save, and look at the validation bar:

> ⚠ `[LADDER]` rung 1 is unconditional — rungs below it can never be selected

That's a **dead rung**: an unconditional rung anywhere but last shadows
everything beneath it. Your gated scene became unreachable — and instead of
discovering that in a playtest next month, you got told at save time. Move it
back down; the warning clears.

The other shapes the [`LADDER` family](/docs/reference/validation-checks/)
catches: a **stuck rung** (unconditional *and* effectful at the top — re-fires
its effects on every re-entry, forever), **no fallthrough** (last rung gated,
so the character can resolve to nothing), and **stranded speakers** (dialogues
whose character has no ladder at all). Deleting a dialogue a rung points at is
a hard `REF` error, not a warning.

## 4. The idiom to keep

Most characters in most games are exactly this shape:

```
1. dlg_confrontation   if the_big_flag        ← most specific on top
2. dlg_midgame_hints   if met_character
3. dlg_first_meeting   — always (fallthrough) ← safety net on the bottom
```

Read the demo's three suspects for the pattern under real pressure —
evidence-gated rungs over a fallthrough, so *talking to anyone twice* feels
alive. A character's ladder is their arc, in one screen.

## Where next

- [Playtest & share](/docs/get-started/playtest-and-share/) — play across the
  ladder: finish the first scene, return, get the second.
- [Dialogue laddering, the concept](/docs/concepts/dialogue-laddering/) — the
  resolution rule, the feed model, and the conformance guarantees.
- [Pattern cookbook](/docs/cookbook/) — ladder recipes in full: reputation tone
  shifts, most-specific-wins (storylet) selection, and the say-it-once idiom.
