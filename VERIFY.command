#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="${1:-$SCRIPT_DIR}"

echo
echo "Codex dosyaları kontrol ediliyor: $TARGET_DIR"
echo

status=0

check_file() {
  local path="$1"
  if [[ -f "$path" ]]; then
    echo "OK   $path"
  else
    echo "YOK  $path"
    status=1
  fi
}

check_dir() {
  local path="$1"
  if [[ -d "$path" ]]; then
    echo "OK   $path"
  else
    echo "YOK  $path"
    status=1
  fi
}

check_file "$TARGET_DIR/AGENTS.md"
check_file "$TARGET_DIR/.codex/config.toml"
check_dir  "$TARGET_DIR/.codex/agents"
check_file "$TARGET_DIR/.agents/skills/grid-package-analysis/SKILL.md"
check_file "$TARGET_DIR/docs/original-analysis-prompt.md"
check_file "$TARGET_DIR/prompts/run-full-analysis.md"

if [[ -d "$TARGET_DIR/.codex/agents" ]]; then
  count="$(find "$TARGET_DIR/.codex/agents" -maxdepth 1 -name '*.toml' | wc -l | tr -d ' ')"
  echo
  echo "Bulunan özel ajan sayısı: $count"
  if [[ "$count" -lt 12 ]]; then
    echo "UYARI: 12 ajan bekleniyordu."
    status=1
  fi
fi

echo
if [[ "$status" -eq 0 ]]; then
  echo "Tüm temel dosyalar yerinde."
else
  echo "Eksik dosya var. INSTALL.command dosyasını çalıştır."
fi

echo
echo "Finder'da gizli klasörleri göstermek/gizlemek için Command + Shift + ."
echo
read -r -p "Pencereyi kapatmak için Enter'a basın..." _ || true
exit "$status"
