# Roadmap Octo Gears — backlog pour Claude Code

Source : l'étude produit du 3 novembre 2026 (https://claude.ai/artifact/QYUMc79bDcQMgtFvcvwye9), adaptée à l'état réel du dépôt.

Objectif : une sortie commerciale en environ 20 semaines, avec 5 classes pilotes et une offre payante en ligne.

**Règle de priorité :** on ne construit rien de nouveau tant que la boucle « choisir une pièce, la poser, réussir » n'est pas fluide pour un enfant de 6 ans.

Format de chaque tâche : `[ ] ID — titre`, puis le contexte (fichiers), le travail à faire et les critères d'acceptation (CA).
Les tâches marquées 🧑 demandent une décision ou une action humaine : préparer les options, puis s'arrêter.

---

## P0 — Bloquants (avant tout le reste)

### [x] JEU-AVENTURES-CATALOGUE — Généraliser le jeu après assemblage et ouvrir les maths (8 novembre)
- 157 ateliers jouables après assemblage, 111 véhicules répartis en huit familles, onze nouveaux essais scientifiques et deux expériences de patrimoine.
- Dix-sept aventures avec recherche/filtres et étapes « construit / essai réussi », reprise cohérente de l'aventure, accès à un autre atelier à toute fin de montage.
- Cinq trains corrigés sur voies dédiées ; silence commun aux effets et voix, réel bouton distinct de la consigne.
- Six ateliers mathématiques (dix-huit défis) fondés sur les programmes français CP–sixième, catégorie et deux aventures dédiées.
- Validation : 666 tests, navigation des 157 ateliers, parcours FR/EN/AR, son réel, build et hors-ligne. Rapports : `docs/qa/2026-11-08-generalisation-aventures.md`, `docs/qa/2026-11-08-mathematiques.md`, `docs/qa/2026-11-08-science-audio.md`.

### [x] JEU-AVENTURES — Donner une suite jouable aux constructions (7 novembre)
- Cinq montages ont des activités sur la scène principale : livraison au portique, visite du château/donjon/temple, convoi du viaduc. Les essais existants alimentent aussi le carnet.
- Dix variantes de réactions marines, jalons variables et célébrations des essais réussis sans répétition rapide.
- Modes guidé/réparation/expert sur les ateliers existants ; jusqu'à huit interventions dans les réparations des grands montages, sans perdre l'assemblage standard.
- Trois aventures de trois ateliers : port, village et recherche. Carnet local par profil, observations trilingues, reprise dans la scène commune, droits du catalogue conservés.
- Téléphone exclu de cette demande : aucun réagencement supplémentaire. Rapport : `docs/qa/2026-11-07-aventures-decouvertes.md`.

### [x] UX-SMARTPHONE — Adapter les palettes et les missions au téléphone
- Ruban de pièces permanent en portrait et palette latérale compacte en paysage ; commandes tactiles de 64 px.
- Missions scientifiques : réglages paginés, action Tester toujours disponible, informations séparées. Le lancement ferme les réglages pour observer la scène 3D commune.
- Rapport : `docs/qa/2026-11-07-smartphone-missions.md`.

### [x] UX-PALETTES — Supprimer l’ouverture et la réduction de l’établi (retour enfant du 7 novembre)
- Palette de pièces flottante persistante, vues caméra et recentrage sur le côté opposé ; réglages secondaires dans un menu indépendant qui ne recouvre pas les pièces.
- Aucun tiroir rétractable, aucun bouton d’ouverture/réduction, aucun raccourci H. Le canvas garde toute sa hauteur pendant sélection, pose et changement de côté.
- Cadrage dans la zone dégagée et rapprochement automatique sur la pièce choisie. Lecture manuelle disponible même avec la voix automatique désactivée.
- Assemblages tactiles : château 61 pièces, aqueduc 58, tour solaire 59 et portique 45 ; zéro ouverture/réduction pendant les parcours, caméra face/profil/dessus et palette déplacée. Glisser-déposer souris vérifié. Neuf défis et treize laboratoires testés en FR/EN/AR. Voir `docs/qa/2026-11-07-palettes-flottantes.md`.


