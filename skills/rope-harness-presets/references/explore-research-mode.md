# Explore Research Mode

External research with disk output is a **mode of `rope-explore`, declared
by the brief** — not a separate agent. The preset carries an
**unrestricted tool surface**; modes constrain behavior, not available tools.
Tool-restricted presets can prevent research leaves from persisting findings.

## Mode contract

**The brief is the contract:** the dispatch prompt states the
task — question, sources, output path, return shape — and the leaf honors
exactly what it declares.

- Default dispatch (investigation, validation, end-of-issue scanner): keeps
  product code/tests unchanged. Validation may run briefed commands and save
  their evidence logs at the declared location, following the
  [handoff contract](role-schema.md#exploration-and-validation-handoff).
  It does not use research permissions or rewrite project documents.
- Research dispatch (the brief names a findings output under
  `.rope/research/`): may use web search / fetch; may write exactly one
  findings artifact under `.rope/research/**` — nowhere else. Never
  touches product code, tests, or branches; never spawns.
- Either mode: a brief requirement that could not be met goes in the
  return under **unknowns** with what was attempted — a silent gap is a
  contract violation, not a smaller answer.
- The reviewed-tree guarantee is unaffected: research writes go
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
and **record the type used** (declared deviation). No schema,
ranking, or manifest change — the three core roles are unchanged.
