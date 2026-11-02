# Protocole de Test Tablette — MécanoKids 3D

> Version du 1er novembre 2026 — à utiliser avant le Lot C1 et le Lot V

---

## Appareils cibles

| Appareil | Pourquoi |
|:---|:---|
| **Android entrée de gamme** (ex. Samsung Galaxy Tab A, ~2020, 2 Go RAM) | Représente le parc scolaire et les familles budget |
| **iPad ancien** (ex. iPad 6e génération, 2018, ou iPad mini 4) | Représente le parc iPad scolaire |
| **Tablette 7"** si disponible | Cas limite d'écran petit |

---

## Préparation (à faire sur le PC avant d'aller sur tablette)

```bash
npm run build
# Vérifier que dist/ est créé sans erreur
npm run start:local-prod
# L'app tourne sur http://localhost:3000
```

Sur le même réseau Wi-Fi, accéder depuis la tablette à `http://<IP-du-PC>:3000`.

Pour trouver l'IP : `ipconfig` → "Adresse IPv4" de l'adaptateur Wi-Fi.

---

## Scénarios à tester (ordre fixe)

### S1 — Premier démarrage (enfant de 5 ans, non-lecteur)

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 1.1 | Ouvrir l'app | Chargement < 3 s sur Wi-Fi, < 8 s en 4G | | |
| 1.2 | Sélectionner un profil | Tap fonctionne, pas de double-tap accidentel | | |
| 1.3 | Choisir un véhicule (voiture simple) | Cartes visibles sans défilement ou défilement naturel au doigt | | |
| 1.4 | Voir la barre des pièces | Miniatures visibles, cartes ≥ 48 px, pas besoin de lire | | |
| 1.5 | Toucher une pièce pour la prendre | Barre se replie, pièce "en main" clairement indiquée | | |
| 1.6 | Poser la pièce au bon endroit | Snap visuellement évident, son de confirmation | | |
| 1.7 | Poser la pièce au mauvais endroit | Retour physique (rebond/vibration), PAS de texte d'erreur | | |
| 1.8 | Barre se rouvre après pose | Auto-scroll vers la prochaine pièce dispo | | |
| 1.9 | Terminer le véhicule | Animation de fin, félicitations audio | | |

### S2 — Glisser-déposer (drag & drop)

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 2.1 | Glisser une pièce (hold + drag) | Pas de scroll de page parasite pendant le glisser | | |
| 2.2 | Glisser lentement, doigt qui bouge peu | Pas de déclenchement du scroll navigateur | | |
| 2.3 | Glisser vers la zone 3D | Pièce suit le doigt avec latence < 50 ms | | |
| 2.4 | Relâcher sur un point de snap | Snap correctement, son + animation | | |
| 2.5 | Relâcher hors zone de snap | Retour à la position initiale, barre se rouvre | | |
| 2.6 | Interrompre le glisser (doigt 2) | Pas de crash, état cohérent | | |

### S3 — Navigation caméra 3D

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 3.1 | Rotation (1 doigt) | Rotation fluide, pas de scroll de page | | |
| 3.2 | Zoom (pinch 2 doigts) | Zoom en/out fluide | | |
| 3.3 | Pan (2 doigts glisser) | Déplacement de la caméra | | |
| 3.4 | Double-tap | Pas d'action non voulue (zoom navigateur supprimé ?) | | |

> **Point critique** : vérifier que `maximum-scale=1` est présent ou que le zoom navigateur ne déclenche pas sur double-tap dans la zone 3D.

### S4 — Barre des pièces : position et repli

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 4.1 | Changer position → Gauche | Barre latérale gauche, défilement vertical au doigt | | |
| 4.2 | Changer position → Droite | Barre latérale droite | | |
| 4.3 | Repli manuel (bouton H ou bouton barre) | Barre se replie, ne se rouvre pas automatiquement | | |
| 4.4 | Rouvrir manuellement | Barre réapparaît | | |
| 4.5 | Barre en position latérale : défilement | Molette / swipe vertical fonctionne | | |

### S5 — Espace Parents (Sas Parental)

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 5.1 | Ouvrir l'Espace Parents | Sas arithmétique s'affiche | | |
| 5.2 | Saisir la réponse sur clavier virtuel | Chiffres arabes orientaux acceptés si clavier arabe | | |
| 5.3 | Valider | Accès accordé | | |
| 5.4 | Tableau de bord STEM | Lisible, pas de texte tronqué | | |
| 5.5 | Générer un diplôme | PDF/PNG téléchargeable | | |

### S6 — Mode hors-ligne

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 6.1 | Couper le Wi-Fi après premier chargement | L'app continue de fonctionner | | |
| 6.2 | Recharger la page hors-ligne | Service Worker sert l'app | | |
| 6.3 | Jouer une partie complète hors-ligne | Aucune erreur réseau | | |

### S7 — Installation PWA

| # | Action | Résultat attendu | ✓/✗ | Note |
|:--|:---|:---|:--:|:---|
| 7.1 | Chrome Android : bannière "Ajouter à l'écran d'accueil" | Apparaît après ~30 s | | |
| 7.2 | Installer et lancer depuis l'icône | Lance en standalone (sans barre URL) | | |
| 7.3 | iPad Safari : "Partager → Sur l'écran d'accueil" | Fonctionne, orientation paysage | | |

---

## Grille d'observation enfant (à remplir pendant le test)

À observer sans intervenir, noter à voix basse :

| Moment | Observer | Note |
|:---|:---|:---|
| Choix de la première pièce | Cherche-t-il/elle plus de 5 s ? | |
| Première pièce en main | Comprend-il/elle où la poser ? | |
| Première pièce refusée | Réaction ? (frustration / essai autre endroit) | |
| Fin de véhicule | Réaction spontanée | |
| Position barre préférée | Bas / Gauche / Droite — laquelle il/elle choisit naturellement | |
| Auto-hide désactivé ? | L'enfant le désactive-t-il/elle ? | |

---

## Problèmes courants à surveiller

| Symptôme | Cause probable | Comment tester |
|:---|:---|:---|
| Scroll de page pendant drag | `touch-action` manquant | Glisser lentement en bas de l'écran |
| Zoom involontaire | Double-tap non bloqué | Double-taper sur le canvas |
| Cartes pièces trop petites | `min-h-[48px]` absent | Mesurer visuellement, pointer avec le doigt |
| Son absent | `AudioContext` bloqué avant geste | Vérifier si le premier tap débloque l'audio |
| Polices absentes hors-ligne | Workbox pas encore déclenché | Tester après un premier chargement connecté |
| Crash mémoire | Tablette < 2 Go RAM | Ouvrir 3-4 véhicules à la suite |

---

## Ce qu'on ne teste PAS maintenant

- Paiement (Lot V pas encore livré)
- Sync Cloud (Lot D2)
- Chromebook / Linux tablet
- Résolution > 1920px

---

## Après les tests

1. **Compléter cette grille** et la committer dans le dépôt
2. **Fixer les bugs bloquants** (crash, drag impossible, son absent) avant le contact écoles
3. **Fixer les valeurs par défaut** de `partsTrayPosition` et `partsTrayAutoHide` selon les observations des enfants
4. **Contacter 2-3 écoles ou clubs pilotes** avec un lien de démo sur le réseau local ou via ngrok
