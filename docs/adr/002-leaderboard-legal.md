# ADR 002 — Mise en conformité du classement (P0-LEGAL)

**Date :** 2026-11-03  
**Statut :** ✅ Décidé et implémenté le 2026-11-03

---

## Inventaire de ce qui est envoyé et stocké

### `/api/score` (server.ts:204)

Payload envoyé par le client :
```json
{ "blueprintId": "camion-pompiers", "profileName": "Mehdi", "timeMs": 42000, "date": "2026-11-03" }
```

- `profileName` : chaîne libre, 1–50 caractères, **saisie par l'enfant** (nom de profil local).
- `blueprintId`, `timeMs`, `date` : données non personnelles.

Ce champ `profileName` est **un pseudonyme libre saisi par l'enfant**, potentiellement son prénom réel. Il est transmis au serveur (Supabase via `adapter.postScore`) et stocké en base.

### `/api/leaderboard/:blueprintId` (server.ts:189)

Retourne jusqu'à 100 entrées `{ profileName, timeMs, date, blueprintId }` — le `profileName` de chaque joueur est **publiquement exposé** dans l'onglet « Mondial » de `SpeedLeaderboardModal`.

### `SpeedLeaderboardModal.tsx`

- Onglet **« Mondial »** : affiche `entry.profileName` en clair dans un tableau public.
- Onglets **locaux** (`stage_bests`, `all_runs`) : lisent uniquement `SpeedrunRecord` du localStorage, **aucun envoi réseau**.

### Problème légal

La règle produit (CLAUDE.md) interdit « pas de classement public nominatif » et « aucune donnée personnelle d'enfant côté serveur ». Or :
1. `profileName` (prénom potentiel d'un enfant) part vers le serveur.
2. Il est affiché dans un classement mondial accessible à tous les joueurs.

---

## Option (a) — Classement local uniquement

**Principe :** supprimer l'onglet « Mondial » et les appels réseau liés aux scores. Les records personnels restent dans le localStorage, par profil.

**Fichiers impactés :**

| Fichier | Modification |
|---|---|
| `src/components/SpeedLeaderboardModal.tsx` | Supprimer l'onglet « Mondial » (lignes 244–345), la prop `onlineEntries`, `onlineLoading` |
| `src/App.tsx` | Supprimer les appels `fetch('/api/leaderboard/…')` et `fetch('/api/score', …)` |
| `server.ts` | Supprimer (ou garder dormant) `GET /api/leaderboard/:id` et `POST /api/score` |
| `src/backend/types.ts` | Supprimer `getLeaderboard`, `postScore` de `BackendAdapter` |
| `src/backend/local.ts` | Supprimer l'implémentation correspondante |
| `src/backend/supabase.ts` | Supprimer l'implémentation correspondante |
| `src/utils/speedrun.ts` | Aucun changement (gère uniquement les records locaux) |

**Avantage :** Zéro donnée enfant côté serveur. Hors-ligne natif. Conforme RGPD/COPPA sans condition.  
**Inconvénient :** Perte de la feature « classement mondial ».

---

## Option (b) — Suppression complète du mode chronomètre

**Principe :** retirer `SpeedLeaderboardModal`, le mode chronomètre et tout le code associé.

**Fichiers impactés :** idem (a) + `src/utils/speedrun.ts`, `src/utils/TimedCompletionResult.tsx`, `src/components/TimedCompletionResult.tsx`.

**Avantage :** Supprime une surface de risque légal et de complexité.  
**Inconvénient :** Perd une feature appréciée des enfants de 8-12 ans (compétition avec soi-même).

---

## Recommandation

**Option (a) — Classement local uniquement.**

Le chronomètre et les records personnels ont de la valeur pédagogique (progrès, motivation). Les supprimer serait trop radical. Supprimer uniquement l'onglet « Mondial » et l'envoi réseau suffit à corriger le problème légal, en conservant l'expérience locale.

Si un classement multi-joueurs est souhaité plus tard, il devra passer derrière la porte parents avec consentement explicite et pseudonymisation côté serveur (jamais de `profileName` libre).

---

## 🧑 Décision attendue

- [ ] Valider l'option (a) ou choisir (b).

Aucune modification de code avant validation.
