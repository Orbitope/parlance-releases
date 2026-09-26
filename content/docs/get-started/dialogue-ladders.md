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
second dialogue for them — **Dialogues** → **+ New** → `dlg_gate_after` — and
give its entry node what they say once you're known: *"'Back again? Gate's open
for you.'"* In the inspector's **Dialogue** section, set its **Default
speaker** to the Gatekeeper too.

## 1. Declare the offers

Each dialogue says when it should play — you set it on the dialogue, not on the
character. The **Offer** lives in the **Dialogue** section at the top of each
dialogue's inspector:

1. `dlg_gate_after` → **+ Offer this dialogue**, then set **offered when** to
   flag `talked_past_gate` is `true`.
2. `dlg_gate_first` → it already has an offer from
   [your first project](/docs/get-started/first-project/), with **offered
   when** empty — *always (the fallback)*: offered whenever nothing more
   specific applies.

(`dlg_gate_first` must actually **set** `talked_past_gate` — the
[branching tutorial](/docs/get-started/branching-dialogue/#6-effects-if-youre-ready)
does it on the success node. A flag read but never written is a `FLAG`
warning, and rightly so.)

There is no ordering to manage: an unknown player has only the fallback
available; a known one also has the gated offer, which is more specific, so it
wins. The engine picks — you just state each scene's situation.

## 2. Watch it resolve, live

Look just below the offer: the inspector's **Resolution preview** shows the
character's offers, marks which are eligible right now, and highlights the one
currently winning — with quick toggles for the flags the offers read:

- `talked_past_gate` off → the fallback wins (`dlg_gate_first`)
- flip it on → the highlight *jumps* to `dlg_gate_after`

The preview runs the same `resolveCharacterDialogue` the engine runtime uses —
what you see is what ships. It starts from the project's default state; the
same preview also lives in the Play panel (**▶ Play** → **Dialogue Offers**),
where it resolves against the playtest's current state instead.

### One-shot by default: Replayable

Resolution skips any dialogue the player has already seen unless it is marked
**Replayable** (the checkbox in the same **Dialogue** section). Nothing is
replayable by default — most scenes should happen once — so a played scene
drops out of the character's offers.

That matters here. A player who *fails* the rhetoric check never sets
`talked_past_gate`, so on their next visit `dlg_gate_after` isn't eligible —
and `dlg_gate_first`, already played, has dropped out. The gatekeeper resolves
to nothing. Tick **Replayable** on `dlg_gate_first` so the turned-away player
can try again. (The validator can't see this one: it depends on what the
player has played, not on how the offers are written.)

## 3. Break it on purpose

Give `dlg_gate_first` a gate too — set its **offered when** to flag
`talked_past_gate` is `false`. It saves as you pick; look at the validation bar:

> ⚠ `OFFER` character 'npc_gatekeeper': 2 offer(s) but none is unconditional
> (dlg_gate_after, dlg_gate_first) — resolution returns no dialogue in states
> where every 'when' fails (add a fallback offer with no 'when')

Now *both* offers are gated. These two gates happen to cover every state
between them — but the validator doesn't try to prove that. It asks for one
ungated offer as the safety net, because a pair of gates that covers
everything today stops covering it the day someone edits one of them, and
then the character resolves to `null` — nothing to say. Instead of
discovering that in a playtest next month, you got told at save time. Clear
the gate again; the warning clears with it.

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
