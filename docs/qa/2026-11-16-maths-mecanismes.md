# Refonte des ateliers mathématiques — 16 novembre 2026

Les six anciens plateaux de comptage sont remplacés par des constructions fonctionnelles dans WorkshopCanvas. La mission est annoncée avant le montage et reste lisible pendant les essais. Aucun second espace de jeu.

| Atelier | Pièces | Apprentissage et conséquence visible |
| --- | ---: | --- |
| Passerelle à rallonger | 15 | Addition de longueurs ; la tortue traverse si le tablier rejoint son appui. |
| Fixations du treuil | 28 | Tableau de boulons, lignes et colonnes ; le treuil soulève sa charge avec le gabarit demandé. |
| Passerelle en quarts | 16 | Unité de longueur fixe, quarts et huitièmes ; les fractions équivalentes construisent la même traversée. |
| Plateau élévateur | 23 | Pavage rectangulaire ; le plateau doit épouser le cadre avant de lever sa charge. |
| Charpente du pont roulant | 39 | Contreventements symétriques ; le chariot circule lorsque les deux côtés correspondent. |
| Engrenages du monte-charge | 25 | Roues de 12 et 18 dents, tours liés et sens inverses ; le câble s’enroule sur le tambour et lève la caisse. |

Chaque atelier propose trois missions, un essai animé, des explications précises et un accès à la mission suivante. La transmission tourne selon le rapport réel 12/18 même si la prévision de l’enfant est fausse. Les essais sont des modèles pédagogiques déterministes, pas des simulations de résistance des matériaux.

Les formes, unités et rôles des pièces sont expliqués en FR/EN/AR, avec audio local. Les réglages numériques emploient des sélecteurs compacts. Le cadrage réserve la zone des instructions sur tablette portrait. Aucun nouveau chantier d’agencement téléphone.

## Vérification

- TypeScript : `npm run lint` réussi ; `npm test` : 673 tests réussis dans 52 fichiers.
- `test-math-workshops.mjs` : six montages dans les trois langues, 438 pièces posées, manipulation directe en 3D, 54 missions réussies et observations sauvegardées ; aucune erreur JavaScript.
- `test-math-mechanisms.mjs` : mouvement visible sur les six essais, succès, passage à la mission suivante et accès au catalogue ; tablette portrait pour les fractions.
- `verify-math-narration.ts` : toutes les instructions mathématiques disposent de clips locaux FR/EN/AR.
- Build isolé `build/qa-math-mechanics` ; test hors ligne après rechargement, résultat dans le carnet et nouvelle consigne audio sans voix système.
- Migration : les anciennes pièces sans supports sont retirées du montage en cours ; les récompenses restent conservées. Les anciennes observations restent au carnet, mais seules les nouvelles expériences valident les aventures mathématiques.

## Limites et prochaine recette

À faire avec des enfants : peuvent-ils expliquer l’objectif avant de construire, anticiper l’effet d’un mauvais réglage et comprendre la conclusion après l’essai ? La réussite des tests techniques ne valide pas ces points pédagogiques. Vérifier aussi sur tablette physique, notamment lisibilité du repère d’unité, sélection des petites pièces et temps d’attention.

Budget JavaScript initial toujours dépassé : environ 649 Ko gzip. Aucun déploiement de cette refonte.
