---
title: FAQ
description: Frequently asked questions about Parlance — licensing, the JSON format, engines, pricing, and how the pieces fit.
---

# FAQ

## Why plain JSON files instead of a database?

Because everything narrative teams struggle with — versioning, merging, review,
backup, tooling — is already solved for files in a repo. One entity per file
means per-entity diffs; canonical serialization (sorted keys, stable formatting)
means a one-line story edit is a one-line diff. Any text editor, script, or
pipeline can read your story without Parlance in the room.
More: [git-native workflow](/docs/concepts/git-native/).

## Why is there no export step?

An exporter is a place where the authored truth and the shipped truth drift
apart. Parlance's answer is a **contract**: the engine reads the exact files the
editor writes, and the runtime semantics are published with conformance vectors
that ports verify against. More: [the engine contract](/docs/concepts/engine-contract/).

## Which engines work with it?

Any engine that can read JSON. The [Godot runtime](https://github.com/Orbitope/parlance-gdscript)
is public and conformance-verified; the TypeScript reference runtime powers the
editor and playtesting; the [integration docs](/docs/integrations/) cover
porting to anything else — the conformance suite tells you when your port is
correct.

## What's the licensing split?

Three layers, deliberately different:

| Layer | License |
|---|---|
| The **format spec** — schemas, runtime contract, conformance vectors, reference validator | **MIT**, published at [parlance-spec](https://github.com/Orbitope/parlance-spec) — open forever, so your data and third-party runtimes never depend on our goodwill |
| The **Parlance tool** — editor, host, CLI, MCP server | Free to use, including for commercial games; not open source and not redistributable ([details](/license/)) |
| **Your narrative content** | Yours. Entirely. The tool's license doesn't touch `data/` or `lore/` |

The manuals on this site are © and not part of the MIT surface.
More: [licensing](/license/) · [the open spec](/docs/spec/).

## How much does it cost?

Nothing. The editor is free — for hobby projects and commercial releases alike,
with no seat count, revenue threshold, or license key.

Paid products come later and separately: hosted review links, hosted editing for
teams, and a self-hosted server license — things that cost real money to run and
are worth it to a team of ten writers. The local editor isn't one of them.
[More on that](/license/#then-how-does-parlance-make-money).

## Is my story safe in AI training / telemetry?

Parlance is local-first: no cloud service, no accounts, no telemetry. Your
files never leave your machine unless you push them somewhere. The optional
[AI drafting](/docs/integrations/#ai-drafting) feature only sends what you ask
it to draft, to the provider you configure, with your API key.

## Does it handle localization and voice-over?

Yes — every player-facing string is extracted with a stable key; translators get
flat JSON templates; coverage and stale keys are tracked per language, and VO
maps voiceable lines to engine audio keys the same way. See the
[editor guide](/docs/editor-guide/#15-localization--vo).

## What's "dialogue laddering"?

The mechanism that answers "which dialogue plays when I talk to this character
*right now*?" — an ordered, state-gated list per character, resolved
first-match-wins, with static checks for the classic ordering mistakes. It's the
heart of state-aware conversations in Parlance:
[dialogue laddering, explained](/docs/concepts/dialogue-laddering/).

## Can a team use it without a server?

Yes — that's the design. Review (comments, suggestions, verdicts, narrative
diffs) works with **nothing but git**: two people with plain clones have a full
review workflow. See [git-native workflow](/docs/concepts/git-native/).

## Something's broken. Where do I report it?

[GitHub issues](https://github.com/Orbitope/parlance-releases/issues/new/choose),
with the version and steps — the form asks for what's needed. Parlance has no
telemetry and no crash reporter, so a bug nobody files is a bug nobody knows
about. Anything you can't say in public (licensing, security, a repro that would
spoil your own game) goes to **orbitopegames@gmail.com** instead.
[The whole process, in one page](/feedback/).

## Where do I start?

[Play the demo](/demo/) (two minutes), then
[your first project](/docs/get-started/first-project/) (ten minutes), then
[how it all fits together](/docs/concepts/workflow/).
