# Setting up writers to contribute

Parlance lets writers contribute to your game **through the app**, without a terminal, a
manual clone, or hand-editing JSON. Your git repository stays the single source of truth —
Parlance hosts nothing, and no writer's words pass through any server of ours.

This guide is for the person setting a team up. It covers what a writer does, what you do
once per writer, and — plainly — what the security model does and does not give you.

## How it works

A writer signs in to your git host inside the app, opens your project by cloning it, and
edits their scenes. When they click **Send for review**, the app quietly creates a branch,
commits, pushes, and opens a review request — the writer never sees any of it. You review
in the app and merge. The writer's mental model is *drafts* and *submissions*; the git is
underneath, run by the app.

Each writer works on their own draft branches (`writer/<name>/…`), so two people rarely
touch the same file, and a genuine conflict is escalated to a person rather than shown to
the writer as a merge to resolve.

## For writers

Everything is in the **Drafts** panel. There is no git here — only drafts.

1. **Start a draft** and write. If you already made some edits, the app offers to start the
   draft *with* those changes.
2. When it's ready, press **Send for review**. That's the whole hand-off — the draft moves
   to "In review". If you're offline it's kept on your computer and sent next time you press
   Send.
3. If the owner asks for changes, the draft says so; make them and press **Send changes**.
4. When the owner publishes it, the draft reads **In the game** on its own (usually within a
   minute). Press **Clean up** to tidy it away.

A draft that's approved reads **"Approved — waiting to be published"**: there's nothing for
you to do — the owner publishes it. An "unsent changes" tag means you've edited since you
last sent; press Send again to share them.

## For owners: reviewing and publishing

Open **Review**. The **"Reviews waiting for you"** list shows every writer's draft by title
and author — no branch names, nothing to check out.

1. **Open a draft.** Read the summary of what changed and, if you like, open a scene to see
   the before/after or play the branch as it stands.
2. **Comment** on anything. Your comments are sent when you publish (or you can send them on
   their own).
3. **Approve & publish** in one click. The change goes into the game with a plain-language
   confirm — and your own open files are never touched. Whatever branch you're on, whatever
   unsaved work you have, publishing leaves it exactly as it was.

If a draft overlaps with something already in the game, publishing refuses in plain words and
changes nothing — that's the one case where someone comfortable with git combines the two.
Publishing needs **git 2.38 or newer** on your computer; older git is refused with a notice
to update. New drafts appear on their own while the panel is open — no need to refresh.

The app publishes to the shared game. If you *also* edit the game directly outside the app,
pull first so your copy is current.

## Providers

Self-serve sign-in works for **GitHub**, **GitLab** (gitlab.com and self-managed) and
**Bitbucket Cloud**:

- **GitHub** — click **Sign in with GitHub**, approve the short code the app shows you at
  github.com, and you're in. There is no token to create or paste. This uses the Parlance
  GitHub App; a repository admin installs that app on the studio's repo once (see the studio
  setup below).
- **GitLab / Bitbucket** — create a personal access / API token from the app's token page and
  paste it back. The app pre-fills the token's name and permissions where the host allows.

Any git host also works *without* self-serve sign-in if you set up the writer's machine
yourself once (a clone plus credentials); the app then drives the rest.

## One-time studio setup

1. **Give the writer access to the repository.** Add them as a collaborator (GitLab: a
   project member with at least **Developer** access; Bitbucket: **write** access). The
   writer accepts the invitation from their email or account page — until they do, the repo
   will not appear in the app's picker.
2. **Tell them which project to open.** They pick it from a list of repositories they can
   push to; point them at the right one by name.
3. **On GitHub only — install the Parlance app on your repository.** A GitHub sign-in can
   reach a private repo only once the Parlance GitHub App is installed on it. A repository
   admin opens the app's page on GitHub, chooses **Install**, selects the repository, and
   confirms — once, for the whole team. GitLab and Bitbucket need no app install; the
   collaborator invite in step 1 is enough on those hosts.

