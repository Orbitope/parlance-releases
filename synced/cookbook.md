# Pattern cookbook — common narrative-logic recipes

Parlance gives you a small, sharp toolkit: **conditions** (predicates over state),
**effects** (state changes), self-declaring **dialogue offers** (each dialogue says who
it is offered to, when, and at what priority), and per-node / per-choice **`showIf`**
gates. Almost every recurring narrative-logic problem is a specific arrangement of those
four things.

This cookbook is the arrangements. Each recipe names a problem writers hit in every
narrative engine, shows the Parlance way to solve it, and — under **Also known as** —
points at how Ink, Yarn Spinner, Twine, and Ren'Py spell the same idea, so a writer
arriving from another tool can find the pattern by the name they already know.

None of this is new engine capability. It is the vocabulary already in
`schema/common.schema.json` (conditions and effects) and `schema/dialogue.schema.json`
(nodes, `showIf`, `next`, `onEnter`, and the `offer` object), used on purpose. When a
recipe leans on a rule with a sharp edge, the edge is called out in **Pitfalls** — most
of them are things that have actually bitten someone here.

## The four primitives, in one breath

- **Condition** — a testable predicate: `flag`, `counter`, `reputation` (faction),
  `relationship` (character), `skill`, `item`, `quest` (compared by stage *order*),
  `questOutcome`, composed with `all` / `any` / `not`. Conditions live on `offer.when`,
  `node.showIf`, `choice.showIf`, quest gates, location exits, codex unlocks, and ending
  conditions.
- **Effect** — a state change fired from `node.onEnter` or `choice.effects`: `set_flag`,
  `adjust_counter`, `adjust_reputation`, `adjust_relationship`, `give_item` / `take_item`,
  `advance_quest`, `grant_xp`, `set_active_dialogue`, `play_cutscene`, `set_text`.
- **The offer** — a dialogue's `offer` object (`{ character?, when?, priority? }`) is its
  self-declared candidacy. Its **presence** opts the dialogue in; `resolveCharacterDialogue`
  gathers a character's offers, drops those whose `when` fails, and picks the most salient —
  highest **priority tier**, then highest **condition specificity**, then lowest id. An
  offer with no `when` is the **fallback** (specificity 0). **Order in the file never
  matters.**
- **`showIf` on a node** — display gate on an *interstitial* beat. When it fails the node
  is skipped and resolution continues at `next`. Its text is not shown **and its
  `onEnter` effects DO NOT fire.** Requires `next`; forbidden with `choices` / `isEnd`.

Everything below is built out of exactly these.

---

## 1. Say-it-once (state-gated re-entry) — the flagship

**Problem.** The first time the player meets the Warden he recruits them: a whole scene.
Every visit after, they just want the one useful line — the checkpoint code, today's
orders. You do not want to replay the recruitment.

**Recipe.** Two dialogues and one flag, each offering for the same character. The intro
fires a `set_flag` as its side effect; the intro's `offer.when` is gated on that flag being
*unset*, so once it fires the intro stops being eligible and the shorter dialogue — the
fallback, which loses to the intro's more specific gate only while the intro is eligible —
wins.

```jsonc
// dlg_warden_recruit — offered while unmet, and records the scene on its way out
{
  "id": "dlg_warden_recruit",
  "speakerId": "npc_warden",
  "offer": {
    "when": { "type": "not", "of": { "type": "flag", "flag": "met_warden", "value": true } }
  },
  "entry": "node_open",
  "nodes": [
    {
      "id": "node_sworn_in", "isEnd": true,
      "onEnter": [ { "type": "set_flag", "flag": "met_warden", "value": true } ],
      "text": "'Then you're one of us. Report to the checkpoint.'"
    }
  ]
}
```

```jsonc
// dlg_warden_brief — the fallback (offer with no `when`), wins forever after
{ "id": "dlg_warden_brief", "speakerId": "npc_warden", "offer": {}, "entry": "…", "nodes": [ … ] }
```

