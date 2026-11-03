# CLAUDE.md — Octo Gears (ex-MécanoKids 3D)

Jeu éducatif 3D d'assemblage mécanique pour enfants de **6 à 10 ans** (mode guidé pour les 5 ans, défis ouverts pour les 10-12 ans).
Trilingue **FR / EN / AR (RTL)**. PWA installable, jouable **hors-ligne**. Cible : familles (B2C) et écoles de cycle 2-3 (B2B).

- Feuille de route détaillée, avec critères d'acceptation : `docs/ROADMAP.md`. **Toujours partir de là.**
- Étude produit complète (UX, technique, prix, roadmap) : https://claude.ai/artifact/QYUMc79bDcQMgtFvcvwye9

## Commandes

| But | Commande |
|---|---|
| Dev (Express + Vite middleware, port 7300) | `npm run dev` |
| Vérification des types | `npm run lint` |
| Tests unitaires (Vitest, `src/**/*.test.ts`) | `npm test` |
| Build | `npm run build` |
| Prévisualisation Cloudflare | `npm run preview` |
| Déploiement (Worker `mecanokids-3d`) | `npm run deploy`, **seulement si on te le demande explicitement** |

Avant de déclarer une tâche terminée : `npm run lint` et `npm test` doivent passer.

## Architecture

- **UI** : React 19 + Tailwind CSS v4 (couleurs oklch, propriétés logiques pour le RTL). Icônes `lucide-react`, animations `motion`.
- **3D** : three.js r187, sans react-three-fiber.
  - `src/components/WorkshopCanvas.tsx` : scène, caméra et interactions.
  - `src/three/` : géométries des pièces, matériaux, environnements.
- **Orchestration** : `src/App.tsx` (~2 500 lignes). Ne pas y ajouter de logique : extraire dans des hooks (`src/hooks/`) ou des utilitaires (`src/utils/`).
- **Pièces** : `src/components/PartsTray.tsx` + `src/hooks/usePartsTrayController.ts` (tiroir), `BottomPartsDock.tsx`.
- **Données** : véhicules et plans dans `src/data/`. `blueprints.ts` et `englishBlueprints.ts` sont en doublon par langue, à unifier (voir ROADMAP).
- **i18n** : `src/i18n/translations.ts`. Chaque nouvelle chaîne doit exister en `fr`, `en` et `ar`.
- **Persistance** : `src/utils/storage.ts` (localStorage).
- **Backend** :
  - `src/backend/` : adaptateur `LocalAdapter` ou `SupabaseAdapter`, choisi selon `VITE_SUPABASE_URL`.
  - `server.ts` : Express, routes `/api/checkout`, `/api/webhook` (Stripe), `/api/leaderboard`, `/api/score`, `/api/school-inquiry`.
  - `supabase/migrations/` : schéma SQL.
- **PWA** : `vite-plugin-pwa` (Workbox), configuré dans `vite.config.ts`.

### ⚠️ Écart connu entre dev et prod

`wrangler.jsonc` déploie **uniquement des assets statiques** : il n'y a pas de `main`, et le SPA fallback est actif.
Les routes `/api/*` de `server.ts` **n'existent donc pas en production**, et le paiement Stripe ne peut pas fonctionner une fois déployé.
Ne pas « corriger » ça au passage : c'est la tâche P0-ARCH de `docs/ROADMAP.md`, avec une décision d'architecture à valider avant.

## Règles produit non négociables

1. **Aucun achat, lien externe ni impression dans le parcours enfant.** Tout passe derrière la porte parents (`ParentalGateModal`, `utils/parentalGate.ts`).
2. **Aucune donnée personnelle d'enfant côté serveur.** Pas de nom, de photo ni d'identifiant persistant. Les événements analytics sont anonymes et agrégés (RGPD, COPPA si diffusion aux États-Unis).
3. **Pas de publicité, pas de chat, pas de multijoueur, pas de classement public nominatif.** Le leaderboard mondial existant est en contradiction avec cette règle : voir P0-LEGAL dans la ROADMAP.
4. **Le hors-ligne est une promesse produit.** Tout asset nécessaire au jeu (JS, CSS, polices, sons, modèles, JSON) doit être pré-caché. Aucune dépendance runtime à un CDN tiers.
5. **Feedback jamais négatif.** Pas de croix rouge ni de son d'échec. Une erreur ramène doucement la pièce au tiroir. Les messages relient le résultat à une notion (« cette roue entraîne la deuxième »), pas juste « Bravo ».
6. **Accessibilité enfants** :
   - cibles tactiles ≥ 64 px pour les 5-7 ans (≥ 48 px sinon) ;
   - aucune action au survol uniquement ;
   - jamais la couleur seule pour porter une information ;
   - respecter `prefers-reduced-motion`, caméra comprise ;
   - toute consigne doit pouvoir être lue à voix haute (`utils/speech.ts`).
7. **RTL** : utiliser les propriétés logiques (`ms-`/`me-`, `start`/`end`), jamais `left`/`right` en dur. Inverser les icônes directionnelles en arabe.

## Budgets de performance

Parc cible : tablettes Android d'entrée de gamme, iPad 9, Chromebooks, TBI.

| Indicateur | Budget |
|---|---|
| JS initial (gzip) | ≤ 400 Ko, 3D et catalogue en chunks à la demande |
| Premier véhicule jouable | ≤ 4 s en 4G sur tablette à 3 Go de RAM |
| Fluidité | 60 i/s sur iPad 9, ≥ 30 i/s sur Android entrée de gamme |
| Appels de dessin | ≤ 150 par scène (instancing, fusion des géométries statiques) |
| Mémoire GPU | ≤ 150 Mo par véhicule ; `dispose()` systématique au changement de véhicule |

## Conventions

- TypeScript strict, aucun `any` nouveau. Les modules purs de `src/utils/` ont un test `*.test.ts` à côté.
- Garder des composants petits et ciblés ; extraire plutôt qu'allonger `App.tsx` et `WorkshopCanvas.tsx`.
- Commits en Conventional Commits (`feat(scope): …`, `fix(scope): …`), en français comme l'historique.
- **Secrets** : ne jamais lire, afficher, modifier ni committer `.env`, `stripe.env` ou `.dev.vars`. Les variables attendues sont listées dans `.env.example`.
- Ne pas toucher à `.omc/`, `.aistudio/`, `.claude/worktrees/`, `dist/` ni `dev-dist/`.

## Marque

Le nouveau nom est **Octo Gears**. La mascotte est une pieuvre mécanicienne, avec un outil par bras.
Le code, le manifest PWA, les textes et le Worker portent encore « MécanoKids ». Le renommage est la tâche P1-BRAND : ne pas renommer au fil de l'eau.

## Méthode de travail attendue

1. Lire la tâche dans `docs/ROADMAP.md` et ses critères d'acceptation.
2. Explorer les fichiers concernés avant de modifier.
3. Faire une seule tâche par branche ou commit.
4. Vérifier avec `npm run lint` et `npm test`. Pour tout changement d'interaction 3D, ajouter une note de test manuel tablette, en t'appuyant sur `TABLET_TEST_PROTOCOL.md`.
5. Cocher la tâche dans `docs/ROADMAP.md` et noter brièvement ce qui a été fait.
