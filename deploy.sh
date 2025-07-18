#!/bin/bash

# Script de déploiement frontend sur Vercel
echo "🚀 Déploiement Frontend Elisabeth Constantin"

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installez-le avec: npm i -g vercel"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Déploiement
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé!"
echo "🔗 N'oubliez pas de configurer les variables d'environnement dans le dashboard Vercel:"
echo "   - VITE_API_URL=https://your-backend-url.vercel.app/api"
echo "   - VITE_CLOUDINARY_CLOUD_NAME=dgpt1ii6h"
echo "   - VITE_CLOUDINARY_UPLOAD_PRESET=react_unsigned"
echo "   - VITE_STRIPE_PUBLIC_KEY=pk_live_..."
