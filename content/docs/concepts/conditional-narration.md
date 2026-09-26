---
title: Conditional narration
description: A line of narration that appears only in some world states — how node display gates work, why a skipped node fires no effects, and what it means when you're migrating from ink or Yarn Spinner.
---

# Conditional narration

Some lines should only exist sometimes.

> The stair creaks under the weight of the pause.
>
> *You know what was in the cup. That is the part that will not settle.*

The second line belongs only to a player who worked out what the poison was. To
everyone else it is a non-sequitur, and cutting it costs the scene its best beat.

Until **v0.11.0** Parlance had nowhere to put that line. A node advances to one
fixed `next`, so it could not branch on state; and wrapping it in a choice
fabricates a decision the player never made — the reader picks "continue", which
is not a decision, and now the transcript says they made one.

A **display gate** is the answer. Any node can carry a `showIf` condition — the
same condition type choices already used. When it holds, the line shows. When it
doesn't, what happens depends on the node:

- **A narration node** — no choices, not an end node — is **skipped**, and the
  dialogue continues at its `next`.
- **A node with choices, or an end node**, keeps everything but its line (since
  **v0.15.0**). Its `onEnter` effects still fire, its choices are still offered,
  and an end node still ends the dialogue. A runtime's `stepDialogue` reports this
  as `textHidden: true` with the node's `text` returned as `""`.

Either way the gate is judged **once, when the player arrives at the node, before
its `onEnter` runs**. A node whose own `onEnter` would make its own condition false —
a greeting shown only to a stranger, which records the meeting — still shows its
line.

## The rule that surprises people

**A skipped node fires no effects.**

`onEnter` does not run. Nothing is set, nothing is granted, nothing is counted.
The reasoning is that a skipped node *did not happen* — it isn't a line that
played silently, it's a beat the player never reached.

So if a flag must be set whether or not the line shows, put it on the node the
gate falls through *to*. The validator warns (`COND`) when a gated narration node
carries effects, because the alternative is discovering it in a playthrough where
a quest silently never advanced.

This applies only to skipped nodes. A gated node with choices, or an end node, is
never skipped: when its gate fails, only the line is hidden. Hiding is
presentation, and effects are state, so its `onEnter` fires either way.

## Where a gate is legal

A gated narration node needs somewhere to fall through to, so it must have a
`next`. A `next` chain can't end at a gated narration node either — there would be
nowhere to go when the gate fails — and gated narration nodes can't form a ring.

A gated node with choices, or an end node, needs none of that, because it is never
skipped. On every shape, the gate needs a line to hide: a `showIf` on a node with
empty text is an error.

The node inspector doesn't offer the control where a gate would be illegal, and
says why, so you should mostly meet these rules as an absent field rather than as
an error. Where the gate is legal, the inspector's hint says which behaviour you
are getting: a skipped node, or a hidden line.

## Migrating from ink or Yarn Spinner

This is the feature that closes the widest gap for anyone arriving from another
engine, because conditional text is a **first-class idiom in both**:

```ink
{ knows_poison: You know what was in the cup. }
```

```yarn
<<if $knows_poison>>You know what was in the cup.<<endif>>
```

Before 0.11.0 a script full of those had no faithful target in Parlance at all.
Every guarded line had to become an invented choice, a duplicated branch, or a
deletion. Now each one has a direct equivalent, which is what makes moving a real
manuscript across a conversion rather than a rewrite.

**The [importers](/docs/integrations/) map guards onto it.** Yarn's
`<<if>>`/`<<elseif>>`/`<<else>>` around a line and ink's `{cond: text}` and
`{ cond: … - else: … }` blocks become node gates, and choice guards become choice
gates. The hard part is the `else` branch. Both formats write it without restating
the condition, so it needs the *negation* of its `if`'s guard. Mapped to the same
guard, it would show **both** lines whenever the guard holds. Nothing would be lost
and nothing invented, so a check that only compares strings can't see it. The
importers' gate compares the conditions too, and refuses to finish on a mismatch.

A guard that Parlance's condition vocabulary can't express exactly — a read count,
an ink `LIST`, a comparison between two variables — is not approximated. It comes
back as a *declared loss*, named with its source line, for you to place by hand.
Since v0.15.0 a guarded line that hosts a choice list, or ends the story, is carried
too: the gate hides the line and keeps the choices.

## See also

- [`COND` validation checks](/docs/reference/validation-checks/) — every rule a gate must satisfy
- [Editor guide: the node inspector](/docs/editor-guide/#node-inspector-right-panel) — authoring one
- [Pattern cookbook](/docs/cookbook/) — node-gate recipes: skip-the-setup, event memory, and knowledge unlocks
- [Migrating from other tools](/docs/integrations/)
