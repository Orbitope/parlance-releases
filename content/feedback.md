---
title: Feedback
description: How to report a Parlance bug, ask for a feature, or reach us privately — what to send, where it goes, and what happens after you send it.
---

# Feedback

Parlance collects **no telemetry**. Nothing phones home, no crash reporter runs,
and your project never reaches us. That's deliberate, and it has one cost worth
being honest about: if you don't tell us something is broken, we don't know.

So this page is the whole feedback process. It's short because it's real.

## Where to send what

| What you have | Where it goes |
|---|---|
| A bug, a crash, or docs that are wrong | [Report a bug](https://github.com/Orbitope/parlance-releases/issues/new?template=bug_report.yml) |
| A feature request, or a workflow that's awkward | [Share an idea](https://github.com/Orbitope/parlance-releases/issues/new?template=idea.yml) |
| A question about how something works | [Open an issue](https://github.com/Orbitope/parlance-releases/issues/new/choose) — questions are welcome there, and the answer helps whoever searches next |
| Something about the **format** — schemas, runtime contract, conformance vectors | [parlance-spec issues](https://github.com/Orbitope/parlance-spec/issues) — the MIT surface lives in its own repo |
| Anything you can't say in public | [orbitopegames@gmail.com](mailto:orbitopegames@gmail.com) |

Public issues are the front door on purpose: they're searchable, they show
whoever arrives next that the project is alive, and they save the person after
you from filing the same thing.

## When to email instead

Use [orbitopegames@gmail.com](mailto:orbitopegames@gmail.com) when the issue
tracker is the wrong room:

- **A bug you can only show with unreleased story content.** This is a narrative
  tool — your repro case may be a plot twist. Email it, or see the trick below.
- **Security.** Please don't file it publicly first. There's no bounty program;
  there is a fast reply and credit if you want it.
- **Licensing and commercial questions** — studio use, redistribution, anything
  where the [six bullets](/license/) don't cover your situation.

## What makes a report get fixed fastest

- **The version and the platform.** *Parlance ▸ About Parlance* on macOS; the
  installer filename on Windows and Linux. The forms ask for these first.
- **Steps, in order, from a state we can reach.** "Open a dialogue, add a choice,
  undo twice" beats "undo is broken."
- **Whether it reproduces on the demo project.** [Mistfall Inn](/demo/) is CC0
  and ships with the editor, so a repro there is one anybody can run — and one
  you can paste in full without revealing a word of your own game. If a bug
  reproduces on the demo, say so; those get fixed first, because nothing about
  them has to be guessed.
- **Project size, if it might matter.** Some problems only show up at forty
  thousand words. Word or dialogue count is enough.

## What happens next

One person maintains Parlance, so here's the honest shape of it rather than a
support SLA nobody would be held to:

- **Everything gets read.** Most things get a reply within a few days.
- **Bugs with a demo-project repro are triaged first**, then bugs with clear
  steps, then everything else.
- **Ideas stay open.** A request that gets no response isn't a rejection — it's a
  request waiting for a second person to ask for it. Adding a 👍 or a comment
  describing *your* version of the problem genuinely changes what gets built.
- **"Won't do" gets said out loud**, with the reason. An idea that quietly rots
  for a year is worse than a no.

## Is there a Discord?

Not yet, and not for a while — that's a decision rather than an oversight.

A chat server is a promise to be present in it. An empty one, or one where
questions sit unanswered for a week, says something worse about a project than
having none at all. It also splits the answers: a question answered in chat helps
one person, where the same question in an issue helps everyone who searches it
later.

The signal we're watching for isn't user count — it's **users wanting to talk to
each other** rather than to us. When people start answering each other's
questions in issue threads, GitHub Discussions comes first — same account,
threaded, searchable, and a discussion converts into an issue when it turns out
to be one — and a chat server only if that outgrows itself. If you'd have used one already, say so in an
issue — that's a data point, and this is exactly the sort of decision it moves.

## One more thing

If you're using Parlance and *nothing* is broken, that's worth an email too. A
tool with no telemetry hears from people almost exclusively when it fails, which
is a distorted picture to build from. Knowing what you're making — and which
parts you never think about because they just work — shapes the roadmap as much
as the bug list does.
