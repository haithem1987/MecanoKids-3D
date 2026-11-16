# Mathématiques : niveaux français et traduction en jeu

Recherche effectuée le 16 novembre 2026 sur les programmes publiés et les ressources officielles. Il s’agit de repères scolaires, pas d’un diagnostic individuel. Les âges usuels se chevauchent selon la date de naissance et le parcours de l’enfant.

## Références en vigueur

- [Maternelle : programme et repères de fin de cycle](https://www.education.gouv.fr/programmes-l-ecole-maternelle-4193), actualisés en août 2026.
- [Cycle 2 : programme officiel CP, CE1, CE2](https://www.education.gouv.fr/sites/default/files/document/Annexe%204%20%E2%80%93%20Programme%20de%20math%C3%A9matiques%20du%20cycle%202-403821.pdf) ; [ressources Éduscol](https://eduscol.education.gouv.fr/4746/ressources-d-accompagnement-du-programme-de-mathematiques-au-cycle-2). Applicable depuis septembre 2025.
- [Cycle 3 : programme CM1, CM2, sixième](https://www.education.gouv.fr/sites/default/files/programme-de-math-matiques-pour-le-cycle-3-439827.pdf). [Calendrier officiel](https://www.education.gouv.fr/bo/2025/Hebdo16/MENE2504620A) : CM1 et sixième depuis 2025, CM2 depuis 2026.
- [Cycle 4 : programme officiel](https://www.education.gouv.fr/sites/default/files/document/Annexe%202%20%E2%80%93%20Programme%20de%20math%C3%A9matiques%20pour%20le%20cycle%204-480716.pdf). [Application](https://www.education.gouv.fr/bo/2026/Hebdo10/MENE2602912A) en cinquième depuis septembre 2026. Ne pas employer un ancien programme ou un projet comme référence actuelle.

## Repères par classe

| Classe, âge usuel indicatif | Repères utiles pour les ateliers |
| --- | --- |
| Grande section, vers 5–6 ans | Petites quantités jusqu’à 10, composition/décomposition, comparaison, formes et motifs ; manipulation accompagnée par l’oral. |
| CP, vers 6–7 ans | Entiers jusqu’à 100, unités/dizaines, sens de l’addition et de la soustraction, longueurs, formes et positions. |
| CE1, vers 7–8 ans | Entiers jusqu’à 1 000, problèmes multiplicatifs et partages ; premières fractions simples, sans présumer leur maîtrise préalable. |
| CE2, vers 8–9 ans | Entiers jusqu’à 10 000, quatre opérations, fractions, grandeurs et géométrie. |
| CM1, vers 9–10 ans | Fractions et décimaux, résolution de problèmes, mesures, aire, géométrie et premières situations de proportionnalité. |
| CM2, vers 10–11 ans | Consolidation des fractions et décimaux jusqu’aux millièmes, mesures, aire et raisonnement proportionnel. |
| Sixième, vers 11–12 ans | Produits de décimaux, fractions et quotients, proportionnalité, aires/volumes, configurations géométriques et raisonnement. |
| Cinquième, vers 12–13 ans | Nombres relatifs/rationnels, proportionnalité, échelles, angles et transformations ; approfondissement, pas socle exigé de tous les 11 ans. |

Le programme définit des objectifs à construire dans l’année ; il ne permet pas de dire que tout enfant du même âge maîtrise déjà ces notions. « Savoir compter jusqu’à 100 » ne signifie pas « poser 100 pièces ». Notre catalogue ne prétend pas couvrir tous ces attendus avec deux jeux.

## Choix de conception appliqués

Les lignes suivantes sont nos choix de conception à tester avec les enfants, et non des prescriptions du ministère.

| Profil existant | Proposition disponible | Prérequis et effet visible |
| --- | --- | --- |
| 5–7 ans | Passerelle de découverte : 2 lames présentes, 3 à ajouter | Compter de petites collections ; pont qui se ferme puis traversée. Activité d’entrée GS/CP, pas synthèse du CE1. |
| 8–10 ans | Grue : masse 2 au repère 3, contrepoids 3 à déplacer | Lire une graduation et comparer de petits produits entiers. Choisir une position, observer l’inclinaison, puis lever. |
| 11–12 ans | Grue : masse 3 à 2,5 m, contrepoids 2 ou 5, positions décimales | Mobiliser produits, mesures décimales et recherche d’une égalité ; choisir masse et distance ensemble. Aucune addition de découverte proposée. |

La loi du levier est un **modèle mécanique introduit par le jeu**, pas un acquis de physique présumé du primaire. L’information explique que les deux produits masse × distance se comparent dans une grue idéale. Le modèle néglige masse de la flèche, frottements et limites de charge ; il ne sert pas à dimensionner une vraie grue.

Les décimaux ne sont donc pas « réservés par le programme » aux 11 ans : ils sont utilisés ici pour différencier le défi, sur une notion déjà abordée au cours moyen. Une adaptation individuelle par classe ou compétence reste à développer ; le profil d’âge seul n’atteste aucune maîtrise.

## Suppression du remplissage

L’ancien treuil à vingt boulons est remplacé : dix pièces structurelles, aucun point à ranger, puis un problème de choix. Une seule mission de grue ; pas de trois variantes qui répètent le même geste. Le levage accompli n’est pas une boucle de récompense relançable sans nouvelle décision.

Fractions, aire, symétrie et engrenages restent en refonte et sortent du catalogue enfant, de la recherche, des aventures et de la reprise. Les sauvegardes et récompenses ne sont pas supprimées. Accès technique explicite uniquement en admin local avec `&mathPrototypes=1` ; aucune exposition de ce commutateur en production.

## Suite du catalogue

À concevoir avant de publier de nouveaux ateliers : relier une portée par deux longueurs différentes ; assembler une surface avec quelques modules de tailles différentes ; construire seulement la moitié symétrique ; sélectionner une transmission selon une vitesse requise. Chaque proposition doit poser une décision géométrique ou mécanique, avec peu de gestes répétitifs et un résultat compréhensible. Aucune de ces idées n’est annoncée comme déjà implémentée.

## Validation

TypeScript et 681 tests unitaires réussis. Neuf parcours navigateur (trois âges × FR/EN/AR), six assemblages complets de grue, inclinaison et levage visibles, blocage des anciens prototypes à la reprise, résultats sauvegardés et sortie disponible. Audio trilingue régénéré et vérifié ; build isolé et parcours hors ligne. La compréhension et l’intérêt restent à confirmer par les enfants ; aucun déploiement. Budget JavaScript initial toujours dépassé, autour de 655 Ko gzip.
