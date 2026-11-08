# Généralisation des aventures et corrections enfant — 8 novembre 2026

## Déploiement préalable

La version `fbb9bd8` a été déployée et vérifiée sur https://octoglos.pages.dev avant ce développement (déploiement https://5f07f9e9.octoglos.pages.dev). Les nouveautés décrites ici n'ont pas été redéployées automatiquement.

## Catalogue et aventures

157 ateliers ont une activité dans la scène principale : 111 véhicules (8 familles), 4 ateliers portant les 9 défis scientifiques existants, 11 nouveaux essais scientifiques, 13 laboratoires, 6 montages avec visite/convoi/livraison, 4 mécanismes, 2 expériences de patrimoine et 6 ateliers mathématiques.

Les 17 aventures se recherchent et se filtrent par univers. Chaque étape distingue construction et essai réussi ; un résultat intermédiaire ne termine pas l'étape. Les anciennes observations sans preuve de réussite restent au carnet mais ne valident pas arbitrairement l'essai. Le bouton suivant suit l'aventure sélectionnée quand l'étape courante est réussie et l'étape suivante accessible.

Missions : livraison, navigation, vol, chantier, rover, satellite, lanceur et rail. Les conditions choisies changent le résultat et le montage construit bouge sur le plateau. L'activité chantier emploie une charge accessoire et déplace le montage entier ; elle n'articule pas chaque bras spécifique. Les modèles restent dans les limites du plateau, dimensionnés depuis leur boîte englobante.

La yourte compare les parois ouvertes/fermées face au vent. Le dôme montre des chemins de charge jusqu'aux appuis, à deux positions : illustration qualitative, pas mesure de résistance. Aucun second espace de jeu.

## Retours enfant

- L'aqueduc était en fin du catalogue et n'avait pas de bouton suivant. « Autre atelier » est désormais accessible à toute fin de montage, y compris au dernier atelier. Consigne et interrupteur sonore sont distincts et nommés.
- Le son utilise une sortie commune : effets, notes programmées, narration locale et voix native sont arrêtés/bloqués en sourdine. La réactivation n'entraîne pas la reprise d'anciens sons. Préférence conservée après rechargement.
- Cinq modèles ferroviaires dédiés : locomotives vapeur, locomotive historique, tramway, TGV et maglev. Les quatre trains classiques ont des essieux à deux roues en acier et une voie ferrée ; les locomotives ont chaudière et bielles. Le maglev possède des patins et une voie guidée sans fausses roues. Le décor routier est supprimé sur ces ateliers. Inventaires de 16 à 23 pièces. Les médailles existantes restent conservées ; les anciennes pièces devenues incompatibles sont filtrées par le stockage et le nouveau modèle peut être reconstruit.

## Validation

- `npm run lint`, `npm test` : 666 tests, 52 fichiers ; build isolé `build/qa-catalogue`.
- `test-workshop-continuation.mjs` : accès au suivant et au catalogue sur les 157 ateliers terminés (lots 1–63 puis 64–157), dont l'aqueduc et le dernier atelier. `test-adventure-continuation.mjs` : tablette, portique réussi puis pont levant de l'aventure, au lieu du prochain élément du catalogue.
- `test-vehicle-adventures.mjs` : 8 familles FR/EN/AR, conditions non remplies puis réussite, toucher réel du modèle, carnet et reset. EN avec mouvements réels et comparaison de pixels ; sortie pendant déplacement vérifiée. Revalidation finale du roulement ferroviaire en mouvement.
- `test-rail-workshops.mjs` : assemblages complets et départ/arrêt des quatre trains classiques en FR/EN ; maglev EN/AR, TGV profilé revalidé en FR. Géométries et rotation des roues testées.
- `test-science-discovery.mjs` : 33 parcours FR/EN/AR, essai non réussi puis objectif, changement visible des pixels, deux observations, style sans doublons ; ventilateur, pente et pendule aussi en mouvement réel.
- `test-heritage-discoveries.mjs` : six parcours FR/EN/AR, comparaison, réussite et reset.
- `test-workshop-mute.mjs` : analyse réelle des échantillons, mute par bouton visible, contexte recréé, MP3 retardé ; stockage, rechargement silencieux, sélection/pose silencieuses et nouveaux sons après réactivation en FR/EN/AR.
- `test-adventures-notebook.mjs` : 17 aventures FR/EN/AR, filtre/recherche, droits, construction distincte de réussite, persistance et unique canvas.
- Mathématiques : 18 assemblages, 297 pièces réellement posées et 54 défis FR/EN/AR, interactions 3D et équivalences. Rapport et sources officielles : `2026-11-08-mathematiques.md`.
- `test-maths-offline.mjs` : build de production hors ligne, rechargement, défi d'addition, observation dans le carnet et nouvelle piste audio pré-cachée.

## Limites et recette physique

Chrome avec émulation tactile ne remplace pas Android/iPad/Pixel réels. Le réagencement téléphone reste différé. Appliquer `TABLET_TEST_PROTOCOL.md` en gardant la palette toujours visible : construire, manipuler l'acteur, comparer la commande au bouton, couper le son pendant une lecture, changer de style et quitter pendant l'animation. Le bundle initial reste au-dessus du budget : environ 637 Ko gzip ; pré-cache environ 95 Mo. Le carnet reste local au profil et indépendant de l'export/import de progression existant.