Now: first talk → `met_warden` is false → the recruit offer is eligible and its `when`
(specificity 1) outranks the bare fallback (specificity 0) → recruit plays → on its way
out it sets `met_warden`. Every later talk → the recruit offer's `when` fails → only the
fallback `dlg_warden_brief` (the short informational one) is eligible.

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
- A skipped `showIf` node **must** have `next` (COND rule). The skip is only defined for
  listen-only beats. A `next` chain must end at a node with no `showIf`, or resolution
  can fall off the end.
- **Since 0.15 you do not need a filler line to carry choices.** A gate on a node with
  `choices` or `isEnd` hides only its line (the choices still show, the dialogue still
  ends, and its `onEnter` still fires), and a node with `choices` may omit `text`
  entirely. An unconditional "So?" or "Anything else?" invented just to host a choice
  list, or to end the scene after a gated line, can go. Where every choice on a node is
  gated, add one `fallback: true` choice (e.g. "Leave.") rather than an extra ungated
  option: it shows only when nothing else does, and the validator stops warning that the
  player may be stuck.
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
`offer.when`, quest gate, and ending in the project.

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
- **Soft / visible-locked:** the same `choice.showIf`, plus `"whenLocked": "show"` (0.15).
  When the gate fails, `stepDialogue` returns the choice in `lockedChoices` instead of
  dropping it, and the engine draws it greyed out and unselectable, with `lockedText`
  (`"[Requires standing with the Order]"`) in place of its text if you set one. Set
  `rules.choices.whenLockedDefault: "show"` to make that the project default. Older
  alternatives still work: *always* show a choice and route it to a node that re-tests the
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

// soft gate — same condition, shown locked when it fails
{
  "id": "ch_enter_vault",
  "showIf": { "type": "item", "item": "order_badge", "has": true },
  "whenLocked": "show",
  "lockedText": "[Requires the Order's badge]",
  "text": "Show the badge and step into the vault.",
  "goto": "node_vault"
}
```

**Pitfalls.**
- `whenLocked` and `lockedText` do nothing without a `showIf` (a `FLOW` warning says so).
  A locked choice is never selectable: `chooseChoice` throws on one, so an engine must
  not let the player pick it.
- The locked list is opt-in for the engine too. One that ignores `lockedChoices` shows
  nothing, exactly as a hard gate would, so check your port renders them.
- Compose with `all` / `any` / `not` rather than inventing one mega-flag. The condition
  tree is readable and the reference index can find each part.
- A `choice.showIf` gates a line *within* a scene; an `offer.when` chooses *which* scene.
  Reach for the offer when the whole conversation should change, and for a choice `showIf`
  when only one option should appear or vanish.

**Also known as.** Ink `* {condition} [choice]`; Yarn `<<if>>` around an option; Ren'Py
`"Option" if condition:`; Twine conditional `(link:)`.

---

## 8. Reputation thresholds (tone shifts with standing)

**Problem.** The same guard is hostile to strangers, curt to the tolerated, and warm to
allies — and you don't want to write that fork inside every line.

**Recipe.** Give each tone its own dialogue, and let each **offer** for the guard. The
gate on each is the reputation band it covers; the fallback (no `when`) catches strangers.
Faction `reputation` conditions do the selecting; `adjust_reputation` effects move the
needle elsewhere. Order in the file is irrelevant — specificity, then value, decides.

```jsonc
// dlg_guard_ally
{ "id": "dlg_guard_ally", "speakerId": "npc_guard",
  "offer": { "when": { "type": "reputation", "faction": "faction_a", "op": ">=", "value": 30 } }, "entry": "…", "nodes": [ … ] }
// dlg_guard_known
{ "id": "dlg_guard_known", "speakerId": "npc_guard",
  "offer": { "when": { "type": "reputation", "faction": "faction_a", "op": ">=", "value": 10 } }, "entry": "…", "nodes": [ … ] }
