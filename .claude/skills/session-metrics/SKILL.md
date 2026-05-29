---
name: session-metrics
description: Use when the user requests a detailed summary of session statistics, line velocity, or project progress.
disable-model-invocation: false
---

# Session Metrics Guide

When the user asks for session metrics, run this safe local git command to evaluate line velocity
and changed-file footprint against the default branch (`master`):

```bash
git diff --stat "$(git merge-base master HEAD)" 2>/dev/null || git diff --stat HEAD
```

Summarize: files touched, insertions/deletions, and which migration phase (see `dreams.md` §1) the
work maps to. If on `master` with no diff, report the latest commit's stat instead.
