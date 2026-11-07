# Aventures, découvertes et variantes — 7 novembre 2026

## Fonctionnement livré

- Les cinq constructions portique, château, donjon, temple et viaduc accueillent une activité jouable dans WorkshopCanvas. Voir `2026-11-07-construction-play.md`.
- Dix variantes de surprises marines ; dauphin, raie, méduse et étoile rejoignent les animaux existants. Déclenchements sur avancée réelle et réussites d'essais, sans répétition au simple undo/rechargement. Les essais répétés rapidement ne multiplient pas les animations. Réduction des mouvements respectée.
- Dans les réglages : Construire avec Octo (silhouette et voix), Réparer un montage (session isolée), Construire en expert (sans silhouette ni voix automatique). La lecture manuelle reste disponible. Le mode affiché suit les réglages réellement actifs. Les grands modèles reçoivent jusqu'à huit interventions de réparation, avec dépendances solubles vérifiées sur tout le catalogue.
- Accès Aventures et découvertes depuis le catalogue et les réglages. Trois parcours de trois ateliers : remettre le port en service, construire un village et explorer le laboratoire. Progression basée sur les constructions existantes, sans nouvelle scène ni contournement des accès.
- Carnet local par profil : constructions terminées et observations scientifiques, récents en premier, résultats FR/EN/AR, réouverture des constructions dans l'espace habituel. Stockage borné à 180 observations, résultats identiques regroupés, échec de stockage géré. Supprimer un profil supprime son carnet. Le carnet est indépendant de l'export/import de progression existant.
- Essais scientifiques et interactifs enregistrent leurs observations ; seules les réussites font réagir les animaux. Les essais sont isolés lors d'un changement de profil. Les scènes attendent que le moteur soit prêt avant d'installer acteurs et commandes.
- Neuf pistes audio ajoutées (trois par langue), pré-cachées avec les autres médias. Aucun asset distant nécessaire.

## Vérifications

- `npm run lint`, `npm test` : 605 tests, 41 fichiers.
- `scripts/test-construction-play.mjs` : quinze parcours FR/EN/AR, toucher réel de l'acteur 3D, commandes équivalentes, routes obstruées/libres, reprise. Test EN également avec mouvements réels et comparaison des pixels.
- `scripts/test-play-modes-surprises.mjs` : placement réel guidé/expert, réparation isolée et conservation du montage ; mauvais atelier/observation intermédiaire ignorés par les surprises, cadence limitée. FR/EN/AR, zéro erreur JavaScript.
- `scripts/test-adventures-notebook.mjs` : trois aventures, atelier avancé verrouillé sans admin, vrai essai Venturi, persistance après rechargement, isolation par profil, réouverture dans un seul canvas. FR/EN/AR.
- `scripts/test-experience-audio.mjs` : douze lectures nouvelles (modes et aventures), voix natives vides, bon clip local chargé, contexte actif et échantillons non silencieux dans les trois langues.
- Régression des neuf défis scientifiques FR/EN/AR ; régression des assemblages et essais du phare, moulin, aqueduc et pont levant.
- `scripts/test-adventures-offline.mjs` sur build de production : rechargement hors ligne, livraison du portique en 3D, résultat du carnet et nouvelle piste audio disponibles.
- Build isolé dans `build/qa-adventures`, sans déploiement.

## Recette physique à poursuivre

Suivre `TABLET_TEST_PROTOCOL.md` en gardant la palette toujours visible (les anciens scénarios de repli ne s'appliquent plus). Sur Android/iPad : assembler, tester au toucher sur acteur et boutons, changer de vue/style, rejouer puis revenir au montage ; comparer guidé/expert et quitter une réparation sans perdre les pièces standard. Ouvrir une aventure, terminer une étape, retrouver son résultat dans le carnet, changer de profil. Répéter hors ligne et avec réduction des mouvements.

Les vérifications navigateur utilisent l'émulation tactile ; elles ne remplacent pas les appareils physiques. L'agencement téléphone n'a pas été modifié. Le budget JS initial reste dépassé, autour de 599 Ko gzip.