// dlg_guard_cold — the fallback: strangers and enemies
{ "id": "dlg_guard_cold", "speakerId": "npc_guard", "offer": {}, "entry": "…", "nodes": [ … ] }
```

**Pitfalls.**
- **Overlapping bands used to be a first-match ordering bug; they no longer are — but
  ties are.** Two bands that read the same reputation value (`>= 10` and `>= 30`) are
  *equally specific* (both a single leaf, specificity 1), so at reputation 40 the two
  offers tie on `(priority, specificity)` and the id decides — here `dlg_guard_ally`
  happens to sort before `dlg_guard_known`, so it wins by its name, not by design. Break
  the tie deliberately: tier the more specific band up (`offer.priority: 1` on
  `dlg_guard_ally`), or make its `when` an `all` that *excludes* the lower band (`>= 30`
  alone stays specificity 1; add a second conjunct to raise it). The validator's `OFFER`
  tie warning flags the un-broken tie, since two reputation reads are not provably
  exclusive.
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
`showIf` and `offer.when` gates key off the same stages, so the whole world stays in sync
with one write.

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

## 12. Salience (most-specific line wins)

**Problem.** A greeting should reflect the *most relevant* current fact: mid-quest? just
betrayed them? raining? Otherwise, a default. You don't want to hand-branch all
combinations.

**Recipe.** This is what offers do by default — no arrangement needed. Give each variant
its own dialogue offering for the character, gated by the fact it needs, plus one fallback
with no `when`. `resolveCharacterDialogue` picks the **most specific** eligible offer
automatically; the fallback wins only when nothing more specific applies.

```jsonc
// each is a dialogue offering for npc_wren — order in the file is irrelevant
{ "id": "dlg_wren_betrayed", "speakerId": "npc_wren",
  "offer": { "when": { "type": "flag", "flag": "betrayed_wren", "value": true } }, "entry": "…", "nodes": [ … ] }
{ "id": "dlg_wren_onquest", "speakerId": "npc_wren",
  "offer": { "when": { "type": "quest", "quest": "task_prove_worth", "op": ">=", "stage": "stg_active" } }, "entry": "…", "nodes": [ … ] }
{ "id": "dlg_wren_warm", "speakerId": "npc_wren",
  "offer": { "when": { "type": "relationship", "character": "npc_wren", "op": ">=", "value": 20 } }, "entry": "…", "nodes": [ … ] }
{ "id": "dlg_wren_default", "speakerId": "npc_wren", "offer": {}, "entry": "…", "nodes": [ … ] }
```

**Pitfalls.**
- **Equal specificity is a real tie, not "the first one".** The three gates above are each
  a single leaf (specificity 1), so if the player is *both* betrayed and mid-quest, the two
  offers tie and the id decides. When one fact should dominate another, say so: raise its
  `offer.priority` (a higher tier beats every lower tier however specific), or make its
  `when` an `all` that carries the dominant fact plus the weaker one (specificity is the
  sum, so it outranks either alone). The validator's `OFFER` tie warning flags un-broken
  ties, and stays quiet when it can prove two gates never both hold (opposite values of
  one flag or item, disjoint ranges of one counter/reputation/relationship/skill, each
  also under a `not`); the offer-audit judges whether the resolution tells the arc you
  intended.
- Keep offers mutually recognizable at a glance; if two can both be "the interesting one"
  at equal specificity, that is a design decision to make explicit with a priority tier,
  not a tie for the engine to break by id.

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
  *player* to `dlg_pick_side`. Pair it with a **tier-1 offer** gated on the flag the engine
  sets (`active_dialogue__<character>`), as `dlg_pick_side` does — a higher tier beats every
  ordinary offer, so the queued scene wins until its flag is cleared.
- **Pull:** offers decide on every open, from world state, via each `offer.when`. Nobody
  "queues" anything — the most salient eligible offer just wins.

Prefer **push** for a scripted "next beat happens here"; prefer **pull** (offers) for
"whatever fits the current state."

**Pitfalls.**
- Push sets a flag named `active_dialogue__<character>`; the receiving offer's `when`
  reads that flag. Don't hand-invent a different flag name and wonder why the offer never
  wins. Clear the flag once the scene is consumed, or it keeps winning.
- Don't drive the *same* transition from both push and pull — pick one owner for each
  scene switch or you'll get double-fires that are miserable to trace.
- The effect's `dialogue` field is a label; what routes is the target's **offer**. The
  validator warns (`OFFER`) when the named dialogue carries no offer for that character
  gated on the flag, and when that offer sits at a tier an ordinary offer can beat — in
  both cases the runtime plays something else and the queued scene never lands.
- A dialogue is offered by **one** character. If two characters must each be able to
  open the same scene, give each a one-node routing dialogue of their own (offered for
  that character, gated on their flag) whose only beat jumps to the shared scene.

**Also known as.** Ink `-> divert` / a scheduled knot vs. a `{condition: -> knot}`
selector; Yarn `<<jump>>` vs. a node picked by `<<if>>`; a state machine's explicit
transition vs. a rule that fires on a matched condition.

---

## 15. Branch, remember, converge (the callback)

**Problem.** A fork early on — spare or execute the prisoner — should reunite into shared
scenes, but pay off later with a line that remembers which way you went.

**Recipe.** At the fork, each branch sets a distinguishing flag; the branches then
converge (`goto`/`next` to the same node). Later, an interstitial `showIf` beat (or a whole
offered dialogue gated on the flag) reads it and delivers the callback.

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
(a stat gate that shows the player *why*). Convey cost/identity with `kind`. Make a check
easier or harder in a given situation with **`modifiers`** — each a `when` condition and a
`bonus` added to the total when it holds (they sum; negative = harder):

```jsonc
{
  "id": "ch_persuade",
  "text": "Talk your way past him.",
  "check": { "mode": "active", "skill": "rhetoric", "difficulty": 12,
             "onSuccess": "node_waved_through", "onFailure": "node_rebuffed", "kind": "priced",
             "modifiers": [
               { "when": { "type": "item", "item": "guild_seal", "has": true }, "bonus": 3, "label": "Guild seal" },
               { "when": { "type": "flag", "flag": "drunk", "value": true }, "bonus": -2 }
             ] }
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
- Modifiers move the **roll**, not the DC: `difficulty` stays the fixed bar and the bonus
  adjusts what the player brings to it. A modifier bonus lifts an otherwise-impossible
  difficulty back into reach — the reachability warning accounts for it.
- Modifiers are **per-check, not global.** An item that should help every rhetoric check is
  re-declared on each, or — if the engine has an equip system — reflected as a flag the
  `when` reads. There is no equipment→skill layer.
- Don't double-gate: a `showIf` of `has guild_seal` on the same choice as a `+3 ? has
  guild_seal` modifier means the choice only appears when the bonus already applies. Gate
  *or* modify; rarely both on the same condition.

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
authored as a **counter you bump on entry** plus a chain of interstitial `showIf` beats,
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

## 19. Engine cue on a line (camera shake, a sound, a mood)

**Problem.** The door slams and the camera should shake; the keeper snaps and her
portrait should switch to *angry*. That is the engine's work, but it has to fire *at
this line*, in order with the story's own effects.

**Recipe.** Two hand-offs, both opaque to Parlance (0.15). A one-shot **action** is an
`engine` effect in the node's `onEnter` (or a choice's `effects`). A **property of the
line** that the engine reads while presenting it is a tag.

```jsonc
{ "id": "node_slam", "text": "The door slams behind you.",
  "tags": ["mood:startled"],
  "onEnter": [
    { "type": "set_flag", "flag": "door_shut", "value": true },
    { "type": "engine", "command": "shake", "args": [0.5] },
    { "type": "engine", "command": "play_sfx", "args": ["door_slam"] }
  ],
  "next": "node_keeper" }
```

Declare the commands your engine handles in `rules.json`
(`"engine": { "commands": { "shake": { "args": 1 }, "play_sfx": { "args": 1 } } }`), so a
typo is a validator warning instead of a silent no-op.

**Pitfalls.**
- **An engine command is not state.** Nothing in the data can later ask "did the camera
  shake?". If the story needs to remember it, add a `set_flag` beside it.
- **A skipped node fires nothing.** An engine command in a `showIf`-gated node's
  `onEnter` never reaches the engine when the node is skipped (recipe 2), the same as any
  other effect.
- **Action or property?** Use an effect for something that *happens once* at this point
  (shake, sting, fade). Use a tag for something that *describes the line* for as long as
  it is on screen (mood, voice filter, camera framing). An engine re-reads a tag on
  replay; an `onEnter` fires on first arrival only.

**Also known as.** Yarn `<<shake 0.5>>` custom commands and `#hashtags`; Ink `EXTERNAL`
functions and `# tags`; Ren'Py `with vpunch` / `play sound`.

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
  comparable) or as a set of mutually exclusive flags. List each set in
  `rules.flag.exclusiveGroups` and both validators report a `FLAG` error when one effect
  list sets two flags of a group to `true` — clearing the old flag when you set the new
  one is still on you.

