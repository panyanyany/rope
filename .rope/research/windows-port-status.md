# Windows port status (2026-09-19)

Fork sync (upstream `WufeiHalf/rope` @ `fd94180`, merged as `ea9508a`) brought
the go execution kernel and its offline regression suite. The suite was
developed on Unix; on Windows (Git Bash / MSYS, Node 22) it is partially
blocked. Status after the port fixes below: **21 pass / 17 fail**, all
failures in `tests/gates.test.mjs` (13) and `tests/kernel.test.mjs` (4).

## Fixed in this repo

- `tests/harness/tmp-repo.mjs`, `tests/smoke.test.mjs` used
  `new URL(...).pathname`, which yields `/C:/...` on Windows and produced
  `C:\C:\...` inside `readFile`. Fixed with `fileURLToPath`.
- No `.gitattributes` existed and the fork machines use `core.autocrlf=true`,
  so every file checked out CRLF: the smoke frontmatter regex failed and
  `.sh` scripts carried CRLF. Fixed with `* text=auto eol=lf` + full
  re-checkout (index was already LF, so no content diff).

## Remaining blocker (needs upstream-scale work, not a quick fix)

`run-check.sh` (and the kernel template's script layer) pass the check batch
as a JSON **argv** string. `JSON.stringify` escapes the Windows temp path as
`C:\\Users\\...`; that backslash collapses somewhere in the bash → node argv
chain, so the batch re-parse dies with `Bad escaped character in JSON`. The
12 gates failures and most kernel failures (plus
`Cannot read properties of undefined (reading 'status')`) trace back to this
layer or to sibling bash semantics.

Proper fix direction: pass JSON via **stdin or a file path** instead of argv
in `skills/rope-go/scripts/run-check.sh` and the kernel template, then
re-examine the residual bash-semantics failures. That is a Windows port of
the kernel script layer — worth taking upstream as a PR rather than
diverging in the fork.

Alternative until then: run `npm test` under WSL, where the suite is
expected to be green.
