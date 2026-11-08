# Mathématiques manipulables — 8 novembre 2026

## Références et limites pédagogiques

Consultation des programmes officiels en vigueur : [cycle 2, programme 2024 applicable en 2025](https://www.education.gouv.fr/sites/default/files/document/Annexe%204%20%E2%80%93%20Programme%20de%20math%C3%A9matiques%20du%20cycle%202-403821.pdf), [cycle 3, programme 2025](https://www.education.gouv.fr/sites/default/files/programme-de-math-matiques-pour-le-cycle-3-439827.pdf), et [arrêté MENE2504620A](https://www.education.gouv.fr/bo/2025/Hebdo16/MENE2504620A). Le nouveau cycle 3 s’applique au CM1 et à la sixième depuis 2025, au CM2 depuis 2026. Les ressources [Éduscol cycle 2](https://eduscol.education.gouv.fr/4746/ressources-d-accompagnement-du-programme-de-mathematiques-au-cycle-2) et [cycle 3](https://eduscol.education.gouv.fr/5712/ressources-d-accompagnement-du-programme-de-mathematiques-au-cycle-3) complètent ces textes.

Le cycle 2 relie quantités, décompositions, opérations et groupes égaux. Les fractions apparaissent concrètement au CE1, puis servent à mesurer au CE2. L’atelier fractions ci-dessous vise une consolidation au cours moyen ; il ne prétend pas introduire cette notion pour la première fois.

Le cycle 3 approfondit fractions, mesures, symétrie et solides. La proportionnalité s’appuie sur des grandeurs contextualisées et le raisonnement multiplicatif ; le produit en croix n’est pas enseigné. Les activités proposées constituent des situations ciblées, sans couvrir l’intégralité d’un programme scolaire.

| Atelier | Repère indicatif | Manipulation et critères |
|---|---|---|
| `math-addition` | CP, environ 6–7 ans | Réunir deux couleurs de cubes pour former 5, 7 ou 9. Toutes les décompositions réalisables de la somme sont acceptées. |
| `math-groups` | CE1–CE2, environ 7–9 ans | Organiser des rangées égales, obtenir 6, 12 ou 20 objets. Les produits commutés réalisables sont acceptés. |
| `math-fractions` | CM1–CM2, environ 9–11 ans | Lever des parts égales d’une unité de longueur constante ; représenter 1/2, 3/4 puis 5/4. Les fractions équivalentes sont acceptées. |
| `math-area` | CM1–CM2 | Construire un rectangle pavé, distinguer carrés unité d’aire et unités de longueur du contour. Critères conjoints d’aire et de périmètre. |
| `math-symmetry` | CM1–sixième, environ 9–12 ans | Reproduire des cubes de hauteurs différentes de l’autre côté d’un axe, à distances égales. Une translation ou une rotation différente ne suffit pas. |
| `math-ratio` | Sixième, environ 11–12 ans | Préparer 1, 2 puis 3 portions d’une recette comportant 2 mesures bleues pour 3 jaunes. Chaque quantité doit conserver la recette. |

L’âge et la classe sont des repères, sans verrou pédagogique : choisir selon les acquis. Chaque atelier propose trois défis et les mêmes manipulations sont accessibles avec les commandes du panneau. Les six ateliers sont reliés par deux aventures, « Les nombres prennent forme » et « Les architectes des mathématiques ».

## Architecture et vérification

Assemblage des pièces canoniques dans `WorkshopCanvas`, puis manipulation des mêmes groupes 3D. Aucun plateau parallèle ni quiz HTML seul. Les formules sont dessinées sur le plateau avec des textures canvas locales. Seule une vérification explicite émet un résultat pour le carnet ; un changement de réglage seul ne crée pas de réussite. Les contrôles restent équivalents aux clics/touchers 3D.

- `src/data/mathActivities.test.ts` : six assemblages, absence de chevauchement des éléments à compter, dix-huit objectifs et équivalences, actions directes et symétrie.
- `src/three/mathActivityScene.test.ts` : manipulation puis restauration des pièces, longueur de l’unité conservée, libération des ressources.
- `scripts/test-math-workshops.mjs` : six assemblages complets par langue, clic/toucher 3D et trois défis par atelier, observations réussies conservées dans le carnet. Le script utilise Chrome et l’émulation tactile sur tablette, pas une validation sur appareil physique.

Exécution réussie en FR/EN/AR : **18 assemblages, 297 pièces réellement posées, 54 défis vérifiés**, un clic/toucher sur les objets de chacun des 18 ateliers, résultats conservés dans le carnet. Le jeu reste dans l’unique scène principale. Après remplacement des éléments d’addition par de véritables cubes, l’addition a été rejouée dans les trois langues. Une passe supplémentaire des six ateliers en français vérifie aussi qu’un arrangement intermédiaire ne valide pas le défi. Les quatre fichiers unitaires mathématiques/aventures/carnet passent **18 tests**.

## Recette tablette physique à effectuer

En suivant `TABLET_TEST_PROTOCOL.md`, essayer au doigt chaque atelier, sélectionner les petits objets, comparer quarts/huitièmes avec la vue du dessus, vérifier les hauteurs en symétrie, interrompre puis reprendre l’activité. Confirmer que les formules et les quantités restent lisibles, que les consignes FR/EN/AR sont compréhensibles et que le mode mouvement réduit fonctionne. Aucun changement spécifique au téléphone dans ce lot.