That is the whole studio-side setup. There is nothing of ours to run or host on your end.

## Per-writer setup

The writer does this once, in the app:

1. **Sign in.** Open **Git accounts**. For **GitHub**, click **Sign in with GitHub** and
   approve the short code it shows you at github.com — nothing to paste. For **GitLab** or
   **Bitbucket**, choose the provider, click **Open token page** — for GitLab the token's name
   and permissions are pre-filled, so it is two clicks; for Bitbucket follow the short numbered
   steps — then paste the token back. The app checks the sign-in before saving it, so a bad one
   fails immediately and stores nothing.
2. **Open the project.** **Open from repository**, pick the repo, choose where it lands. The
   app clones it and opens it. From then on the writer just opens the app and writes.

The minimum token permissions the app asks for are exactly what it needs and no more:
clone/push plus reading the list of repositories and the account name. Nothing administrative.

## What enforcement you actually get — read this

Method A gives every writer **read access to the whole repository** and lets the app keep
their writing on their own branches. Be clear-eyed about what that is and isn't:

- **A writer can read the entire repo.** If your unreleased story must stay secret from a
  freelancer, Method A is not the boundary for that — that is the separate slice-repo model
  (contact us; it is a different tier). Method A is for **trusted** collaborators.
- **`writer/<name>/…` branches are an app convention, not a lock.** Anyone with write access
  can, with plain git, push elsewhere. The app keeps writers on their own branches and
  review catches stray edits, but it is a guardrail against accident, not a control against a
  determined person.
- **Protecting `main` needs a paid plan or an organization.** On a **free personal** private
  repository, neither GitLab nor Bitbucket lets you restrict who can push where at all — every
  collaborator can push any branch. To require review before `main` changes, use a paid plan
  or move the repo into an organization/group and configure its branch rules. Per-writer branch
  isolation (only `writer/alice/*` for Alice) is not expressible on any of these hosts and is
  not something the app can enforce.

None of this is a reason not to use Method A — it is the right tool for a team that trusts
its writers. It is a reason to know which repositories you point it at.

## Tokens and revoking access

- The writer's token is stored on **their** machine (owner-readable), the same way command-line
  git tools keep a token. It never reaches Parlance and is never sent back to the app's own
  interface.
- The token can only do what its permissions allow on the repositories the account can reach —
  edit files, essentially. No admin, no secrets.
- **To cut off a writer:** remove them as a collaborator on the git host. That is the real
  revocation. The in-app **Sign out** only clears the local token; a writer can also revoke the
  token from their own account settings on the git host.

## Writers who won't create an account

Some writers won't make a git account at all. They don't have to. They can write in a plain
screenplay-style text format and send it in; a trusted operator (or Claude, via the
`ingest-dialogue` skill) converts it to game data and puts it through the same review. See
`tooling/llm/WRITER_TEMPLATE.md`. Method A is for writers willing to install the app and sign
in; the template path catches everyone else.

## Troubleshooting

- **The repo isn't in the picker.** The App/collaborator invite is unaccepted, or the account
  doesn't have push access to it. Confirm the writer accepted the invitation and has at least
  Developer/write access, then use the picker's refresh.
- **"Your sign-in has expired — sign in again."** The git host stopped accepting the stored
  sign-in (a GitHub App set to expire tokens, or access revoked). Parlance refreshes an
  expiring GitHub sign-in on its own, so this normally only appears after a revocation;
  Git accounts → Sign in with GitHub puts it right. Being offline is reported separately
  ("couldn't check") and never as being signed out.
- **"That token was rejected."** The token was mistyped, expired, or lacks the requested
  permissions. Create a fresh one from the token page and paste it again.
- **A push fails mentioning a workflow file.** The requested permissions deliberately do not
  include editing CI configuration; the app only writes narrative data and review files.