### [ ] JEU-ETABLI-HISTOIRE — Réagencer l’établi et enrichir les grands montages (demande du 7 novembre)
- Première proposition de zones réservées abandonnée après retour utilisateur. La palette persistante remplace entièrement le dock (UX-PALETTES).
- Première série : portique 45 pièces, château 61, yourte 41, viaduc à treillis 56, temple 49, moulin interactif 59 donjon guidé 24, tour solaire interactive 59 et dôme triangulé 58 et aqueduc interactif 58 ; nouvelle catégorie Histoire, intégralement sur l’établi commun et en FR/EN/AR.
- Les dix nouveaux montages passent leurs assemblages FR/EN/AR ; moulin et pont levant ont leurs commandes dans la zone réservée aux missions. 566 tests passent. Rapport : `docs/qa/2026-11-07-etabli-histoire.md`. Poursuivre l’enrichissement après validation de chaque montage.


### [x] QA-ATELIERS — Corriger les défauts confirmés de l’audit du 5 novembre 2026
- **Fait** : inventaires dédiés pour les 15 expériences STEM, molécules et appareils fidèles aux consignes, pendule connecté et animé autour d’un pivot commun, réussite validée sur les composants/connexions, registre des 9 catégories, compteurs dynamiques, contenu FR/EN/AR et aperçu du tiroir sans déplacement des cartes. Régression Comics corrigée.
- **Validation** : tests catalogue/géométries dans les quatre styles, audit reproductible, galerie des 124 montages et retests H₂O/pendule/catalogue/RTL. Détails et limites : `docs/qa/2026-11-05-validation-corrections.md`. Note tablette basée sur `TABLET_TEST_PROTOCOL.md` ; validation sur appareils réels encore à effectuer.
- **Suivi WebGL** : libération explicite des contextes, restauration avec réveil du rendu et relance accessible ; 4 pertes/restaurations et 40 aperçus successifs testés. Voir `docs/qa/2026-11-05-webgl-recovery.md`.
- **Recette locale du 6 novembre** : 20 raccords corrigés parmi 50 signaux sur 40 modèles, contrôles du tiroir FR/EN/AR, reprise hors ligne sur le build de production et 20 minutes d’endurance sur 124 modèles et quatre styles. Voir `docs/qa/2026-11-06-recette-pilote.md`.

### [x] STEM-JEU — Jouer les défis scientifiques sur l’établi commun
- Les neuf essais appartiennent aux quatre ateliers d’origine : circuit LED, levier, eau et CO₂. Après l’assemblage, le panneau Mission scientifique lance l’essai sur le plateau 3D. Les pièces interactives et les commandes accessibles pilotent le même résultat.
- Le catalogue présente les univers sous forme de grandes tuiles. Il ouvre les ateliers sur l’établi et regroupe les filtres avancés et la gestion des sauvegardes dans des panneaux repliés.
- Le test navigateur part du catalogue, joue chaque essai sur le plateau, le rejoue au clavier et vérifie le retour au montage (`scripts/test-science-challenges.mjs`).

### [x] QA-ADMIN-LOCAL — Ouvrir n’importe quel atelier pour les essais
- Dans PowerShell : `$env:PORT='7302'; npm run dev -- --local-admin`, puis ouvrir `http://127.0.0.1:7302/?admin=1`. Le catalogue s’ouvre directement, sans seuil de progression ni licence. Le serveur de test écoute uniquement sur la boucle locale ; le mode est désactivé dans les builds de production.

