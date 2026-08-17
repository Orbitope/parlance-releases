---
title: The open spec
description: What's MIT-licensed and what isn't — the Parlance format spec, schemas, runtime contract, conformance vectors, and reference validator, and why the split protects your data.
---

# The open spec

Parlance draws a deliberate line through its own codebase: **the format is
open; the tool is a product.** This page is the map of that line.

## The MIT surface

The **spec** — everything needed to read, write, validate, and *execute*
Parlance data without us — is MIT-licensed and published at
**[github.com/Orbitope/parlance-spec](https://github.com/Orbitope/parlance-spec)**:

| Path | What it gives you |
|---|---|
| `schema/` | JSON Schema for every entity type — the authoritative shape of the format, validatable with any JSON Schema library ([schema-first data](/docs/concepts/schema-first/)) |
| `docs/` | The runtime contract (conditions, effects, checks, [ladders](/docs/concepts/dialogue-laddering/), quest resolution, RNG, every edge case), plus integration, naming, versioning, and migration guides |
| `conformance/` | Executable vectors any port must pass — how a runtime [proves itself](/docs/concepts/engine-contract/). Where prose and vectors disagree, the vectors win |
| `validate/` | The standalone Python [reference validator](/docs/reference/cli/#the-python-reference-validator) |

The public [Godot runtime](https://github.com/Orbitope/parlance-gdscript) is
built on exactly this surface — as any engine port, importer, linter, or
pipeline tool can be, in any license, commercial included.

> **Status: awaiting first publication.** The repository is up and MIT, but
> deliberately empty until Parlance tags **v0.9.0** — a spec repo pinned to an
> untagged version gives a port nothing to pin to, which is the whole point of
> publishing. Contents arrive by a one-way sync from the upstream repo.
>
> When it lands: **pin an exact tag**, never a branch or a range, and vendor
> the conformance vectors at that tag. Pre-1.0, breaking changes may land in
> any minor release; the repo's versioning policy is the promise to read
> before pinning. Issues are welcome there; pull requests aren't, since the
> repo is a publication target and a merge would be overwritten by the next
> sync.

## The product surface

The **tool** — editor, host, CLI, MCP server, desktop app — is free to use,
including for commercial releases, but is not open source and may not be
redistributed ([licensing in six bullets](/license/)). The product manuals on
this site (notably the [editor guide](/docs/editor-guide/)) are part of the
product, not the MIT surface.

## Your content

Not ours, in any layer. `data/` and `lore/` are your creative work; the tool's
license doesn't touch them. The demo project is
[CC0](/demo/) so you can strip it for parts.

## Why the split matters

The asymmetry is the anti-lock-in guarantee, stated plainly:

- Your story lives in **readable files** whose meaning is **publicly
  specified** and **testably portable**.
- The worst case — we vanish, we displease you, we price wrong — leaves you
  with all your data, open schemas, an open contract, open vectors, and at
  least one open runtime. You lose an editor, not a game.
- And because that guarantee is MIT, it's irrevocable — it doesn't depend on
  our continued goodwill, which is the only kind of promise worth building on.

**Related:** [the engine contract](/docs/concepts/engine-contract/) ·
[FAQ on licensing](/faq/)