## Choosing between the recipes — a cheat sheet

| You want to… | Reach for | Recipe |
|---|---|---|
| Not replay a whole intro scene | offer gated on a "met" flag + a fallback offer | 1 |
| Skip a preamble inside one replayable dialogue | node `showIf` + `next`, flag on the surviving beat | 2 |
| Let the world react to an off-screen deed | `set_flag`, read from anywhere | 3 |
| Unlock a topic once the player *learns* it | knowledge flag on a `choice.showIf` | 4 |
| Offer something exactly once | choice that sets a flag and hides on it | 5 |
| A returnable topic menu | hub node + `next`-back spokes + exhaustion flags | 6 |
| Require a prerequisite (hidden or signposted) | condition on `choice.showIf` (hard) vs. the same plus `whenLocked: "show"` + `lockedText` (soft; or a re-test node / passive check) | 7, 16 |
| Shift tone by standing | one offer per band on `reputation` / `relationship` | 8, 9 |
| Track a multi-stage quest | `advance_quest` + `quest` (stage-order) conditions | 10 |
| Count things / "asked enough" | `adjust_counter` + `counter` condition | 11 |
| Pick the most relevant line automatically | offers ranked by specificity (salience) | 12 |
| Quote the player's specific choice back | `set_text` + `{var}` | 13 |
| Script the next conversation explicitly | `set_active_dialogue` (push) vs. offers (pull) | 14 |
| Pay off an early fork much later | flag at the fork, `showIf` at the payoff | 15 |
| Fork on a skill / let failure through | active/passive `check`, `kind: priced` | 16 |
| Gate on carrying an object | `item` condition + `give_item`/`take_item` | 17 |
| Vary a repeated line across visits | `adjust_counter` + counter-band `showIf` beats | 18 |
| Shake the camera / play a sound / set a mood on a line | `engine` effect (an action) or a line tag (a property) | 19 |

## Two rules that cut across every recipe

- **Declare every id.** Flags, counters, and text variables must exist in
  `data/variables.json`; items in `data/items.json`; skills, factions, quests in their
  registries. Both validators check references — an undeclared flag is an error, not a
  silent no-op.
- **Salience is meaning.** Offers are ranked by priority tier, then condition specificity,
  then id — file order never matters. When two offers can apply at once, the *more specific*
  gate wins, and an equal-specificity tie is a design decision to make explicit with a
  priority tier, not a coin flip to leave to the id (recipes 8, 12).
- **"Is true" is not "just became true."** A threshold like `reputation >= 30` or
  `level >= 10` stays true forever once crossed, so a beat gated on it alone replays every
  visit. When you want a *one-time* reaction to crossing a line — a congratulation, a
  first-time gasp — pair the threshold with a one-shot flag: `all` of (the threshold, `not`
  the played-flag), and set the played-flag as the beat's effect (recipes 5, 11). This is
  the single most common authoring bug all four of Ink/Yarn/Twine/Ren'Py warn about, and it
  reads identically in Parlance.
