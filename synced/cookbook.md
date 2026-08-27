# Pattern cookbook — common narrative-logic recipes

Parlance gives you a small, sharp toolkit: **conditions** (predicates over state),
**effects** (state changes), an ordered **dialogue ladder** per character, and per-node /
per-choice **`showIf`** gates. Almost every recurring narrative-logic problem is a
specific arrangement of those four things.

This cookbook is the arrangements. Each recipe names a problem writers hit in every
narrative engine, shows the Parlance way to solve it, and — under **Also known as** —
points at how Ink, Yarn Spinner, Twine, and Ren'Py spell the same idea, so a writer
arriving from another tool can find the pattern by the name they already know.

None of this is new engine capability. It is the vocabulary already in
`schema/common.schema.json` (conditions and effects), `schema/dialogue.schema.json`
(nodes, `showIf`, `next`, `onEnter`), and `schema/character.schema.json` (the ladder),
used on purpose. When a recipe leans on a rule with a sharp edge, the edge is called out
in **Pitfalls** — most of them are things that have actually bitten someone here.

## The four primitives, in one breath

- **Condition** — a testable predicate: `flag`, `counter`, `reputation` (faction),
  `relationship` (character), `skill`, `item`, `quest` (compared by stage *order*),
  `questOutcome`, composed with `all` / `any` / `not`. Conditions live on ladder rungs,
  `dialogue.availableWhen`, `node.showIf`, `choice.showIf`, quest gates, location exits,
  codex unlocks, and ending conditions.
- **Effect** — a state change fired from `node.onEnter` or `choice.effects`: `set_flag`,
  `adjust_counter`, `adjust_reputation`, `adjust_relationship`, `give_item` / `take_item`,
  `advance_quest`, `grant_xp`, `set_active_dialogue`, `play_cutscene`, `set_text`.
- **The ladder** — `character.dialogues` is an **ordered, first-match-wins** list.
  Resolution walks top to bottom and returns the first rung whose `showIf` passes. A rung
  with no `showIf` always matches (the fallthrough). **Array order is significant.**
- **`showIf` on a node** — display gate on an *interstitial* beat. When it fails the node
  is skipped and resolution continues at `next`. Its text is not shown **and its
  `onEnter` effects DO NOT fire.** Requires `next`; forbidden with `choices` / `isEnd`.

Everything below is built out of exactly these.

---

## 1. Say-it-once (state-gated re-entry) — the flagship

**Problem.** The first time the player meets the Warden he recruits them: a whole scene.
Every visit after, they just want the one useful line — the checkpoint code, today's
orders. You do not want to replay the recruitment.

**Recipe.** Two dialogues and one flag, arranged on the ladder. The intro fires a
`set_flag` as its side effect; the ladder rung for the intro is gated on that flag being
*unset*, so once it fires the rung stops matching and the shorter dialogue wins.

```jsonc
// character npc_warden — dialogues ladder (order matters: specific → fallthrough)
"dialogues": [
  {
    "dialogue": "dlg_warden_recruit",
    "showIf": { "type": "not", "of": { "type": "flag", "flag": "met_warden", "value": true } }
  },
  { "dialogue": "dlg_warden_brief" }   // no showIf — the fallthrough, wins forever after
]
```

```jsonc
// dlg_warden_recruit — its ending beat records that the scene has played
{
  "id": "node_sworn_in", "isEnd": true,
  "onEnter": [ { "type": "set_flag", "flag": "met_warden", "value": true } ],
  "text": "'Then you're one of us. Report to the checkpoint.'"
}
```

Now: first talk → `met_warden` is false → recruit plays → on its way out it sets
`met_warden`. Every later talk → recruit rung fails → `dlg_warden_brief` (the short
informational one) wins.

**Pitfalls.**
- **Set the flag on a beat the player actually *reaches*.** If recruitment can end on
  several nodes, put the `set_flag` on each ending, or on an early unconditional beat —
  not on one branch the player might skip.
- If instead you keep *one* dialogue and mark it `replayable`, use recipe **2** to skip
  the setup — don't try to gate a whole dialogue's worth of beats with one flag.
- Declare `met_warden` in `data/variables.json` (kind `flag`) or the validator flags an
  unknown reference.

