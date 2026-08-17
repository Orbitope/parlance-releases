---
title: Features
description: Everything Parlance does — the visual editor, dialogue ladders, playtesting, validation, localization, review, CLI, and AI integration.
---

# Features

Parlance is a narrative design environment for the whole story layer of a game —
not just dialogue trees. This page tours the major surfaces; the
[complete feature index](/docs/#feature-index) lists every capability down to the
small stuff, and the [editor guide](/docs/editor-guide/) documents each one in depth.

<img class="shot" src="/assets/images/editor-dialogue-canvas.png" alt="The Parlance editor's dialogue canvas: a node graph of a confrontation scene with skill-check badges and a pacing panel" loading="lazy">
<p class="shot-caption">The editor, on the demo mystery's climax scene — every screenshot on this site is the real tool on real data.</p>

## The data model: files, not a database

- **One JSON file per entity**, human-readable, canonically serialized (sorted keys,
  stable formatting) so git diffs are per-entity and reviewable.
- **Twelve entity types**: skills, variables, factions, characters, dialogues, quests,
  locations, endings, codex entries, items, portraits, and cutscene manifests.
- **[Schema-first](/docs/concepts/schema-first/)**: 19 JSON Schemas drive both validation
  and the editor's forms. The same schema that rejects bad data generates the UI for
  editing good data.
- **No import/export.** The editor writes `data/`; your engine reads `data/`. That's the
  [whole integration model](/docs/concepts/engine-contract/).

## Dialogue authoring

- **Node graph canvas** — conversations as a left-to-right flow with visual edges for
  choices, skill checks (separate success/failure routes), and choiceless `next` beats.
- **Script view** — the same scene as editable text, in a compact grammar with a
  lossless byte-level round-trip. Type or click; your choice per moment.
- **Flow map** — every dialogue in the project as one graph, with edges for cross-scene
  routing and cutscene chains.
- **[Dialogue ladders](/docs/concepts/dialogue-laddering/)** — each character owns an
  ordered, state-gated list deciding which dialogue plays *right now*, with a live
  resolution preview.
- **Skill checks** — passive or active (`d20 + skill ≥ difficulty`), with a probability
  bar previewing success chance, and check badges generated automatically on the canvas.
- **Conditions & effects builders** — structured editors for flags, counters, items,
  reputation, relationships, quest state, and boolean combinators; no scripting language
  to learn, and everything they produce is validated.
- **Text variables** — let the player name the protagonist; `{placeholder}` substitution
  is render-time only, so authored files stay clean.
- **Pacing panel** — scene size, branch shape, longest path, check density, and dead-end
  detection at a glance.

## Quests, locations, and the rest of the world

- **Quest canvas** — stages and outcomes as a graph, with journal objectives
  (intent, in the protagonist's voice) kept distinct from retrospective descriptions.
- **Quest dependency graph** — the whole quest structure as a DAG with gate badges.
- **Location map** — locations and their exits (including gated ones) as a graph.
- **Endings, codex, cutscene manifests** — all first-class, all validated, all
  reachable from the same reference index.

## Playtesting

- **[In-canvas playtest](/docs/concepts/playtest-determinism/)** with a live simulated
  game state: starting-state editor, seeded deterministic dice, rewindable transcript,
  forced check outcomes, cross-scene continuation, and a live state inspector.
- **Edit while playing** — change the scene mid-session; state carries over and the
  session re-reads the content instantly.
- **Share builds** — export any scene as a single self-contained HTML file that plays
  in a browser with the same core engine. Hand it to a writer, get feedback, no setup.

## Validation

- **[Eighteen check families](/docs/reference/validation-checks/)** covering references,
  reachability, flag flow, quest logic, ladder shape, coverage, localization targets,
  progression math, and more.
- **Runs on every save**, streamed live to every open editor window.
- **Runs headless in CI** via [`parlance ci-check`](/docs/reference/cli/), plus an
  independent Python reference validator kept in enforced parity.
- **Reports panel** — coverage issues grouped and clickable, plus a searchable
  **reference index**: for any id, see where it's defined, read, and written
  ("find usages" for your story).

## Collaboration

- **[Git-native review](/docs/concepts/git-native/)** — read a colleague's branch as a
  *narrative* diff ("2 nodes added, ladder reordered"), play the branch's own content,
  comment on story anchors rather than line numbers, propose replacement text the author
  applies in one click, and record verdicts. Works with nothing but git — no server.
- **Localization & VO pipeline** — extract every player-facing string with stable keys,
  hand off locale templates, track coverage per language, and flag stale keys when
  content changes. VO maps voiceable lines to engine audio keys the same way.

## Automation & AI

- **[CLI](/docs/reference/cli/)** — `parlance init` scaffolds a project,
  `parlance ci-check` gates CI, `parlance route` runs scripted playthrough fixtures
  with assertions.
- **[MCP server](/docs/reference/mcp/)** — LLM agents read and write project data
  through the same validated path as the editor, with dry-run support and automatic
  re-validation after every write.
- **AI drafting** — optional in-editor drafting against Anthropic or OpenAI-compatible
  providers; drafts are visually marked until accepted.

## The editor itself

- **Command palette** (`Cmd/Ctrl+K`) — fuzzy-jump to any entity or action from anywhere.
- **Undo/redo** for every save, plus browser-style back/forward selection history.
- Node density toggle, minimaps, auto-layout, resizable persistent panels, text scaling,
  inline lore viewer, inline flag creation — the small features are catalogued in
  [Shortcuts & small features](/docs/reference/shortcuts/) so you don't miss them.

Wondering how it compares to articy:draft, Twine, ink, or Yarn Spinner?
See the [honest comparison](/compare/).
