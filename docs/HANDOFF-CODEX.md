# Handoff — Octo Gears (MécanoKids 3D) → CODEX

## Résumé des travaux récents

### 1. Univers STEM — géométries 3D (commit `5311d4f`)
Les trois univers STEM (Électronique, Chimie, Physique) utilisaient les mêmes archétypes que les véhicules classiques. Corrections :
- `elec_circuit` : plateau PCB + composants (LED, résistance, condensateur, puce IC, switch)
- `chem_molecule` : atome central O + 2 liaisons BOND_SINGLE + 2 atomes H + atome C
- `phys_apparatus` : structure pendule (tige, pivot, boule)
- 8 nouveaux `PartShapeKind` : ATOM_OXYGEN, ATOM_HYDROGEN, ATOM_CARBON, BOND_SINGLE, BOND_DOUBLE, CIRCUIT_BOARD, ELECTRONIC_COMPONENT, PENDULUM_ROD
- Fichiers : `src/three/partGeometries.ts`, `src/data/catalogTemplates.ts`, `src/types/game.ts`

### 2. Fix visuel liaisons moléculaires (commit `d798097`)
**Problème** : les liaisons BOND_SINGLE apparaissaient verticales (axe Y) au lieu de relier horizontalement O aux H.  
**Cause** : double-pivot incohérent — `rotateX(PI/2)` baked dans la géométrie + `targetRot Y=PI/2` sur le groupe.  
**Fix** :
- `partGeometries.ts` : suppression du `rotateX` baked → cylindre CylinderGeometry reste sur l'axe Y par défaut
- `catalogTemplates.ts` : `targetRot` des liaisons passe de `[0, PI/2, 0]` à `[0, 0, PI/2]` (rotation Z : Y → −X)
- Résultat : liaisons horizontales O–H–H sur l'axe X, visibles en vue ISO

---

## État du projet

- **Branche** : `main`
- **Dernier commit** : `d798097`
- **Dev server** : `npm run dev` → http://localhost:7300
- **Lint** : `npm run lint` (tsc --noEmit) — passe
- **Tests** : `npm test` (Vitest)
- **Deploy** : `npm run deploy` → https://octo-gears.khalifa-haithem.workers.dev

### Points d'attention architecture
- `src/App.tsx` fait ~2 500 lignes — ne pas y ajouter de logique, extraire dans `src/hooks/` ou `src/utils/`
- `wrangler.jsonc` déploie uniquement des assets statiques — les routes `/api/*` de `server.ts` **n'existent pas en prod** (tâche P0-ARCH dans ROADMAP)
- Le leaderboard mondial expose des noms — en contradiction avec RGPD/COPPA (tâche P0-LEGAL)

---

## Secrets & Accès requis pour CODEX

### 1. Cloudflare (déploiement)
CODEX a besoin d'accès au compte Cloudflare pour `npm run deploy` (via Wrangler).

| Ce dont tu as besoin | Où le trouver | Pour quoi |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com → My Profile → API Tokens → Create Token (template *Edit Cloudflare Workers*) | `wrangler deploy` |
| `CLOUDFLARE_ACCOUNT_ID` | dash.cloudflare.com → Workers & Pages → ton account ID en haut à droite | `wrangler deploy` |

Méthode : soit exporter les variables dans le shell avant de lancer `npm run deploy`, soit créer un fichier `.wrangler/config` local (jamais committer).

Le Worker s'appelle **`octo-gears`**, déploie sur :
> https://octo-gears.khalifa-haithem.workers.dev

---

### 2. Variables d'environnement — fichier `.env` (à créer à la racine)

Copier `.env.example` → `.env` et remplir :

```env
# Supabase — optionnel, laisser vide pour mode 100% offline/local
VITE_SUPABASE_URL=https://<projet>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Port du serveur Express local (dev)
PORT=7300

# Analytics Cloudflare — optionnel (sans cookie, RGPD ok)
VITE_CF_ANALYTICS_TOKEN=

# Sentry WebGL — optionnel
VITE_SENTRY_DSN=
VITE_APP_VERSION=1.0.0
```