**Also known as.** Ink: a `{knot > 0}` seen-check, or a `VAR met = false` set once.
Yarn: `once` / `visited("warden")`. Twine: `(if: not visited())` (Harlowe) /
`<<if visited() is 1>>` (SugarCube). Ren'Py: `if not persistent.met_warden:` or
`renpy.seen_label()`.

---

## 2. Skip the setup (node-level `showIf`)

**Problem.** Same goal as recipe 1, but you want to keep it in **one** dialogue — the
first three beats are scene-setting you only want once; the menu at the bottom is
evergreen.

**Recipe.** Mark the dialogue `replayable`. Make the setup beats interstitial nodes
(`text` + `next`, no choices) and gate each with `showIf`. When the gate fails the beat is
skipped and flow jumps to `next` — landing on the evergreen menu.

```jsonc
{ "replayable": true, "entry": "node_establish", "nodes": [
  {
    "id": "node_establish",
    "showIf": { "type": "not", "of": { "type": "flag", "flag": "seen_office", "value": true } },
    "text": "The office reeks of cold coffee. She doesn't look up.",
    "next": "node_office_seen"
  },
  {
    "id": "node_office_seen",
    "onEnter": [ { "type": "set_flag", "flag": "seen_office", "value": true } ],
    "text": "'Well? What do you want?'",
    "next": "node_menu"
  },
  { "id": "node_menu", "text": "…", "choices": [ /* evergreen menu */ ] }
] }
```

**Pitfalls.**
- **`onEnter` on a skipped node never fires.** That is exactly why the `set_flag` sits on
  `node_office_seen` (never skipped), not on `node_establish` (skipped on re-entry). Put
  the flag-write on the beat that *survives* the skip.
- A `showIf` node **must** have `next` and **must not** have `choices` or `isEnd` (FLOW
  rule). The skip is only defined for listen-only beats. A `next` chain must end at a node
  with no `showIf`, or resolution can fall off the end.
- Recipe 1 vs 2: use **1** when the two versions are structurally different conversations;
  use **2** when it is one conversation with a disposable preamble.

**Also known as.** Ink once-only gather / `{ ... }` once-only alternatives. Yarn
`<<once>>`. Ren'Py content guarded by a `seen` flag inside one label.

---

## 3. Event memory (world reacts to what you did)

**Problem.** The player sabotages the relay in a cutscene or a conversation. Later, an
*unrelated* character should already know — comment on it, treat the player differently.

**Recipe.** The action writes a flag; anyone, anywhere, reads it. Effects and conditions
share one global state, so a `set_flag` in one dialogue is visible to every `showIf`,
ladder rung, quest gate, and ending in the project.

```jsonc
// in the sabotage dialogue
"effects": [ { "type": "set_flag", "flag": "relay_sabotaged", "value": true } ]
```
```jsonc
// a bystander's dialogue, days later — a beat that only exists if it happened
{
  "id": "node_gossip",
  "showIf": { "type": "flag", "flag": "relay_sabotaged", "value": true },
  "text": "'Heard the relay went dark. That was you, wasn't it.'",
  "next": "node_menu"
}
```

**Pitfalls.**
- Name flags for the **world fact**, not the scene that set them: `relay_sabotaged`, not
  `did_dialogue_17`. Facts get read from places you haven't written yet.
- One flag, many readers is the whole point — but it also means renaming it touches
  everything. Use the editor's find-usages before you rename.

**Also known as.** Emily Short's "world model as shared state"; Ink/Yarn global `VAR`s
read across knots/nodes; Twine story variables (`$relay_sabotaged`); Ren'Py module-level
`default relay_sabotaged = False`.

---

## 4. Knowledge unlock (learning X opens a door elsewhere)

**Problem.** You cannot ask the Broker about the "sealed letter" until someone has told
you it exists. Once you know, the option should appear on its own.

**Recipe.** Learning the fact sets a knowledge flag; the option that requires the fact
carries a matching `choice.showIf`. This is event memory (recipe 3) pointed at the
player's *knowledge* rather than the world's state.

```jsonc
// the informant's line grants the knowledge
"effects": [ { "type": "set_flag", "flag": "knows_letter", "value": true } ]
```
```jsonc
// the Broker's menu — this choice is hidden until you know
{
  "id": "ch_ask_letter",
  "showIf": { "type": "flag", "flag": "knows_letter", "value": true },
  "text": "Ask about the sealed letter.",
  "goto": "node_letter"
}
```

