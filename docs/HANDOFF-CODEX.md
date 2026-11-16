## Correction du 16 novembre — niveaux scolaires et fin des poses de remplissage

Recherche dans les programmes officiels français en vigueur en 2026, de la GS à la cinquième : `docs/qa/2026-11-16-maths-niveaux-france.md`. Les âges sont des points d’entrée, pas un diagnostic des acquis. L’addition de découverte n’est proposée qu’en 5–7 ans. `math-groups` garde son ID de sauvegarde mais devient une grue à équilibrer : produits entiers en 8–10, choix de masse et distances décimales en 11–12. Dix pièces structurelles, aucune série de vingt boulons. Inclinaison puis levage dans WorkshopCanvas ; pas de variantes répétitives ni de boucle de récompense sans décision.

Quatre prototypes retirés du parcours enfant : fractions, aire, symétrie, engrenages. Catalogue, recherche, aventures, reprise et sélection respectent la politique. Les progrès restent sauvegardés. Admin local suit aussi l’âge par défaut ; pour vérifier un prototype, opt-in `http://127.0.0.1:7302/?admin=1&mathPrototypes=1`. Cette option est inopérante en production.

681 tests et TypeScript, neuf parcours âge/langue, 60 poses de structure de grue, animations, ajout réel de la passerelle et lecture hors ligne vérifiés. Validation enfant encore nécessaire ; aucun déploiement. Serveur local conservé sur 7302.

## Correction du 16 novembre — addition par poses réelles

Retour utilisateur : les tests techniques n’ont pas rendu les maths compréhensibles. La passerelle avait encore dix lames de réserve et deux nombres à régler. Elle démarre désormais avec deux lames ; seules trois lames restent à poser directement dans le pont. Comptage et équation suivent les poses. Une seule mission complète, traversée ensuite sans formulaire. Palette limitée aux trois lames à ajouter. Nouvelle observation `math-addition-construction-v3`.

676 tests, parcours réel FR/EN/AR et animations vérifiés ; voir `docs/qa/2026-11-16-addition-construite.md`. Les cinq autres ateliers restent à revoir pédagogiquement ; ne pas les présenter comme validés par des enfants. Aucun déploiement.

## Lot du 16 novembre — refonte mathématique mécanique

Les six prototypes mathématiques du 8 novembre sont remplacés par des mécanismes concrets, avec mission expliquée avant montage, trois défis et essai animé dans la même scène. Passerelles addition/fractions, fixations de treuil, plateau élévateur, charpente symétrique, engrenages 12/18 et tambour. Audio FR/EN/AR local actualisé. Migration des montages sauvegardés, récompenses et anciennes observations conservées.

673 tests et TypeScript passent ; 18 montages FR/EN/AR, 54 missions et six animations vérifiés. Build isolé et essai hors ligne réussis. Voir `docs/qa/2026-11-16-maths-mecanismes.md`. La compréhension doit encore être testée par des enfants ; aucun déploiement. Serveur local port 7302, accès admin de développement `/?admin=1`.

## Lot du 8 novembre — catalogue jouable, maths et retours enfant

157 ateliers ont une activité après construction ; 17 aventures, 6 nouveaux ateliers mathématiques (18 défis), 11 nouveaux essais scientifiques, 5 trains corrigés et bouton de silence commun. Navigation vérifiée sur tout le catalogue et continuation selon l'aventure sélectionnée. Le dernier atelier propose toujours Autre atelier. Pas de réagencement téléphone.

666 tests, TypeScript, build, contrôles navigateur FR/EN/AR et test maths hors ligne. Rapports dans `docs/qa/2026-11-08-*.md`. Dernier déploiement demandé : `fbb9bd8` (avant ce lot). Les nouveautés ne sont pas automatiquement déployées. Budget JS initial toujours dépassé (~637 Ko gzip), validation physique Android/iPad/Pixel à poursuivre.

## Évolution du 7 novembre — aventures et découvertes

Cinq activités après construction dans la scène commune, dix variantes de réactions marines, modes guidé/réparation/expert, trois aventures de trois étapes et carnet local par profil. Entrée depuis catalogue et réglages. Pas de modification de l’agencement téléphone, à tester plus tard sur Pixel 10.

Validation : TypeScript, 605 tests, build ; parcours FR/EN/AR des interactions/modes/carnet/audio et essai hors ligne. Rapports `docs/qa/2026-11-07-aventures-decouvertes.md` et `docs/qa/2026-11-07-construction-play.md`. Aucun déploiement demandé pour ce lot. Carnet indépendant du backup progression ; essais/médias locaux et pré-cachés. Reste validation sur tablettes physiques et budget initial JS (~599 Ko gzip).

# Handoff — Octo Gears (MécanoKids 3D) → CODEX

## Priorité actuelle — palettes persistantes (7 novembre)

Le retour utilisateur a invalidé le dock rétractable et la grille réservée. `WorkshopHud.tsx` gère maintenant une palette de pièces toujours visible, les vues caméra opposées et un menu de réglages secondaire. Ne pas réintroduire de bouton Ouvrir/Réduire, de raccourci H ni d’auto-rétraction. Le canvas reste à sa taille ; `floatingFraming.ts` et `cameraFraming.ts` cadrent la cible dans la zone libre.

Validation : 223 poses sur quatre formats, glisser-déposer, FR/EN/AR, neuf défis et treize laboratoires dans les trois langues, lecture vocale manuelle locale sans voix navigateur. Rapport actuel : `docs/qa/2026-11-07-palettes-flottantes.md`.

Le catalogue comprend dix ajouts dans `heritageBlueprints.ts` (151 ateliers au total) : portique 45, château 61, yourte 41, treillis 56, temple 49, moulin 59, donjon guidé 24, tour solaire 59, dôme 58, aqueduc 58. Moulin, tour solaire et aqueduc ont des commandes après montage sur le même plateau, via `WorkshopMissionPortal`. Le pont levant existant utilise également ce panneau. L’enrichissement reste subordonné à la fluidité du jeu demandée dans le dernier retour.


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
- **Déploiement public** : `npm run deploy` publie sur Cloudflare Pages, projet `octoglos`, à https://octoglos.pages.dev/.

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
| `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens, permission Cloudflare Pages Write | `npm run deploy` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare → Workers & Pages → identifiant du compte | `npm run deploy` |

Méthode : soit exporter les variables dans le shell avant de lancer `npm run deploy`, soit créer un fichier `.wrangler/config` local (jamais committer).

Le projet Pages **`octoglos`** sert l’application publique sur https://octoglos.pages.dev/.

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
