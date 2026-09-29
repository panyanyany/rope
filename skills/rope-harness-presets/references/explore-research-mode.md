# Explore Research Mode (ADR 0011; mode wording revised by ADR 0017)

External research with disk output is a **mode of `rope-explore`, declared
by the brief** — not a separate agent. The preset carries an
**unrestricted tool surface**; both modes are body discipline, not tool
restriction. Historically, plain explore was tool-restricted read-only,
could not persist findings, and borrowing a general-purpose worker went
undeclared (observed twice in the field; again 2026-09-09 — every grill
research leaf degraded to a twin because the pi preset had been
generated without web/write).

## Mode contract

**The brief is the contract** (ADR 0017): the dispatch prompt states the
task — question, sources, output path, return shape — and the leaf honors
exactly what it declares.

- Default dispatch (codebase navigation, end-of-issue scanner): behaves
  read-only — web and writes stay unused even though the tool surface
  grants them.
- Research dispatch (the brief names a findings output under
  `.rope/research/`): may use web search / fetch; may write exactly one
  findings artifact under `.rope/research/**` — nowhere else. Never
  touches product code, tests, or branches; never spawns.
- Either mode: a brief requirement that could not be met goes in the
  return under **unknowns** with what was attempted — a silent gap is a
  contract violation, not a smaller answer.
- The reviewed-tree guarantee of ADR 0010 is unaffected: research writes go
  to docs, outside reviewed product code, and scanner briefs never request
  writes.

## Research brief shape (minimal)

1. Research question + why it matters (1–2 sentences).
2. Primary-source rule (vendor docs / upstream repo at a pinned commit).
3. Output path + required sections (Question / Verified Facts with Sources /
   Assumptions / Implications).
4. Return shape: file path + ≤300-word summary + confidence.

## Degradation

Rare by construction — the preset ships unrestricted. Only when a host
cannot grant web/write at all: run the research brief on a generic worker
and **record the type used** (declared deviation, ADR 0011). No schema,
ranking, or manifest change — the three core roles are unchanged.
