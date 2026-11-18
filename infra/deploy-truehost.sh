#!/usr/bin/env bash
set -e

# ==============================================================================
# MANGA MARKETSQUARE — TRUEHOST VPS PRODUCTION DEPLOYMENT AUTOMATION
# ==============================================================================

echo "========================================================"
echo "🚀 Starting Manga Marketsquare Truehost VPS Deployment..."
echo "========================================================"

# Step 1: Check Docker & Docker Compose
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker not found. Installing Docker on Ubuntu VPS..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
    echo "✅ Docker installed successfully."
fi

# Step 2: Ensure .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found in repository root."
    echo "👉 Copy .env.example to .env and configure your production credentials (Paystack, Termii, JWT_SECRET, Database password):"
    echo "   cp .env.example .env"
    exit 1
fi

# Step 3: Verify Critical Production Variables
source .env

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "REPLACE_WITH_SECURE_RANDOM_SECRET_KEY_MIN_32_CHARS" ]; then
    echo "❌ Error: JWT_SECRET in .env is using the default placeholder."
    echo "👉 Generate a secure secret using: openssl rand -base64 48"
    exit 1
fi

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" = "REPLACE_WITH_SECURE_DATABASE_PASSWORD_32_CHARS" ]; then
    echo "❌ Error: POSTGRES_PASSWORD in .env is using the default placeholder."
    exit 1
fi

echo "✅ Environment secrets validated."

# Step 4: Build and Deploy Production Containers
echo "📦 Building and starting production containers via Docker Compose..."
docker compose -f infra/docker-compose.prod.yml up -d --build

# Step 5: Verify Health
echo "⏳ Waiting for services to initialize..."
sleep 10

echo "🔍 Checking container status..."
docker compose -f infra/docker-compose.prod.yml ps

echo "========================================================"
echo "🎉 Deployment successfully initiated!"
echo ""
echo "To obtain your free Let's Encrypt SSL Certificates on Truehost:"
echo "docker compose -f infra/docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d manga.ng -d www.manga.ng -d api.manga.ng"
echo ""
echo "To view live logs:"
echo "docker compose -f infra/docker-compose.prod.yml logs -f"
echo "========================================================"