**Pitfalls.**
- Keep "knows about X" separate from "has done X." Knowing the letter exists
  (`knows_letter`) is not owning it (`item: sealed_letter`) — they gate different things.
- If a topic should be learnable from several sources, every source sets the *same* flag.

**Also known as.** Elder Scrolls topic lists; Ace Attorney "evidence"; Disco Elysium
thoughts; Ink `knows_X = true`; Yarn knowledge variables.

---

## 5. One-shot option (a choice that spends itself)

**Problem.** "Pocket the ledger" should be offered once. After the player takes it, the
option must be gone — not greyed, gone — even on a replayable dialogue.

**Recipe.** The choice both fires a flag and hides on that same flag. Its `effects` set
it; its `showIf` requires it *unset*.

```jsonc
{
  "id": "ch_pocket_ledger",
  "showIf": { "type": "not", "of": { "type": "flag", "flag": "took_ledger", "value": true } },
  "text": "Pocket the ledger while she's turned away.",
  "effects": [
    { "type": "set_flag", "flag": "took_ledger", "value": true },
    { "type": "give_item", "item": "burned_ledger" }
  ],
  "goto": "node_pocketed"
}
```

**Pitfalls.**
- For an item you can only hold one of, gate on the **item** instead
  (`{ "type": "item", "item": "burned_ledger", "has": false }`) and skip the extra flag —
  the inventory *is* the memory.
- The schema comment on `replayable` names this exact pattern: on re-entry, "once-only
  choices (showIf flag gates) will simply not appear."

**Also known as.** Ink once-only `*` choices; Yarn a choice inside `<<if not $took>>`;
Twine `(link:)` that `(set:)`s then vanishes; Ren'Py menu option `"Take it" if not taken:`.

---

## 6. Hub-and-spoke topic menu

**Problem.** An interrogation or a shopkeeper: a central menu, the player picks a topic,
hears it, comes back to the menu, and topics they've exhausted stop cluttering it.

**Recipe.** A hub node whose choices `goto` topic nodes; each topic ends by routing
`next` back to the hub. Mark a topic done with a flag and hide its choice on that flag.
Add an unconditional "That's all" exit and, optionally, an "anything else?" beat.

```jsonc
{ "id": "node_hub", "text": "'Ask what you like.'", "choices": [
  {
    "id": "ch_topic_bridge",
    "showIf": { "type": "not", "of": { "type": "flag", "flag": "asked_bridge", "value": true } },
    "text": "The bridge — who controls it?",
    "effects": [ { "type": "set_flag", "flag": "asked_bridge", "value": true } ],
    "goto": "node_bridge"
  },
  { "id": "ch_leave", "text": "That's all for now.", "goto": "node_bye" }
] }
```
```jsonc
{ "id": "node_bridge", "text": "'The Order holds it. For now.'", "next": "node_hub" }
```

**Pitfalls.**
- **Always keep one exit whose `showIf` can never fail** (or none at all), or a player who
  exhausts every topic is trapped in a menu with no way out — a REACH-class dead end.
- The topic nodes use `next` back to the hub, so they can't also carry `choices`. Put the
  branching *in the hub*, keep the spokes listen-only.

**Also known as.** Ink weave with a gather acting as the hub; Yarn a node the options
jump back to; Twine a central passage; the classic RPG "conversation topics" wheel.

---

## 7. Gating & prerequisites (hard gate vs. soft gate)

