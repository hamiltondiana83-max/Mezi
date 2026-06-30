# 🌸 Mezi — Guide de déploiement Vercel

## Architecture du projet

```
mezi/
├── api/                      ← Fonctions serverless Vercel
│   ├── chat.js               ← Proxy sécurisé → Anthropic
│   ├── beta-validate.js      ← Validation codes beta
│   └── beta-request.js       ← Demandes d'accès
├── src/
│   ├── App.jsx               ← Application React (modifiée)
│   └── main.jsx              ← Point d'entrée
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── .env.example              ← Modèle de variables d'environnement
```

## Ce qui a changé vs. l'original

| Avant | Après |
|-------|-------|
| Clé Anthropic exposée dans le JS client | Clé cachée côté serveur dans `api/chat.js` |
| URL Apps Script visible dans le bundle | URL cachée côté serveur dans `api/beta-*.js` |
| `fetch("https://api.anthropic.com/...")` | `fetch("/api/chat")` |
| `fetch(APPS_SCRIPT_URL, { mode: "no-cors" })` | `fetch("/api/beta-request")` + `fetch("/api/beta-validate")` |

---

## Déploiement en 5 étapes

### 1. Prérequis

- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [GitHub](https://github.com)
- Clé API Anthropic : https://console.anthropic.com/settings/keys
- Votre Google Apps Script déployé

### 2. Pousser sur GitHub

```bash
cd mezi
git init
git add .
git commit -m "feat: mezi v1 beta — backend sécurisé"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM/mezi.git
git push -u origin main
```

### 3. Importer sur Vercel

1. Allez sur https://vercel.com/new
2. Cliquez **"Import Git Repository"**
3. Sélectionnez votre repo `mezi`
4. Framework : **Vite** (détecté automatiquement)
5. Cliquez **Deploy** (sans encore configurer les variables)

### 4. Ajouter les variables d'environnement

Dans votre projet Vercel > **Settings** > **Environment Variables** :

| Nom | Valeur | Environnements |
|-----|--------|----------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Production, Preview, Development |
| `APPS_SCRIPT_URL` | `https://script.google.com/macros/s/...` | Production, Preview, Development |

Puis **Deployments** > **Redeploy** (pour appliquer les variables).

### 5. Vérifier

Votre app est disponible sur : `https://mezi-VOTRE_NOM.vercel.app`

Testez :
- ✅ La beta gate (formulaire + code)
- ✅ L'onboarding 3 étapes
- ✅ Le chat en FR, EN, SR
- ✅ Que `/api/chat` répond bien (sans exposer la clé)

---

## Développement local

```bash
npm install
cp .env.example .env.local
# Remplissez .env.local avec vos vraies clés

npm run dev
# → http://localhost:5173

# Tester les fonctions API en local avec Vercel CLI :
npm install -g vercel
vercel dev
# → http://localhost:3000
```

---

## Sécurité incluse

- ✅ Clé Anthropic jamais exposée côté client
- ✅ URL Apps Script jamais exposée côté client
- ✅ Rate limiting : 20 requêtes / minute / IP
- ✅ Validation des inputs (longueur, format, rôles)
- ✅ Modèle verrouillé sur `claude-sonnet-4-6`
- ✅ max_tokens plafonné à 1000 côté serveur
- ✅ Headers de sécurité (X-Frame-Options, XSS, etc.)

---

## Domaine personnalisé (optionnel)

Dans Vercel > **Settings** > **Domains** : ajoutez `mezi.votredomaine.com`.
Configurez ensuite le CNAME chez votre registrar.

---

## Coûts estimés

| Service | Plan | Coût |
|---------|------|------|
| Vercel | Hobby (gratuit) | 0 € |
| Anthropic | Pay-as-you-go | ~0,003 $/1k tokens |
| Domaine (optionnel) | — | ~10 €/an |

Pour 100 utilisateurs beta actifs : environ **5-15 €/mois** côté Anthropic.
