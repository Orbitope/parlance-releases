---
title: Download
description: Download Parlance for macOS, Windows, or Linux — free for hobby projects and commercial games alike, with no account and no email required.
---

# Download

**Parlance is available now.** Free for hobby projects and commercial games
alike — no account, no email, no license key.

<div id="release-list" data-releases-repo="Orbitope/parlance-releases" data-releases-limit="1">
  <p class="releases-status">Loading the latest release…</p>
</div>

<noscript>
  <p><a class="btn btn-primary" href="https://github.com/Orbitope/parlance-releases/releases/latest">Get the latest release →</a></p>
</noscript>

Every file ships with a **SHA-256 checksum** beside it. [All releases →](/releases/)

## What runs where

| Platform | Build | Notes |
|---|---|---|
| **macOS** | `.dmg`, Apple Silicon | M-series Macs. No Intel build yet |
| **Windows** | `.exe` installer, x64 | |
| **Linux** | `.AppImage` or `.deb` | AppImage runs anywhere; `.deb` for Debian and Ubuntu |

## First launch

These builds are **unsigned**, so both desktop platforms will warn you once.
Nothing is wrong with the download — signing certificates are in progress.

**macOS** may say *"Parlance is damaged and can't be opened."* It isn't. Drag
Parlance to Applications, then run this once:

```bash
xattr -cr /Applications/Parlance.app
```

**Windows** may show *"Windows protected your PC."* Click **More info → Run
anyway**.

Then see [Install & run](/docs/install/) for opening your first project, and
[your first project](/docs/get-started/first-project/) for the ten-minute tour.

If something goes wrong that this page doesn't cover, [tell us](/feedback/) —
there's no telemetry, so a launch failure is invisible unless you report it.

## What it costs

Nothing. No seat count, no revenue threshold, no license key. Your story files
are always yours, and the [format spec is MIT](/docs/spec/) so your data outlives
the tool.

[Licensing in six bullets →](/license/)

## Also available

- **[Play the demo](/demo/)** — the CC0 mystery, in your browser, no install
- **[parlance-spec](https://github.com/Orbitope/parlance-spec)** — schemas,
  runtime contract, conformance vectors, MIT
- **[Godot runtime](https://github.com/Orbitope/parlance-gdscript)** — a
  conformance-verified GDScript port

Package-manager installs and an itch.io listing are on the way.
