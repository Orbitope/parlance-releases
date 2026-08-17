---
title: Git-native workflow
description: Why Parlance treats your repo as the database — per-entity diffs, branch-based narrative review with comments and suggestions, and no server anywhere.
---

# Git-native workflow

Parlance has no database, no cloud service, and no accounts. Your repository is
the project. That's not a limitation being spun — it's the design bet the whole
tool is built on: everything teams struggle with in narrative pipelines
(versioning, merging, review, backup, tooling access) is *already solved* for
plain files in version control.

## Files that diff like they mean it

- **One JSON file per entity.** A dialogue is a file; a character is a file.
  Git history answers "what changed in this scene" per scene, not per
  database-dump.
- **Canonical serialization** (sorted keys, stable formatting — see
  [schema-first data](/docs/concepts/schema-first/)) means a one-line edit
  produces a one-line diff.

```diff
   "text":
-  "I sell tinctures. Nothing stronger."
+  "I sell tinctures, magistrate. Nothing stronger —
+   nothing that would do *that* to a man."
```

- **Editor metadata never pollutes content.** Canvas node positions live in
  `*.layout.json` sidecars that are **gitignored** — your graph arrangement is
  a personal concern, and `data/` stays pure story. Deleting a sidecar just
  re-runs auto-layout.
- **Review data can't break the build.** The `review/` directory is invisible
  to the runtime, the loaders, and the validator — a stale comment can never
  fail a narrative build.
- If two writers (or a script) touch the same file, the editor's
  **stale-load detection** catches the conflict at save time (a 409 — reload
  and re-save) instead of silently clobbering.

## Review: reading someone else's branch

The [Review surface](/docs/editor-guide/#16-review--reading-someone-elses-branch)
turns a branch into a reviewable *story*, using nothing but git — a two-person
team on plain clones gets working review with no server anywhere.

- **Roles are decided by git, not modes.** Have the branch checked out? You're
  its author. Otherwise you're a reviewer, reading a snapshot — your own
  working tree is never touched.
- **Narrative diffs, not file diffs.** "2 nodes added, 1 line edited, ladder
  reordered" — per-entity before/after lines, flags introduced or retired, and
  the validation delta.
- **Play the branch.** Reviewers run the branch's *own* content in
  [playtest](/docs/concepts/playtest-determinism/) — hear the scene as it
  actually plays before saying anything about it, with a 💬 on every transcript
  line that opens a comment anchored to that exact node.
- **Comments anchor to story, not line numbers** — a node, a choice, a field.
  Renaming things doesn't orphan discussion silently; threads get flagged
  *stale anchor* instead.
- **Suggestions are the reviewer's edit**: they propose replacement text, the
  author applies it with one button. Content edits stay with one writer, which
  is what keeps review data conflict-free.
- **Verdicts record what was actually read.** Approve / request-changes is
  stamped against a commit; push more work and the review says "the branch has
  moved since this verdict" rather than showing a stale tick.
- **Merging** happens only from a clean base checkout, cleanly or not at all —
  conflicts are resolved in git, not inside a narrative editor.

## What Parlance deliberately isn't

It is not a git client. No branch creation, no conflict resolution, no history
editing, no PR sync. Branches and merges stay in the tools built for them;
Parlance adds the narrative-shaped layer those tools can't see.

## And because it's all just files in CI's reach…

the same repo that holds the story can *gate* on the story:
[`parlance ci-check`](/docs/reference/cli/) runs the full validator headless,
and [route fixtures](/docs/get-started/validate-in-ci/) replay scripted
playthroughs with assertions. Narrative regressions fail the build. That's the
[whole loop](/docs/concepts/workflow/).
