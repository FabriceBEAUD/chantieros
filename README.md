# ChantierOS

Application de gestion pour PME de travaux publics avec assistant IA intégré (Claude).

## Stack
- **Frontend** : React 18 + Vite + React Router
- **Backend** : Node.js + Express
- **IA** : Anthropic Claude (streaming SSE)
- **Fonts** : DM Sans + DM Mono

## Installation

```bash
# 1. Cloner le repo
git clone https://github.com/TON_USERNAME/chantieros.git
cd chantieros

# 2. Installer les dépendances
npm install

# 3. Configurer la clé API
cp .env.example .env
# Éditer .env et ajouter votre ANTHROPIC_API_KEY

# 4. Lancer en développement
npm run dev
```

L'app est disponible sur `http://localhost:5173`
L'API tourne sur `http://localhost:3001`

## Déploiement Vercel

```bash
npm run build
vercel --prod
```

Variables d'environnement à définir dans Vercel :
- `ANTHROPIC_API_KEY` : votre clé API Anthropic

## Structure

```
chantieros/
├── server/
│   └── index.js          # API Express + endpoint Anthropic streaming
├── src/
│   ├── components/
│   │   ├── Layout.jsx     # Topbar + sidebar + routing
│   │   └── AIAssistant.jsx # Chat IA avec streaming
│   ├── hooks/
│   │   └── useChat.js     # Hook streaming SSE
│   ├── pages/
│   │   ├── Dashboard.jsx  # Tableau de bord principal
│   │   └── Pages.jsx      # Tous les autres modules
│   ├── data/
│   │   └── mock.js        # Données de démonstration
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
└── vite.config.js
```

## Modules

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/` | KPIs, chantiers actifs, alertes, Gantt |
| Chantiers | `/chantiers` | Liste, filtres, création |
| Planning | `/planning` | Gantt semaine par semaine |
| Trésorerie | `/finance` | Situations de travaux, impayés |
| Situations | `/situations` | Calcul et création de situations |
| RH | `/rh` | Pointages, validation, habilitations |
| Sécurité | `/securite` | Incidents, PPSPS, EPI |
| Appels d'offres | `/ao` | Pipeline commercial |
| Matériel | `/materiel` | Parc machines, révisions |

## Assistant IA

L'assistant est propulsé par Claude (claude-sonnet-4) avec un contexte métier TP injecté.
Il répond en streaming et connaît le contexte de l'entreprise, les chantiers actifs,
les alertes, la réglementation BTP (CACES, PPSPS, RE2020, marchés publics).
