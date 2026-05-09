#!/usr/bin/env bash
# setup-skills.sh
# Downloads Claude Code skills from verified GitHub repos into .agent/skills/
# Each skill gets its own folder with a SKILL.md inside, e.g.:
#   .agent/skills/building-native-ui/SKILL.md
# No skillfish, no npm installs — just curl.
# Usage: bash setup-skills.sh

set -e

RAW="https://raw.githubusercontent.com"
SKILLS_DIR=".agent/skills"

echo ""
echo "Creating $SKILLS_DIR/ ..."
mkdir -p "$SKILLS_DIR"

# ─────────────────────────────────────────────────────────────────────────────
# Helper: download a SKILL.md into its own named subfolder
# Usage: get <folder-name> <raw-url>
# ─────────────────────────────────────────────────────────────────────────────
get() {
  local name="$1"
  local url="$2"
  local dir="$SKILLS_DIR/$name"
  mkdir -p "$dir"
  if curl -fsSL "$url" -o "$dir/SKILL.md" 2>/dev/null; then
    echo "  ✓  $name"
  else
    rmdir "$dir" 2>/dev/null || true
    echo "  ✗  $name  (fetch failed — URL may have moved)"
  fi
}

# ─────────────────────────────────────────────────────────────────────────────
# EXPO OFFICIAL  (github.com/expo/skills — 1,500+ stars, verified path)
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[Expo official skills]"
BASE_EXPO="$RAW/expo/skills/main/plugins/expo/skills"

get "building-native-ui"   "$BASE_EXPO/building-native-ui/SKILL.md"
get "native-data-fetching" "$BASE_EXPO/native-data-fetching/SKILL.md"
get "expo-tailwind-setup"  "$BASE_EXPO/expo-tailwind-setup/SKILL.md"
get "upgrading-expo"       "$BASE_EXPO/upgrading-expo/SKILL.md"

# ─────────────────────────────────────────────────────────────────────────────
# VERCEL LABS  (github.com/vercel-labs/agent-skills — verified path)
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[Vercel Labs skills]"
BASE_VERCEL="$RAW/vercel-labs/agent-skills/main/skills"

get "vercel-react-native"    "$BASE_VERCEL/react-native-skills/SKILL.md"
get "vercel-react-practices" "$BASE_VERCEL/react-best-practices/SKILL.md"
get "vercel-web-design"      "$BASE_VERCEL/web-design-guidelines/SKILL.md"

# ─────────────────────────────────────────────────────────────────────────────
# MCOLLINA (github.com/mcollina/skills — 1,800+ stars, verified path)
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[mcollina skills — Node.js / TypeScript]"
BASE_MCOLLINA="$RAW/mcollina/skills/main/skills"

get "typescript-magician"   "$BASE_MCOLLINA/typescript-magician/SKILL.md"
get "node-best-practices"   "$BASE_MCOLLINA/node/SKILL.md"

# ─────────────────────────────────────────────────────────────────────────────
# GOOGLE LABS  (github.com/google-labs-code/stitch-skills — verified path)
# UI/UX design skills — enhance-prompt teaches the agent UI/UX vocabulary
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[Google Labs design skills]"
BASE_GOOGLE="$RAW/google-labs-code/stitch-skills/main/skills"

get "enhance-prompt" "$BASE_GOOGLE/enhance-prompt/SKILL.md"
get "design-md"      "$BASE_GOOGLE/design-md/SKILL.md"

# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────"
echo " Done. Installed skills:"
echo ""
for d in "$SKILLS_DIR"/*/; do
  name=$(basename "$d")
  if [ -f "$d/SKILL.md" ]; then
    echo "  ✓  $name"
  fi
done
echo ""
echo " Folder: $SKILLS_DIR/<skill>/SKILL.md"
echo " Claude Code reads .agent/ automatically each session."
echo "────────────────────────────────────────"
echo ""