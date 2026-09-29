# Grill habits (load when running the interview loop)

## Fact vs decision

- **Facts** (code, tests, docs, primary sources, mature libraries): look up.
  Wide lookups are dispatched to background explore leaves in parallel —
  mandatory under the research floor below; research briefs carry output
  contracts per the explore research mode (ADR 0017). A running
  exploration delays only the questions downstream of it, never the
  current round. Never turn answerable facts into user quizzes.
- **Decisions** (product tradeoffs, risk, gates, which option wins): put to
  the user in frontier rounds, each with a recommended answer. Never write
  contested choices into `.rope/` as settled.

## Domain discipline

1. Glossary clash with `.rope/CONTEXT.md` → force a choice immediately.
2. Fuzzy language → propose canonical term + `_Avoid_`.
3. User claim vs code → surface evidence before continuing.
4. Abstract boundaries → concrete scenario (prefer this issue’s world).

## Question preference

Prioritize **product, UX/design, scope, policy** over file layout / class names /
framework trivia unless they change the Behavior Contract or a human gate. If
you are only probing structure, step back to a product question.

## Design tree + frontier rounds

- Map the decisions as a tree: every decision branches into the decisions
  that hang off it.
- The **frontier** is every decision whose prerequisites are already settled —
  the questions askable **now** without guessing at answers not yet heard. Ask
  the whole frontier in one numbered round; a question whose answer depends on
  another question still open in this round belongs to a **later** round.
- Each answered round reshapes the tree: settled decisions push the frontier
  outward and unblock what depended on them. Recompute the frontier, then ask
  the next round.
- Done when the frontier is empty: every branch visited, nothing silently
  assumed. The Ready-for-shape checklist below still gates shape.

## Research floor (ADR 0017)

Before inventing, walk the prior-art ladder (ADR 0017): question the need →
repo precedent → standard library / platform-native → installed deps →
minimal implementation — full behavior understood first, without
sacrificing boundary checks, error handling, security, accessibility.

**Floor:** a request involving a new mechanism, an external
platform/service integration, or a "how do mature products do this"
design judgment requires **parallel research dispatch before the decision
rounds** — typically two briefs: repo precedent + external product survey
(brief shape per
[explore-research-mode.md](../../rope-harness-presets/references/explore-research-mode.md):
question+why / primary sources / output path+sections / return shape).
Purely internal small changes record `research: not-needed` + one-line
reason on the issue/PRD.

**Evidence rule:** an industry-practice claim with no research artifact
behind it ("X and Y both do it this way") is an unverified memory claim —
never a decision basis; dispatch a leaf or drop the claim.

When the capability has mature open-source options, search popular
packages and official guidance **before** inventing. Write facts to
`.rope/research/` and cite from the PRD. If network is blocked, retry via
the host's proxy (e.g. `HTTP(S)_PROXY`) before degrading to offline
heuristics.

## Behavior Contract fields

- System under test
- Trigger/input
- Collaborators
- Observable result
- Failure visibility
- Forbidden shortcuts

## Scenario minimum

- Primary-path success
- Failure visibility
- Forbidden shortcut (shallow test would pass, intent violated)
- When relevant: empty input or unavailable dependency

## Doc crystallize targets

| Decision | File |
| --- | --- |
| Term | `.rope/CONTEXT.md` |
| Hard-to-reverse tradeoff (all three ADR tests) | `.rope/adr/` |
| External fact | `.rope/research/` |
| Stable contract/gotcha | `.rope/specs/` |

ADR only when hard to reverse **and** surprising **and** real tradeoff — see
[doc-formats.md](doc-formats.md).

## Ready for shape checklist

- [ ] Behavior Contract six fields user-confirmed
- [ ] Key terms in CONTEXT or explicitly deferred
- [ ] Prior-art ladder walked, or `research: not-needed` recorded with reason
- [ ] No unverified "industry practice" claims in decisions — each cites research or is dropped
- [ ] External facts in research or “not needed”
- [ ] Human gates listed
- [ ] Primary / failure / forbidden-shortcut scenarios discussed
- [ ] User confirmed shared understanding
