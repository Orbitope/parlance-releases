---
title: Play the demo
description: The Mistfall Inn — a complete, tiny Parlance mystery you can play in your browser. One night, one body, three suspects, three endings.
---

# The Mistfall Inn

A complete, tiny Parlance project you can play right now. **One night, one body,
three suspects, three endings.**

<div class="dialogue-sample">
  <div class="speaker">Narration</div>
  <p class="line">The Kelder bridge washes out at midnight and strands five travellers
  at the Mistfall. Before dawn, Halloran Vane of the Crown Assessment is dead at the
  corner table with his wine gone cold. You are a magistrate's clerk. The militia
  arrives at first light and takes whoever you name.</p>
</div>

<p><a class="btn btn-mint" href="/play/mistfall.html">▶ Play in your browser</a></p>

This is a **share build** — the same single-file HTML export any Parlance author
can hand to a writer or playtester from the canvas toolbar. It runs the real
runtime: checks roll with seeded dice, `showIf` gates evaluate, effects apply,
and scenes route, all in one file with no server.

## What it demonstrates

Every feature in the demo is doing a job:

| Feature | Where you'll meet it |
|---|---|
| Skill checks with a real failure branch | Examining the body — failing Observation still moves the plot, it just costs you a detail |
| [Dialogue ladders](/docs/concepts/dialogue-laddering/) | Each suspect has a gated rung on top and a fallthrough below — talk to anyone twice and the conversation re-points |
| Evidence-gated choices | Cornering Wren offers a different way in for each piece of evidence you actually hold |
| Items as gates | The stable yard needs a lantern; without it a different scene plays |
| Counters | The militia won't act on fewer than three facts — `evidence_count` gates the accusation |
| Text variables | Give your name at the door and Bragg uses it later |
| Quest stages & outcomes | One inquest, three stages, three outcomes — one per ending |
| Multiple endings | Right name, wrong name, no name. None of them are clean. |

## Then look behind the curtain

The whole project is ~40 human-readable JSON files, released **CC0** — data,
route fixtures, and the lore doc with the actual solution. It ships with the
app, so it's the first thing you can open.

- [Open it in the editor](/docs/get-started/first-project/) and see the same
  scenes as node graphs, ladders, and quest stages.
- It validates clean under `--strict` — zero errors, zero warnings — and CI
  keeps it that way. It's also the reference project used throughout the
  [tutorials](/docs/get-started/).
