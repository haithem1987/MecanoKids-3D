# Roadmap Octo Gears — backlog pour Claude Code

Source : l'étude produit du 3 novembre 2026 (https://claude.ai/artifact/QYUMc79bDcQMgtFvcvwye9), adaptée à l'état réel du dépôt.

Objectif : une sortie commerciale en environ 20 semaines, avec 5 classes pilotes et une offre payante en ligne.

**Règle de priorité :** on ne construit rien de nouveau tant que la boucle « choisir une pièce, la poser, réussir » n'est pas fluide pour un enfant de 6 ans.

Format de chaque tâche : `[ ] ID — titre`, puis le contexte (fichiers), le travail à faire et les critères d'acceptation (CA).
Les tâches marquées 🧑 demandent une décision ou une action humaine : préparer les options, puis s'arrêter.

---

## P0 — Bloquants (avant tout le reste)

### [x] P0-SEC — Protéger `stripe.env` *(fait : stripe.env et *.env ajoutés au .gitignore, git check-ignore validé)*
- **Contexte** : `stripe.env` est non suivi, mais il n'est pas couvert par `.gitignore` (le motif `.env*` ne couvre pas `stripe.env`).
- **Travail** : ajouter `stripe.env` et `*.env` au `.gitignore`. Vérifier avec `git status` qu'il n'apparaît plus.
- **CA** : `git check-ignore stripe.env` renvoie le fichier. 🧑 Recommander au propriétaire de régénérer les clés de test Stripe et de déplacer le contenu dans `.env`.

