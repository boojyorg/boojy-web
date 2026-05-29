---
name: suite-status
description: Use when the user asks for the overall state of the Boojy suite, cross-project status, progress, or "what's next". Refreshes the suite progress tracker.
disable-model-invocation: false
---

# Suite Status / Progress Tracker

The suite tracker lives in the **vault** at `~/Documents/Vault/Boojy/SUITE_STATUS.md` (cross-project
docs). This script lives in the boojy repo because it's code. Refresh it, then report.

```bash
./scripts/suite-status.sh
# or override the output path:
# ./scripts/suite-status.sh /absolute/path/to/SUITE_STATUS.md
```

It rewrites **only** the auto Snapshot block (version, branch, last commit, 30-day commits,
working-tree state per repo). The **Current Milestone** checklist and per-app **Focus** notes are
hand-maintained and preserved across runs — never edit the AUTO block by hand.

After running: summarize what changed since last time (new commits, version bumps, dirty trees),
then point at the top unchecked item in the Current Milestone as the recommended next action.
Strategy/intent lives in *Boojy Suite — Vision (2026 Refresh)*; this tracker is operational state.
