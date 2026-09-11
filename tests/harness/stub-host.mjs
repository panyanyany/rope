/**
 * stub-host.mjs — a stub SubagentWorkflow host for offline template tests.
 *
 * Every behaviour the tests rely on carries a citation to the real source it
 * imitates. A stub behaviour with no citation is a finding, and a citation that
 * no longer matches the installed extension is a finding too: these tests are
 * the only fence between a fixed template and a changed host contract.
 *
 * | Stub behaviour                                   | Real source                        |
 * | ------------------------------------------------ | ---------------------------------- |
 * | a schema'd spawn resolves to the **payload**,    | `worker-source.ts` `agentIn`:      |
 * | never to an `{ok, text}` envelope: the script    | `if (schema === undefined) return  |
 * | sees `realmParse(result)`, so `result.ok` is     | result; return realmParse(result)` |
 * | always `undefined`                               |                                    |
 * | a schema-less spawn resolves to the **prose      | `runtime.ts` `respond(callId,      |
 * | string** itself, unenveloped                     | true, text)` → `worker-source.ts` `callHost` value |
 * | a worktree child's prose gains the host's branch | `agent-manager.ts` appends         |
 * | note; a schema'd payload does not                | "Changes saved to branch `…`" to   |
 * |                                                  | `record.result` only               |
 * | a failed spawn is `null`, never a throw          | `runtime.ts` `respond(callId,true, |
 * |                                                  | null)`; "a dead agent is a null in |
 * |                                                  | the script"                        |
 * | a reply violating the requested schema is `null` | `runtime.ts` `applySchema` sets    |
 * | (after materialisation, before the script sees   | ok:false → the same null path      |
 * | it)                                              |                                    |
 * | a gate rejection is `null` with no readable text | `runtime.ts` `applyGate`, then the same null path |
 * | the script's return value may not contain an     | `worker-source.ts` `assertBoundary`|
 * | `undefined` below the top level                  | + `checkBoundary(value, "the workflow result")` |
 * | `gate` runs before the worktree is cleaned up    | `host.ts` `onBeforeWorktreeCleanup` |
 * | `phase`/`log`/`console` are injected, nothing else | `worker-source.ts` sandbox construction |
 * | `budget.spent()` counts output tokens            | `runtime.ts` `budget`           |
 * | `parallel`/`pipeline` swallow thunk errors but    | `worker-source.ts` rethrows      |
 * | rethrow a fatal one (`error.fatal`)               | `isFatal` errors                 |
 *
 * The envelope rows are the ones that matter: `toSpawnResult` (the shape the
 * host builds for its own bookkeeping) is NOT what a script receives, and a
 * stub that hands back `{ok, text}` tests a contract no script ever sees. The
 * `agentIn` unwrap is the layer that decides, and the loader enforces the
 * boundary rule so an unroutable record fails here rather than at runtime.
 *
 * Determinism is deliberate: no clock, no randomness, no ids that vary between
 * runs, because the template itself may not read any of those.
 */

import { spawnSync } from "node:child_process";

/**
 * A minimal JSON-Schema checker covering every keyword the template's schemas
 * use: type (incl. type arrays like `["string", "null"]`), enum, required,
 * properties, items, additionalProperties. Mirrors the host's `applySchema`
 * (`runtime.ts`): a reply that violates the requested schema is a failed
 * spawn (null), never a value the script is left to police. Without this the
 * offline suite can show a false green the real host would reject — a
 * schema-violating verdict once read as approve.
 */
function validateSchema(value, schema) {
  if (schema === undefined || schema === null || typeof schema !== "object") return true;
  const types = Array.isArray(schema.type) ? schema.type : (schema.type === undefined ? [] : [schema.type]);
  if (types.length > 0 && !types.some((candidate) => schemaTypeMatches(value, candidate))) return false;
  if (Array.isArray(schema.enum) && !schema.enum.some((candidate) => candidate === value)) return false;
  // `typeof null === "object"`, so the branch is entered on the value's real
  // shape (and the type gate above has already accepted it), never on the
  // type keyword alone — a `["string", "null"]` field holding null must not
  // wander into the object branch and die there.
  if (types.includes("object") && typeof value === "object" && value !== null && !Array.isArray(value)) {
    for (const name of schema.required || []) {
      if (!Object.prototype.hasOwnProperty.call(value, name)) return false;
    }
    if (schema.additionalProperties === false) {
      const allowed = Object.keys(schema.properties || {});
      for (const key of Object.keys(value)) {
        if (!allowed.some((candidate) => candidate === key)) return false;
      }
    }
    for (const key of Object.keys(schema.properties || {})) {
      if (Object.prototype.hasOwnProperty.call(value, key) && !validateSchema(value[key], schema.properties[key])) return false;
    }
  }
  if (types.includes("array") && Array.isArray(value)) {
    for (const item of value) {
      if (!validateSchema(item, schema.items)) return false;
    }
  }
  return true;
}

function schemaTypeMatches(value, type) {
  if (type === "object") return typeof value === "object" && value !== null && !Array.isArray(value);
  if (type === "array") return Array.isArray(value);
  if (type === "string") return typeof value === "string";
  if (type === "integer") return typeof value === "number" && Number.isInteger(value);
  if (type === "number") return typeof value === "number";
  if (type === "boolean") return typeof value === "boolean";
  if (type === "null") return value === null;
  return true;
}

