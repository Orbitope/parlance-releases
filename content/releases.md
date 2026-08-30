---
title: Releases
description: Every Parlance release — downloads for macOS, Windows, and Linux, with checksums and what changed in each version.
---

# Releases

Every tagged version, with builds for macOS, Windows, and Linux. Each release
carries a **SHA-256 checksum** beside every file so you can verify what you
downloaded, and notes describing what changed. Just want the current build?
[Download](/download/).

<!-- id must not collide with a heading slug: `# Releases` is auto-assigned
     id="releases" by the anchor plugin, and querySelector would match it. -->
<div id="release-list" data-releases-repo="Orbitope/parlance-releases">
  <p class="releases-status">Loading releases…</p>
</div>

<noscript>
  <p><a class="btn btn-primary" href="https://github.com/Orbitope/parlance-releases/releases">View all releases on GitHub →</a></p>
</noscript>

<p class="releases-subscribe">Prefer to subscribe? <a href="/feed.xml">Follow the release feed (RSS)</a> to get new versions in your reader.</p>

## Which file do I want?

| Platform | File | Notes |
|---|---|---|
| **macOS** | `.dmg` | Apple Silicon (M-series). No Intel build yet |
| **Windows** | `.exe` | Installer, x64 |
| **Linux** | `.AppImage` or `.deb` | AppImage runs anywhere; `.deb` for Debian and Ubuntu |
| Any | `.sha256` | Checksum for the file of the same name |

Verify a download by comparing hashes — on macOS or Linux:

```bash
shasum -a 256 -c Parlance-1.0.0.dmg.sha256
```

## Versioning

Parlance follows semantic versioning, and the **data contract carries its own
version** independently of the app — see
[the open spec](/docs/spec/) for what that guarantees. In short: a project
authored today keeps working, and a contract change that would alter what your
files mean is a breaking change with a deprecation window, never a silent
update.

Terms attach to the version you have and never change retroactively
([licensing](/license/)).

## Installing

First launch, where your project lives, and the handful of things that commonly
go wrong: [Install & run](/docs/install/).

Package-manager installs (Homebrew, winget) and an itch.io listing are on the
way. Until then, [Download](/download/) has the current build.
