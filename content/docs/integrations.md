---
title: Engine integrations
description: Driving Parlance data from your engine — the Godot runtime, porting to any engine via the conformance suite, the MCP server, and in-editor AI drafting.
---

# Engine integrations

A shipping game loads `data/` — the same files the editor writes — and
executes them with a runtime that implements
[the published contract](/docs/concepts/engine-contract/). There is no export
step; "integration" means *reading files and honoring semantics*, and the
conformance suite tells you when you've honored them.

## Godot (GDScript) — official port

The [parlance-gdscript](https://github.com/Orbitope/parlance-gdscript) addon
executes Parlance JSON natively in Godot 4:

- **Install**: copy `addons/parlance/` into your project. Static classes — no
  plugin to enable, no autoloads.
- **Immutable state**: every entry point returns a new state, never mutates
  input — save/load and rewind stay trivial.
- **Conformance-verified**: 136 vectors passing, 0 failing, with unported
  areas (quest resolution, progression) declared as skips in the README
  scoreboard rather than fudged.

## TypeScript — the reference runtime

`@parlance/core` is the reference implementation: pure and deterministic (no
filesystem, no DOM), the same code that powers the editor's
[playtest](/docs/concepts/playtest-determinism/) and
[share builds](/docs/editor-guide/#share-build). A web-based or Electron game
can consume it directly.

## Porting to any other engine

The path every port follows:

1. **Load the files.** One JSON entity per file (skills/variables/items/
   portraits as flat registries); file name = entity id. Any JSON parser is
   the whole "SDK".
2. **Implement the contract.** Published in
   [`parlance-spec`](https://github.com/Orbitope/parlance-spec), the runtime
   contract defines each function —
   `evaluate`, `applyEffect`, `resolveCheck`, `stepDialogue`,
   [`resolveCharacterDialogue`](/docs/concepts/dialogue-laddering/),
   `resolveQuests` — including RNG (`mulberry32`), clamping rules, and the
   edge cases where ports usually drift.
3. **Run the conformance vectors.** Machine-readable given-state/expect-output
   cases per function. Green vectors = correct port; the scoreboard is your
   integration test forever after.
4. **Mind the host's half.** Your engine owns cutscene playback, calling quest
   resolution after state transitions, persistence, and presentation — the
   contract marks each boundary explicitly.

Contract, vectors, and schemas are all [MIT-licensed](/docs/spec/), so a port
of any license — including closed-source commercial — is fine.

## MCP server — for LLM agents

The [MCP server](/docs/reference/mcp/) exposes a project to AI agents through
the same validated write path as the editor: seven tools, `dry_run` support,
automatic re-validation after every write. Agent output lands as canonical
JSON in git — one reviewable diff.

## AI drafting

In-editor drafting talks to **Anthropic or any OpenAI-compatible provider**,
configured with your endpoint and API key. Drafted content is visually marked
(the purple "AI" accent in the app's own palette) until a human accepts it —
drafts propose, writers decide. Local-first still applies: nothing leaves your
machine except the drafting request you explicitly make.

**Related:** [the engine contract](/docs/concepts/engine-contract/) ·
[the open spec](/docs/spec/) · [configuration](/docs/reference/config/)
