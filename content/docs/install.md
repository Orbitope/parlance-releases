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

### Linux

**`.deb`** (Debian, Ubuntu): `sudo apt install ./parlance-desktop_*.deb`. On Ubuntu
23.10 and later the package installs a small AppArmor profile so Chromium's sandbox
can start; nothing else is needed.

**AppImage**: `chmod +x Parlance-*.AppImage` and run it. Two things can stop it on
Ubuntu:

- On Ubuntu 23.10 and later an AppImage cannot use the sandbox (AppArmor blocks it,
  and an AppImage cannot carry a profile). If it exits at once with *"The SUID
  sandbox helper binary was found, but is not configured correctly"*, start it with
  `--no-sandbox`, or use the `.deb` instead.
- The AppImage needs FUSE 2, which Ubuntu 22.04 and later no longer install by
  default. If it fails with *"dlopen(): error loading libfuse.so.2"*, run
  `sudo apt install libfuse2` (`libfuse2t64` on 24.04).

## Open a project

Launch Parlance and point it at a project folder. A project is just a directory
containing your narrative files — most often the `data/` directory inside your
**game's own repository**, so your story is versioned alongside the game that
reads it.

- **New to it?** Use **File ▸ New Project…** and pick the **First
  conversation** template: a tiny working project with one character and a
  branching dialogue. **Blank** gives you the empty layout instead.
  (`parlance init my-story --template first-conversation` does the same from
  the [command line](/docs/reference/cli/#parlance-init).)
- **Want to see a finished project?** The demo mystery, *The Mistfall Inn*, is
  [playable in your browser](/demo/). Its project files are not included in the
  app or offered as a download at the moment, so the tutorials that open it in
  the editor need a copy of it from the Parlance source repository.
- **Existing project?** Use **File ▸ Open Project…** and pick the project root.
  If it has a `data/` directory, a `parlance.config.json` or a `schema/`
  directory, Parlance recognizes it. Any other folder is refused with *"Not a
  Parlance project"*: Parlance never scaffolds a folder you open. Create a
  project with **New Project…** or `parlance init` instead.

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

The same validator the app runs is available headless for CI, in the separate
npm package `@orbitope/parlance-cli` (`parlance ci-check`, `parlance route` and
more). The desktop app doesn't install a `parlance` command. See the
[CLI reference](/docs/reference/cli/) and the
[CI tutorial](/docs/get-started/validate-in-ci/).

## When something's wrong

| Symptom | Cause and fix |
|---|---|
| *"Parlance is damaged and can't be opened"* | Unsigned build — run the `xattr -cr` command above, once per download |
| Linux AppImage exits at once: *"The SUID sandbox helper binary was found, but is not configured correctly"* | Ubuntu 23.10+ blocks an AppImage's sandbox. Start it with `--no-sandbox`, or install the `.deb`, which carries the AppArmor profile — see [Linux](#linux) |
| Linux AppImage: *"dlopen(): error loading libfuse.so.2"* | Install FUSE 2: `sudo apt install libfuse2` (`libfuse2t64` on Ubuntu 24.04) |
| *"File changed on disk — reload to see latest version"* | Another editor window, a script, or a `git checkout` changed the file since you loaded it. Reload to pull the latest, then re-save — your edit isn't lost, it's just not applied to a stale base |
| *"Not a Parlance project"* when opening a folder | The folder has no `data/`, `parlance.config.json` or `schema/` at its root. Open the project root itself, not a folder inside it, or create a project with **File ▸ New Project…** |
| The project opens empty | `data` in `parlance.config.json` points somewhere other than your data. See [configuration](/docs/reference/config/) |
| Validation shows errors you don't understand | Every code is explained in the [validation checks reference](/docs/reference/validation-checks/) |
| A canvas looks tangled or a node is hidden behind the minimap | **Auto layout** re-flows the graph; **Map** toggles the minimap; the density toggle shrinks nodes. See [shortcuts](/docs/reference/shortcuts/) |

## Working from source

If you have access to the Parlance repository, the editor also runs from a
source checkout as a local host plus web client — that path is documented in
the repository itself, not here. Everything else in these docs applies
identically either way: same editor, same validator, same files on disk.
