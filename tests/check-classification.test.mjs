/**
 * check-classification.test.mjs — what a red check means, and what it may not.
 *
 * The audited regression: every unverified check was recorded as a
 * `host-template` blocker, and `host-template` is the trigger for the
 * downgrade escape hatch — so an ordinary red suite told the parent to abandon
 * the kernel. These tests fence the two-way split:
 *
 *   exit 1  (evidence readable, saved exit non-zero)  → product, stage record
 *   exit 2  (no readable evidence)                    → host-template, blockers
 *
 * and the review-side twin: a reply that violates its schema is a failed
 * spawn the host rejects, never a verdict the kernel interprets.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

import { loadTemplate } from "./harness/load-workflow.mjs";
import { createStubHost } from "./harness/stub-host.mjs";
import { makeRepo, commitIn, cleanup, scriptPath } from "./harness/tmp-repo.mjs";
import { greenPlan, approvingReplies, task, failCheck, templatePath } from "./harness/fixture-plan.mjs";

const VERIFY = scriptPath("verify-delivery.sh");
const RUN_CHECK = scriptPath("run-check.sh");

async function fixture(prefix) {
  const repo = await makeRepo(prefix);
  repo.evidenceDir = join(repo.dir, ".rope", "issues", prefix.replace(/-+$/, ""), "evidence");
  repo.verifyScript = VERIFY;
  repo.checkScript = RUN_CHECK;
  return repo;
}

/** The vm realm has its own Array prototype; deepEqual needs a native one. */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test("an ordinary red check is a product fact and never suggests downgrading the kernel", async () => {
  const repo = await fixture("classify-red-");
  try {
    const host = createStubHost({
      repo: repo.dir,
      // The probe carriers are gate-driven: an "ok" reply with the gate's exit
      // code deciding. Here the probe gate reads the saved exit 3 (non-zero →
      // carrier null) and the readability gate passes — a product fact.
      replies: Object.assign(approvingReplies(["A"]), {
        "check:integration": { ack: "ok" },
        "check-readable:integration": { ack: "ok" },
      }),
    });
    const record = await loadTemplate(templatePath(), {
      globals: host.globals,
      args: greenPlan({
        repo: repo, baseSha: repo.baseSha, tasks: [task("A")],
        checks: [failCheck("integration", "l2")],
      }),
    });

    assert.equal(record.stages.l2.ok, false);
    assert.match(record.stages.l2.reason, /integration/, "the failing check is named, not lumped into an indistinguishable outcome");
    const classes = plain(record.blockers).map((blocker) => blocker.class);
    assert.deepEqual(classes, ["product"], "one product blocker for the stage; a red check is not a harness defect: " + JSON.stringify(record.blockers));
    assert.equal(record.suggestDowngrade, null, "the escape hatch must not fire on an ordinary failing suite");
    assert.equal(plain(record.checks).find((check) => check.id === "integration").ok, false);
    assert.notEqual(record.verdict, "delivered");
  } finally { await cleanup(repo.dir); }
});

test("a check that wrote no readable evidence is the host/template blocker the escape hatch exists for", async () => {
  const repo = await fixture("classify-silent-");
  try {
    // A wrapper that forwards to the real run-check.sh and then deletes the
    // detail files: the batch still fails (the check is red), but the evidence
    // a probe needs is gone — the command itself cannot cause that.
    const wrapper = join(repo.dir, "swallow-evidence.sh");
    await writeFile(wrapper, [
      "#!/usr/bin/env bash",
      `bash "${RUN_CHECK}" "$@"; rc=$?`,
      `find "${repo.evidenceDir}" -name "*.json" -type f -delete 2>/dev/null`,
      "exit $rc",
      "",
    ].join("\n"), "utf8");

    const host = createStubHost({
      repo: repo.dir,
      // Probe gate: detail deleted → exit 2 → carrier null. Readability gate:
      // `test -s` on a missing file → carrier null. Both gates decide; the
      // replies only let the carriers exist.
      replies: Object.assign(approvingReplies(["A"]), {
        "check:integration": { ack: "ok" },
        "check-readable:integration": { ack: "ok" },
      }),
    });
    const record = await loadTemplate(templatePath(), {
      globals: host.globals,
      args: greenPlan({
        repo: repo, baseSha: repo.baseSha, tasks: [task("A")],
        checks: [failCheck("integration", "l2")],
        checkScript: wrapper,
      }),
    });

    const hostTemplate = plain(record.blockers).filter((blocker) => blocker.class === "host-template");
    assert.ok(hostTemplate.length > 0, "missing evidence is a harness fact the blockers must name");
    assert.match(hostTemplate[0].message, /integration/);
    assert.ok(record.suggestDowngrade !== undefined, "genuine host trouble is exactly what the downgrade suggestion is for");
    assert.notEqual(record.verdict, "delivered");
  } finally { await cleanup(repo.dir); }
});

test("a reply violating its schema is a failed spawn, never an approve the kernel interprets", async () => {
  const repo = await fixture("classify-fence-");
  try {
    const replies = approvingReplies(["A"]);
    // AXIS_SCHEMA allows approve | changes_requested | blocked. Two replies
    // outside that vocabulary used to pass the stub and read as approve.
    replies["review:scanner"] = { axis: "scanner", verdict: "banana", identity: "stub-scanner", findings: [] };
    replies["review:behavior"] = { axis: "behavior", verdict: "banana", identity: "stub-reviewer", findings: [] };
    const host = createStubHost({ repo: repo.dir, replies });

    const record = await loadTemplate(templatePath(), {
      globals: host.globals,
      args: greenPlan({ repo: repo, baseSha: repo.baseSha, tasks: [task("A")] }),
    });

    assert.notEqual(record.verdict, "delivered", "an uninterpretable review must not deliver");
    assert.equal(record.review.verdict, "blocked");
    assert.ok(plain(record.review.axes).every((axis) => axis.verdict === "blocked"));
    assert.ok(host.logs.some((line) => line.includes("violates its requested schema")),
      "the stub names the rejection so the offline suite can see it");
  } finally { await cleanup(repo.dir); }
});

test("the shared-mode identity probe writes its own verdict beside, not over, the delivery verdict", async () => {
  const repo = await fixture("classify-paths-");
  try {
    const head = await commitIn(repo.dir, "feature.txt", "feature\n", "feat: shared");
    const replies = approvingReplies(["A"]);
    replies["leaf:A"].commit = head;
    replies["identity:A"] = { ack: "ok" };
    const host = createStubHost({ repo: repo.dir, replies });

    const record = await loadTemplate(templatePath(), {
      globals: host.globals,
      args: greenPlan({ repo: repo, baseSha: repo.baseSha, mode: "shared", fixRounds: 0, tasks: [task("A")] }),
    });

    assert.equal(record.verdict, "delivered");
    const deliveryVerdict = join(repo.evidenceDir, "delivery", "A-r0.json");
    const identityVerdict = join(repo.evidenceDir, "delivery", "A.identity-r0.json");
    assert.ok(existsSync(deliveryVerdict), "the leaf's own gate evidence survives");
    assert.ok(existsSync(identityVerdict), "the identity probe's verdict exists separately");
  } finally { await cleanup(repo.dir); }
});
