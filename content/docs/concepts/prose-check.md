---
title: The prose check
description: A spell check that knows your characters' names — how Parlance derives a project dictionary from your own data, and why misspelling a proper noun is the defect that actually accumulates.
---

# The prose check

Every other check in Parlance is structural: references, flow, reachability,
interpolation. None of them read the writing.

The defect that actually accumulates in a long project written by more than one
person is not a broken `goto`. It is a proper noun spelled three ways across two
years, and ordinary typos in text nobody re-reads. Both are invisible to a
validator, and both ship.

## Your own names are the dictionary

The interesting layer isn't the English dictionary. It's that Parlance derives
your project's proper nouns **from your own data** — every character, faction,
item, location, skill, codex entry, ending and quest journal name — and matches
them case-sensitively.

So, given a character named `Kestrel`:

| In your prose | Reported as |
|---|---|
| `Kestral waits by the gate.` | **Canon near-miss** — "close to the canon name 'Kestrel'" |
| `kestrel waits by the gate.` | **Canon capitalization** — one of your names, written lowercase |
| `Kestrel waits by the gate.` | nothing |

Neither of the first two is a finding a general-purpose spell checker can produce,
because it has never heard of Kestrel. And there is no list to maintain: rename
the character and the check follows.

### One deliberate limitation

A name that is *also* an ordinary English word — a character called "Hawk", a
faction called "The Order" — is **not** treated as a canon name. Nothing can
distinguish "the hawk circled" from "the Hawk circled" without understanding the
sentence, so those words are simply spell-checked normally.

That rule is the difference between a usable report and an unusable one. Entity
names are title-cased, so without it every ordinary "the" in the project gets
flagged as a miscapitalized `The` — measured at 141 false findings on a small
project before the rule existed.

## Three layers

| Layer | Source | You maintain it? |
|---|---|---|
| Your names | derived from `data/` at check time | no — automatic |
| Your words | `lore/dictionary.md` | yes |
| English | bundled with the editor | no |

`lore/dictionary.md` is plain Markdown so a writer can edit it without touching
JSON, and each entry can carry the reason it's there:

```markdown
## Words

- Vashti — the merchant. Not "Vashi".
- gaolhouse
```

It lives in `lore/` because it is authoring canon that never ships to the game.

## Where it shows up

- **Reports → Prose** — findings grouped by kind, each row navigating to the entity, with **+ dictionary** on unknown words.
- **Inline** — underlines as you type, heavier for a name problem than an unknown word.
- **CI** — `npm run prose -- --check` fails the build on a new typo.

It runs on demand, never on save, and it is fast enough not to think about:
845 ms across a 1.02-million-word project.

## Sorting the first run

On a large project the first run is mostly proper nouns rather than typos, and a
wall of red is how a feature like this gets abandoned in a week. Deriving your
names removes most of it for free. For what remains there's an optional AI pass
that sorts unknown words into names, jargon, dialect and real typos, using your own
API key.

It only *classifies* words the deterministic check already found. It never edits
prose, never writes anything until you accept it, and never adds a typo to the
dictionary. Everything else on this page works offline and needs no key.

## Not part of the contract

Spelling is editorial, not structural — it says nothing about whether a project
conforms to the format. So the [reference validator](/docs/spec/) doesn't implement
it, no conformance vector covers it, and it emits its own `SPELL` code that
[validation](/docs/concepts/validation/) never produces.

## See also

- [`SPELL` in the validation checks](/docs/reference/validation-checks/)
- [Editor guide: Reports](/docs/editor-guide/#11-reports--coverage--reference-index)
