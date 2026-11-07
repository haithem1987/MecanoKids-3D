# Téléphone et missions — 7 novembre 2026

Checkpoint préalable : `0837dec`, poussé sur `codex/corrections-qualite-ateliers` et déployé sur https://octoglos.pages.dev. Les adaptations suivantes sont locales.

## Interface

Ruban de pièces permanent inférieur en portrait, palette compacte latérale en paysage. Balayage natif sans sélectionner de pièce. Commandes Vue, Annuler, Écouter et Réglages séparées. Le cadrage tient compte des espaces occupés.

Panneau commun aux laboratoires, défis et essais : réglages paginés, action principale disponible sans défilement vertical, fermeture des réglages au lancement pour observer la scène. Les informations longues sont séparées dans Infos. PC et tablette conservent leurs palettes flottantes.

La première mesure du cadrage attend une frame pour éviter d'appeler le réveil du rendu avant son initialisation.

## Tests

- `scripts/test-smartphone-missions.mjs` : 320×568 FR, 390×844 EN, 430×932 AR, 667×375 FR, 568×320 EN, 915×412 AR, 768×1024 FR, 1280×800 EN. Bouton Tester visible, cible ≥64 px, centre dégagé, résultat Venturi atteint sans défilement vertical.
- `scripts/test-smartphone-swipe.mjs` : balayage tactile FR/AR et rotation, aucune sélection accidentelle.
- `scripts/test-science-challenges.mjs` : neuf défis FR/EN/AR dans la scène, puis commandes accessibles et retour au montage.
- `scripts/test-virtual-labs.mjs` : assemblages et essais des treize laboratoires FR/EN/AR. Audio exclu de cette passe ; moteur vocal inchangé.
- Assemblages tactiles et essais : moulin 59 pièces, tour solaire 59, aqueduc 58 et pont levant 48 via `scripts/test-heritage-workshops.mjs`.
- `npm run lint`, `npm test` : 581 tests. Build isolé dans `build/qa-smartphone`.

Chrome avec émulation tactile : validation sur téléphones physiques encore nécessaire. Bundle initial toujours au-dessus du budget : environ 587 Ko gzip.
