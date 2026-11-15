# Rope Harness Manifest Schema

## Location

User-global only:

```text
~/.config/rope/harness/<host>.json
```

For example: pi → `~/.config/rope/harness/pi.json`, codex →
`~/.config/rope/harness/codex.json`. The `<host>` segment is whatever
host-discovery identified — never a guessed value.

Not project `.rope/`. Not skill-local settings. Not a second prompt database.

## Shape

```json
{
  "host": "pi",
  "generated_at": "2026-07-16T12:00:00Z",
  "skill": "rope-harness-presets",
  "confidence": "low",
  "sources": [
    "agent registry verified from ~/.codex/agents/*.toml local example",
    "enabledModels from ~/.pi/agent/settings.json",
    "offline heuristics"
  ],
  "capability_gaps": [
    "host cannot spawn model-pinned subagents (inherit reported)"
  ],
  "roles": {
    "implementer": {
      "agent": "rope-implementer",
      "model": "provider/modelId",
      "thinking": "medium",
      "backup_model": "provider/backupModelId",
      "backup_thinking": "medium",
      "path": "~/.pi/agent/agents/rope-implementer.md"
    },
    "reviewer": {
      "agent": "rope-reviewer",
      "model": "provider/modelId",
      "thinking": "high",
      "path": "~/.pi/agent/agents/rope-reviewer.md"
    },
    "runner": {
      "agent": "rope-e2e-runner",
      "model": "provider/modelId",
      "thinking": "low",
      "path": "~/.pi/agent/agents/rope-e2e-runner.md"
    },
    "explore": {
      "agent": "rope-explore",
      "model": "provider/modelId",
      "thinking": "low",
      "path": "~/.pi/agent/agents/rope-explore.md"
    }
  }
}
```

## Field rules

| Field | Required | Notes |
| --- | --- | --- |
| `host` | yes | Harness id as identified by host-discovery (`pi`, `codex`, `agy`, …) |
| `generated_at` | yes | ISO-8601 UTC |
| `skill` | yes | Always `rope-harness-presets` |
| `confidence` | yes | `high` \| `medium` \| `low` |
| `sources` | yes | Non-empty string array describing how ranking was produced |
| `roles` | yes | Must include all four role keys (`implementer`, `reviewer`, `runner`, `explore`) |
| `roles.*.agent` | yes | Exact rope agent name |
| `roles.*.model` | yes | Host model id as written into agent frontmatter |
| `roles.*.thinking` | yes | Host thinking/effort level |
| `roles.*.path` | yes | Absolute or `~/…` path of the agent file (host-native location/format, e.g. `.toml` on codex) |
| `roles.*.backup_model` | no | Optional fallback host model id when primary encounters quota/rate-limit errors |
| `roles.*.backup_thinking` | no | Optional fallback thinking/effort level |
| `capability_gaps` | no | String array; present only when host-discovery recorded gaps (e.g. `no_agent_mechanism` detail); consumers treat entries as information, not failure |

## Write policy

- Create `~/.config/rope/harness/` if missing.
- Overwrite the whole file on each successful run (idempotent).
- Corrupt/partial prior content is not merged — replace with a valid full manifest.
- Do not write a manifest if agent writes failed mid-way; report partial failure
  with paths attempted.
- A gap-only manifest (no `roles`, only `capability_gaps`) is legal **only**
  when the user explicitly asked to persist a `no_agent_mechanism` finding;
  consumers must treat a roles-less manifest exactly like a missing one
  (`preset_missing` soft degrade).

## Soft-degrade contract (consumers)

When `rope-go` / `rope-finish` / a future parent orchestrator wants a leaf:

1. If `~/.config/rope/harness/<host>.json` exists and maps the role, prefer the
   named `rope-*` agent (and its pinned model/thinking).
2. If missing, unreadable, or roles-less (gap-only): record `preset_missing`,
   use a generic host worker without forced model pin, continue. Do **not**
   hard-block. Do **not** auto-run this skill. A `capability_gaps` entry rides
   the same path: record it, keep going.
3. If a leaf hits an API quota or rate-limit error and its role maps a
   `backup_model`, re-dispatch that slice with the backup model (and
   `backup_thinking` if mapped), record `[degraded: switched to <backup_model> (quota)]`,
   and maintain sticky degradation for subsequent dispatches of that role in
   the session.
