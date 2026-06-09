#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="${1:-$SCRIPT_DIR}"
SOURCE_DIR="$SCRIPT_DIR/codex-install-source"

echo
echo "Codex Grid Agents kurulumu"
echo "Hedef proje: $TARGET_DIR"
echo

if [[ ! -d "$TARGET_DIR" ]]; then
  echo "HATA: Hedef klasör bulunamadı: $TARGET_DIR"
  exit 1
fi

if [[ ! -d "$SOURCE_DIR/codex" || ! -d "$SOURCE_DIR/agents" ]]; then
  echo "HATA: Görünür kurulum kaynakları bulunamadı."
  exit 1
fi

mkdir -p "$TARGET_DIR/.codex" "$TARGET_DIR/.agents"

# Preserve existing project files; copy/merge package contents.
cp -R "$SOURCE_DIR/codex/." "$TARGET_DIR/.codex/"
cp -R "$SOURCE_DIR/agents/." "$TARGET_DIR/.agents/"

echo "Kurulan yollar:"
echo "  $TARGET_DIR/.codex/config.toml"
echo "  $TARGET_DIR/.codex/agents/"
echo "  $TARGET_DIR/.agents/skills/grid-package-analysis/SKILL.md"
echo

missing=0
[[ -f "$TARGET_DIR/.codex/config.toml" ]] || missing=1
[[ -d "$TARGET_DIR/.codex/agents" ]] || missing=1
[[ -f "$TARGET_DIR/.agents/skills/grid-package-analysis/SKILL.md" ]] || missing=1

if [[ "$missing" -ne 0 ]]; then
  echo "HATA: Kurulum doğrulaması başarısız."
  exit 1
fi

agent_count="$(find "$TARGET_DIR/.codex/agents" -maxdepth 1 -name '*.toml' | wc -l | tr -d ' ')"

echo "Kurulum başarılı."
echo "Özel ajan sayısı: $agent_count"
echo
echo "Finder'da gizli klasörleri göstermek/gizlemek için:"
echo "  Command + Shift + ."
echo
echo "Codex'i proje kökünden yeniden başlat."
echo
read -r -p "Pencereyi kapatmak için Enter'a basın..." _ || true
