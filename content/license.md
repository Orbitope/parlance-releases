---
title: Licensing
description: The Parlance editor is free — for hobby projects and commercial games alike. Your story files are always yours, and the format is MIT.
---

# Licensing

Six bullets, then you can get back to work.

- **The editor is free.** Hobby projects, commercial releases, solo devs, studios —
  no seat count, no revenue threshold, no license key to chase.

- **Your story is yours.** We claim nothing in the files you write, the playable
  builds you export, or the game you ship — no royalties, no revenue share, no
  credit required.

- **No telemetry, no account.** Nothing is collected about you, and your story
  never reaches us. If that ever changes it'll be opt-in, and it'll never include
  your content. Features you configure yourself — AI drafting with your own API
  key, git with your own remotes — talk to those services, not to us.

- **[The format is MIT](/docs/spec/).** Schemas, runtime contract, conformance
  vectors, and the reference validator are open, deliberately more open than the
  editor itself. Anyone can build a competing editor or an engine runtime without
  asking.

- **The terms you got with a version are the terms you keep.** Future versions can
  carry different terms; they can never be applied retroactively to a version you
  already have.

- **It can't be taken away.** The grant is perpetual and irrevocable — no
  activation, no renewal, no dependence on us still being here. If development
  stopped tomorrow your copy keeps working, and
  [the format is already MIT](/docs/spec/) with a working runtime nobody at
  Parlance maintains — so a multi-year production can bet on it.

That's the whole deal. The full license text ships with the application and says the
same thing more carefully; if the two ever seem to disagree, the license text governs
— tell us and we'll fix the summary.

## Then how does Parlance make money?

A fair question to ask of anything free, and the answer shapes what the tool will
become, so it's worth stating plainly.

**Not by charging for the editor.** Parlance runs on your machine and we host
nothing for you. Charging a subscription for software that provides no ongoing
service is the thing this project's whole design argues against — so we don't.

**By selling the things that genuinely are a service**, later and separately: hosted
review links so a producer can play a branch without cloning it, hosted editing for
teams, presence and permissions, SSO, and a self-hosted server license for studios
whose unannounced titles can't touch anyone's cloud. Those cost real money to run
and are worth real money to a team of ten writers. None of them are needed by a solo
developer, which is why the editor stays free.

The useful consequence for you: we have no incentive to hold the local tool back.
There's no "pro" feature list waiting behind a paywall, no export limit, no project
cap. The free thing is the whole thing.

**Working at a studio and want a support relationship, an invoice, or a security
questionnaire answered?** That's a conversation we're glad to have — get in touch.

## Three layers, three licenses

| Layer | License |
|---|---|
| **The format spec** — schemas, runtime contract, conformance vectors, reference validator | **MIT**, published at [parlance-spec](https://github.com/Orbitope/parlance-spec) |
| **The editor** — app, CLI, MCP server | Free to use; not open source, and not redistributable |
| **Your narrative content** | Yours entirely. The tool's license doesn't touch `data/` or `lore/` |

The documentation on this site is © and is not part of the MIT grant.

## Why it's shaped this way

Two of those bullets exist because tools like this have burned people before, and
saying so in the license is cheaper than asking you to trust us.

**You should be able to leave.** Your narrative is plain JSON whose meaning is
publicly specified and independently testable — there's already a
[conformance-verified Godot runtime](https://github.com/Orbitope/parlance-gdscript)
nobody at Parlance maintains. Leaving costs you an editor, not a game. That's not an
oversight; it's the point.

**Nothing changes under you.** Terms attach to the version you have, permanently. A
future release can carry different terms and you can decide whether to take it.
Retroactive licensing changes are the thing that has damaged trust elsewhere in this
industry, and the version-permanence clause exists so that we *can't* do it, not
merely so that we promise not to.

**And the project outliving its author is a real question** for anyone betting a
multi-year production on a tool with a small team behind it. The answer isn't a
promise about our future; it's the format. Your narrative is plain JSON with a
published contract and conformance vectors, and there is already a runtime we
don't maintain that executes it correctly. Meanwhile the licence you hold is
perpetual and irrevocable, so the copy on your machine keeps working no matter
what. Studios that need source access as a condition of adoption should talk to
us — that's a contract term, not a press release.

## Questions we get

**Really free? Even for a commercial game?** Yes. Ship it, sell it, keep the money.

**Do I have to credit Parlance?** No. Please do if you'd like — it helps — but
nothing requires it.

**Is it open source?** The format is; the editor isn't. You can use the editor
freely but not redistribute or resell it. The distinction matters because the format
being open is what guarantees your data outlives us — and that guarantee doesn't
require the editor's source.

**Will it start costing money later?** The version you have keeps its terms forever,
so nothing can be taken away retroactively. The intent is for the editor to stay
free and for the paid products to be the hosted, team-oriented ones described above.

**Can I use it at a big studio?** Yes, on the same terms. If you need a support
agreement, an invoice, or a self-hosted deployment, get in touch.

**Can I publish the playable files it exports?** Yes — share builds are yours to
distribute, publish, and sell, including the runtime code embedded in them. The
[demo on this site](/demo/) is one.

**Does anything leave my machine?** Only what you set up yourself. Parlance
collects no telemetry and never sends your narrative anywhere. Two features do
make connections, both by your configuration and with your credentials: optional
AI drafting talks to the model provider you choose, and the review features run
your own git against your own remotes. Neither routes through us.
