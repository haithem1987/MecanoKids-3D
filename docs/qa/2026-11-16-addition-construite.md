# Addition par construction — retour utilisateur du 16 novembre

## Défaut constaté

Le premier remaniement conservait deux activités séparées : monter dix lames en réserve, puis régler deux nombres dans un panneau. L’équation donnée à l’avance n’expliquait pas ce que les gestes de construction apprenaient. Les tests techniques précédents ne démontrent pas la compréhension pédagogique.

## Nouvelle passerelle

- Le décor et deux lames bleues sont déjà assemblés. Trois silhouettes restent vides dans le tablier. La tortue attend au départ.
- L’enfant pose trois lames jaunes directement à leur place, en utilisant les interactions habituelles du WorkshopCanvas. Aucune lame n’est à monter en réserve.
- Le panneau compte uniquement les lames : présentes 2, ajoutées 0/1/2/3 ; les équations suivent les poses : 2 + 0 = 2, 2 + 1 = 3, 2 + 2 = 4, 2 + 3 = 5. L’objectif initial est 2 + ? = 5.
- La palette contient les trois lames à ajouter. Les supports et les deux lames initiales n’y gonflent pas le compteur.
- Une fois le tablier terminé, la tortue traverse ce même pont. Aucun réglage numérique, aucun deuxième montage. Une seule mission pédagogique remplace les trois anciennes variantes.
- FR/EN/AR, lecture audio locale, reprise et réinitialisation conservées. Les anciens identifiants excédentaires sont filtrés à la reprise. Les observations précédentes restent au carnet mais ne valident pas cette nouvelle expérience.

## Vérifications

- `npm run lint`, 676 tests unitaires ; notamment état initial, comptage lié aux poses, continuité géométrique du pont, suppression des anciennes lames de réserve.
- `scripts/test-addition-bridge.mjs` : trois poses réelles dans chaque langue, équations intermédiaires, absence de sélecteurs numériques, mouvement de la tortue, reprise et sortie accessibles.
- Vérification visuelle de la capture finale française. Animations des cinq autres mécanismes vérifiées sans changement de leur parcours pédagogique.
- Audio local vérifié dans les trois langues ; build isolé, test de rechargement hors ligne et lecture audio.

## Audit restant

| Atelier | Défaut pédagogique restant | Direction à prototyper |
| --- | --- | --- |
| Fixations | Montage des boulons en réserve, puis réglage des lignes/colonnes | Remplir réellement les trous et faire apparaître les groupes au fil des poses. |
| Fractions | Réserve puis sélection numérateur/dénominateur | Couvrir une unité visible avec de vraies portions, puis comparer deux pavages équivalents. |
| Aire | Dalles montées puis dimensions choisies | Paver une surface directement et compter ses rangées ; traiter le contour séparément. |
| Symétrie | Toutes les pièces montées avant apparition du modèle | Construire uniquement l’autre moitié en regardant le modèle. |
| Engrenages | Petits compteurs montés puis nombres de tours sélectionnés | Tourner une manivelle et observer des marques de rotation ; faire la prévision avant le geste. |

Ces directions ne sont pas implémentées dans ce correctif. Faire tester d’abord la passerelle : l’enfant peut-il montrer les deux lames initiales, compter celles qu’il a ajoutées et expliquer pourquoi 2 + 3 fait 5 ? Aucun déploiement.
