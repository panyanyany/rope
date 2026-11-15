# 0ff08a5 宿主契约复审

状态：修复中；不 push，仅修改 Rope。

## 范围与事实基线

- 审核提交：`0ff08a566703750ddcb1a972cbfd767854c8e762`（起始工作树干净）。
- 宿主只读：`/home/wufei/Desktop/privatecode/pi-custom-subagent`，HEAD `4a968b54e7c09218086c6bdd2b5f489c21393367`；存在用户未提交修改，不触碰。以磁盘源码为准，不把 HEAD 当作无修改快照。
- 入口：真实 `go-execute.js` 经 `node:vm`，git 门禁在临时仓库实际执行。
- 基线：`node --test tests/*.test.mjs`，40/40，约 2.3s。
- 证据：本 issue 的 `evidence/review-0ff08a5/`（树内、gitignore）。

## 初步结论

原修复的 payload 解包和可选字段省略方向正确，但不足以通过复审。

1. `budget.spent()` 直接进入记录，非有限数仍会让整条记录被边界拒绝。宿主 `src/workflow/host.ts:125-134` 保留正 Infinity，`runtime.ts:1085` 累加，`worker-source.ts:112,714-716` 不检查有限性；边界 `:208-210` 拒绝。
2. 宿主不是“失败永远 null”：`worker-source.ts:114-125` 将失败 RPC 变为 rejection，fatal 标记 `workflowFatal`；`:557-607` 的 parallel/pipeline 仅吞普通异常。内核必须留下分类故障记录，不能在 merge/check/fix/串行 E2E 直接丢返回。
3. 终审不能过滤掉丢失的轴后对剩余空集合求 approve；delta 也必须有两轴。跑过却失败的 E2E、delta 拒绝和恢复成功的重试必须保留分类历史。
4. `stripUndefined` 以普通对象赋值复制 JSON 的 `__proto__` key，会自行制造非 plain 原型；宿主 JSON.parse 允许这个普通数据 key，边界 `:241-246` 却拒绝复制后原型。
5. shared 切片直接信 leaf claim，shared 修复没有实际身份门禁且不更新 headSha；worktree 修复记录 fix claim 而非 merge 的 git 解析值。这些不符合 PRD 的 git 裁定约束。新增 exact-head 门禁保留旧的 ancestor 探针语义。

## 验证要求

- 每条修复先红后绿；不改弱原有断言。
- 独立回退 parsePayload、branch 初始化、stripUndefined，验证原两条回归证伪能力和实际错误路径。
- 桩与真实源码逐分支对照，包括原型、循环/共享引用、sparse、symbol、fatal、JSON realm 和确定性 prelude。
- 完成后记录全量结果、本地提交、重新安装与逐字节一致性验证。
