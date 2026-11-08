# Essais scientifiques et silence général — 8 novembre 2026

## Onze ateliers originaux jouables après construction

Ventilateur (alimentation), alarme (circuit et capteur couvert), jouet solaire (lumière), plan incliné (pente et déplacement du bloc), boussole (position de l’aimant), pendule (longueur et écart), cristal de sel (ions dispersés ou réseau alterné), bécher (sel/sable et mélange), radio (accord), balance (masse de droite), prisme (source blanche/rouge/éteinte).

Toutes les commandes pilotent les pièces du montage dans le même canvas. Les compléments visibles représentent l’air, le signal sonore, la lumière ou les grains. Aucun autre plateau. Les modèles sont qualitatifs ; le pendule respecte la dépendance de la période à la racine de sa longueur, le plan incliné néglige les frottements et le réseau cristallin est simplifié. Aucun mélange réel n’est demandé.

Les contrôleurs restaurent les pièces et libèrent géométries, matériaux et écouteurs. En mouvement réduit, le résultat reste visible sans oscillation ni rotation continue. Les styles peuvent être changés sans nouvelle observation ni nouvelle récompense.

`node scripts/test-science-discovery.mjs <playwright>` : 33 parcours FR/EN/AR, paramètres initiaux puis solution, différence des pixels du canvas, événement unique par essai, reset, changement de style sans doublon.

## Silence général

Un gain maître commun réunit les effets et narrations locales. Le silence ferme cette sortie immédiatement, annule les sons programmés, arrête les voix natives et locales et empêche les nouvelles demandes. Le zéro du volume de voix arrête aussi la lecture active. Le silence précède la création et survit à la recréation du contexte audio. La réactivation ne reprend pas une ancienne voix ou des notes déjà annulées.

`node scripts/test-workshop-mute.mjs <playwright>` : analyse des vrais échantillons WebAudio avant la destination, effet et narration actifs, clic du bouton de silence, pic inférieur à 0,000001, absence de reprise ancienne, nouveaux sons après réactivation, recréation du contexte et réponse MP3 retardée après mise en sourdine. Les voix natives sont également testées par annulation et blocage des demandes dans les tests unitaires de speech.

## Vérification du bouton visible et de la reprise

Le script sonore utilise de vrais clics sur `data-workshop-mute`, distinct du bouton Consigne. Chaque clic vérifie aussi `progress.muted` dans le profil actif du stockage local. Le complément `OCTO_QA_UI_ONLY=1` vérifie la sélection et la pose silencieuses, la persistance après rechargement, puis une nouvelle pose émettant de nouveaux échantillons après réactivation. Il ne dépend d’aucune temporisation de navigateur pour afficher l’état du bouton.

## Recette physique à compléter

Sur tablette Android/iPad : construire un appareil, écouter une consigne, couper le son pendant la lecture et pendant la fête de réussite ; vérifier le silence immédiat, attendre puis réactiver et demander une nouvelle consigne. Tester le capteur ou la pièce active au doigt ainsi que les commandes accessibles. Comparer pendule court/long et petites/grandes amplitudes. Aucune validation matérielle réelle n’est revendiquée par les tests Chrome.
