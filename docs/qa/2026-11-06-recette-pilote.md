# Recette pilote Octo Gears du 6 novembre 2026

La revue des modèles, la recette des commandes et le banc WebGL ont avancé en parallèle. Les vérifications navigateur ont utilisé un profil de recette local. La grille des 15 expériences prévoit un passage dans chacune des trois langues sur chaque appareil cible. [Grille tablette](recette-tablette-stem.md)

## Modèles et commandes

Sur les 50 raccords signalés dans 40 modèles, 20 ont été corrigés. Les 30 autres ont un support voisin plausible qui reste à examiner visuellement. Les tests contrôlent les points de montage sur les triangles des pièces, les axes du fuselage et l’orientation des tuyères. [Revue mécanique](2026-11-06-revue-geometrie-mecanique.md)

Les commandes du tiroir mesurées dans le navigateur font 64 × 64 px. Les cartes présentent des noms sur deux lignes, des libellés complets et un suivi de la prochaine pièce disponible. Le défilement automatique respecte la réduction des animations. Une annulation de pointeur ou une perte de focus termine le glissement sans valider la pose ni ajouter une erreur. Le tiroir se rouvre s’il s’était rétracté automatiquement.

À 1 280 × 720 px, le menu de langue recouvrait une partie du tiroir latéral et ce dernier interceptait le clic. Le menu passe maintenant devant le tiroir. Le build final tient dans la largeur de l’écran et le choix de l’arabe fonctionne. En RTL, le bouton du début était mesuré à x = 1 201 px, celui de fin à x = 30 px, tous deux en 64 × 64 px. Les libellés français et anglais ont également été contrôlés. [Capture RTL](tiroir-rtl-recette.png)

## Hors ligne

Le build a été produit avec `npx vite build --outDir build/qa-offline`. Workbox a préchargé 48 entrées. Le paquet JS initial reste à 539 kB gzip, au-dessus du budget projet de 400 kB.

Le serveur statique isolé a été lancé avec `node scripts/serve-offline-qa.mjs 7304`. Après l’initialisation du profil et du cache, le processus a été arrêté et le port vérifié fermé. Le navigateur a rechargé l’application et ouvert le circuit LED, la molécule d’eau et le pendule. Le pendule a été terminé par clic puis glissement. Les quatre pièces et l’état de réussite ont été retrouvés après un nouveau rechargement, serveur toujours arrêté. Le test porte sur une origine HTTP inaccessible dans le navigateur local. [Pendule terminé hors ligne](pendule-hors-ligne.png)

## WebGL

La page de recette `/qa/webgl-recovery.html` alterne les modèles et les styles sur une seule scène. Elle force un rendu après les transitions et compte les captures, les appels de dessin et les erreurs. Son chronomètre exclut le temps passé dans un onglet masqué.

La session a atteint 1 200 secondes visibles. Elle a effectué 454 transitions et 455 captures réussies, avec les 124 modèles et les quatre styles représentés. Le compteur indique zéro perte de contexte, zéro capture en échec et zéro erreur JavaScript. Les 7 593 607 appels de dessin sont un total cumulé sur la session. La session a démarré avant la dernière modification de la restauration des reflets, vérifiée séparément ci-dessous. [Relevé brut](endurance-webgl-2026-11-06.json) · [Capture du banc](endurance-webgl-2026-11-06.png)

Après une perte de contexte, le moteur recrée la texture de réflexion générée sur le GPU avant de réveiller le rendu. Une perte provoquée sur le code final a donné une restauration, avec reprise des appels de dessin et aucune erreur de console. [Preuve de restauration](webgl-restauration-recette.png)

## Contrôles et recette physique

`npm run lint`, `npm test` avec 479 tests dans 23 fichiers, `git diff --check` et l’audit des 124 modèles passent. Le build de production a été généré dans le dossier de recette.

Les 45 passages sur tablette physique, les voix du système, les gestes multitactiles et les mesures de fluidité sur le matériel cible restent à exécuter. Pour reproduire la vérification des commandes, ouvrir les modèles STEM, utiliser le tiroir latéral puis le tiroir bas, interrompre un glissement par un geste système et reprendre la pose. Vérifier la reprise après fermeture de l’application et répéter en arabe.
