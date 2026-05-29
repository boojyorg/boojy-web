#!/usr/bin/env bash
set -euo pipefail

# =========================================================================
# boojy.org post-edit validation hook (ported from boojy-design, adapted)
#
# Runs after every Edit/Write/MultiEdit. For edits to .astro/.ts/.tsx files
# under website/, it runs `astro check` as the gate. On failure it appends a
# checkbox incident to dreams.md §2.
#
# Toolchain-aware: only runs when BOTH pnpm is on PATH AND Astro is installed
# (website/node_modules/.bin/astro). Otherwise it SKIPS gracefully (exit 0) —
# e.g. before Phase 0 scaffolds Astro. Biome + a test suite are deferred; add
# their gates here once they land (see CLAUDE.md).
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

REPO_ROOT="$(pwd)"
DREAMS="$REPO_ROOT/dreams.md"
INCIDENT_HEADER="### 🚨 Automated Validation Incident Logs"

log_failure_to_dreams() {
    local phase="$1" file="$2" error_log="$3"
    touch "$DREAMS"

    local clean_log
    clean_log=$(echo "$error_log" | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,3})*)?[mGK]//g" | head -n 8)

    local block_file dreams_tmp
    block_file=$(mktemp)
    dreams_tmp=$(mktemp)
    cat > "$block_file" << BLOCK
- [ ] **Fix $phase Failure in \`$file\`**
  \`\`\`text
  $clean_log
  \`\`\`
BLOCK

    if grep -qF "$INCIDENT_HEADER" "$DREAMS"; then
        awk -v hdr="$INCIDENT_HEADER" -v blk="$block_file" '
            index($0, hdr) == 1 {
                print
                while ((getline line < blk) > 0) print line
                close(blk)
                next
            }
            { print }
        ' "$DREAMS" > "$dreams_tmp" && cat "$dreams_tmp" > "$DREAMS"
    else
        { printf '\n%s\n' "$INCIDENT_HEADER"; cat "$block_file"; } >> "$DREAMS"
    fi
    rm -f "$block_file" "$dreams_tmp"
}

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
        log_failure_to_dreams "astro check" "$FILE_PATH" "$(cat "$err_log")"
        rm -f "$err_log"
        exit 1
    fi
    rm -f "$err_log"
    echo "✅ Validation Passed: astro check clean."
fi

exit 0
