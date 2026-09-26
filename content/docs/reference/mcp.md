---
title: MCP server
description: The Parlance MCP server — twelve tools that let LLM agents read, create, update and rename narrative entities, and edit custom game data, with every write validated before it lands.
---

# MCP server

`@parlance/mcp` exposes a Parlance project to LLM agents over the
[Model Context Protocol](https://modelcontextprotocol.io) — a stdio process, no
web server, no accounts. Agents write through the **same storage path as the
editor**: canonically serialized JSON, with locked writes to the shared
registry files. Every write is validated before anything touches disk. A write
that would give the entity a schema error is refused and nothing is written;
reference and other cross-entity issues are reported with the result, as the
editor reports them, but don't block the write.

## Get the server

The MCP server **ships inside the desktop app** — there is nothing else to
install, and no separate Node.js: it runs on the app's own runtime. (It is not
published to npm.)

With a project open, choose **Help ▸ Connect an AI Agent…**. The dialog shows the
configuration for *this* install and *this* project, ready to paste, with buttons
that copy it:

- **Copy .mcp.json** — a project-scoped `.mcp.json` for Claude Code. Save it at
  the root of the folder you run Claude Code in.
- **Copy claude mcp add** — the same thing as one `claude mcp add` command.
- **Copy for Other Clients** — command, arguments and environment, for any MCP
  client that launches a stdio server. Clients that read an `mcpServers` block
  (Claude Desktop, Cursor and most others) take the `.mcp.json` entry as-is.

If no project is open, the dialog still works, and says that `PARLANCE_ROOT` is a
placeholder for you to fill in.

## Setup

The config the dialog gives you has this shape — the app's own executable run as
Node (`ELECTRON_RUN_AS_NODE=1`), with the bundled server as its argument:

```json
{
  "mcpServers": {
    "parlance": {
      "command": "/Applications/Parlance.app/Contents/MacOS/Parlance",
      "args": ["/Applications/Parlance.app/Contents/Resources/mcp/parlance-mcp.mjs"],
      "env": {
        "ELECTRON_RUN_AS_NODE": "1",
        "PARLANCE_ROOT": "/path/to/your/project"
      }
    }
  }
}
```

On Windows the command is `Parlance.exe` and the server is under its
`resources\mcp\` folder; on Linux, `/opt/Parlance/parlance-desktop` and
`/opt/Parlance/resources/mcp/` for the `.deb`. Copy the paths from the dialog
rather than typing them: they are exact for your install. If you run the
AppImage, the command is the `.AppImage` file itself and the server is copied to
Parlance's settings folder, because the AppImage's own files only exist while it
is running. The paths point into the app, so after moving or reinstalling
Parlance, copy the config again.

The paths are specific to one machine, so a `.mcp.json` with them is a poor fit
for committing to a shared repository; each writer takes theirs from their own
dialog.

`PARLANCE_ROOT` is the project root: the directory that holds `data/` or
`parlance.config.json` ([root resolution](/docs/reference/config/)). Without it
the server uses the directory it was started in. The root is read once, when the
server starts.

## Tools

| Tool | What it does |
|---|---|
| `list_entities` | List all entities of a type (skills, variables, factions, characters, dialogues, quests, locations, endings, codex, items, portraits, cutscenes, routes, snapshots) |
| `get_entity` | Full JSON for one entity by type + id |
| `entity_exists` | Existence check — decide create vs. update before writing |
| `generate_id` | Convert a human-readable name to a canonical id per the naming standards (with optional collision checking) |
| `validate_project` | Run the full validator, return every issue |
| `create_entity` | Write a new entity (id generated from `name` if omitted); refused if the entity fails its schema; supports `dry_run` |
| `update_entity` | Shallow merge patch on an existing entity (each top-level field in the patch replaces that field); refused if the result fails its schema, or if `base_hash` is stale; supports `dry_run` |
| `rename_entity` | Change an entity's id and rewrite every reference to it, as the editor's **Rename id** does. `dry_run` returns the plan and a `plan_hash`; applying with that hash is refused if the project changed in between |
| `list_custom_types` | The project's [custom types](/docs/editor-guide/#custom-types--the-grid): fields, storage and row counts |
| `get_custom_rows` | A custom type's rows, each with the hash needed to change it; pages through large tables |
| `save_custom_rows` | Create, replace or delete custom rows in one write — all land or none do. A row changed on disk since it was read, or a row that fails its type's fields, refuses the whole batch; supports `dry_run` |
| `declare_custom_type` | Declare, redefine or delete a custom type, checked as the editor's Fields panel checks it; renaming a field rewrites every row |

Three behaviors are the safety story:

- **`dry_run`** on `create_entity`, `update_entity`, `save_custom_rows` and
  `rename_entity` reports what *would* happen — including validation results —
  without touching disk.
- **Schema errors are refused.** `create_entity`, `update_entity` and
  `save_custom_rows` validate the result in memory first. If what is being
  written has a `SCHEMA` error of its own, the tool returns `written: false`
  with the issues and nothing on disk changes. Other issues, such as a `REF` to
  an id that doesn't exist yet, don't block the write.
- **Every result carries the project's issues.** After a write the tools re-run
  the project validator and return the issues, so the agent sees the
  consequences of its edit in the same turn and can fix its own `REF` errors.

## A typical agent loop

Batch-importing entities from an outline (or a Notion database, a spreadsheet,
anywhere):

1. `generate_id` for each name, with collision checking on.
2. `entity_exists` → decide create vs. update.
3. `create_entity` / `update_entity` with the mapped fields, `dry_run` first if
   the mapping is new.
4. One final `validate_project` to confirm a clean state.

Because everything lands as [canonical JSON in git](/docs/concepts/git-native/),
the agent's whole session is one reviewable diff — you read what it did in a
pull request, comment, and revert cleanly if the tone is off. Combined with
in-editor [AI drafting](/docs/integrations/#ai-drafting), this is Parlance's
answer to AI-assisted writing: agents propose through validated channels,
humans keep the merge button.