**Problem.** Some content requires a prerequisite. Sometimes you want it *invisible* until
earned (a surprise); sometimes you want it *visible but locked* (a signpost — "come back
when you're stronger").

**Recipe.** Same condition, two placements.
- **Hard / invisible:** put the condition on `choice.showIf`. Fails → the option doesn't
  render at all.
- **Soft / visible-locked:** *always* show a choice, route it to a node that re-tests the
  condition and turns the player away when unmet — or use a **passive check** (recipe 16)
  which reveals the option but marks it as needing the stat.

```jsonc
// hard gate — needs standing with the Order AND the badge
{
  "id": "ch_enter_vault",
  "showIf": { "type": "all", "of": [
    { "type": "reputation", "faction": "faction_a", "op": ">=", "value": 20 },
    { "type": "item", "item": "order_badge", "has": true }
  ] },
  "text": "Show the badge and step into the vault.",
  "goto": "node_vault"
}
```

**Pitfalls.**
- Compose with `all` / `any` / `not` rather than inventing one mega-flag. The condition
  tree is readable and the reference index can find each part.
- A `dialogue.availableWhen` gate is a blunter tool than a ladder rung — prefer the ladder
  for "which conversation," and reserve `availableWhen` for corner-case overrides (the
  schema says as much).

**Also known as.** Ink `* {condition} [choice]`; Yarn `<<if>>` around an option; Ren'Py
`"Option" if condition:`; Twine conditional `(link:)`.

---

## 8. Reputation thresholds (tone shifts with standing)

**Problem.** The same guard is hostile to strangers, curt to the tolerated, and warm to
allies — and you don't want to write that fork inside every line.

**Recipe.** Put the fork on the **ladder**, not in the dialogue. Order rungs from the
highest bar down; the first that passes wins. Faction `reputation` conditions do the
selecting; `adjust_reputation` effects move the needle elsewhere.

```jsonc
"dialogues": [
  { "dialogue": "dlg_guard_ally",   "showIf": { "type": "reputation", "faction": "faction_a", "op": ">=", "value": 30 } },
  { "dialogue": "dlg_guard_known",  "showIf": { "type": "reputation", "faction": "faction_a", "op": ">=", "value": 10 } },
  { "dialogue": "dlg_guard_cold" }   // fallthrough: strangers and enemies
]
```

**Pitfalls.**
- **Order matters and overlapping thresholds are a classic bug.** List the *strictest*
  rung first. If `>= 10` sits above `>= 30`, the ally rung is dead — reputation 40 matches
  `>= 10` first and never reaches it. (The `ladder-audit` skill exists to catch exactly
  this kind of ordering mistake.)
- Faction reputation is clamped to the faction's declared range; character standing
  (recipe 9) is not.

**Also known as.** Ren'Py "points" systems; Fallout/Elder Scrolls disposition tiers; any
`if rep > N` tone gate.

---

## 9. Relationship track (per-character warmth)

**Problem.** One companion should remember how *you personally* have treated them,
independent of faction politics.

**Recipe.** `adjust_relationship` on the choices that matter; `relationship` conditions to
read it. Structurally identical to reputation (recipe 8) but keyed to a character id, and
**unclamped** — a character declares no range, and an absent key reads as 0.

```jsonc
// a kind choice
"effects": [ { "type": "adjust_relationship", "character": "npc_contact", "delta": 5 } ]
```
```jsonc
// a beat that only warm friends get
{
  "id": "node_confides",
  "showIf": { "type": "relationship", "character": "npc_contact", "op": ">=", "value": 15 },
  "text": "She lowers her voice. 'Can I trust you with something?'",
  "next": "node_secret"
}
```

**Pitfalls.**
- Because it's unclamped, runaway loops are on you — don't put a `+delta` on a choice the
  player can farm in a replayable hub. Gate the reward with a one-shot flag (recipe 5) if
  it must only pay once.
- `relationship` (character) and `reputation` (faction) are different axes. Don't
  overload one to mean the other.

**Also known as.** Ren'Py affection points → ending; BioWare approval/loyalty; Persona
social links.

---

## 10. Quest as a state machine

**Problem.** "Find the Contact" moves through stages — offered, accepted, in progress,
resolved — and dialogue, objectives, and endings all need to know where it stands.

**Recipe.** Model the quest with ordered stages. `advance_quest` moves it forward from an
effect; `quest` conditions read it **by stage order** (`>=` means "at or past"). Objective
`showIf` and ladder rungs key off the same stages, so the whole world stays in sync with
one write.

```jsonc
// accepting the job, in dialogue
"effects": [ { "type": "advance_quest", "quest": "task_find_contact", "toStage": "stg_active" } ]
```
```jsonc
// a line that only makes sense once the job is live but not yet done
{
  "id": "node_progress",
  "showIf": { "type": "all", "of": [
    { "type": "quest", "quest": "task_find_contact", "op": ">=", "stage": "stg_active" },
    { "type": "quest", "quest": "task_find_contact", "op": "<",  "stage": "stg_done" }
  ] },
  "text": "'Any sign of them yet?'",
  "next": "node_hub"
}
```

**Pitfalls.**
- Quest conditions compare **stage order, not id equality.** A quest never advanced sits
  *before* every stage, so `< firstStage` is "not started." `== stg_x` is a genuine
  equality when you need "exactly here."
- `>=`/`<` on quests take a `stage` id, not a numeric `value` — a quest condition has no
  `value` field at all (unlike `counter` / `reputation`).
- Use `questOutcome` (which re-tests the outcome's `reachedWhen`) rather than reading a
  fired-record, per the schema note — effect-free outcomes never appear in `questFired`.

**Also known as.** RPG Maker quest switches/variables; Ink quest `LIST` state machines;
the universal available → active → complete/failed lifecycle.

---

## 11. Counters, thresholds & "you've asked enough"

**Problem.** Some things count: visit three shrines, ask the same nosy question twice and
the NPC gets annoyed, buy five and unlock a discount.

**Recipe.** `adjust_counter` to tally; a `counter` condition to branch on the total.

```jsonc
// each visit
"onEnter": [ { "type": "adjust_counter", "counter": "shrines_lit", "delta": 1 } ]
```
```jsonc
// the payoff, anywhere
{
  "id": "node_blessing",
  "showIf": { "type": "counter", "counter": "shrines_lit", "op": ">=", "value": 3 },
  "text": "The air changes. Something has noticed.",
  "next": "node_hub"
}
```

**Pitfalls.**
- A counter on a `replayable` hub node increments on *every* re-entry. If you mean "how
  many distinct shrines," pair each increment with a one-shot flag (recipe 5) so a shrine
  can't be double-counted.
- There is no built-in "times this dialogue was seen" — model it with your own counter
  when you need it. (Cooldowns/timers are the same shape: a counter you bump and test, or
  a flag you set and later clear.)

**Also known as.** Ink knot read-counts (`{knot}`); Yarn `visited_count()`; Twine
`(history:)` length; any `n += 1` tally.

---

## 12. Priority ladder (most-specific line wins)

**Problem.** A greeting should reflect the *most relevant* current fact: mid-quest? just
betrayed them? raining? Otherwise, a default. You don't want to hand-branch all
combinations.

**Recipe.** This is the ladder (recipe 8) generalized into storylet selection: order rungs
**most-specific → most-general**, each gated by the fact it needs, ending in an
unconditional default. The engine picks the first that applies.

```jsonc
"dialogues": [
  { "dialogue": "dlg_wren_betrayed", "showIf": { "type": "flag", "flag": "betrayed_wren", "value": true } },
  { "dialogue": "dlg_wren_onquest",  "showIf": { "type": "quest", "quest": "task_prove_worth", "op": ">=", "stage": "stg_active" } },
  { "dialogue": "dlg_wren_warm",     "showIf": { "type": "relationship", "character": "npc_wren", "op": ">=", "value": 20 } },
  { "dialogue": "dlg_wren_default" }
]
```

**Pitfalls.**
- The whole pattern rests on order. A general rung above a specific one shadows it
  permanently — the single most common ladder bug, and what the `ladder-audit` skill
  traces: for each rung, *when does it first win and when does it stop winning?*
- Keep rungs mutually recognizable at a glance; if two rungs can both be "the interesting
  one," you have a design decision to make explicit, not a tie for the engine to break.

**Also known as.** Fallen London / StoryNexus storylets and "salience"; Valve's Left 4
Dead / Dota response rules (most-specific matching context wins); Versu.

---

## 13. Remembered detail (echo it back with text variables)

**Problem.** The player named their ship, or chose the red door. Later you want a character
to *say the specific thing back* — not "your choice," but "the Kestrel."

**Recipe.** `set_text` writes a named string slot; `{var}` in any player-facing string
interpolates it. Text variables are substitution slots — they are **not** readable by a
condition; to branch, set a *flag* alongside (recipe 15).

```jsonc
// at the naming beat
"effects": [ { "type": "set_text", "variable": "ship_name", "value": "the Kestrel" } ]
```
```jsonc
// much later
{ "id": "node_callback", "text": "'They say {ship_name} runs the blockade nightly. That you?'" }
```

**Pitfalls.**
- `set_text` values are **literals**. Parlance has no free-text input capture — a variable
  the *engine* fills from typed input is declared `writtenBy: "engine"` in the registry so
  the hygiene passes don't complain it's "never set."
- A text variable with no default renders its raw `{ship_name}` until a `set_text` runs.
  Give it a sensible default, or make sure the write always precedes the read.

**Also known as.** Ink/Yarn string variables in text (`{ship_name}`); Twine `$shipName`
printed in a passage; Ren'Py `"[ship_name]"` interpolation.

---

## 14. Push vs. pull — deciding the next conversation

**Problem.** After the Broker's deal, the *player* should have a new scene queued when they
next talk to whoever's relevant. Who decides which conversation plays?

**Recipe.** Two mechanisms, deliberately different:
- **Push (preferred):** `set_active_dialogue` from an effect targets a character and names
  the exact dialogue to play next time. The demo Broker does this — its ending routes the
  *player* to `dlg_pick_side`. Pair it with a ladder rung gated on the flag the engine
  sets (`active_dialogue__<character>`), as `npc_warden` does.
- **Pull:** the ladder itself decides on every open, from world state, via each rung's
  `showIf`. Nobody "queues" anything — the highest matching rung just wins.

Prefer **push** for a scripted "next beat happens here"; prefer **pull** (the ladder) for
"whatever fits the current state." The schema is explicit: use `availableWhen` only for
corner-case overrides, not as your main switch.

**Pitfalls.**
- Push sets a flag named `active_dialogue__<character>`; the receiving rung's `showIf`
  reads that flag. Don't hand-invent a different flag name and wonder why the rung never
  fires.
- Don't drive the *same* transition from both push and pull — pick one owner for each
  scene switch or you'll get double-fires that are miserable to trace.

**Also known as.** Ink `-> divert` / a scheduled knot vs. a `{condition: -> knot}`
selector; Yarn `<<jump>>` vs. a node picked by `<<if>>`; a state machine's explicit
transition vs. a rule that fires on a matched condition.

---

## 15. Branch, remember, converge (the callback)

**Problem.** A fork early on — spare or execute the prisoner — should reunite into shared
scenes, but pay off later with a line that remembers which way you went.

**Recipe.** At the fork, each branch sets a distinguishing flag; the branches then
converge (`goto`/`next` to the same node). Later, an interstitial `showIf` beat (or a whole
ladder rung) reads the flag and delivers the callback.

```jsonc
// the fork
{ "id": "ch_spare", "text": "Let them go.",
  "effects": [ { "type": "set_flag", "flag": "spared_prisoner", "value": true } ],
  "goto": "node_after" }
```
```jsonc
// the payoff, an act later
{ "id": "node_callback",
  "showIf": { "type": "flag", "flag": "spared_prisoner", "value": true },
  "text": "'Word is you showed mercy at the gate. People remember that.'",
  "next": "node_hub" }
```

**Pitfalls.**
- Set the remembering flag at the **moment of choice**, not at some later node the other
  branch also reaches — otherwise both paths look identical to the callback.
- This is the read-only sibling of recipe 13: `set_text` for *quoting* the choice back,
  `set_flag` for *branching* on it. Often you want both — set a flag and a text slot at the
  same fork.

**Also known as.** Ink variables set in one branch, tested in a later gather; Ren'Py flags
that steer the epilogue; the universal "your choices matter" callback.

---

## 16. Skill-check fork (and letting failure through)

**Problem.** Persuade the guard. A pass and a fail should lead somewhere — and failure
usually shouldn't be a dead stop.

**Recipe.** Wrap a choice in a **check**. *Active* rolls against a difficulty and routes to
`onSuccess` / `onFailure` nodes. *Passive* reveals or hides the option against a threshold
(a stat gate that shows the player *why*). Convey cost/identity with `kind`.

```jsonc
{
  "id": "ch_persuade",
  "text": "Talk your way past him.",
  "check": { "mode": "active", "skill": "rhetoric", "difficulty": 12,
             "onSuccess": "node_waved_through", "onFailure": "node_rebuffed", "kind": "priced" }
}
```

**Pitfalls.**
- `kind: "priced"` (the default for active checks) means **failure must still lead
  somewhere** — proceed at a cost. `kind: "oneshot"` is the rare pass-or-not-forever
  identity moment; if content is reachable *only* by passing, mark
  `acknowledgedLockout: true` so `--strict` doesn't warn about the unreachable branch.
- A check supplies its own routing via `onSuccess`/`onFailure`, so the choice usually
  omits `goto`. Don't supply both.
- Passive checks still need their `goto` targets to be reachable — the validator once had a
  blind spot here; don't rely on it to catch a dangling passive branch.

**Also known as.** Disco Elysium white/red checks; Fallout SPECIAL dialogue checks; Ren'Py
`if renpy.random...`; any `[Persuade]` / `[Strength]` tagged option.

---

## 17. Item as key (the inventory is the memory)

**Problem.** A door needs the rusted key; a fence only deals if you're carrying the goods.
You could track it with a flag — but you're already tracking the item.

**Recipe.** Gate on the `item` condition directly; `give_item` / `take_item` are the writes.
The demo Broker's "buy it outright" choice does exactly this — it's `showIf` on holding
`stash_valuables`, and its `onEnter` does `take_item` then `give_item`.

```jsonc
{
  "id": "ch_unlock",
  "showIf": { "type": "item", "item": "rusted_key", "has": true },
  "text": "Try the rusted key in the lock.",
  "effects": [ { "type": "take_item", "item": "rusted_key" } ],
  "goto": "node_opened"
}
```

**Pitfalls.**
- Don't shadow inventory with a parallel `has_key` flag — they drift. If the truth is "do
  they hold it," ask the inventory. Reach for a flag only when the truth is "did they ever
  hold it," which the item can't answer after a `take_item`.
- Items are **not** variables — they live in their own registry (`data/items.json`) so they
  carry a player-facing name and description. Declare the item there before you gate on it.

**Also known as.** Every adventure-game "use key on door"; Ink/Yarn an inventory list +
membership test; Twine an inventory datamap.

---

## 18. Rotating flavor (a line that doesn't repeat itself)

**Problem.** A doorman has five idle greetings; hearing the same one every visit reads as a
machine. You want variety across visits.

**Recipe.** Parlance has no inline variant syntax and no RNG in the data — variety is
authored as a **counter you bump on entry** plus a ladder of interstitial `showIf` beats,
each gated on a counter band. This gives a *sequence* (each line once, then hold on the
last), which is the version most worth having.

```jsonc
{ "id": "node_greet_tick", "onEnter": [ { "type": "adjust_counter", "counter": "doorman_seen", "delta": 1 } ],
  "text": "", "next": "node_greet_1" },
{ "id": "node_greet_1", "showIf": { "type": "counter", "counter": "doorman_seen", "op": "==", "value": 1 },
  "text": "'New face. State your business.'", "next": "node_menu" },
{ "id": "node_greet_2", "showIf": { "type": "counter", "counter": "doorman_seen", "op": "==", "value": 2 },
  "text": "'You again.'", "next": "node_menu" },
{ "id": "node_greet_n", "text": "'Go on through.'", "next": "node_menu" }   // holds for every later visit
```

**Pitfalls.**
- The empty-`text` ticker node is only there to hold the `onEnter` increment before the
  gated beats — a `showIf` beat can't carry the increment, because a skipped node's
  `onEnter` never fires (recipe 2). Bump the counter on a node that is never skipped.
- **No cycle, no shuffle.** Ink's `{&a|b|c}` (cycle) and `{~a|b|c}` (random) have no
  data-level equivalent — conditions can't do modulo, and there's no RNG operand. If you
  need true cycling or randomness, it belongs in the runtime, not the narrative data.

**Also known as.** Ink alternatives — `{a|b|c}` sequence, `{&a|b|c}` cycle, `{!a|b|c}`
once-through, `{~a|b|c}` shuffle; Skyrim idle-chatter pools; Left 4 Dead barks.

---

## What Parlance deliberately doesn't model (and how to fake it)

Authors coming from Ink, Yarn, Twine, or Ren'Py will reach for a few things that aren't in
the contract. None are oversights — each has a reason, and each has a workaround in the
vocabulary above.

- **No built-in visit counts.** Ink knot-counts and Yarn `visited_count()` are automatic;
  Parlance has no per-node "times seen" integer. **Fake it** with your own `counter` and an
  `onEnter` increment (recipes 11, 18). The upside: what's counted is explicit and named,
  so it shows up in find-usages.
- **One state scope, not three.** The save-state (`schema/common.schema.json` → `gameState`)
  is a single per-playthrough bag. There is no *per-conversation* scope (so "ask once *per
  visit*" has nothing to reset it) and no *meta / cross-save* scope (so "seen on any
  playthrough" isn't expressible in data). **Fake per-conversation reset** by clearing the
  flag with a `set_flag …=false` on the way out of the conversation. Cross-save/meta state
  is a runtime concern, not a narrative-data one.
- **No computed / "smart" variables.** There's no derived operand that recomputes from
  other state (Ink functions, Yarn smart variables). **Compose inline** with `all` / `any`
  / `not` instead. It's more verbose, but every clause is independently visible to the
  reference index — a named `is_friend` helper would hide its inputs from find-usages.
- **Text variables aren't readable by conditions.** `set_text` writes a substitution slot
  for `{var}` interpolation (recipe 13) — you cannot branch on it. To *quote* a choice back
  and *branch* on it, set a `text` slot **and** a `flag` at the same beat (recipe 15).
- **No cross-dialogue call/return.** There's no tunnel/detour (Ink `-> k ->`, Yarn
  `<<detour>>`) that runs another dialogue and comes back. `set_active_dialogue` is a
  one-way push (recipe 14); `goto`/`next` route only *within* one dialogue. Shared business
  is either duplicated or modeled as its own queued dialogue.
- **One-of-N state has no enum type.** Ink's `LIST` gives a single variable a fixed domain
  of states. In Parlance, model a state machine as **quest stages** (recipe 10, ordered and
  comparable) or as a set of mutually exclusive flags you're careful to keep exclusive.

## Choosing between the recipes — a cheat sheet

| You want to… | Reach for | Recipe |
|---|---|---|
| Not replay a whole intro scene | ladder rung gated on a "met" flag | 1 |
| Skip a preamble inside one replayable dialogue | node `showIf` + `next`, flag on the surviving beat | 2 |
| Let the world react to an off-screen deed | `set_flag`, read from anywhere | 3 |
| Unlock a topic once the player *learns* it | knowledge flag on a `choice.showIf` | 4 |
| Offer something exactly once | choice that sets a flag and hides on it | 5 |
| A returnable topic menu | hub node + `next`-back spokes + exhaustion flags | 6 |
| Require a prerequisite (hidden or signposted) | condition on `choice.showIf` (hard) vs. re-test node / passive check (soft) | 7, 16 |
| Shift tone by standing | ordered ladder on `reputation` / `relationship` | 8, 9 |
| Track a multi-stage quest | `advance_quest` + `quest` (stage-order) conditions | 10 |
| Count things / "asked enough" | `adjust_counter` + `counter` condition | 11 |
| Pick the most relevant line automatically | most-specific-first ladder (storylet) | 12 |
| Quote the player's specific choice back | `set_text` + `{var}` | 13 |
| Script the next conversation explicitly | `set_active_dialogue` (push) vs. ladder (pull) | 14 |
| Pay off an early fork much later | flag at the fork, `showIf` at the payoff | 15 |
| Fork on a skill / let failure through | active/passive `check`, `kind: priced` | 16 |
| Gate on carrying an object | `item` condition + `give_item`/`take_item` | 17 |
| Vary a repeated line across visits | `adjust_counter` + counter-band `showIf` beats | 18 |

## Two rules that cut across every recipe

- **Declare every id.** Flags, counters, and text variables must exist in
  `data/variables.json`; items in `data/items.json`; skills, factions, quests in their
  registries. Both validators check references — an undeclared flag is an error, not a
  silent no-op.
- **Order is meaning.** Wherever there's a list — ladder rungs, `all`/`any` members read
  by a human, a `next` chain — the arrangement carries intent. The ladder is
  first-match-wins, so "most specific first, unconditional last" is not style, it's
  correctness (recipes 8, 12).
- **"Is true" is not "just became true."** A threshold like `reputation >= 30` or
  `level >= 10` stays true forever once crossed, so a beat gated on it alone replays every
  visit. When you want a *one-time* reaction to crossing a line — a congratulation, a
  first-time gasp — pair the threshold with a one-shot flag: `all` of (the threshold, `not`
  the played-flag), and set the played-flag as the beat's effect (recipes 5, 11). This is
  the single most common authoring bug all four of Ink/Yarn/Twine/Ren'Py warn about, and it
  reads identically in Parlance.
