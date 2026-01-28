#!/bin/bash

echo "🚀 Friends Radar - Cloudflare Deployment Script"
echo ""
echo "Follow these steps:"
echo ""
echo "1️⃣  Register your workers.dev subdomain:"
echo "   👉 https://dash.cloudflare.com/7995d9385ba34b6f85cd8dd0ba0b1044/workers/onboarding"
echo ""
echo "2️⃣  After registering, press Enter to continue..."
read -r

echo ""
echo "📦 Deploying worker to Cloudflare..."
cd worker
wrangler deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Worker deployed successfully!"
  echo ""
  echo "3️⃣  Copy your worker URL and add it to .env:"
  echo ""
  echo "VITE_API_URL=https://friends-radar-api.YOUR-SUBDOMAIN.workers.dev"
  echo ""
  echo "4️⃣  Restart your dev server:"
  echo "   npm run dev"
  echo ""
  echo "🎉 Cross-device sync is now enabled!"
else
  echo ""
  echo "❌ Deployment failed. Check the errors above."
fi
