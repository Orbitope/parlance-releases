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
doesn't, the node is skipped and the dialogue continues at its `next`.

## The rule that surprises people

**A skipped node fires no effects.**

`onEnter` does not run. Nothing is set, nothing is granted, nothing is counted.
The reasoning is that a skipped node *did not happen* — it isn't a line that
played silently, it's a beat the player never reached.

So if a flag must be set whether or not the line shows, put it on the node the
gate falls through *to*. The validator warns (`COND`) when a gated node carries
effects, because the alternative is discovering it in a playthrough where a quest
silently never advanced.

## Where a gate is legal

A gated node needs somewhere to fall through to, so it must have a `next`, and it
must not carry choices or be an end node. A `next` chain can't end at a gated node
either — there would be nowhere to go when the gate fails — and gated nodes can't
form a ring.

The node inspector simply doesn't offer the control where a gate would be illegal,
and says why. You should mostly meet these rules as an absent field rather than as
an error.

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

**The [importers](/docs/integrations/) do not map guards automatically yet, and
they say so.** A guarded line is reported as a *declared loss* — named, with its
source line — for you to place by hand. That is deliberate rather than unfinished.
The blocker is the `else` branch: an `else` written without restating its
condition, mapped to the same guard as its `if`, shows **both** lines whenever the
guard holds. Nothing is lost and nothing is invented, so no automated content check
can see it — the failure would be silently wrong output, which is the one outcome
worth refusing to risk.

So the honest position today: the *format* can express your conditional lines, and
the importer will hand you a list of exactly which ones it couldn't carry. That is
a shorter list than the manuscript, and it is a list you can trust.

## See also

- [`COND` validation checks](/docs/reference/validation-checks/) — every rule a gate must satisfy
- [Editor guide: the node inspector](/docs/editor-guide/#node-inspector-right-panel) — authoring one
- [Pattern cookbook](/docs/cookbook/) — node-gate recipes: skip-the-setup, event memory, and knowledge unlocks
- [Migrating from other tools](/docs/integrations/)
