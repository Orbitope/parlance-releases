---
title: Schema-first data
description: Nineteen JSON Schemas are Parlance's single source of truth — driving validation and the editor's forms from the same files, so malformed narrative data cannot exist.
---

# Schema-first data

Every Parlance entity type is defined by a JSON Schema — nineteen of them,
covering characters, dialogues, quests, locations, and the rest, down to route
fixtures and review threads. The schemas aren't documentation *about* the
format; they are the format.

## One definition, two jobs

The editor loads the schemas for two purposes at once:

1. **Validation.** Every save is checked against the schema (the `SCHEMA` check
   family) before anything else. A field with the wrong type, a missing
   required key, an unknown enum value — none of it can reach disk quietly.
2. **Form generation.** The entity forms are *generated from the same schemas*.
   A string field becomes a text input; an enum becomes a dropdown; a reference
   field becomes a dropdown of the actual matching entities; a `min`/`max` pair
   becomes two number inputs. There is no per-type form code to fall out of
   sync with the format.

This is the quiet reason the editor feels trustworthy: the thing that rejects
bad data and the thing that helps you enter good data cannot disagree, because
they are the same file.

## What it means for your project

- **You don't vendor schemas by default.** The editor ships with the bundled
  set; a project needs its own `schema/` directory only to **pin a contract
  version** (or point `schema` in
  [`parlance.config.json`](/docs/reference/config/) somewhere else). If you do
  vendor, your copy wins — loudly, even if the path is a typo, so
  misconfiguration surfaces instead of silently falling back.
- **Adding a field is one schema edit away** from appearing in the form,
  the validator, and the serialized output.
- **Third-party tooling gets the same guarantees.** The schemas are part of the
  [MIT-licensed spec surface](/docs/spec/), so a pipeline script or engine
  importer can validate data with any JSON Schema library — no Parlance code
  required.

## Canonical serialization

Schema-validity says what data *means*; canonical serialization says what it
*looks like* on disk: sorted keys, 2-space indent, LF endings, literal UTF-8.
Every file the editor writes is in canonical form, which is what keeps diffs
honest — a one-line story edit is a one-line diff, never a whole-file reflow.

Hand-authored or script-generated files can drift (Python's `json.dumps`
escapes non-ASCII by default, for instance). The editor normalizes on every
save, so re-saving a drifted file through Parlance restores canonical form.

## Where the semantics live

Schemas constrain *shape*. What the data **does** when executed — how
conditions evaluate, how effects apply, how
[ladders resolve](/docs/concepts/dialogue-laddering/) — is defined by the
runtime contract and its conformance vectors:
[the engine contract](/docs/concepts/engine-contract/). The two layers
together are the spec.

**Related:** [configuration reference](/docs/reference/config/) ·
[validation model](/docs/concepts/validation/) · [the open spec](/docs/spec/)
