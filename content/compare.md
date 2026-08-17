---
title: Parlance vs. articy:draft, Twine, ink, Yarn Spinner
description: An honest comparison of narrative design tools — where Parlance shines and where another tool is the better fit.
---

# How Parlance compares

Different tools fit different shapes of game and team, and pretending otherwise
helps nobody. This page compares Parlance honestly with the tools we most often
get asked about — including where *they* are the better choice.

## At a glance

| | **Parlance** | **articy:draft** | **Twine** | **ink** | **Yarn Spinner** |
|---|---|---|---|---|---|
| Source format | <span class="yes">✓</span> plain JSON, per-entity files, clean diffs | <span class="no">✗</span> proprietary project (X exports XML/JSON) | <span class="partial">◑</span> HTML/Twee archive | <span class="yes">✓</span> plain-text `.ink` | <span class="yes">✓</span> plain-text `.yarn` |
| Visual node editing | <span class="yes">✓</span> dialogue, quest, location canvases | <span class="yes">✓</span> mature flow editor | <span class="yes">✓</span> passage map | <span class="no">✗</span> text-first | <span class="partial">◑</span> graph view, text-first |
| Structured entities beyond dialogue (quests, factions, items, endings) | <span class="yes">✓</span> 12 first-class types | <span class="yes">✓</span> templates & objects | <span class="no">✗</span> | <span class="no">✗</span> variables only | <span class="no">✗</span> variables only |
| State-aware dialogue selection | <span class="yes">✓</span> [dialogue ladders](/docs/concepts/dialogue-laddering/), spec'd + conformance-tested | <span class="partial">◑</span> via scripting | <span class="partial">◑</span> via macros | <span class="partial">◑</span> weave/logic in-script | <span class="partial">◑</span> via commands |
| Static validation & CI story | <span class="yes">✓</span> 18 check families on save + `ci-check` + reference validator | <span class="partial">◑</span> in-app checks | <span class="no">✗</span> | <span class="partial">◑</span> compiler errors | <span class="partial">◑</span> compiler errors |
| In-tool playtesting | <span class="yes">✓</span> seeded, rewindable, forced outcomes, live state | <span class="yes">✓</span> presentation/simulation | <span class="yes">✓</span> play in browser | <span class="yes">✓</span> inky player | <span class="yes">✓</span> preview |
| Shareable playable build of a scene | <span class="yes">✓</span> single-file HTML export | <span class="no">✗</span> | <span class="yes">✓</span> whole story is HTML | <span class="partial">◑</span> export for web via tooling | <span class="no">✗</span> |
| Branch-based review workflow | <span class="yes">✓</span> narrative diffs, comments, suggestions, verdicts — plain git | <span class="no">✗</span> (server products exist) | <span class="no">✗</span> | <span class="partial">◑</span> text diffs review fine in PRs | <span class="partial">◑</span> text diffs review fine in PRs |
| Engine integration model | <span class="yes">✓</span> engine reads authored files; published contract + conformance vectors | <span class="partial">◑</span> exporter + official Unity/Unreal plugins | <span class="partial">◑</span> web-native; engine use is DIY | <span class="yes">✓</span> excellent Unity runtime; C/C#/others | <span class="yes">✓</span> first-class Unity |
| Localization & VO tooling | <span class="yes">✓</span> stable keys, coverage, stale detection | <span class="yes">✓</span> mature | <span class="no">✗</span> | <span class="partial">◑</span> community tooling | <span class="partial">◑</span> line-tag based |
| AI / MCP integration | <span class="yes">✓</span> MCP server, validated writes | <span class="no">✗</span> | <span class="no">✗</span> | <span class="no">✗</span> | <span class="no">✗</span> |
| Open spec | <span class="yes">✓</span> MIT schemas + conformance vectors, [published separately](https://github.com/Orbitope/parlance-spec) ([details](/docs/spec/)) | <span class="no">✗</span> | <span class="partial">◑</span> formats documented | <span class="yes">✓</span> open source | <span class="yes">✓</span> open source |
| License / price | [free](/license/), incl. commercial use; not open source | commercial, per-seat | free, open source | free, open source | free, open source (paid add-ons) |

<p><span class="yes">✓</span> first-class &nbsp; <span class="partial">◑</span> possible with work or partial &nbsp; <span class="no">✗</span> not a goal of the tool</p>

This table is maintained by us, about our competitors — read it with that grain
of salt, and tell us if a cell is unfair or out of date.

## Choose articy:draft if…

You're a mid-size-or-larger studio that wants a mature, commercial, all-in-one
narrative pipeline with official Unity and Unreal plugins, template-driven game
objects, and years of shipped-title track record. It's the most feature-complete
commercial tool in this space. The trade-offs are the proprietary project format
(version control works on binary/opaque data, with server products sold to solve
the collaboration problem git would otherwise give you) and per-seat licensing.

## Choose Twine if…

You're writing hypertext fiction that ships *as* a web page, teaching interactive
fiction, or jamming — nothing gets you from zero to playable branching story
faster, and the output is the delivery format. It's not built for driving a game
engine, structured game data, or team review workflows.

## Choose ink if…

Your game is prose-first and your writers are comfortable in a lightweight
scripting language. ink's writing ergonomics for dense, weave-style branching
prose are unmatched, its Unity integration is excellent, and its shipped-game
pedigree (80 Days, Heaven's Vault, countless others) speaks for itself. You'll
be hand-rolling the structured layer — quests, factions, items, endings — and
the static guarantees beyond compiler errors.

## Choose Yarn Spinner if…

You're Unity-first and want a friendly, well-supported dialogue system with a
strong community, voice-over-oriented line tagging, and a syntax writers pick up
in an afternoon. Like ink, it deliberately stays a *dialogue* tool — the rest of
the narrative data model is yours to build.

## Choose Parlance if…

- Your team already lives in git and wants narrative to work like code:
  branches, [reviewable diffs](/docs/concepts/git-native/), CI gates.
- Your story is **structured data as much as prose** — quests, factions,
  reputation, items, endings, codex — and you want one validated model for all
  of it, not a dialogue tool plus a spreadsheet.
- You want **[validation](/docs/concepts/validation/) as a guarantee**, not a
  vibe: eighteen check families on every save and in CI, so a dangling
  reference or an unwinnable quest fails the build instead of shipping.
- You want the engine to read the **same files the editor writes** — a
  [published contract with conformance vectors](/docs/concepts/engine-contract/)
  instead of an export step.
- You playtest constantly and want [seeded, rewindable sessions](/docs/concepts/playtest-determinism/)
  and one-file playable handoffs.

The fastest way to judge: [play the demo](/demo/), then
[open it in the editor](/docs/get-started/first-project/).