/**
 * Replace `<sha:key>` placeholders in a scripted reply.
 *
 * An explicit hash wins; otherwise a deterministic 40-hex stand-in is derived
 * from the key, so a test that does not care about the real object still reads
 * the same and never depends on a clock or a counter.
 */
function materialize(value, scope) {
  if (typeof value === "string") {
    return value.replace(/<sha:([^>]+)>/g, (_, key) => scope[key] || standInSha(key));
  }
  if (Array.isArray(value)) return value.map((item) => materialize(item, scope));
  if (value !== null && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value)) out[key] = materialize(value[key], scope);
    return out;
  }
  return value;
}

function standInSha(key) {
  return (String(key).toLowerCase().replace(/[^0-9a-f]/g, "c") + "0".repeat(40)).slice(0, 40);
}

export function createStubHost(options = {}) {
  const calls = [];
  const phases = [];
  const logs = [];
  const context = { repo: options.repo, gateCwd: undefined, hashes: options.hashes || {} };

  /**
   * The host runs a `gate` command with `pi.exec` in the child's cwd. In tests
   * the gate command is a `bash …` invocation, which is executed for real so the
   * shell scripts under test are exercised rather than described.
   */
  function runGate(command) {
    const result = spawnSync("bash", ["-c", command], {
      cwd: context.gateCwd || context.repo,
      encoding: "utf8",
      timeout: options.gateTimeoutMs || 60_000,
    });
    return { ok: result.status === 0, output: String(result.stdout || "") + String(result.stderr || "") };
  }

  function resolveReply(script, call) {
    if (script === undefined) throw new Error("no scripted reply for " + call.label);
    const value = typeof script === "function" ? script(call) : script;
    if (value === undefined || value === null) return { fail: true };
    return { value: materialize(value, context.hashes) };
  }

  async function agent(prompt, opts = {}) {
    const call = {
      index: calls.length,
      label: opts.label === undefined ? "agent:" + calls.length : opts.label,
      agentType: opts.agentType,
      isolation: opts.isolation,
      phase: opts.phase,
      hasSchema: opts.schema !== undefined,
      hasGate: opts.gate !== undefined,
      prompt: prompt,
      gate: opts.gate,
      gateResult: undefined,
    };
    calls.push(call);
    if (opts.phase !== undefined) phases.push(opts.phase);

    const scripted = options.replies === undefined ? undefined : options.replies[call.label];
    const fallback = options.replies === undefined || options.replies[call.label] !== undefined
      ? undefined
      : options.replies[call.label.replace(/:r\d+$/, "")];
    const outcome = resolveReply(scripted === undefined ? fallback : scripted, call);
    if (outcome.fail === true) return null;

    // gate runs only on a successful child, and for an isolated child before
    // the worktree is cleaned up — the template depends on both.
    if (opts.gate !== undefined) {
      const verdict = runGate(opts.gate);
      call.gateResult = verdict;
      if (!verdict.ok) return null;
    }

    const payload = outcome.value;
    if (opts.schema === undefined) {
      // Prose, unwrapped: with no schema asked for, the host hands the script
      // the text itself. A worktree child's text carries the branch note the
      // host appended to `record.result`, which is why the template must always
      // request a schema.
      const prose = typeof payload === "string" ? payload : JSON.stringify(payload);
      return opts.isolation === "worktree" && options.branchNote !== false
        ? prose + "\n\n---\nChanges saved to branch `pi-agent-<id>`."
        : prose;
    }
    // Schema'd: the host parses the reply in the script's realm and returns the
    // payload itself — not `{ok, text}`, and not a JSON string. A reply that
    // does not match the requested schema never reaches the script: the real
    // host's applySchema turns it into a failed spawn (after one retry).
    if (!validateSchema(payload, opts.schema)) {
      logs.push("stub: scripted reply for " + call.label + " violates its requested schema");
      return null;
    }
    return payload;
  }

  /** A `parallel` that really runs its thunks concurrently. Like the host's, a
   * thunk error is swallowed into null — except a fatal one, which rejects the
   * whole call so the script cannot mistake an aborted workflow for a quiet
   * failure (`worker-source.ts` rethrows `isFatal` errors from parallel and
   * pipeline). */
  async function parallel(thunks) {
    const results = await Promise.all(thunks.map(async (thunk) => {
      try {
        return await thunk();
      } catch (error) {
        if (error !== null && error !== undefined && error.fatal) throw error;
        return null;
      }
    }));
    return results;
  }

  async function pipeline(items, ...stages) {
    try {
      return await Promise.all(items.map(async (item, index) => {
        let value = item;
        for (const stage of stages) value = await stage(value, item, index);
        return value;
      }));
    } catch (error) {
      if (error !== null && error !== undefined && error.fatal) throw error;
      return items.map(() => null);
    }
  }

  return {
    calls,
    phases,
    logs,
    context,
    globals: {
      agent,
      parallel,
      pipeline,
      phase: (title) => phases.push(title),
      log: (message) => logs.push(message),
      budget: { spent: () => options.spentOutputTokens || 0, remaining: () => Infinity, total: null },
      console: { log() {}, error() {}, warn() {} },
    },
  };
}
