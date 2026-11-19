#!/usr/bin/env bash
set -e

# ==============================================================================
# MANGA MARKETPLACE — cPanel Git Deployment Handler
# Domain: manga.jlm.com.ng
# ==============================================================================

echo "--- Starting cPanel Deployment for manga.jlm.com.ng ---"

# Detect target deployment path
if [ -n "$DEPLOYPATH" ] && [ -d "$DEPLOYPATH" ]; then
  TARGET="$DEPLOYPATH"
elif [ -d "$HOME/manga.jlm.com.ng" ]; then
  TARGET="$HOME/manga.jlm.com.ng"
elif [ -d "$HOME/public_html/manga.jlm.com.ng" ]; then
  TARGET="$HOME/public_html/manga.jlm.com.ng"
elif [ -d "$HOME/public_html/manga" ]; then
  TARGET="$HOME/public_html/manga"
elif [ -d "$HOME/public_html" ]; then
  TARGET="$HOME/public_html"
else
  TARGET="$HOME/manga.jlm.com.ng"
  mkdir -p "$TARGET"
fi

echo "Deployment target directory: $TARGET"

# Sync repository files to the deployment target
if command -v rsync &> /dev/null; then
  echo "Using rsync to synchronize files..."
  rsync -av \
    --exclude='.git' \
    --exclude='.cpanel.yml' \
    --exclude='.github' \
    --exclude='.turbo' \
    --exclude='.next/cache' \
    --exclude='node_modules' \
    ./ "$TARGET/"
else
  echo "rsync not found, using cp..."
  /bin/cp -R * "$TARGET/" 2>/dev/null || true
  /bin/cp -f .htaccess "$TARGET/" 2>/dev/null || true
  /bin/cp -rf apps/web-store/.next "$TARGET/apps/web-store/" 2>/dev/null || true
fi

# Remove static index.html or index.htm so Passenger handles root traffic
rm -f "$TARGET/index.html" "$TARGET/index.htm"

# Ensure .htaccess has CloudLinux Passenger directives
/bin/cp -f .htaccess "$TARGET/.htaccess" 2>/dev/null || true

# Trigger Phusion Passenger reload
mkdir -p "$TARGET/tmp"
touch "$TARGET/tmp/restart.txt"

# Ensure .env is preserved or created from example if not already present
if [ ! -f "$TARGET/.env" ] && [ -f "$TARGET/.env.example" ]; then
  echo "Creating initial .env from .env.example..."
  cp "$TARGET/.env.example" "$TARGET/.env"
fi

echo "✅ Deployment finished successfully for manga.jlm.com.ng"
exit 0