> **Mode offline** : sans Supabase, le jeu fonctionne entièrement avec `LocalAdapter` (localStorage). Supabase n'est requis que pour le leaderboard et les scores serveur.

---

### 3. Stripe — fichier `.dev.vars` (à créer à la racine, jamais committer)

```
STRIPE_SECRET_KEY=sk_test_...        # clé test Stripe
STRIPE_WEBHOOK_SECRET=whsec_...      # secret du webhook local (stripe listen)
```

> **Important** : les routes `/api/checkout` et `/api/webhook` n'existent **pas en production** (Cloudflare Workers statiques uniquement). Elles ne fonctionnent qu'en `npm run dev`. C'est la tâche **P0-ARCH** dans ROADMAP.md — architecture à décider avant de câbler le paiement prod.

---

### 4. Supabase (optionnel)
Si tu veux activer le backend Supabase :
1. Créer un projet sur supabase.com
2. Appliquer les migrations : `supabase/migrations/` (dans l'ordre)
3. Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env`

---

### 5. Node / outils locaux requis
```
node >= 20
npm >= 10
wrangler (installé via npm — pas besoin d'install globale)
```

---

### Résumé des fichiers sensibles (ne jamais committer)
| Fichier | Contenu |
|---|---|
| `.env` | Supabase, analytics, Sentry |
| `.dev.vars` | Stripe secret key + webhook secret |
| `.wrangler/` | Cache et config Wrangler locale |

Tous sont déjà dans `.gitignore`.

---

## Prompt de passation pour CODEX / ChatGPT

```
Tu reprends le développement du projet **Octo Gears** (ex-MécanoKids 3D).

**Contexte** : jeu éducatif 3D d'assemblage mécanique pour enfants 6-10 ans.
PWA installable, hors-ligne, trilingue FR/EN/AR (RTL).
Stack : React 19 + Three.js r187 + Tailwind CSS v4 + TypeScript strict + Vite + Cloudflare Workers.

**Dépôt** : C:\DEV\REPOS\MecanoKids-3D
**Branche courante** : main (commit d798097)
**Feuille de route** : docs/ROADMAP.md — toujours partir de là.
**Règles produit** : CLAUDE.md (à lire en premier).

**Travaux déjà faits** :
- Univers STEM (Électronique, Chimie, Physique) : géométries 3D dédiées, 8 nouveaux PartShapeKind (commit 5311d4f)
- Fix liaisons moléculaires BOND_SINGLE : cylindre Y + targetRot [0,0,PI/2] pour axe X (commit d798097)

**Prochaine tâche** : prendre la première tâche non cochée dans docs/ROADMAP.md (ordre P0 → Phase 0 → Phase 1).

**Conventions** :
- TypeScript strict, aucun `any`
- Commits Conventional Commits en français : `feat(scope): …` / `fix(scope): …`
- Toute nouvelle chaîne UI doit exister en `fr`, `en` et `ar` dans `src/i18n/translations.ts`
- Propriétés logiques CSS pour le RTL (ms-/me-, start/end), jamais left/right en dur
- Avant de déclarer terminé : `npm run lint` et `npm test` doivent passer
- Ne jamais lire/modifier/committer `.env`, `stripe.env`, `.dev.vars`
- Ne déployer que si explicitement demandé

**Architecture clé** :
- Scène 3D : `src/components/WorkshopCanvas.tsx`
- Géométries des pièces : `src/three/partGeometries.ts`
- Données véhicules/blueprints : `src/data/catalogTemplates.ts`
- Orchestration principale : `src/App.tsx` (ne pas allonger)
- i18n : `src/i18n/translations.ts`

Commence par lire CLAUDE.md et docs/ROADMAP.md, puis annonce la tâche que tu vas traiter.
```
