import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { loadTemplate } from "./harness/load-workflow.mjs";
import { createStubHost } from "./harness/stub-host.mjs";
import { greenPlan, approvingReplies, task, e2eItem, templatePath } from "./harness/fixture-plan.mjs";
import { makeRepo, cleanup, scriptPath } from "./harness/tmp-repo.mjs";

const finding = { severity: "blocking", path: "x.js", issue: "wrong behavior", fix: "correct it" };
const needsFix = { axis: "scanner", verdict: "changes_requested", identity: "scanner", findings: [finding] };
function fixReplies() {
  return {
    "review:scanner": needsFix,
    "fix:1": { status: "done", branch: "rope/review-fix-1", commit: "a".repeat(40), summary: "fixed" },
    "merge:fix1": { commit: "a".repeat(40), mergeCommit: "b".repeat(40), headAfter: "b".repeat(40) },
    "review:scanner:delta": approvingReplies([])["review:scanner"],
    "review:behavior:delta": approvingReplies([])["review:behavior"],
  };
}
async function run({ replies = {}, plan = {}, configure = () => {} } = {}) {
  const repo = await makeRepo("host-audit-");
  Object.assign(repo, { evidenceDir: join(repo.dir, ".rope/issues/host-audit/evidence"),
    verifyScript: scriptPath("verify-delivery.sh"), checkScript: scriptPath("run-check.sh") });
  try {
    const host = createStubHost({ repo: repo.dir, replies: { ...approvingReplies(["A", "B", "C"]), ...replies } });
    configure(host);
    const record = await loadTemplate(templatePath(), { globals: host.globals,
      args: { ...greenPlan({ repo, baseSha: repo.baseSha, fixRounds: 0, tasks: [task("A")], ...plan }), ...plan } });
    return { record, calls: host.calls };
  } finally { await cleanup(repo.dir); }
}
function rejecting(label, fatal = false) {
  return (host) => {
    const original = host.globals.agent;
    host.globals.agent = async (prompt, options) => {
      if (options.label === label) throw Object.assign(new Error("host transport exploded at " + label), { workflowFatal: fatal });
      return original(prompt, options);
    };
  };
}

test("review findings with a legal __proto__ field survive without changing their prototype", async () => {
  const { record } = await run({ configure(host) {
    const original = host.globals.agent;
    host.globals.agent = async (prompt, options) => {
      const result = await original(prompt, options);
      if (options.label === "review:scanner") result.findings.push(JSON.parse(
        '{"severity":"note","path":"x.js","issue":"metadata","fix":"none","__proto__":{"polluted":true}}'));
      return result;
    };
  } });
  assert.equal(record.verdict, "delivered");
  assert.equal(Object.prototype.polluted, undefined);
  assert.ok(Object.hasOwn(record.review.findings[0], "__proto__"));
  assert.equal(record.review.findings[0].__proto__.polluted, true);
});

test("non-finite host token accounting keeps the record and a classified diagnostic, never fake zero", async () => {
  for (const spent of [NaN, Infinity, -Infinity]) {
    const { record } = await run({ configure(host) { host.globals.budget.spent = () => spent; } });
    assert.equal(record.tokens.output, null);
    assert.ok(record.blockers.some((b) => b.class === "host-template" && /budget/.test(b.message)));
  }
  const { record } = await run({ configure(host) { host.globals.budget.spent = () => 123; } });
  assert.equal(record.tokens.output, 123);
});

for (const label of ["leaf:A", "merge:A", "checks:l2", "review:scanner", "fix:1", "merge:fix1", "e2e:E1"]) {
  test("rejected host spawn preserves the record and cannot pass: " + label, async () => {
    const fixing = label === "fix:1" || label === "merge:fix1";
    const { record } = await run({ configure: rejecting(label),
      replies: { ...(fixing ? fixReplies() : {}), "e2e:E1": { id: "E1", status: "passed", evidence: "walk" } },
      plan: { fixRounds: fixing ? 1 : 0, e2e: [e2eItem("E1")], e2eSerial: true },
    });
    assert.notEqual(record.verdict, "delivered");
    assert.ok(record.blockers.some((b) => b.class === "host-template" && b.message.includes("host transport exploded at " + label)));
    if (label === "review:scanner") {
      assert.equal(record.review.axes.length, 2);
      assert.equal(record.review.verdict, "blocked");
      assert.equal(record.stages.e2e.ran, false);
    }
    if (label === "checks:l2") {
      assert.equal(record.stages.l2.ran, false);
      assert.equal(record.stages.l2.skipped, false);
    }
  });
}