### [ ] P0-ARCH 🧑 — Rendre l'API disponible en production *(ADR rédigé, décision : Supabase Edge Functions — implémentation en Phase 3 / tâche B4)*
- **Contexte** : le Worker ne sert que des assets statiques (`wrangler.jsonc` n'a pas de `main`). Les routes `server.ts` (checkout, webhook, leaderboard, score, school-inquiry) ne fonctionnent qu'en dev.
- **Travail** : rédiger un ADR court (`docs/adr/001-api-prod.md`) comparant deux options :
  - **(a)** Worker avec `main` (Hono) + D1 pour licences et contacts école, routes `/api/*` et assets via le binding `ASSETS` ;
  - **(b)** Supabase Edge Functions.
  - Recommandation par défaut : (a), cohérent avec l'hébergement actuel.
- **CA** : ADR écrit, décision validée par un humain avant toute implémentation.

### [x] P0-LEGAL 🧑 — Mettre le classement en conformité *(fait : onglet Mondial supprimé, envoi profileName/score retiré de App.tsx et SpeedLeaderboardModal — classement local uniquement)*
- **Contexte** : `SpeedLeaderboardModal`, `/api/leaderboard` et `/api/score` exposent un classement mondial. C'est contraire à la règle « pas de classement public nominatif ni de donnée d'enfant côté serveur ».
- **Travail** : proposer deux options :
  - **(a)** un classement **local uniquement** (records personnels par profil sur l'appareil) ;
  - **(b)** la suppression du classement.
  - Vérifier que `/api/score` ne stocke aucun pseudo libre.
- **CA** : après décision, plus aucune donnée saisie par un enfant n'est envoyée au serveur.

---

## Phase 0 — Quick wins (semaines 1-2)

### [x] Q1 — Refaire la sélection des pièces *(fait : vignettes ≥ 80px, position par défaut 'bottom', auto-rétraction et tap-to-pick déjà présents)*
- **Fichiers** : `PartsTray.tsx`, `usePartsTrayController.ts`, `BottomPartsDock.tsx`, `WorkshopCanvas.tsx`.
- **Travail** :
  - tiroir ancré en bas, qui se rétracte automatiquement pendant le placement ;
  - tiroir déplaçable à gauche, à droite ou en bas, avec la position mémorisée ;
  - vignettes ≥ 80 px ;
  - interaction **tap pour prendre la pièce, puis tap sur la zone cible** ; le glisser-déposer reste une option.
- **CA** :
  - un enfant de 6 ans pose sa première pièce en ≤ 30 s, sans aide ;
  - le tiroir ne masque jamais le point d'ancrage actif ;
  - ça fonctionne au doigt sur une tablette de 10 pouces.

### [ ] Q2 — Rendre l'aimantation tolérante et visible
- **Travail** :
  - points de connexion visibles ;
  - rayon d'aimantation ≥ taille de la pièce, réglable par profil d'âge ;
  - aperçu fantôme vert ou rouge, doublé d'une icône (pas la couleur seule) ;
  - « clic » sonore et `navigator.vibrate` court quand c'est disponible.
- **CA** : poser une pièce à moins d'une demi-pièce de distance réussit ; l'aperçu fantôme se distingue sans couleur.

### [ ] Q3 — Ajouter Annuler et « recommencer l'étape »
- **Fichiers** : `WorkshopToolbar.tsx` et l'état d'assemblage.
- **CA** : Annuler défait la dernière pose, y compris plusieurs fois de suite ; les deux boutons restent toujours visibles et font ≥ 64 px ; tests unitaires sur la pile d'historique.

### [ ] Q4 — Borner la caméra
- **Fichiers** : `WorkshopCanvas.tsx`.
- **Travail** :
  - limiter l'angle polaire (jamais sous le sol) ;
  - bornes de zoom ;
  - bouton « recentrer » toujours visible ;
  - orientation automatique vers le prochain point d'ancrage en mode guidé ;
  - respect de `prefers-reduced-motion`.
- **CA** : impossible de perdre le véhicule hors champ.

### [ ] Q5 — Rendre le hors-ligne réel
- **Fichiers** : `vite.config.ts`, `index.html`, `src/index.css`, `public/offline.html`.
- **Travail** :
  - `globPatterns` étendu à `glb,gltf,ktx2,mp3,ogg,wav,json,webp` ;
  - auto-héberger les polices en woff2 sous-ensemblé (latin + arabe) et supprimer les règles runtime Google Fonts ;
  - supprimer `offline.html`, ou le réserver aux pages d'achat ;
  - dédoublonner `includeAssets` et `globPatterns` ;
  - remplacer `skipWaiting` automatique par un bandeau « nouvelle version, relancer », après sauvegarde de l'état.
- **CA** : test Playwright « mode avion » (charger, couper le réseau, recharger, ouvrir 3 véhicules) qui passe en CI ; aucune requête vers `fonts.googleapis.com` ni `fonts.gstatic.com`.

### [ ] Q6 — Nettoyer le côté web public
- **Travail** :
  - `public/robots.txt`, `public/sitemap.xml` ;
  - une vraie page 404 hors routes SPA ;
  - `public/_headers` : `/assets/*` en `public, max-age=31536000, immutable`, `index.html` et `sw.js` en `no-cache` ;
  - aligner la balise canonique sur le domaine réel.
- **CA** : `curl -I /robots.txt` renvoie du `text/plain`, pas le HTML de l'application.

### [ ] Q7 — Ajouter la mesure, de façon anonyme
- **Fichiers** : `utils/stemAnalytics.ts`.
- **Travail** :
  - Cloudflare Web Analytics, sans cookie ;
  - Sentry pour les erreurs WebGL et la perte de contexte ;
  - événements : `game_started`, `tutorial_completed`, `mission_started`, `part_selected`, `part_snapped`, `assembly_failed`, `undo_used`, `hint_requested`, `mission_completed`, `diagnostic_solved`, `paywall_shown`, `purchase_completed`.
- **CA** : aucun identifiant persistant d'enfant ; les événements sont testés unitairement.

### [ ] Q8 — Mentions légales et confidentialité enfants
- **Fichiers** : `public/privacy.html` (déjà modifié localement).
- **CA** : RGPD couvert, mention qu'aucune donnée personnelle d'enfant n'est collectée, page accessible derrière la porte parents.

---

## Phase 1 — Jouable seul dès 6 ans (semaines 3-6)

### [ ] M1 — Décrire les missions en données
- **Travail** :
  - schéma JSON versionné (`src/missions/schema.ts`, validé au build) ;
  - unifier `blueprints.ts` et `englishBlueprints.ts` en un seul jeu de données avec champs `{fr,en,ar}`.
- **Format de mission** :
  ```json
  { "id": "meca-camion-pompiers-01", "atelier": "mecanique", "ages": [6,10], "niveau": 1,
    "vehicule": "camion-pompiers", "objectifs": ["transmission du mouvement"],
    "etapes": [], "conditionsReussite": [],
    "explication": { "fr": "", "en": "", "ar": "" },
    "defiTransfert": { "type": "diagnostic", "panne": "axe-arriere" } }
  ```
- **Boucle de chaque mission** : situation → question → expérience → résultat visible → explication dite à voix haute → défi de transfert (diagnostic).
- **CA** : 15 missions sur 15 véhicules existants ; un test vérifie que chaque mission est valide et traduite dans les 3 langues.

### [ ] M2 — Consignes vocales FR/EN/AR
- **Fichiers** : `utils/speech.ts`.
- **CA** : chaque consigne peut être réécoutée ; mode guidé jouable sans savoir lire.

### [ ] M3 — Profils d'âge
- **Profils** : 5-7, 8-10 et 11-12 ans, choisis au démarrage avec 3 visuels.
- **Ce qu'ils règlent** : niveau d'aide, quantité de texte, vitesse, tolérance d'aimantation, mode guidé ou libre.
- **CA** : le profil persiste et se change derrière la porte parents.

### [ ] M4 — Aide progressive
- **CA** : un indice apparaît automatiquement après 3 échecs ou 20 s d'inactivité sur une étape ; l'événement `hint_requested` est envoyé.

### [ ] M5 — Qualité 3D adaptative
- **Travail** :
  - détection du GPU ; ombres coupées et `devicePixelRatio` plafonné à 1,5 sur les appareils faibles ;
  - rendu en pause quand rien ne bouge ;
  - `dispose()` systématique ;
  - chargement à la demande du catalogue.
- **CA** : budgets de `CLAUDE.md` tenus, avec mesures notées dans la PR.

**Critère de sortie de phase** : 8 enfants de 6-8 ans sur 10 terminent une mission seuls en moins de 3 min ; ≥ 30 i/s sur tablette d'entrée de gamme.

---

## Phase 2 — Apprentissage et classe (semaines 7-11)

- [ ] C1 — Explications et défis de transfert (diagnostic) pour les 15 missions. 🧑 Relecture par un enseignant de cycle 2-3.
- [ ] C2 — Mode enseignant : code de classe sans compte élève, attribution de missions, progression par compétence. Fichier : `TeacherDashboard.tsx`.
- [ ] C3 — 12 fiches pédagogiques imprimables pour le cycle 2-3.
- [ ] C4 — Mode TBI (grandes cibles) et mode classe silencieux, avec volumes séparés pour la musique, les effets et la voix.
- [ ] C5 — Mini-tutoriel du mode diagnostic (« écoute le bruit, trouve la pièce qui ne va pas »). Fichier : `utils/diagnosticMode.ts`.

**Critère de sortie de phase** : 5 classes pilotes actives ; NPS enseignant ≥ 40.

---

## Phase 3 — Monétisation (semaines 12-16)

Prérequis : P0-ARCH décidé et implémenté.

- [ ] B1 — Paywall après 5 missions gratuites, derrière la porte parents. Fichiers : `UpgradeModal.tsx`, `utils/entitlements.ts`.
- [ ] B2 — Offres et prix :

  | Offre | France | Tunisie | Golfe |
  |---|---|---|---|
  | Atelier complet (achat unique) | 7,99 € au lancement, puis 9,99 € | 19 DT | 39 AED |
  | Cartes cadeaux | 12,99 € ou 34,99 € | | |

  Pas d'abonnement avant le 2e atelier.
- [ ] B3 — Licences école :

  | Licence | Public France (HT/an) | Privé et international (HT/an) |
  |---|---|---|
  | Classe | 49 € | 149 € |
  | École / établissement | 149 € | 499 € |
  | Réseau / collectivité | 1 € par élève, plancher 990 € | 3 $ par élève |

  Clés d'activation, jeton signé vérifiable hors-ligne pendant 30 jours, bons de commande. Fichier : `LicenseActivationModal.tsx`.
- [ ] B4 — Webhook Stripe en production, avec vérification de signature et idempotence.
- [ ] P1-BRAND 🧑 — Renommer en **Octo Gears** : manifest PWA, `<title>`, textes i18n, `package.json`, nom du Worker, landing. 🧑 Prérequis : antériorité de marque (INPI/EUIPO/USPTO) vérifiée et domaine `octogears.com` acquis.

**Critère de sortie de phase** : premier achat famille et première licence école encaissés.

---

## Phase 4 — Lancement (semaines 17-20)

- [ ] L1 — Landing page Octo Gears et vidéo de 30-45 s. Fichier : `LandingPage.tsx`.
- [ ] L2 — Version Play Store (TWA).
- [ ] L3 — 🧑 Dossier de référencement GAR et kit presse.

---

## À ne pas faire maintenant

- Multijoueur, chat, partage public ou comptes enfants en ligne.
- Applications séparées par discipline.
- Plus de 3 ateliers, ou un moteur de simulation universel.
- Un abonnement familles avant le 2e atelier.
- Une app iOS native avant d'avoir validé la conversion sur le web et Android.
