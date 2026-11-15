---
name: rope-clear
description: Organizes project documentation and migrates legacy .rope layouts to current conventions through an approved edit batch. Use for document cleanup, obsolete-rule triage, or knowledge-layer migration.
---

# Rope Clear

Organize project knowledge into current, correctly owned documents, not another
summary of the mess. Includes legacy `.rope/CONTEXT.md` → `.rope/GLOSSARY.md`
migration. This skill changes documents, not product behavior or architecture
decisions; init remains responsible for initial scaffolding.

## Workflow

1. **Bound the cleanup.** Read repo instructions and routes; identify the
   glossary and requested paths using
   [current documents](references/current-docs.md). Read relevant definitions
   and source sections as needed, not the whole knowledge layer up front.
   Inspect git status and identify tracked, modified,
   untracked, and external/installed files. Default scope is this repo's
   `.rope/` knowledge layer; list necessary inbound-reference repairs in the
   batch, including root agent-doc links. Other expansion needs user agreement.
   Record the scope in the existing work record. Done when every candidate's
   ownership and preservation needs are known; user edits remain intact.
2. **Establish current truth.** Read
   [current documents](references/current-docs.md) before classifying hits.
   Use explore for unknown source/usage lookups per the
   [handoff contract](../rope-harness-presets/references/role-schema.md#exploration-and-validation-handoff):
   request scoped facts, owners, inbound references, evidence and unknowns;
   the parent decides the batch and semantic conflicts. Check each candidate
   against its status, scope, explicit replacements, relevant source/tests,
   and Git history. Detect legacy glossary migration below. Classify: keep,
   revise, relocate, deduplicate, retire reference, or unresolved. Age,
   repetition, and filenames are clues, not proof. Done when each proposed
   change cites evidence or an open question.
3. **Approve a batch.** Present a compact table: path/section, problem,
   evidence, proposed edit, preservation method, and reference checks.
   Ask for one approval of the listed edits; resolve semantic conflicts with
   concrete choices. A general cleanup request is not approval of unseen
   deletions. Untracked content and dirty sections need an explicit retention
   choice because Git may not preserve their current bytes. Done when the
   approved rows and held rows are unambiguous.
4. **Apply only approved rows.** Recheck the candidate content against the
   approved version; intervening edits return that row for confirmation.
   Revise current text in place, consolidate duplicate rules at their owner,
   and repair affected inbound references. Keep formal ADR history with
   accurate replacement/scope markers. Preserve unrelated edits and installed
   copies; updating installations is a separate authorized operation.
   An unresolved row holds only dependent edits. Done when every approved
   row is applied or explicitly blocked, with no unapproved changes.
5. **Verify the reading path.** Check modified links, statuses and surviving
   references. Repeat the searches that exposed each obsolete rule; inspect
   hits rather than demand zero historical matches. From current navigation,
   read the replacement and verify its scope; for ADR history hits, confirm
   the status/replacement identifies why the old rule is not current.
   Read the diff for lost still-valid constraints. Done when every approved
   row has evidence of the intended result or a reported blocker.
6. **Close once.** Update the existing work record with changed paths,
   verification, and unresolved rows. If no record exists, use one
   `.rope/issues/<slug>/quick.md`; keep the inventory there, not a separate
   report per finding. Report a concise diff summary. Commit only when
   authorized by the user's task/workflow, including only approved changes.

## Legacy glossary migration

Check for `.rope/CONTEXT.md` on every run, even when it is not the named
cleanup target. Use the currently loaded Rope conventions, not an invented
schema-version ladder:

- **Only CONTEXT exists:** propose renaming it to `.rope/GLOSSARY.md`, preserving
  all content, with current inbound-reference repairs in the same batch.
- **Both exist:** compare content and ownership; propose consolidation at
  `.rope/GLOSSARY.md`. Never overwrite either file or silently choose between
  conflicting definitions. Hold dependent edits until the conflict is resolved.
- **Only GLOSSARY exists:** no filename migration is needed. Do not create a
  root-level glossary, a duplicate vocabulary, or a permanent CONTEXT alias.

The rename and content cleanup are separate edits. Long contracts, workflows
and task evidence are not made glossary entries merely by renaming the file;
propose their existing owners per current-docs. Preserve valid constraints,
and approve any content removal/relocation through the normal batch. Update
active instructions and links, including the repo's Rope agent-doc block;
leave historical mentions intact when they describe history. Uneditable or
out-of-scope active consumers are reported before removing the old entrypoint.

## Examples

- A spec contains both “old sessions retain snapshots” and “each turn reads
  current settings.” Trace the accepted change; propose replacing the obsolete
  paragraph and fixing its references. Without a decision, ask which behavior
  must hold — current code alone cannot authorize a contract change.
- Two guides repeat a live rule. Keep the rule at its owner and replace the
  duplicate with a pointer. Git retains the committed previous text.
- A superseded ADR matches grep. Retain its decision history, label its
  superseded scope and replacement, and make current navigation lead to the
  replacement. A raw grep hit is not an active instruction.

## Safety boundary

No product-code changes, new architecture choices, blanket formatting,
Git reset/clean, or automatic installation updates. Without Git history,
preserve content until the user approves a retention method or deletion.
If an approved change reveals a new conflict, return that row for a decision.
