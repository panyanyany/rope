---
name: rope-grill
description: Grills requirements against .rope docs to a shape-ready contract — behavior, architecture impact, decision dispositions. Use when clarifying a feature before slices or discussing ADR/spec inheritance.
---

# Rope Grill

Plain requirements interview. Internally this is a judgment-primary,
**context-protective** Parent Orchestrator workflow; with the user, speak in
simple product language.

Interview habits (fact vs decision, frontier rounds, scenarios, checklist):
[references/grilling.md](references/grilling.md).
Doc formats: [references/doc-formats.md](references/doc-formats.md).
Architecture continuity fields and dispositions:
[../rope-shape/references/architecture-continuity.md](../rope-shape/references/architecture-continuity.md).

## Plain interview

Internal Rope terms are reasoning labels, not user language. Translate before
speaking: say "what behavior must we guarantee" before Behavior Contract,
"where the user sees the error" before failure visibility, "a lazy
implementation that could still pass tests" before forbidden shortcut.

Every decision question has four parts: one plain-language question, a
recommended answer, a concrete example of what the user would click, run,
see, or receive, and the tradeoff of the other option. Completion criterion:
the user can repeat the decision in their own words without asking what a
Rope term means. If they look confused, pause and re-explain with a real
scenario, not more framework language.

## Inputs

When present: `.rope/GLOSSARY.md`, `routes.md`, relevant `adr/`, `research/`,
`specs/`, and code named by routes. Legacy glossary lookup follows
[current documents](../rope-clear/references/current-docs.md#project-language).

## Context-protective parent

1. Default searches and diagnosis to explore per the
   [handoff contract](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff);
   fan independent lookups out in parallel — a running exploration delays only the
   questions downstream of it, never the round. Every research brief
   declares its output contract (question/sources/path/return shape —
   explore-research-mode.md).
2. Crystallize confirmed decisions into `.rope/` immediately (chat dies on
   compact).
3. Read leaf summaries + paths, not full traces.
4. Never ask a leaf to spawn a leaf.

## Workflow

1. Restate target and suspected ambiguity.
2. Resolve **facts** (code/docs/libs) before asking the user — never turn an
   answerable fact into a user quiz (grilling.md). **Research floor:** when the request involves a new mechanism, an external
   platform/service integration, or a design judgment about how mature
   products solve this, dispatch the research briefs **before the decision
   rounds** — typically two in parallel (repo precedent + external product
   survey). Feed the findings into the reuse/adapt/build comparison before
   recommending an implementation (grilling.md). Purely internal small changes
   record `research: not-needed` + one-line reason on the issue/PRD instead.
3. Apply **domain discipline** (glossary, fuzzy terms, code contradictions).
4. Resolve the **Behavior Contract** six fields (grilling.md).
5. Run the conditional architecture-impact check: targeted lookup through
   glossary, routes, seams, relevant ADR/spec paths; record `required`, or
   `not-applicable` with the lightweight trigger check. If a trigger is
   present, resolve each decision's disposition before shape.
6. Ask **product/design-first** decisions in **frontier rounds** (grilling.md):
   one numbered round for every decision whose prerequisites are settled; a
   decision that depends on an answer still open goes to a later round.
   Recompute the frontier after each round.
7. Prefer the host's structured question tool for batches and choices; if
   unavailable, use the same plain-text questions — do not block.
8. Keep the loop moving: answer digressions, restate until confirmed, then
   the next unblocked question — do not wait for "continue" unless the user
   pauses.
9. Stress-test scenarios: primary path, failure visibility, forbidden
   shortcut.
10. Crystallize each round's confirmed decisions into `.rope/` **in the
    same round** (glossary / ADR / research / specs; chat dies on compact) —
    a confirmed decision still living only in chat when its round ends is a
    violation, never a batch for after the interview.
11. **Shared-understanding gate:** recap 3–6 bullets; the user confirms before
    shape. Do not write the issue package until confirm (unless they said
    "直接 shape"). Shape later projects this recap into the PRD's Contract
    Note.
12. **Done when** grilling.md's Ready checklist holds + user confirm. Else
    list blockers.
13. Handoff shape in-session by default; cross-window paste only if the user
    switches sessions. Inline shape: summary then nod before commit.

## Guardrails

- No feature implementation code; no issue package before step 11 confirm.
- No answerable uncertainty as an "implementation branch".
- No product decisions only in chat — write `.rope/`.
- Schema, dependency, auth, deploy, destructive FS/git, prod/shared → human gate.
