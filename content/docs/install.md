---
title: Install & run
description: Installing Parlance, opening a project, where your files live, and fixing the handful of things that commonly go wrong.
---

# Install & run

Parlance is a **local desktop application**. It runs on your machine, reads and
writes your project's files directly, and needs no account, no server, and no
internet connection.

## Get the app

Grab a build from [Download](/download/) — macOS (Apple Silicon), Windows (x64),
or Linux (AppImage or `.deb`). On macOS, drag Parlance to Applications.

> **First launch.** Current builds are unsigned, so each desktop platform warns
> once. On macOS you may see *"Parlance is damaged and can't be opened."* It
> isn't damaged — that's the standard unsigned-app warning. Clear the quarantine
> flag once per download:
> ```bash
> xattr -cr /Applications/Parlance.app
> ```
> On Windows, SmartScreen may say *"Windows protected your PC"* — click
> **More info → Run anyway**.

## Open a project

Launch Parlance and point it at a project folder. A project is just a directory
containing your narrative files — most often the `data/` directory inside your
**game's own repository**, so your story is versioned alongside the game that
reads it.

- **New to it?** Start from the demo project, *The Mistfall Inn* — a complete,
  tiny mystery with every feature in play. [Your first project](/docs/get-started/first-project/)
  walks through it.
- **Starting fresh?** `parlance init my-story` scaffolds the standard layout
  ([CLI reference](/docs/reference/cli/)), or point the app at an empty folder
  and let it scaffold on first save.
- **Existing project?** Just open the folder. If it has a `data/` directory or
  a `parlance.config.json`, Parlance recognizes it.

## Where your files live

Everything is human-readable JSON in your repo — no database, no library
folder, nothing hidden in Application Support:

```
your-game/
  data/          the narrative — what your game reads
  tests/         route fixtures — regression tests
  lore/          Markdown canon docs
  review/        review threads (invisible to the runtime)
  parlance.config.json   optional
```

Full details, including how to relocate any of those directories, are in the
[configuration reference](/docs/reference/config/). Nothing outside your project
folder is written except a few view preferences (panel widths, node density),
which live in the app's local storage and never in your repo.

## Command line

The same validator the app runs on every save is available headless for CI —
`parlance ci-check` and `parlance route` — see the
[CLI reference](/docs/reference/cli/) and the
[CI tutorial](/docs/get-started/validate-in-ci/).

## When something's wrong

| Symptom | Cause and fix |
|---|---|
| *"Parlance is damaged and can't be opened"* | Unsigned build — run the `xattr -cr` command above, once per download |
| *"File changed on disk — reload to see latest version"* | Another editor window, a script, or a `git checkout` changed the file since you loaded it. Reload to pull the latest, then re-save — your edit isn't lost, it's just not applied to a stale base |
| The project opens empty | The folder isn't a Parlance project (no `data/`, no `parlance.config.json`), or `data` is pointed elsewhere in the config. See [configuration](/docs/reference/config/) |
| Validation shows errors you don't understand | Every code is explained in the [validation checks reference](/docs/reference/validation-checks/) |
| A canvas looks tangled or a node is hidden behind the minimap | **Auto layout** re-flows the graph; **Map** toggles the minimap; the density toggle shrinks nodes. See [shortcuts](/docs/reference/shortcuts/) |

## Working from source

If you have access to the Parlance repository, the editor also runs from a
source checkout as a local host plus web client — that path is documented in
the repository itself, not here. Everything else in these docs applies
identically either way: same editor, same validator, same files on disk.
