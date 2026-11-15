#!/usr/bin/env bash
# Render diagramas/*.mmd (Mermaid) to figures/NAME.png (DOCX) and figures/NAME.pdf
# (vector, picked up by the LaTeX build next to the PNG).
#
# Runs on the host — the pandoc/LaTeX builder image has no browser. Mermaid CLI
# comes from the repo's pnpm devDependencies and drives a system Chromium/Chrome
# (set PUPPETEER_EXECUTABLE_PATH to override the lookup).
#
#   relatorio/scripts/diagrams.sh            # from anywhere; or: pnpm diagrams
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(cd .. && pwd)"

browser="${PUPPETEER_EXECUTABLE_PATH:-}"
if [[ -z "$browser" ]]; then
  for b in chromium chromium-browser google-chrome-stable google-chrome; do
    if command -v "$b" >/dev/null; then browser="$(command -v "$b")"; break; fi
  done
fi
[[ -n "$browser" ]] || { echo "error: no Chromium/Chrome found; set PUPPETEER_EXECUTABLE_PATH" >&2; exit 1; }

mmdc="$ROOT/node_modules/.bin/mmdc"
[[ -x "$mmdc" ]] || { echo "error: $mmdc missing; run 'pnpm install' at the repo root" >&2; exit 1; }

cfg="$(mktemp --suffix=.json)"
trap 'rm -f "$cfg"' EXIT
printf '{"executablePath": "%s", "args": ["--no-sandbox"]}' "$browser" > "$cfg"

shopt -s nullglob
MAX_W="${MAX_W:-1050}"   # natural width (CSS px) above which text prints < ~7 pt at 16 cm
for f in diagramas/*.mmd; do
  out="figures/$(basename "${f%.mmd}")"
  "$mmdc" -q -i "$f" -o "$out.png" -p "$cfg" -s 3 -b white
  "$mmdc" -q -i "$f" -o "$out.pdf" -p "$cfg"
  "$mmdc" -q -i "$f" -o "$out.svg" -p "$cfg"
  w="$(grep -o 'viewBox="[^"]*"' "$out.svg" | head -1 | awk '{printf "%d", $3}')"
  rm -f "$out.svg"
  if (( w > MAX_W )); then
    echo "WARN $out: natural width ${w}px > ${MAX_W}px — text will print small; restructure (TB, shorter labels)" >&2
  else
    echo "ok -> $out.{png,pdf} (${w}px)"
  fi
done
