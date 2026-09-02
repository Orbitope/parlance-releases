---
title: Documentation
description: Parlance documentation — quickstart, how-do-I task index, the complete feature index, and reading paths for writers, integrators, and self-hosters.
---

# Documentation

## Start here

Three steps to a working editor with a real project open — under five minutes:

1. **Launch Parlance** and point it at a project folder.
   ([Install & run](/docs/install/))
2. **Open the demo project.** *The Mistfall Inn* is a complete, tiny mystery
   with every feature in play.
   ([Your first project](/docs/get-started/first-project/) walks through it.)
3. **Play a scene.** Open the `dlg_examine_body` dialogue and hit **▶ Play** —
   seeded dice, a rewindable transcript, and a live state inspector.

Then: the [first project tutorial](/docs/get-started/first-project/) for the
guided tour, and [how it all fits together](/docs/concepts/workflow/) for the
big picture.

## How do I…

Fast answers, deep-linked into the manuals and tutorials.

| I want to… | Go to |
|---|---|
| Jump to any entity from anywhere | [Command palette `Cmd/Ctrl+K`](/docs/editor-guide/#2-layout-overview) |
| Create my first dialogue | [Tutorial: branching dialogue](/docs/get-started/branching-dialogue/) |
| Add a skill check with success/failure branches | [Tutorial: branching dialogue](/docs/get-started/branching-dialogue/) · [node inspector](/docs/editor-guide/#node-inspector-right-panel) |
| Make a character's dialogue change with game state | [Tutorial: dialogue ladders](/docs/get-started/dialogue-ladders/) |
| Write a scene as text instead of nodes | [Graph vs. Text](/docs/editor-guide/#graph-vs-text) |
| Add a beat with no choices (narration, overheard line) | [`next` — choiceless advance](/docs/editor-guide/#connecting-nodes) |
| Let the player name their character | [`set_text` + placeholders](/docs/editor-guide/#effects-reference) |
| Playtest a scene from the middle | [Starting state editor — Start at](/docs/editor-guide/#starting-state-editor) |
| Test both branches of a check without changing stats | [force ✓ / force ✗](/docs/editor-guide/#check-affordances) |
| Share a scene with a writer who has nothing installed | [Share build](/docs/editor-guide/#share-build) · [tutorial](/docs/get-started/playtest-and-share/) |
| See everywhere a flag is read and written | [Reference index](/docs/editor-guide/#11-reports--coverage--reference-index) · [Flow panel](/docs/editor-guide/#flow-flags-counters-items) |
| Create a flag without leaving the form I'm in | [Creating a flag inline](/docs/editor-guide/#creating-a-flag-inline) |
| Understand a validation message | [Validation checks reference](/docs/reference/validation-checks/) |
| Fail the CI build on story errors | [Tutorial: validate in CI](/docs/get-started/validate-in-ci/) · [CLI](/docs/reference/cli/) |
| Give a quest journal objectives in the player's voice | [Journal objectives](/docs/editor-guide/#journal-objectives-stage-inspector) |
| See which quests gate which | [Quest dependency graph](/docs/editor-guide/#8-quest-dependency-graph) |
| Map my locations and their gated exits | [Location map](/docs/editor-guide/#9-location-map) |
| Review a colleague's story branch | [Review](/docs/editor-guide/#16-review--reading-someone-elses-branch) |
| Set writers up to contribute through the app | [Collaboration setup](/docs/collaboration/) |
| Hand off strings for translation or VO | [Localization & VO](/docs/editor-guide/#15-localization--vo) |
| Undo a bad save / get back to where I was | [Undo/redo & navigation history](/docs/editor-guide/#13-undo--redo-and-navigation-history) |
| Install the app and open a project | [Install & run](/docs/install/) |
| Reset my panel layout / view preferences | [View preferences](/docs/reference/config/#view-preferences) |
| Change where data/schema/lore live | [Configuration reference](/docs/reference/config/) |
| Wire my engine to read Parlance data | [Engine integrations](/docs/integrations/) |
| Let an LLM agent create entities safely | [MCP server](/docs/reference/mcp/) |
| Fix "Parlance is damaged and can't be opened" | [Troubleshooting](/docs/install/#when-somethings-wrong) |
| Learn the keyboard shortcuts | [Shortcuts & small features](/docs/reference/shortcuts/) |

## Feature index

Every capability, one line each — so nothing stays undiscovered. Small
affordances get the same billing as headline features; most rows link into the
[editor guide](/docs/editor-guide/), which documents them fully.

**Editor chrome** —
[command palette](/docs/editor-guide/#2-layout-overview) ·
[breadcrumb navigation](/docs/editor-guide/#2-layout-overview) ·
[text size 90–150%](/docs/editor-guide/#2-layout-overview) ·
[collapsible entity panel](/docs/editor-guide/#2-layout-overview) ·
[resizable side panels](/docs/editor-guide/#2-layout-overview) ·
[undo/redo](/docs/editor-guide/#13-undo--redo-and-navigation-history) ·
[back/forward history](/docs/editor-guide/#13-undo--redo-and-navigation-history) ·
[persisted view preferences](/docs/reference/config/#view-preferences) ·
[shortcuts cheat sheet](/docs/reference/shortcuts/)

**Entities & forms** —
[12 entity types](/docs/editor-guide/#3-entity-types) ·
[search & group-by](/docs/editor-guide/#4-entity-list--search) ·
[schema-driven forms](/docs/concepts/schema-first/) ·
[JSON/Edit toggle](/docs/editor-guide/#5-entity-detail--view--edit) ·
[inline lore viewer](/docs/editor-guide/#5-entity-detail--view--edit) ·
[inline flag creation](/docs/editor-guide/#creating-a-flag-inline) ·
[variable Flow panel](/docs/editor-guide/#flow-flags-counters-items) ·
[stale-load conflict detection](/docs/editor-guide/#stale-load-detection)

**Dialogue** —
[node graph canvas](/docs/editor-guide/#6-dialogue-canvas) ·
[script (text) view with lossless round-trip](/docs/editor-guide/#graph-vs-text) ·
[flow map of all dialogues](/docs/editor-guide/#flow-map-all-dialogues) ·
[node density Compact/Card/Script](/docs/editor-guide/#canvas-controls) ·
[auto-layout & minimap](/docs/editor-guide/#canvas-controls) ·
[choiceless `next` beats](/docs/editor-guide/#connecting-nodes) ·
[speaker inheritance & overrides](/docs/editor-guide/#node-inspector-right-panel) ·
[author notes](/docs/editor-guide/#node-inspector-right-panel) ·
[skill checks with probability bar](/docs/editor-guide/#node-inspector-right-panel) ·
[condition & effect builders](/docs/editor-guide/#node-inspector-right-panel) ·
[effects reference](/docs/editor-guide/#effects-reference) ·
[pacing analysis](/docs/editor-guide/#pacing-inspector-with-no-node-selected) ·
[dialogue ladders](/docs/concepts/dialogue-laddering/) ·
[share builds](/docs/editor-guide/#share-build)

**Quests, locations, world** —
[quest stage canvas](/docs/editor-guide/#7-quest-canvas) ·
[journal objectives vs. descriptions](/docs/editor-guide/#journal-objectives-stage-inspector) ·
[quest dependency graph](/docs/editor-guide/#8-quest-dependency-graph) ·
[location map with gated exits](/docs/editor-guide/#9-location-map) ·
endings · codex · items · portraits · [cutscene manifests](/docs/editor-guide/#3-entity-types)

**Playtest** —
[in-canvas play sessions](/docs/editor-guide/#12-playtest-mode) ·
[starting-state editor](/docs/editor-guide/#starting-state-editor) ·
[seeded determinism](/docs/editor-guide/#determinism-guarantee) ·
[rewind & reroll](/docs/editor-guide/#toolbar-controls-while-session-is-running) ·
[forced check outcomes](/docs/editor-guide/#check-affordances) ·
[edit-while-playing](/docs/editor-guide/#editing-while-playing-auto-reload) ·
[cross-scene continuation](/docs/editor-guide/#continuing-into-the-next-scene) ·
[state inspector](/docs/editor-guide/#state-inspector)

**Validation & reports** —
[live validation bar](/docs/editor-guide/#10-validation-panel) ·
[18 check families](/docs/reference/validation-checks/) ·
[Reports & coverage](/docs/editor-guide/#11-reports--coverage--reference-index) ·
[reference index (find usages)](/docs/editor-guide/#11-reports--coverage--reference-index) ·
[CI gating](/docs/get-started/validate-in-ci/) ·
[independent Python validator](/docs/reference/cli/#the-python-reference-validator)

**Collaboration** —
[setting up writers](/docs/collaboration/) ·
[git-native review](/docs/editor-guide/#16-review--reading-someone-elses-branch) ·
[narrative diffs](/docs/concepts/git-native/) ·
[comments, suggestions, verdicts](/docs/editor-guide/#comments-suggestions-verdicts) ·
[localization & VO pipeline](/docs/editor-guide/#15-localization--vo)

**Automation & AI** —
[`parlance init` / `ci-check` / `route`](/docs/reference/cli/) ·
[MCP server for LLM agents](/docs/reference/mcp/) ·
[AI drafting](/docs/integrations/#ai-drafting)

## Reading paths

**You write the story** → [first project](/docs/get-started/first-project/) →
[branching dialogue](/docs/get-started/branching-dialogue/) →
[dialogue ladders](/docs/get-started/dialogue-ladders/) →
[playtest & share](/docs/get-started/playtest-and-share/) →
the [editor guide](/docs/editor-guide/) end to end.

**You integrate the engine** → [the engine contract](/docs/concepts/engine-contract/) →
[engine integrations](/docs/integrations/) → [the open spec](/docs/spec/) →
[configuration reference](/docs/reference/config/).

**You run the tooling** → [install & run](/docs/install/) →
[configuration](/docs/reference/config/) → [CLI](/docs/reference/cli/) →
[validate in CI](/docs/get-started/validate-in-ci/).
