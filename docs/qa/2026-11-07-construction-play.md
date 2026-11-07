# Jouer avec les grands montages terminés — 7 novembre 2026

Cinq ateliers reçoivent une mission jouable dans leur scène 3D existante : portique de manutention, château, donjon guidé, temple et viaduc à treillis. Les commandes du panneau et le toucher sur la caisse, la tortue ou le convoi déclenchent la même action.

- Portique : lever la caisse avant de déplacer le chariot puis la déposer sur un repère bleu. Le câble raccourcit en restant relié au treuil et à la caisse. La translation reste entre les montants.
- Château et donjon : accueillir la tortue par la porte centrale. La route latérale rencontre un mur ; le personnage s'arrête avant la pierre, avec un indice invitant à choisir le passage libre.
- Temple : visiter l'allée entre les colonnes. Le chemin latéral s'arrête avant une colonne, tandis que l'allée centrale est libre.
- Viaduc : guider le convoi au centre du tablier. Les roues suivent les rampes d'accès ; le choix latéral s'arrête devant le garde-corps.

Les résultats réussis émettent l'événement local `octogears:workshop-discovery` avec résultat trilingue et paramètres pour le carnet. Aucun nouvel asset distant. Les géométries ajoutées sont libérées à la fermeture ; les transformations du portique sont rétablies en quittant le mode d'essai. Les animations respectent la réduction des mouvements. L’initialisation attend que le moteur 3D soit prêt, y compris lors du chargement direct d’une sauvegarde déjà assemblée ; les petits acteurs ont une zone tactile tolérante de 64 px autour de leur ancre projetée.

## Vérification automatisée

`scripts/test-construction-play.mjs <chemin-playwright>` : 15 parcours en français, anglais et arabe, dont tablette tactile simulée 768×1024 en anglais. Le test charge un montage déjà assemblé, touche l'acteur réel dans la scène 3D, joue les étapes du portique ou les chemins obstrué/libre, vérifie l'événement de découverte, la réussite et le retour initial. Aucune erreur JavaScript détectée. Les cinq parcours passent aussi en EN avec mouvements réels ; le test compare deux captures du canvas pendant la progression pour vérifier le mouvement rendu et vérifie que changer le style du portique ne réenregistre pas une réussite. Captures `qa/construction-play-*.png`.

Six tests unitaires couvrent les contrats de route (porte/linteau, allée des colonnes, centre du pont), l'attache du câble à toutes les étapes et la libération des géométries.

## Complément de recette tablette physique

S'appuyer sur `TABLET_TEST_PROTOCOL.md`, en conservant la règle actuelle de palette toujours visible (les anciens points de repli du protocole ne s'appliquent plus).

1. Monter chaque structure, puis toucher l'acteur 3D et utiliser les mêmes actions au bouton.
2. Vérifier le changement de vue, le zoom et le pan sans déclenchement accidentel de l'essai.
3. Lever/déplacer/déposer avec le portique et observer la liaison du câble.
4. Comparer les deux routes, vérifier que le personnage ne traverse ni mur ni colonne.
5. Rejouer, changer de style, quitter l'atelier et revenir ; pas d'acteur fantôme ni de réussite enregistrée au simple changement de style.
6. Répéter avec réduction des animations et lecture des consignes en FR/EN/AR.

La validation sur appareils physiques reste à effectuer.
