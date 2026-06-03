#!/usr/bin/env bash
set -euo pipefail

# =========================================================================
# Boojy Suite dashboard generator — a compact reference fact-sheet.
#
# One row per app: where it's stored, tech stack, platforms, current version.
# Tech/platforms/path are stable facts (kept in the REPOS config below);
# the version is read live from each repo (package.json / pubspec / CHANGELOG).
#
#   ./scripts/suite-dashboard.sh                  # writes to the default vault path
#   ./scripts/suite-dashboard.sh /path/out.html   # override output
# =========================================================================

cd "$(dirname "$0")/.."                 # repo root (Boojy/) — so sibling paths resolve
DEFAULT_OUT="$HOME/Documents/Vault/Boojy/dashboard.html"
OUT="${1:-${SUITE_DASHBOARD_OUT:-$DEFAULT_OUT}}"
TODAY="$(date '+%Y-%m-%d %H:%M')"

# name | path | tech stack | platforms
REPOS=(
  "Boojy Audio|../boojy-audio|Flutter (Dart) UI + Rust engine over dart:ffi; VST3 hosting|macOS · Windows (iOS / web scaffolded)"
  "Boojy Design|../boojy-design|TypeScript + Konva canvas (Vite / React)|Web (browser)"
  "Boojy Notes|../boojy-notes|React + Vite + TypeScript; Supabase + R2 sync|Web · Desktop (Electron: macOS / Windows)"
  "boojy.org (website)|.|Astro static site (SSG + React islands), TS; Cloudflare Pages|Web"
  "Boojy Cloud|../boojy-cloud|Supabase Edge Functions (Deno / TS) + migrations|Backend (no client)"
)

esc() { sed -e 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

get_version() {
  local p="$1" v
  for f in "$p/package.json" "$p/website/package.json" "$p/ui/pubspec.yaml"; do
    [ -f "$f" ] || continue
    case "$f" in
      *.yaml) v=$(grep -m1 -E '^version:' "$f" 2>/dev/null | sed -E 's/^version:[[:space:]]*//; s/\+.*$//' || true) ;;
      *)      v=$(jq -r '.version // empty' "$f" 2>/dev/null || true) ;;
    esac
    [ -n "$v" ] && { echo "$v"; return; }
  done
  if [ -f "$p/CHANGELOG.md" ]; then
    v=$(grep -m1 -E '^##[[:space:]]+v?[0-9]' "$p/CHANGELOG.md" 2>/dev/null | sed -E 's/^##[[:space:]]+//; s/[[:space:]].*$//' || true)
    [ -n "$v" ] && { echo "$v"; return; }
  fi
  echo "—"
}

TMP="$(mktemp)"
cat > "$TMP" <<HTML
<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Boojy Suite — Apps</title>
<style>
  :root{--bg:#0f1117;--panel:#171a22;--bd:#2a2f3a;--fg:#e6e8ee;--dim:#9aa3b2;--accent:#7c9cff}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;padding:32px 20px;max-width:980px;margin-inline:auto}
  h1{font-size:22px;margin:0 0 2px}
  .sub{color:var(--dim);font-size:13px;margin-bottom:22px}
  .wrap{overflow-x:auto;border:1px solid var(--bd);border-radius:12px}
  table{border-collapse:collapse;width:100%;min-width:760px;background:var(--panel)}
  th,td{text-align:left;padding:13px 16px;border-bottom:1px solid var(--bd);vertical-align:top}
  th{color:var(--dim);font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:600}
  tr:last-child td{border-bottom:none}
  td.app{font-weight:600;white-space:nowrap}
  td.ver{font-variant-numeric:tabular-nums;white-space:nowrap}
  .tech{color:var(--fg)} .plat{color:var(--dim)}
  a.loc{color:var(--accent);text-decoration:none;font-size:12.5px}
  a.loc:hover{text-decoration:underline}
  code{background:#0b0d12;padding:1px 5px;border-radius:5px;font-size:12.5px}
  .foot{color:var(--dim);font-size:12px;margin-top:18px}
</style></head><body>
<h1>Boojy Suite — Apps</h1>
<div class="sub">Generated $TODAY · regenerate: <code>./scripts/suite-dashboard.sh</code> · version is read live; tech/platforms/location are fixed facts</div>
<div class="wrap"><table>
<thead><tr><th>App</th><th>Version</th><th>Tech stack</th><th>Platforms</th><th>Location</th></tr></thead>
<tbody>
HTML

for entry in "${REPOS[@]}"; do
  IFS='|' read -r name path tech plats <<< "$entry"
  [ -d "$path/.git" ] || continue
  ver="$(get_version "$path")"
  case "$ver" in v[0-9]*) ;; [0-9]*) ver="v$ver" ;; *) ;; esac
  abs="$(cd "$path" && pwd)"; enc="${abs// /%20}"
  disp="${abs/#$HOME/~}"
  {
    echo "<tr>"
    echo "  <td class=\"app\">$(printf '%s' "$name" | esc)</td>"
    echo "  <td class=\"ver\">$(printf '%s' "$ver" | esc)</td>"
    echo "  <td class=\"tech\">$(printf '%s' "$tech" | esc)</td>"
    echo "  <td class=\"plat\">$(printf '%s' "$plats" | esc)</td>"
    echo "  <td><a class=\"loc\" href=\"file://$enc/\">$(printf '%s' "$disp" | esc)</a></td>"
    echo "</tr>"
  } >> "$TMP"
done

cat >> "$TMP" <<'HTML'
</tbody></table></div>
<div class="foot">Internal reference. Deeper detail lives elsewhere: per-app tech notes in each repo's <code>CLAUDE.md</code> + <code>.claude/rules/</code>; live status &amp; milestones in <a class="loc" href="./SUITE_STATUS.md">SUITE_STATUS</a>; strategy in the <a class="loc" href="./Boojy%20Suite%20%E2%80%94%20Vision%20(2026%20Refresh).md">Vision</a> doc.</div>
</body></html>
HTML

mkdir -p "$(dirname "$OUT")"
cat "$TMP" > "$OUT"      # overwrite in place (redirect, not unlink — works on mounted dirs)
rm -f "$TMP"
echo "✅ Wrote $OUT"
