import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { loadTemplate } from "./harness/load-workflow.mjs";
import { createStubHost } from "./harness/stub-host.mjs";
import { makeRepo, commitIn, cleanup, scriptPath, readJson } from "./harness/tmp-repo.mjs";
import { greenPlan, approvingReplies, task, templatePath } from "./harness/fixture-plan.mjs";

async function fixture() {
  const repo = await makeRepo("identity-audit-");
  repo.evidenceDir = join(repo.dir, ".rope/issues/identity/evidence");
  repo.verifyScript = scriptPath("verify-delivery.sh");
  repo.checkScript = scriptPath("run-check.sh");
  return repo;
}

test("shared delivery accepts only the full SHA git verifies as current HEAD, not an ancestor or invented claim", async () => {
  const repo = await fixture();
  try {
    const head = await commitIn(repo.dir, "feature.txt", "feature\n", "feat: shared");
    for (const claim of ["f".repeat(40), repo.baseSha, "HEAD", head]) {
      const replies = approvingReplies(["A"]);
      replies["leaf:A"].commit = claim;
      replies["identity:A"] = { ack: "ok" };
      const host = createStubHost({ repo: repo.dir, replies });
      const record = await loadTemplate(templatePath(), {
        globals: host.globals,
        args: greenPlan({ repo, baseSha: repo.baseSha, mode: "shared", fixRounds: 0, tasks: [task("A")] }),
      });
      if (claim === head) {
        assert.equal(record.verdict, "delivered");
        assert.equal(record.headSha, head);
        assert.equal(record.tasks[0].commit, head);
      } else {
        assert.notEqual(record.verdict, "delivered", "unverified claim: " + claim);
        assert.equal(record.tasks[0].state, "blocked");
        assert.ok(record.blockers.length > 0);
      }
    }
  } finally { await cleanup(repo.dir); }
});

test("exact-head delivery gate preserves legacy reachability mode but rejects an old or symbolic claim", async () => {
  const repo = await fixture();
  try {
    const head = await commitIn(repo.dir, "feature.txt", "feature\n", "feat: shared");
    const verdict = join(repo.evidenceDir, "exact.json");
    const run = (claim, exact) => spawnSync("bash", [repo.verifyScript,
      "--verdict", verdict, "--evidence", repo.evidenceDir, "--commit", claim,
      ...(exact ? ["--exact-head"] : []),
    ], { cwd: repo.dir, encoding: "utf8" });
    assert.equal(run(repo.baseSha, false).status, 0, "legacy ancestor probe remains supported");
    assert.equal(run(head, true).status, 0);
    for (const claim of [repo.baseSha, "HEAD"]) {
      assert.equal(run(claim, true).status, 1);
      assert.equal((await readJson(verdict)).reason, "commit-not-head");
    }
  } finally { await cleanup(repo.dir); }
});

test("shared review fixes verify their SHA, advance HEAD, and never issue worktree branch instructions", async () => {
  const repo = await fixture();
  try {
    const original = await commitIn(repo.dir, "feature.txt", "before\n", "feat: shared");
    let fixed;
    const replies = approvingReplies(["A"]);
    replies["leaf:A"].commit = original;
    replies["identity:A"] = { ack: "ok" };
    replies["review:scanner"] = {
      axis: "scanner", verdict: "changes_requested", identity: "scanner",
      findings: [{ severity: "blocking", path: "feature.txt", issue: "wrong content", fix: "correct content" }],
    };
    replies["fix:1"] = () => ({ status: "done", branch: "main", commit: fixed, summary: "fixed" });
    replies["identity:review-fix-1"] = { ack: "ok" };
    replies["review:scanner:delta"] = approvingReplies([])["review:scanner"];
    replies["review:behavior:delta"] = approvingReplies([])["review:behavior"];
    const host = createStubHost({ repo: repo.dir, replies });
    const originalAgent = host.globals.agent;
    host.globals.agent = async (prompt, options) => {
      if (options.label === "fix:1") fixed = await commitIn(repo.dir, "feature.txt", "after\n", "fix: shared");
      return originalAgent(prompt, options);
    };
    const record = await loadTemplate(templatePath(), {
      globals: host.globals,
      args: greenPlan({ repo, baseSha: repo.baseSha, mode: "shared", fixRounds: 1, tasks: [task("A")] }),
    });
    assert.equal(record.verdict, "delivered");
    assert.equal(record.headSha, fixed);
    assert.equal(record.review.fixes[0].commit, fixed);
    assert.ok(host.calls.some((call) => call.label === "identity:review-fix-1" && call.gateResult?.ok));
    assert.doesNotMatch(host.calls.find((call) => call.label === "fix:1").prompt, /git branch -f|your worktree/);
  } finally { await cleanup(repo.dir); }
});

test("worktree review fix records git-resolved commit rather than the implementer's claim", async () => {
  const repo = await fixture();
  try {
    const replies = approvingReplies(["A"]);
    replies["review:scanner"] = { axis: "scanner", verdict: "changes_requested", identity: "scanner",
      findings: [{ severity: "blocking", path: "feature.txt", issue: "wrong", fix: "correct" }] };
    replies["fix:1"] = { status: "done", branch: "rope/review-fix-1", commit: "f".repeat(40), summary: "fixed" };
    replies["merge:fix1"] = { commit: "a".repeat(40), mergeCommit: "b".repeat(40), headAfter: "b".repeat(40) };
    replies["review:scanner:delta"] = approvingReplies([])["review:scanner"];
    replies["review:behavior:delta"] = approvingReplies([])["review:behavior"];
    const host = createStubHost({ repo: repo.dir, replies });
    const record = await loadTemplate(templatePath(), {
      globals: host.globals,
      args: greenPlan({ repo, baseSha: repo.baseSha, fixRounds: 1, tasks: [task("A")] }),
    });
    assert.equal(record.review.fixes[0].commit, "a".repeat(40));
  } finally { await cleanup(repo.dir); }
});
