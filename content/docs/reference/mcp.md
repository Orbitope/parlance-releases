---
title: MCP server
description: The Parlance MCP server — seven tools that let LLM agents read, create, and update narrative entities through the same validated path as the editor.
---

# MCP server

`@parlance/mcp` exposes a Parlance project to LLM agents over the
[Model Context Protocol](https://modelcontextprotocol.io) — a stdio process, no
web server, no accounts. Agents work through the **same validated write path
as the editor**: schema-checked, canonically serialized, re-validated after
every write. An agent can draft a faction's worth of characters; it cannot
write malformed data.

## Setup

Add to your MCP client config (for Claude Code, `.claude/mcp_servers.json`):

```json
{
  "parlance": {
    "command": "node",
    "args": ["<path to the Parlance MCP server>"],
    "env": {
      "PARLANCE_ROOT": "/path/to/your/project"
    }
  }
}
```

The server ships with Parlance; the exact path is listed in the app's settings.
`PARLANCE_ROOT` must point at the directory containing `data/`
([root resolution](/docs/reference/config/)).

## Tools

| Tool | What it does |
|---|---|
| `list_entities` | List all entities of a type (characters, dialogues, quests, factions, locations, skills, variables, endings, codex) |
| `get_entity` | Full JSON for one entity by type + id |
| `entity_exists` | Existence check — decide create vs. update before writing |
| `generate_id` | Convert a human-readable name to a canonical id per the naming standards (with optional collision checking) |
| `validate_project` | Run the full validator, return every issue |
| `create_entity` | Write a new entity (id generated from `name` if omitted); supports `dry_run` |
| `update_entity` | Non-destructive merge patch on an existing entity; supports `dry_run` |

Two behaviors are the safety story:

- **`dry_run`** on both write tools reports what *would* happen — including
  validation results — without touching disk.
- **Writes always re-validate.** `create_entity` and `update_entity` run the
  project validator after writing and return any new issues, so the agent
  sees the consequences of its edit in the same turn and can fix its own
  `REF` errors.

## A typical agent loop

Batch-importing entities from an outline (or a Notion database, a spreadsheet,
anywhere):

1. `generate_id` for each name, with collision checking on.
2. `entity_exists` → decide create vs. update.
3. `create_entity` / `update_entity` with the mapped fields.
4. One final `validate_project` to confirm a clean state.

Because everything lands as [canonical JSON in git](/docs/concepts/git-native/),
the agent's whole session is one reviewable diff — you read what it did in a
pull request, comment, and revert cleanly if the tone is off. Combined with
in-editor [AI drafting](/docs/integrations/#ai-drafting), this is Parlance's
answer to AI-assisted writing: agents propose through validated channels,
humans keep the merge button.
