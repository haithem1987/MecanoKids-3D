---
description: Prendre la prochaine tâche non cochée de docs/ROADMAP.md et l'exécuter
---

1. Lis `CLAUDE.md` et `docs/ROADMAP.md`.
2. Choisis la première tâche non cochée (`[ ]`), dans l'ordre P0 → Phase 0 → Phase 1 → etc. Si $ARGUMENTS est fourni, prends la tâche dont l'ID correspond (ex. `Q1`).
3. Si la tâche est marquée 🧑, prépare les options ou l'ADR demandé, puis **arrête-toi** et demande la décision. N'implémente rien.
4. Sinon :
   - explore les fichiers cités ;
   - annonce ton plan en 3 à 5 lignes ;
   - implémente ;
   - ajoute ou mets à jour les tests ;
   - lance `npm run lint` et `npm test`.
5. Vérifie chaque critère d'acceptation (CA) un par un. Si l'un d'eux exige un test manuel sur tablette, écris la procédure exacte à suivre.
6. Coche la tâche dans `docs/ROADMAP.md` avec une ligne de résumé, puis propose un message de commit Conventional Commits. Ne committe pas sans accord.