test("fatal host errors stop new dispatch without spending retries or pretending queued tasks ran", async () => {
  const { record, calls } = await run({ configure: rejecting("leaf:A", true),
    plan: { tasks: [task("A"), task("B"), task("C")], inFlight: 1, fixRounds: 2 } });
  assert.equal(calls.length, 0, "the failing RPC was intercepted before the fixture child started");
  assert.equal(record.concurrency.spawns, 1);
  assert.equal(record.tasks[0].rounds, 0);
  assert.deepEqual(record.tasks.slice(1).map((t) => t.state).join(","), "not-started,not-started");
  assert.notEqual(record.verdict, "delivered");
});

test("a missing parallel review result remains a named blocked axis instead of approving an empty set", async () => {
  // The review axes are this plan's only two-thunk parallel call (the check
  // stage probes one spec); losing both entries must read as two blocked
  // axes, not as an empty set the old code approved.
  const { record } = await run({
    configure(host) {
      const faithful = host.globals.parallel;
      host.globals.parallel = async (thunks) => (thunks.length === 2 ? thunks.map(() => null) : faithful(thunks));
    },
  });
  assert.equal(record.review.verdict, "blocked");
  assert.equal(record.review.axes.length, 2);
  assert.equal(record.review.axes.map((a) => a.axis).join(","), "scanner,behavior");
  assert.equal(record.stages.e2e.ran, false);
});

test("approve text cannot override blocking findings", async () => {
  const { record } = await run({ replies: { "review:scanner": { ...needsFix, verdict: "approve" } } });
  assert.equal(record.review.verdict, "changes_requested");
  assert.equal(record.review.blockingRemaining, 1);
  assert.notEqual(record.verdict, "delivered");
});

test("a failed delta axis cannot approve a review fix", async () => {
  const { record } = await run({ plan: { fixRounds: 1 }, replies: fixReplies(), configure: rejecting("review:scanner:delta") });
  assert.equal(record.review.verdict, "blocked");
  assert.notEqual(record.verdict, "delivered");
});

for (const [status, required] of [["failed", true], ["blocked", true], ["failed", false]]) {
  test("E2E outcome is classified even without a repair: " + status + "/required=" + required, async () => {
    const { record } = await run({ plan: { e2e: [e2eItem("E1", { required })] },
      replies: { "e2e:E1": { id: "E1", status, evidence: "real walk", detail: "not green" } } });
    assert.ok(record.blockers.some((b) => b.id === "E1" && b.class === "product"));
    if (required) assert.notEqual(record.verdict, "delivered");
  });
}

test("E2E delta rejection records remaining findings and a classified review failure", async () => {
  let walks = 0;
  const { record } = await run({ plan: { fixRounds: 1, e2e: [e2eItem("E1")] }, replies: {
    "e2e:E1": () => ({ id: "E1", status: ++walks === 1 ? "failed" : "passed", evidence: "walk" }),
    "e2e-fix:1": { status: "done", branch: "rope/e2e-fix-1", commit: "a".repeat(40), summary: "fixed" },
    "merge:e2e-fix1": { commit: "a".repeat(40), mergeCommit: "b".repeat(40), headAfter: "b".repeat(40) },
    "review:scanner:delta": needsFix,
    "review:behavior:delta": approvingReplies([])["review:behavior"],
  } });
  assert.equal(record.review.blockingRemaining, 1);
  assert.ok(record.blockers.some((b) => /delta.*review|review.*delta/.test(b.message)));
  assert.notEqual(record.verdict, "delivered");
});

test("a repaired slice retains the classified failure history", async () => {
  const { record } = await run({ plan: { fixRounds: 1 }, replies: { "leaf:A": null, "leaf:A:r1": approvingReplies(["A"])["leaf:A"] } });
  assert.equal(record.verdict, "delivered");
  assert.ok(record.blockers.some((b) => b.id === "A" && b.class && /verifiable delivery/.test(b.message)));
});
