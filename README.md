# ChantierOS

Application web de pilotage chantier pour artisans et gérants de société de travaux publics.

## Installation locale

```bash
npm install
npm run dev
```

## Publication GitHub Pages

Ce dépôt contient un workflow GitHub Actions qui publie automatiquement le site statique sur GitHub Pages à chaque push sur `main`.

Dans GitHub :
1. Aller dans **Settings > Pages**
2. Choisir **Build and deployment > Source: GitHub Actions**
3. Le site sera accessible sur : `https://FabriceBEAUD.github.io/chantieros/`

## Assistant IA

Le frontend est compatible avec un backend `/api/chat`. Pour utiliser l'assistant IA en production, déployer le dossier `server/` sur un service backend comme Render, Railway ou Vercel avec la variable `ANTHROPIC_API_KEY`.
