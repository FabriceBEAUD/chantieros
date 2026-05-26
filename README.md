# ChantierOS

Application de gestion pour PME de travaux publics avec assistant IA intégré (Mistral AI).

## Stack
- **Frontend** : React 18 + Vite + React Router
- **Backend** : Node.js + Express
- **IA** : Mistral AI (`mistral-small-latest` par défaut)
- **Fonts** : DM Sans + DM Mono

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/FabriceBEAUD/chantieros.git
cd chantieros

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
cp .env.example .env
# Éditer .env et ajouter votre MISTRAL_API_KEY

# 4. Lancer en développement
npm run dev
```

L'app est disponible sur `http://localhost:5173`
L'API tourne sur `http://localhost:3001`

## Déploiement Render (backend) + GitHub Pages (frontend)

Le backend tourne sur Render (`https://chantieros.onrender.com`).
Le frontend est déployé automatiquement sur GitHub Pages via GitHub Actions à chaque push sur `main`.

Variables d'environnement à définir sur Render :
- `MISTRAL_API_KEY` : votre clé API Mistral
- `MISTRAL_MODEL` : modèle à utiliser (défaut : `mistral-small-latest`)

## Assistant IA

L'assistant est propulsé par Mistral AI avec un contexte métier TP complet injecté dans le system prompt :
chantiers actifs, situations de travaux, impayés, alertes RH, habilitations, matériel, appels d'offres
et réglementation BTP (CACES, PPSPS, AIPR, RE2020, marchés publics).
