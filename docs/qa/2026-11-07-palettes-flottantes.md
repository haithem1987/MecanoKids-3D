# Palettes flottantes persistantes — 7 novembre 2026

## Retour pris en compte

Le dock à ouvrir/réduire et l’auto-rétraction sont retirés. La première proposition de grille et de dock consommait trop d’espace et imposait des actions répétées pour sélectionner puis poser une pièce.

## Fonctionnement actuel

- `WorkshopHud.tsx` remplace `BottomPartsDock.tsx` et `WorkshopToolbar.tsx`.
- `PartsTray.tsx` est une palette flottante persistante, déplaçable au début ou à la fin de la ligne. Les pièces ne disparaissent ni à la prise, ni à la pose, ni lors d’un changement de vue.
- Les quatre vues, le recentrage, Annuler et la lecture vocale flottent sur le côté opposé. Les cibles mesurent au moins 64 px.
- Les réglages secondaires sont dans un menu indépendant : style, transparence, environnement, vue éclatée, son, lecture automatique, réparation et sauvegarde. Ce menu ne recouvre pas la palette ; il se ferme automatiquement quand on prend une pièce ou clique ailleurs.
- La scène conserve toute la hauteur disponible. Le cadrage tient compte des palettes sans réduire le canvas. La cible de pose reste dans la zone dégagée ; changer de vue avec une pièce en main conserve cette cible.
- Les vignettes suivent la géométrie et les proportions des pièces en FR/EN/AR. Les anciennes heuristiques liées aux mots français ne déterminent plus les vignettes des nouveaux composants.
- Le bouton vocal lit la pièce choisie ou la prochaine pièce disponible, même avec la lecture automatique désactivée. Les sons sont disponibles localement.
- Les fichiers et le raccourci de rétraction H ont été supprimés ; la règle de palette persistante est inscrite dans `CLAUDE.md`.

## Vérifications

- `scripts/test-floating-workshop.mjs` : château 61 pièces sur téléphone 430×900 EN ; aqueduc 58 sur tablette 1024×768 AR ; tour solaire 59 sur ordinateur 1280×800 FR ; portique 45 sur tablette portrait 768×1024 FR. Soit 223 poses avec palette constamment visible, aucune ouverture/réduction, canvas stable, changement de côté et des quatre vues, y compris une vue changée avec une pièce en main. Glisser-déposer souris exercé sur la tour solaire.
- `scripts/test-workspace-layout.mjs` : quatre formats, deux côtés ; les palettes et les réglages ne se chevauchent pas, la cible est libre et le canvas garde sa taille.
- `scripts/test-science-challenges.mjs` : neuf défis joués en 3D puis rejoués au clavier dans chaque langue.
- `scripts/test-virtual-labs.mjs` : treize laboratoires assemblés et essais réussis dans chacune des trois langues ; toucher simulé EN/AR.
- `scripts/test-manual-workshop-audio.mjs` : lecture vocale manuelle FR/EN/AR avec lecture automatique désactivée et sans voix du navigateur. Vérification du démarrage effectif d’un buffer audio local non silencieux.
- Types stricts : `npm run lint`. Tests unitaires : `npm test` (580 tests au dernier passage).
- Build de contrôle isolé : `build/qa-palettes-flottantes`. Aucun déploiement associé à cette correction.

## Test tablette à reprendre avec les enfants

Selon `TABLET_TEST_PROTOCOL.md`, les essais navigateur ne remplacent pas les appareils physiques. Vérifier le confort du nouveau cadrage, la sélection continue des pièces au doigt, les vues caméra avec une pièce sélectionnée, la rotation de l’écran et le glisser-déposer. L’essai n’exige plus de fermer une palette pour pouvoir poser une pièce.

Serveur local : `http://127.0.0.1:7302/?admin=1`.
