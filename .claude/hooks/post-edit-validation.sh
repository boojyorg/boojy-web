#!/usr/bin/env bash
set -euo pipefail

# =========================================================================
# boojy.org post-edit validation hook (ported from boojy-design, adapted)
#
# Runs after every Edit/Write/MultiEdit. For edits to .astro/.ts/.tsx files
# under website/, it runs `astro check` as the gate. On failure it prints the
# (ANSI-stripped) error to stderr and exits non-zero; on success it exits 0.
#
# It does NOT write to dreams.md — incident logging was removed when the repo
# adopted the auto-memory dev model (git log + auto memory own history now).
# Biome lint is a separate gate (`pnpm lint`), not run here.
#
# Toolchain-aware: only runs when BOTH pnpm is on PATH AND Astro is installed
# (website/node_modules/.bin/astro). Otherwise it SKIPS gracefully (exit 0).
# =========================================================================

# Claude Code runs hooks with a minimal, non-login PATH, so an nvm-managed
# node/pnpm (in ~/.nvm/versions/node/*/bin) won't be found. Put it on PATH —
# version-agnostic glob, newest last so it wins. Without this the gate silently
# skips ("pnpm not found") and never actually runs astro check.
if ! command -v pnpm >/dev/null 2>&1; then
    for _nvm_bin in "$HOME"/.nvm/versions/node/*/bin; do
        [ -d "$_nvm_bin" ] && PATH="$_nvm_bin:$PATH"
    done
    export PATH
fi

JSON_INPUT=$(cat)
FILE_PATH=$(echo "$JSON_INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""')

# Only gate source files inside website/
if [[ "$FILE_PATH" == *"/website/"* && "$FILE_PATH" =~ \.(astro|ts|tsx)$ ]]; then
    # Skip unless the toolchain is ready (pnpm + Astro installed).
    if ! command -v pnpm >/dev/null 2>&1 || [ ! -x website/node_modules/.bin/astro ]; then
        echo "ℹ️  Toolchain not ready (pnpm/astro) — skipping validation gate for $FILE_PATH."
        exit 0
    fi

    echo "========================================="
    echo "⚙️  Auto-Validation Gate: astro check ($FILE_PATH)"
    echo "========================================="

    err_log=$(mktemp)
    if ! (cd website && pnpm exec astro check) > "$err_log" 2>&1; then
        echo "❌ Validation Failed: astro check reported errors." >&2
        sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,3})*)?[mGK]//g" "$err_log" | head -n 20 >&2
        rm -f "$err_log"
        exit 1
    fi
    rm -f "$err_log"
    echo "✅ Validation Passed: astro check clean."
fi

exit 0
