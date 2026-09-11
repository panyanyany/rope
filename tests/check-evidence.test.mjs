import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { loadTemplate } from "./harness/load-workflow.mjs";
import { createStubHost } from "./harness/stub-host.mjs";
import { makeRepo, cleanup, scriptPath } from "./harness/tmp-repo.mjs";
import { greenPlan, approvingReplies, task, passCheck, failCheck, templatePath } from "./harness/fixture-plan.mjs";

test("a batch exit code is not every check's outcome: optional failure stays visible and required successes stay true", async () => {
  const repo = await makeRepo("check-truth-");
  repo.evidenceDir = join(repo.dir, ".rope/issues/check-truth/evidence");
  repo.verifyScript = scriptPath("verify-delivery.sh");
  repo.checkScript = scriptPath("run-check.sh");
  try {
    for (const required of [false, true]) {
      const replies = approvingReplies(["A"]);
      replies["check:good"] = { ack: "ok" };
      replies["check:bad"] = { ack: "ok" };
      const host = createStubHost({ repo: repo.dir, replies });
      const record = await loadTemplate(templatePath(), {
        globals: host.globals,
        args: greenPlan({ repo, baseSha: repo.baseSha, tasks: [task("A")], checks: [
          passCheck("good", "l2"), failCheck("bad", "l2", { required }),
        ] }),
      });
      assert.equal(record.checks.find((c) => c.id === "good").ok, true);
      assert.equal(record.checks.find((c) => c.id === "bad").ok, false, "an optional failure cannot become green");
      assert.ok(record.blockers.some((b) => b.id === "bad"), "each unverified check is named and classified");
      assert.equal(record.verdict === "delivered", !required);
      const detail = JSON.parse(await readFile(record.checks.find((c) => c.id === "bad").verdictFile, "utf8"));
      assert.equal(detail.exitCode, 3);
    }
  } finally { await cleanup(repo.dir); }
});

test("run-check evidence probe is read-only and refuses missing, malformed and non-zero evidence", async () => {
  const repo = await makeRepo("check-probe-");
  try {
    const path = join(repo.dir, ".rope/issues/check-probe/evidence/check.json");
    await mkdir(join(path, ".."), { recursive: true });
    const probe = () => spawnSync("bash", [scriptPath("run-check.sh"), "--probe", path], { cwd: repo.dir, encoding: "utf8" });
    assert.equal(probe().status, 2);
    for (const [content, exit] of [["{", 2], ["{}", 2], ['{"exitCode":7}', 1], ['{"exitCode":0}', 0]]) {
      await writeFile(path, content);
      assert.equal(probe().status, exit);
      assert.equal(await readFile(path, "utf8"), content);
    }
  } finally { await cleanup(repo.dir); }
});