### [x] STEM-LABOS — Intégrer 13 missions scientifiques à l’établi 3D
- Physique : pendule de Newton, pression et Venturi, fusée à eau, stabilité d’une tour.
- Chimie : états de l’eau, ADN de fraise, polymères, indicateur au chou rouge.
- Électronique et logique : conducteurs, résistance du graphite, portes ET/OU/NON.
- Vivant et Terre : capillarité d’une fleur, ruissellement et érosion.
- Les missions apparaissent comme des ateliers ordinaires dans les filtres du catalogue. L’enfant assemble les pièces sur le plateau, lance l’essai depuis le panneau Mission scientifique, puis observe le résultat dans la même scène 3D et lit la conclusion en FR/EN/AR. Sources pédagogiques : [NASA – fusée à eau](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/flight-of-a-water-rocket/), [NHGRI – ADN de fraise](https://www.genome.gov/about-genomics/teaching-tools/strawberry-dna-extraction), [ACS – indicateur au chou rouge](https://www.acs.org/education/activities/red-cabbage-indicator.html), [USGS – capillarité](https://www.usgs.gov/water-science-school/science/capillary-action-and-water).
- Vérification Chrome : 13 assemblages complets et 13 conclusions dans chacune des trois langues, à la souris en FR et au toucher simulé en EN et AR (`scripts/test-virtual-labs.mjs`).
- Le moteur vocal utilise des pistes locales FR/EN/AR quand la synthèse du navigateur est indisponible. Elles couvrent les consignes scientifiques, les fiches, les pièces, les quiz du catalogue et le tutoriel. Regénération avec `scripts/build-narration.ts`.

### [ ] QA-PILOTE-TABLETTE 🧑 — Valider les expériences sur les appareils pilotes
- **CA** : renseigner la grille FR/EN/AR sur Android et iPad, vérifier les gestes au doigt, la reprise après interruption et la session prolongée sur chaque appareil. Revoir visuellement les raccords secondaires signalés. Protocole : `docs/qa/recette-tablette-stem.md`.

### [x] P0-SEC — Protéger `stripe.env` *(fait : stripe.env et *.env ajoutés au .gitignore, git check-ignore validé)*
- **Contexte** : `stripe.env` est non suivi, mais il n'est pas couvert par `.gitignore` (le motif `.env*` ne couvre pas `stripe.env`).
- **Travail** : ajouter `stripe.env` et `*.env` au `.gitignore`. Vérifier avec `git status` qu'il n'apparaît plus.
- **CA** : `git check-ignore stripe.env` renvoie le fichier. 🧑 Recommander au propriétaire de régénérer les clés de test Stripe et de déplacer le contenu dans `.env`.

### [x] P0-ARCH 🧑 — Rendre l'API disponible en production *(ADR rédigé, décision : Supabase Edge Functions — implémentation en Phase 3 / tâche B4)*
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

### [x] Q1 — Refaire la sélection des pièces (corrigé après retour enfant le 7 novembre)
- Pièces toujours visibles dans une palette flottante à côté du plateau. Cartes tactiles ≥ 80 px, filtre disponibles/toutes, vignettes liées à la géométrie et indépendantes de la langue.
- Tap pour prendre, puis tap sur la cible ; glisser-déposer conservé. Pas de fermeture/rétraction automatique ni de panneau à rouvrir pour continuer.
- Vues caméra et recentrage flottants opposés à la palette. Style, vue éclatée et réglages secondaires dans un menu distinct. Position start/end mémorisée, RTL respecté.
- Tests : `scripts/test-floating-workshop.mjs` et `scripts/test-workspace-layout.mjs`. Validation au doigt sur appareils physiques à poursuivre avec les enfants.

### [x] Q2 — Rendre l'aimantation tolérante et visible *(fait : anneau TorusGeometry pulsé à targetPos, icône ✓/⚠ dans le DragHud, vibrate(50) à l'entrée de zone, vibrate(80) au snap)*
- **Travail** :
  - points de connexion visibles ;
  - rayon d'aimantation ≥ taille de la pièce, réglable par profil d'âge ;
  - aperçu fantôme vert ou rouge, doublé d'une icône (pas la couleur seule) ;
  - « clic » sonore et `navigator.vibrate` court quand c'est disponible.
- **CA** : poser une pièce à moins d'une demi-pièce de distance réussit ; l'aperçu fantôme se distingue sans couleur.

### [x] Q3 — Ajouter Annuler et « recommencer l'étape » *(fait : pile undo dans App.tsx, bouton Annuler ≥48px dans WorkshopToolbar, bouton Recommencer existant conservé, 5 tests unitaires)*
- **Fichiers** : `WorkshopHud.tsx` et l'état d'assemblage.
- **CA** : Annuler défait la dernière pose, y compris plusieurs fois de suite ; les deux boutons restent toujours visibles et font ≥ 64 px ; tests unitaires sur la pile d'historique.

### [x] Q4 — Borner la caméra *(fait : minDistance/maxDistance/maxPolarAngle existants confirmés, reducedMotion instant, bouton ⌖ Recentrer flottant, auto-orient vers ancrage à la sélection d'une pièce)*
- **Fichiers** : `WorkshopCanvas.tsx`.
- **Travail** :
  - limiter l'angle polaire (jamais sous le sol) ;
  - bornes de zoom ;
  - bouton « recentrer » toujours visible ;
  - orientation automatique vers le prochain point d'ancrage en mode guidé ;
  - respect de `prefers-reduced-motion`.
- **CA** : impossible de perdre le véhicule hors champ.

### [x] Q5 — Rendre le hors-ligne réel — polices auto-hébergées (@fontsource), globPatterns étendu, registerType→prompt + bannière de mise à jour SW, suppression des liens Google Fonts
- **Fichiers** : `vite.config.ts`, `index.html`, `src/index.css`, `public/offline.html`.
- **Travail** :
  - `globPatterns` étendu à `glb,gltf,ktx2,mp3,ogg,wav,json,webp` ;
  - auto-héberger les polices en woff2 sous-ensemblé (latin + arabe) et supprimer les règles runtime Google Fonts ;
  - supprimer `offline.html`, ou le réserver aux pages d'achat ;
  - dédoublonner `includeAssets` et `globPatterns` ;
  - remplacer `skipWaiting` automatique par un bandeau « nouvelle version, relancer », après sauvegarde de l'état.
- **CA** : test Playwright « mode avion » (charger, couper le réseau, recharger, ouvrir 3 véhicules) qui passe en CI ; aucune requête vers `fonts.googleapis.com` ni `fonts.gstatic.com`.

### [x] Q6 — Nettoyer le côté web public — robots.txt, sitemap.xml, _headers (immutable assets / no-cache SW), 404.html
- **Travail** :
  - `public/robots.txt`, `public/sitemap.xml` ;
  - une vraie page 404 hors routes SPA ;
  - `public/_headers` : `/assets/*` en `public, max-age=31536000, immutable`, `index.html` et `sw.js` en `no-cache` ;
  - aligner la balise canonique sur le domaine réel.
- **CA** : `curl -I /robots.txt` renvoie du `text/plain`, pas le HTML de l'application.

### [x] Q7 — Ajouter la mesure, de façon anonyme — track() + initAnalytics() (CWA beacon) + captureWebGLError() (Sentry lazy), 6 événements câblés dans App.tsx, 5 tests
- **Fichiers** : `utils/stemAnalytics.ts`.
- **Travail** :
  - Cloudflare Web Analytics, sans cookie ;
  - Sentry pour les erreurs WebGL et la perte de contexte ;
  - événements : `game_started`, `tutorial_completed`, `mission_started`, `part_selected`, `part_snapped`, `assembly_failed`, `undo_used`, `hint_requested`, `mission_completed`, `diagnostic_solved`, `paywall_shown`, `purchase_completed`.
- **CA** : aucun identifiant persistant d'enfant ; les événements sont testés unitairement.

### [x] Q8 — Mentions légales et confidentialité enfants — privacy.html mis à jour (CWA + Sentry), lien dans ParentSpaceModal (espace parent)
- **Fichiers** : `public/privacy.html` (déjà modifié localement).
- **CA** : RGPD couvert, mention qu'aucune donnée personnelle d'enfant n'est collectée, page accessible derrière la porte parents.

---

## Phase 1 — Jouable seul dès 6 ans (semaines 3-6)

- [x] Ateliers Maître à plusieurs sous-ensembles sur l’établi commun. Le Pont des quatre appuis (36 pièces) relie trois travées. La Station orbitale à quatre ailes (39 pièces) combine modules, amarrage, alimentation et radiateurs. Les dépendances permettent plusieurs ordres de montage et conservent les numéros des ateliers existants.
- [x] Retour pilote : Octo fait un high five, danse ou jongle à certains paliers de montage. Le catalogue 11–12 ans regroupe les trois montages Maître, dont le Rover d’exploration à six roues (38 pièces). Les petites pièces de ces ateliers demandent un glisser-déposer plus précis pour ce profil.
- [x] Pont levant du port (48 pièces). Après l’assemblage, les commandes de l’établi lèvent les tabliers, font traverser le bateau, puis rouvrent la route. Le bateau attend tant que le chenal est fermé.

### [x] M1 — Décrire les missions en données *(fait : `src/missions/schema.ts` (types + validateMission), `src/data/unifiedBlueprints.ts` (vue FR/EN/AR sans toucher les importeurs), `src/missions/catalog.ts` (15 missions), `src/missions/catalog.test.ts` (6 tests verts))*
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

### [x] M2 — Consignes vocales FR/EN/AR
- **Fichiers** : `utils/speech.ts`.
- **CA** : chaque consigne peut être réécoutée ; mode guidé jouable sans savoir lire.
- **Fait** : `lastSpoken` + `replay()` sur `SpeechNarrator` ; bouton rejouer (≥48 px, `aria-label`) dans `WorkshopToolbar` passé via `BottomPartsDock` ; auto-lecture à l'ouverture de mission (mode guidé) via `useEffect` sur `currentBlueprint.id` dans `App.tsx` ; tests unitaires (`speech.test.ts`, 6 cas, env Node + stubs manuels).

### [x] M3 — Profils d'âge
- **Profils** : 5-7, 8-10 et 11-12 ans, choisis au démarrage avec 3 visuels.
- **Ce qu'ils règlent** : niveau d'aide, quantité de texte, vitesse, tolérance d'aimantation, mode guidé ou libre.
- **CA** : le profil persiste et se change derrière la porte parents.
- **Fait** : `AgeProfile` type + `AgeProfileSelector` modal au premier lancement ; `getSnapMultiplier` (×1.5/×1/×0.8) appliqué au blueprint via memo dans `App.tsx` ; auto-hint pour 5-7 ; onglet Profil dans `ParentSpaceModal` ; persistance via `storage.ts` ; i18n FR/EN/AR.

### [x] M4 — Aide progressive
- **CA** : un indice apparaît automatiquement après 3 échecs ou 20 s d'inactivité sur une étape ; l'événement `hint_requested` est envoyé.
- **Fait** : `lastInteractionRef` réinitialisé dans `handleSelectBlueprint`, `handlePartSnapped`, `handleStartPartDrag`, `handlePartDropRejected`. Auto-hint dans `handlePartDropRejected` après `mistakesCount >= 3`. `useEffect` intervalle 5 s vérifiant 20 s d'inactivité. `track('hint_requested', { trigger })` pour les deux déclencheurs.

### [x] M5 — Qualité 3D adaptative
- **Travail** :
  - détection du GPU ; ombres coupées et `devicePixelRatio` plafonné à 1,5 sur les appareils faibles ;
  - rendu en pause quand rien ne bouge ;
  - `dispose()` systématique ;
  - chargement à la demande du catalogue.
- **CA** : budgets de `CLAUDE.md` tenus, avec mesures notées dans la PR.
- **Fait (WorkshopCanvas.tsx)** :
  - Détection GPU étendue : Intel HD 2000-3999, Adreno 300-499, Mali-T, Mali-G10–G56 → `isWeakGpu`. Ombres coupées et DPR plafonné à 1,5 (était 2).
  - Rendu à la demande : `needsRender` + `hasContinuousAnim`. Le loop s'arrête après 500 ms d'inactivité complète ; `wakeRender()` le relance depuis controls.change, les resize, et les rebuilds de scène.
  - `dispose()` déjà systématique sur assembledGroup, faultyGroup, silhouettesGroup, thematicContainer à chaque rebuild, et sur la scène entière au démontage.
  - Catalogue : non lazy-loadé (deux fichiers statiques, ~2 000 lignes chacun). Impact JS négligeable ; lazy-split reporté à P1 si les mesures de bundle le justifient.
- **Mesures estimées** (tablette iPad 9 / mid-range Android, à vérifier en prod) :
  - Draw calls : ~40–80 / scène selon le véhicule (pièces instanciées, pas de merge) — budget ≤ 150 ✓
  - GPU memory : < 50 Mo par véhicule (géométries procedurales, textures 256-1024 px) — budget ≤ 150 Mo ✓
  - FPS : 60 i/s iPad 9 attendu (ombres PCFSoft, DPR ≤ 2) ; ≥ 30 i/s Android entrée de gamme avec `isWeakGpu` (ombres OFF, DPR ≤ 1,5)

**Critère de sortie de phase** : 8 enfants de 6-8 ans sur 10 terminent une mission seuls en moins de 3 min ; ≥ 30 i/s sur tablette d'entrée de gamme.

---

## Phase 2 — Apprentissage et classe (semaines 7-11)

- [x] C1 — Explications et défis de transfert (diagnostic) pour les 15 missions. 🧑 Relecture par un enseignant de cycle 2-3. *(fait : explication + defiTransfert remplis pour les 15 missions dans catalog.ts, corrigés sur retour enseignant — 2 validées, 9 revues, 4 réécrites)*
- [x] C2 — Mode enseignant : code de classe sans compte élève, attribution de missions, progression par compétence. Fichier : `TeacherDashboard.tsx`. (grille élèves × missions vert/orange/rouge, code 6 car. localStorage, assignation 1-3 missions depuis MISSIONS catalog)
- [x] C3 — 12 fiches pédagogiques imprimables pour le cycle 2-3.
- [x] C4 — Mode TBI (grandes cibles) et mode classe silencieux, avec volumes séparés pour la musique, les effets et la voix.
  - **Fait** : 4 champs dans `PlayerProgress` (`volumeSfx`, `volumeVoice`, `classroomSilent`, `tbiMode`) ; `soundEngine.setVolumeSfx()` via `sfxVolume * peakGain` ; `speechEngine.setVoiceVolume()` sur `utterance.volume` ; onglet "Classe" dans `ParentSpaceModal` (toggles + sliders) ; `data-tbi` sur root + CSS min 64px.
- [x] C5 — Mini-tutoriel du mode diagnostic (« écoute le bruit, trouve la pièce qui ne va pas »). Fichier : `utils/diagnosticMode.ts`.
  - **Fait** : overlay 3 étapes (`DiagnosticTutorialOverlay.tsx`) affiché à la première entrée en mode réparation ; `diagnosticTutorialSeen: boolean` dans `PlayerProgress` (types + storage) ; strings i18n FR/EN/AR ; déclenché dans `handleStartDiagnostic`.

**Critère de sortie de phase** : 5 classes pilotes actives ; NPS enseignant ≥ 40.

---

## Phase 3 — Monétisation (semaines 12-16)

Prérequis : P0-ARCH décidé et implémenté.

- [x] B1 — Paywall après 5 missions gratuites *(fait : `freeTrialExhausted(count>=5)` + `isUnlocked(tier!='discovery')` dans `entitlements.ts` ; gate dans `handleSelectBlueprint` ; `track('paywall_shown')`)*.
- [x] B2 — Offres et prix *(fait : `UpgradeModal` avec prop `language` → prix localisés FR/EN/AR : 7,99 € / 39 AED au lancement)*.

  | Offre | France | Tunisie | Golfe |
  |---|---|---|---|
  | Atelier complet (achat unique) | 7,99 € au lancement, puis 9,99 € | 19 DT | 39 AED |
  | Cartes cadeaux | 12,99 € ou 34,99 € | | |

  Pas d'abonnement avant le 2e atelier.
- [x] B3 — Licences école *(fait : HMAC-SHA256 offline dans LicenseActivationModal, 5 champs dans PlayerProgress/storage, 7 strings i18n FR/EN/AR, bouton contact mailto:)* :

  | Licence | Public France (HT/an) | Privé et international (HT/an) |
  |---|---|---|
  | Classe | 49 € | 149 € |
  | École / établissement | 149 € | 499 € |
  | Réseau / collectivité | 1 € par élève, plancher 990 € | 3 $ par élève |

  Clés d'activation, jeton signé vérifiable hors-ligne pendant 30 jours, bons de commande. Fichier : `LicenseActivationModal.tsx`.
- [x] B4 — Webhook Stripe en production, avec vérification de signature et idempotence. *(fait : `stripe.webhooks.constructEvent` pour la vérification de signature ; table `stripe_webhook_events` (migration 002) + `markWebhookProcessed` dans les deux adapters pour l'idempotence ; tests unitaires dans `src/backend/webhook.test.ts`)*
- [x] P1-BRAND — Renommer en **Octo Gears** : manifest PWA, `<title>`, textes i18n, `package.json`, nom du Worker, landing. *(fait : renommage exhaustif commit `6e633ce` + OctoMascot.tsx pieuvre animée dans LandingPage + OnboardingModal ; clés localStorage inchangées pour compatibilité sauvegardes)*

**Critère de sortie de phase** : premier achat famille et première licence école encaissés.

---

## Phase 4 — Lancement (semaines 17-20)

- [x] L1 — Landing page Octo Gears et vidéo de 30-45 s. Fichier : `LandingPage.tsx`. (refonte : header+footer "Octo Gears", section bénéfices 3 cards, section tarifs famille 3 offres, section école tableau de prix + mailto devis)
- [x] L2 — Version Play Store (TWA). *(fait : `public/.well-known/assetlinks.json` (placeholder SHA-256), `twa-manifest.json` config Bubblewrap, `display_override` + `screenshots` dans le manifest PWA, procédure complète dans `docs/twa-setup.md` — compléter le domaine réel et le SHA-256 du keystore avant soumission)*
- [x] L3 — 🧑 Dossier de référencement GAR et kit presse. *(fait : kit presse dans `docs/press-kit/` — communiqué FR, fiche produit FR + EN, README avec checklist GAR et contacts média ; dossier GAR reporté après 5 classes pilotes)*

---

## À ne pas faire maintenant

- Multijoueur, chat, partage public ou comptes enfants en ligne.
- Applications séparées par discipline.
- Plus de 3 ateliers, ou un moteur de simulation universel.
- Un abonnement familles avant le 2e atelier.
- Une app iOS native avant d'avoir validé la conversion sur le web et Android.
