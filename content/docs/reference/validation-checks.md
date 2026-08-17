---
title: Validation checks
description: Every Parlance validation family — SCHEMA through CHECK — what each scans, error vs. warning, and how to fix what it finds.
---

# Validation checks

The complete catalog of check families. Each issue in the
[validation bar](/docs/editor-guide/#10-validation-panel) carries its family
code; every row navigates to the offending entity. Errors are broken wiring;
warnings are story smells — and the editor
[never blocks a save](/docs/concepts/validation/) on either. CI draws the line
with [`ci-check`](/docs/reference/cli/) (`--strict` to fail warnings too).

## Shape & wiring

| Code | Severity | Fires when | Fix by |
|---|---|---|---|
| `SCHEMA` | error | A field fails JSON Schema validation — wrong type, missing required key, unknown enum | Correcting the field; the [schemas](/docs/concepts/schema-first/) are the format's ground truth |
| `REF` | error | Any reference names an id that doesn't exist — a choice's `goto`, a ladder rung's dialogue, a `factionId`, a condition's flag | Re-pointing or creating the target. The [reference index](/docs/editor-guide/#11-reports--coverage--reference-index) finds every usage of an id |
| `DUP` | error | Duplicate ids — entities, dialogue nodes/choices, or a location's spawns/exits/interactables | Renaming one of the twins |

## Dialogue flow

| Code | Severity | Fires when | Fix by |
|---|---|---|---|
| `FLOW` | warning | A dialogue has an unreachable node or a dead-end choice | Wiring the node in, or marking an intended terminal **Is End** |
| `REACH` | warning | A node can't be reached from the dialogue's `entry` | Connecting it or deleting it — the Pacing panel spots these too |
| `GATE` | error | An active check is missing its `onSuccess` / `onFailure` destination | Dragging both the green and red handles somewhere |

## State

| Code | Severity | Fires when | Fix by |
|---|---|---|---|
| `FLAG` | warning | A flag is written but never read, or read but never written | Deleting the orphan or wiring the missing half — the variable's [Flow panel](/docs/editor-guide/#flow-flags-counters-items) shows both directions |
| `REP` | error | A reputation reference names an unknown faction | Fixing the faction id |

## Structure

| Code | Severity | Fires when | Fix by |
|---|---|---|---|
| `QUEST` | warning/error | Quest stage issues — notably stage/outcome **effects with no condition** (`completeWhen`/`reachedWhen`), which can never fire; outcome reference cycles are errors | Adding the condition; quest resolution only fires condition-gated items ([why](/docs/concepts/engine-contract/)) |
| `ENDING` | warning | An ending is unreachable — no path leads to it | Wiring the path, or retiring the ending |
| `COVERAGE` | warning | A character has no dialogue | Giving them a [ladder](/docs/concepts/dialogue-laddering/) — or accepting silence knowingly |
| `LOC` | warning | Location graph issues — a bad exit spawn, a spawn nothing arrives at, more than one default spawn, gate/gateType mismatch, an unreachable location, an npc interactable whose character can't speak | Following the message; the [location map](/docs/editor-guide/#9-location-map) shows the topology |
| `CUT` | warning | Cutscene issues — unknown `entersDialogue`, a cutscene nothing triggers, or two `play_cutscene` effects racing on one node | Fixing the reference or the ordering |
| `LADDER` | warning | Ladder shape mistakes — **dead rung** (unconditional, not last), **stuck rung** (top rung unconditional *and* effectful — re-fires forever), **no fallthrough** (last rung gated). A rung's dangling dialogue is a `REF` error | Reordering; the [deep dive](/docs/concepts/dialogue-laddering/) shows each shape with examples |

## Content & progression

| Code | Severity | Fires when | Fix by |
|---|---|---|---|
| `LORE` | error | A `loreRef` points at a file that doesn't exist | Fixing the path — the form's file dropdown exists so this can't be typed wrong |
| `PROG` | warning/error | Progression config problems — thresholds not strictly increasing, `pointsPerLevel`/`maxSkill` < 1 (errors), a starting skill already at the ceiling, or authored XP generous enough to max *every* skill (the soft-cap sanity warning) | Adjusting `progression.json` |
| `XP` | warning | A `grant_xp` with a non-positive amount, or authored outside a quest outcome (advisory — the convention is XP from quests only) | Moving the grant, or granting something |
| `CHECK` | warning | Priced-check discipline — a `priced` active check whose failure branch doesn't proceed, or a priced-gate failure that sets a flag some ladder reads (the punishment-spiral advisory). `oneshot` checks are exempt | Giving failure somewhere to go — failure is content |

## Reading the output

In the editor: errors first, then warnings, filter chips per code, click to
navigate. In CI: the same list grouped by family, with counts, and exit codes
your pipeline can gate on ([tutorial](/docs/get-started/validate-in-ci/)).

Two implementations produce this list — the TypeScript validator (editor + CI)
and the [independent Python one](/docs/reference/cli/#the-python-reference-validator)
— kept in enforced parity, so the list you read is the list, everywhere.
