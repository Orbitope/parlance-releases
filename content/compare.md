---
title: Parlance vs. articy:draft, Twine, ink, Yarn Spinner
description: An honest comparison of narrative design tools — where Parlance shines and where another tool is the better fit.
---

# Parlance and the alternatives

Parlance is built for a specific shape of project: a story that's structured data
as much as prose, authored by people who already live in git. Different tools fit
different shapes, and pretending otherwise helps nobody — so this page covers where
Parlance wins, and where one of the others is the better call.

## At a glance

| | **Parlance** | **articy:draft** | **Twine** | **ink** | **Yarn Spinner** |
|---|---|---|---|---|---|
| Static validation & CI story | <span class="yes">✓</span> 18 check families on save + `ci-check` + independent reference validator | <span class="partial">◑</span> in-app checks | <span class="no">✗</span> | <span class="partial">◑</span> compiler errors | <span class="partial">◑</span> compiler errors |
| State-aware dialogue selection | <span class="yes">✓</span> [dialogue ladders](/docs/concepts/dialogue-laddering/), spec'd + conformance-tested | <span class="partial">◑</span> via scripting | <span class="partial">◑</span> via macros | <span class="partial">◑</span> weave/logic in-script | <span class="partial">◑</span> via commands |
| Branch-based review workflow | <span class="yes">✓</span> narrative diffs, comments, suggestions, verdicts — plain git | <span class="no">✗</span> (server products exist) | <span class="no">✗</span> | <span class="partial">◑</span> text diffs review fine in PRs | <span class="partial">◑</span> text diffs review fine in PRs |
| AI / MCP integration | <span class="yes">✓</span> MCP server, validated writes | <span class="no">✗</span> | <span class="no">✗</span> | <span class="no">✗</span> | <span class="no">✗</span> |
| Graph **and** text authoring, same document | <span class="yes">✓</span> canvas ↔ script view, both fully editable, lossless byte-level round-trip | <span class="partial">◑</span> flow editor is primary; no text form of a scene | <span class="partial">◑</span> Twee import/export round-trips, including layout — not a live second view | <span class="no">✗</span> text only | <span class="partial">◑</span> graph view adds and moves nodes; branching is authored in text |
| Structured entities beyond dialogue (quests, factions, items, endings) | <span class="yes">✓</span> 12 first-class types | <span class="yes">✓</span> templates & objects | <span class="no">✗</span> | <span class="no">✗</span> variables only | <span class="no">✗</span> variables only |
| Engine integration model | <span class="yes">✓</span> no export step — your engine reads the files the editor writes; published contract + conformance vectors | <span class="partial">◑</span> exporter + official Unity/Unreal plugins | <span class="partial">◑</span> web-native; engine use is DIY | <span class="yes">✓</span> excellent Unity runtime; C/C#/others | <span class="yes">✓</span> first-class Unity |
| Source format | <span class="yes">✓</span> plain JSON, per-entity files, clean diffs | <span class="no">✗</span> proprietary project (X exports XML/JSON) | <span class="partial">◑</span> HTML/Twee archive | <span class="yes">✓</span> plain-text `.ink` | <span class="yes">✓</span> plain-text `.yarn` |
| Visual node editing | <span class="yes">✓</span> dialogue, quest, location canvases | <span class="yes">✓</span> mature flow editor | <span class="yes">✓</span> passage map | <span class="no">✗</span> text-first | <span class="partial">◑</span> graph view, text-first |
| In-tool playtesting | <span class="yes">✓</span> seeded, rewindable, forced outcomes, live state | <span class="yes">✓</span> presentation/simulation | <span class="yes">✓</span> play in browser | <span class="yes">✓</span> inky player | <span class="yes">✓</span> preview |
| Shareable playable build of a scene | <span class="yes">✓</span> single-file HTML export | <span class="no">✗</span> | <span class="yes">✓</span> whole story is HTML | <span class="partial">◑</span> export for web via tooling | <span class="no">✗</span> |
| Localization & VO tooling | <span class="yes">✓</span> stable keys, coverage, stale detection | <span class="yes">✓</span> mature | <span class="no">✗</span> | <span class="partial">◑</span> community tooling | <span class="partial">◑</span> line-tag based |
| Open spec | <span class="yes">✓</span> MIT schemas + conformance vectors, [published separately](https://github.com/Orbitope/parlance-spec) ([details](/docs/spec/)) | <span class="no">✗</span> | <span class="partial">◑</span> formats documented | <span class="yes">✓</span> open source | <span class="yes">✓</span> open source |
| License / price | [free](/license/), including commercial use — MIT open spec, editor not open source | commercial, per-seat | free, open source | free, open source | free, open source (paid add-ons) |

<p><span class="yes">✓</span> first-class &nbsp; <span class="partial">◑</span> possible with work or partial &nbsp; <span class="no">✗</span> not a goal of the tool &nbsp; <a href="#table-note">†</a></p>

## Choose Parlance if…

Parlance is the only tool here that treats the *whole* story layer as validated,
reviewable data — dialogue, quests, factions, reputation, items, endings — in files
your engine reads directly, with no export step in between. One JSON file per entity
means a save touches one file and a diff reads like a change to one scene, not to a
project. If your narrative has outgrown what one person can hold in their head,
that's the problem it's built for — here's
[what that looks like](/docs/concepts/at-scale/) on a public 112-dialogue project.

Choose Parlance if:

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

## When another tool is the better fit

### articy:draft

You're a mid-size-or-larger studio that wants a mature, commercial, all-in-one
narrative pipeline with official Unity and Unreal plugins, template-driven game
objects, and years of shipped-title track record. For a studio that wants one
vendor-supported pipeline covering everything, nothing else commercial comes
close. The trade-offs are the proprietary project format (version control works
on binary/opaque data, with server products sold to solve the collaboration
problem git would otherwise give you) and per-seat licensing.

### Twine

You're writing hypertext fiction that ships *as* a web page, teaching interactive
fiction, or jamming — nothing gets you from zero to playable branching story
faster, and the output is the delivery format. It's not built for driving a game
engine, structured game data, or team review workflows.

### ink

Your game is prose-first and your writers are comfortable in a lightweight
scripting language. ink's writing ergonomics for dense, weave-style branching
prose are unmatched, its Unity integration is excellent, and its shipped-game
pedigree (80 Days, Heaven's Vault, countless others) speaks for itself. The
structured layer is yours to hand-roll — quests, factions, items, endings — as
are any static guarantees beyond compiler errors.

### Yarn Spinner

You're Unity-first and want a friendly, well-supported dialogue system with a
strong community, voice-over-oriented line tagging, and a syntax writers pick up
in an afternoon. Like ink, it stays a *dialogue* tool: quests, factions, items,
endings, and the validation over them are yours to build and maintain.

## If you've already written it

Two of the tools on this page are ones Parlance can **import from**: ink and Yarn Spinner.
The importers check every emitted string against your source byte for byte and name
anything they can't carry, so the question "do I have to retype my script" has a concrete
answer. [How migration works](/docs/integrations/).

Worth knowing before you weigh it: conditional text — `{ cond: line }` in ink,
`<<if>>` in Yarn — had no equivalent in Parlance until v0.11.0. It does now
([conditional narration](/docs/concepts/conditional-narration/)), which is what turned
moving a real manuscript into a conversion rather than a rewrite.

The fastest way to judge: [play the demo](/demo/), then
[open it in the editor](/docs/get-started/first-project/).

<p class="page-note" id="table-note">† This table is maintained by us, about our competitors — read it with that grain of salt, and tell us if a cell is unfair or out of date.</p>
