# MécanoKids 3D — Atelier d'Assemblage Mécanique Interactif

**MécanoKids 3D** est un jeu web éducatif accessible instantanément dans le navigateur où les enfants de 6 à 10 ans assemblent pièce par pièce des véhicules mécaniques en 3D (voitures, bateaux, avions et engins spéciaux) à travers des stages de difficulté progressive, accompagnés d'une mascotte mécanicienne intelligente et de fiches découvertes sur les vrais véhicules du monde réel.

---

## Validation Utilisateur & Décisions Clés

> [!IMPORTANT]
> Ce document constitue le **plan de spécifications complet** avant toute implémentation de code. Dès votre validation pour lancer le développement (ou lors de la connexion à votre dépôt GitHub), ce cahier des charges sera également enregistré sous forme de document Markdown versionné à la racine du projet afin d'être sauvegardé directement sur GitHub.

- **Public cible confirmé** : **Enfants de 6 à 10 ans** avec une courbe de progression graduelle (de 4 pièces simples au début jusqu'à 12 pièces techniques articulées dans les niveaux avancés).
- **Mécanique d'assemblage confirmée** : **Glisser-déposer aimanté sur silhouettes guides 3D**, combinant manipulation spatiale intuitive (souris et tactile) et validation de l'ordre logique de montage (châssis avant roues, fuselage avant ailes).
- **Direction artistique confirmée** : **Les 3 modes visuels intégrés et commutables à tout moment** (Jouets en Bois & Métal Peint, Blocs Modulaires à tenons, Maquettes Mécaniques Miniatures Réalistes).
- **Compagnon IA & Savoir confirmés** : **Mascotte d'atelier conversationnelle** (indices progressifs et réponses aux « pourquoi » mécaniques) + **Fiche Découverte Finale** enrichie par Google Search avec anecdotes réelles et sources vérifiées à la fin de chaque construction.

> [!NOTE]
> **Routage des modèles Gemini** : Les discussions générales avec la mascotte et les recherches Google Search utilisent `gemini-3.8-flash`, et les indices éclairs en cours de partie utilisent `gemini-3.1-flash-lite` (fonctionnels immédiatement sans configuration supplémentaire). Un mode d'explication approfondie d'ingénierie pourra mobiliser `gemini-4-argon` (nécessitant une clé API avec facturation activée si sollicité).

---

## 1. Vue d'Ensemble & Concept Cœur

- **Ce que fait l'application** : Le joueur entre dans un atelier 3D interactif lumineux, choisit un stage débloqué parmi trois grandes familles mécaniques (**Terre / Voitures**, **Mer / Bateaux**, **Air / Avions**), puis assemble un véhicule pièce par pièce. Toutes les pièces détachées sont présentées dans un établi inférieur ; l'enfant les saisit et les approche du modèle central où des silhouettes translucides guident le montage. Une fois la dernière pièce fixée, le véhicule s'anime (phares qui s'allument, roues qui tournent, hélice qui fend l'air, flottaison sur l'eau) et débloque à la fois le stage suivant et une fiche découverte illustrant le fonctionnement du véritable engin.
- **Public Cible & Ergonomie (6–10 ans)** :
  - *6–7 ans (Apprentis Mécanos)* : Gros points d'accroche, silhouettes très lisibles, tolérance d'aimantation généreuse, vocabulaire accessible et consignes courtes.
  - *8–10 ans (Jeunes Ingénieurs)* : Sous-ensembles mécaniques plus nombreux (moteur, transmission, gouvernail, train d'atterrissage, rotors), respect strict de la séquence structurelle (impossible de poser le capot avant d'avoir installé le bloc moteur) et tolérance d'aimantation plus précise.
- **Valeur Pédagogique & Ludique** : Développe le repérage dans l'espace 3D, la logique séquentielle d'ingénierie (structure porteuse → propulsion → direction → habillage) et la curiosité scientifique grâce au lien direct entre le jouet construit et les vraies machines du quotidien.

### Progression des Stages et Catalogue Mécanique Initial

| Palier | Difficulté | Exemples d'Objets à Construire | Nombre de Pièces | Règles Mécaniques Introduites |
| :--- | :--- | :--- | :--- | :--- |
| **Palier 1 — Découverte** | Facile | Citadine Compacte · Petit Voilier · Avion Monomoteur | 4 à 5 pièces | Aimantation large, toutes les silhouettes visibles, ordre libre sur le châssis principal |
| **Palier 2 — Atelier** | Intermédiaire | Camion de Pompiers · Bateau Remorqueur · Biplan Acrobatique | 6 à 8 pièces | Montage séquentiel par couches (châssis → essieux/moteur → cabine/ailes), pièces symétriques |
| **Palier 3 — Ingénieur** | Avancé | Bolide de Course · Navire d'Exploration · Hélicoptère de Secours | 9 à 12 pièces | Sous-mécanismes internes requis avant carénage, aimantation précise, silhouettes affichées par étape active |

---

## 2. Expérience Utilisateur & Design Visuel

### Parcours Utilisateur Pas à Pas

1. **Arrivée sur la Carte de l'Atelier (Zéro friction)** : Page web accessible immédiatement sans inscription obligatoire. L'enfant découvre la progression des stages sous forme de parcours d'établi clair (Terre, Mer, Air), visualise ses étoiles gagnées et choisit librement son style visuel parmi les 3 modes.
2. **Entrée dans un Stage de Construction** : La caméra 3D plonge doucement vers le plateau tournant de l'établi. L'objectif du véhicule s'affiche brièvement en aperçu complet, puis se sépare avec un mouvement fluide pour laisser place au socle d'assemblage et aux pièces rangées dans le tiroir inférieur.
3. **Assemblage Pièce par Pièce** :
   - L'enfant fait tourner la caméra librement autour du modèle pour observer les emplacements sous tous les angles.
   - Lorsqu'il saisit une pièce du tiroir inférieur, la rotation caméra se verrouille automatiquement pour garantir un glisser-déposer stable.
   - En approchant la pièce de la bonne silhouette guide, celle-ci s'illumine avec une icône de validation (`✓ Prêt à fixer`) et attire doucement la pièce comme un aimant.
   - Si une pièce dépend d'une autre non encore montée (ex. poser l'hélice avant le nez du moteur), la pièce regagne souplement le tiroir avec une bulle bienveillante indiquant quelle base installer d'abord.
4. **Célébration Mécanique & Test Interactif** : Dès la dernière pièce assemblée, le véhicule prend vie en 3D (rotation des roues, battement des pales, sillage marin procédural, essai d'ouverture/vue éclatée).
5. **Fiche Découverte Réelle & Passage au Niveau Suivant** : Un panneau affiche 3 faits fascinants et vérifiés via Google Search sur le vrai véhicule correspondant (vitesse record, invention historique, principe physique expliqué simplement), avec possibilité de poser des questions à la mascotte ou de lancer immédiatement le stage suivant plus complexe.

### Identité Visuelle & Les 3 Modes Artistiques Temps Réel

L'interface respecte la règle **60-30-10** pour laisser le véhicule 3D au centre absolu de l'attention :
- **60 % Canevas Dominant (`--background`)** : Scène d'atelier lumineuse et apaisante (`#F4F6F9` en ambiance claire d'atelier de jour, avec dégradé d'horizon doux sans éblouissement).
- **30 % Surfaces Structurelles (`--surface`)** : Panneaux de contrôle sobres (`#FFFFFF` avec bordures fines `#E2E8F0`), garantissant une lisibilité maximale AA sans flou transparent coûteux au-dessus du canevas WebGL.
- **10 % Budget d'Accents Fonctionnels (`--primary` / `--accent`)** : Bleu Atelier (`#0284C7`) pour les actions principales, Ambre Mécanique (`#D97706`) pour les indices et étapes actives, Émeraude (`#059669`) toujours associé à une icône et un texte explicite pour la validation d'ancrage.

#### Sélecteur des 3 Modes de Rendu 3D (Commutable à la volée)
1. **Mode « Bois & Métal Peint »** : Rendu chaleureux inspiré des jouets d'artisanat ; hêtre et érable aux veines procédurales satinées (`roughness: 0.65`), garde-boues et ailes en tôle laquée colorée (`roughness: 0.25`, `metalness: 0.35`), plateau d'établi en bois clair.
2. **Mode « Blocs Modulaires »** : Esthétique jeu de construction emboîtable ; surfaces ABS lustrées à vernis brillant (`clearcoat: 1.0`, `roughness: 0.15`), tenons cylindriques procéduraux sur les arêtes supérieures, couleurs primaires franches et socle quadrillé à picots.
3. **Mode « Maquette Mécanique Réaliste »** : Rendu miniature d'ingénierie ; aluminium brossé anisotrope (`metalness: 0.9`, `roughness: 0.2`), pneumatiques en gomme mate rainurée (`roughness: 0.85`), verrières de cockpit translucides (`MeshPhysicalMaterial`), éclairage studio de précision à trois points.

### Typographie, Ergonomie Spatiale & Retours Sensoriels

- **Hiérarchie Typographique (Règle 2+1)** :
  - *Titres & Noms de Véhicules* : `Outfit` (SemiBold/Bold, formes géométriques rondes et chaleureuses très lisibles pour les 6–10 ans, équilibrage des lignes `text-wrap: balance`).
  - *Interface, Bulles Mascotte & Fiches Découvertes* : `Plus Jakarta Sans` (15–16 px, interlignage aéré 1.6).
  - *Compteurs de Pièces & Numéros de Stages* : `JetBrains Mono` en chiffres tabulaires (`tabular-nums`, ex. `Pièces : 4 / 7`).
- **Contrat de Barre Supérieure Épurée (3 Zones)** :
  1. Marque à gauche (`MécanoKids 3D`, une seule ligne).
  2. Sélecteur central épuré sur une ligne : Navigation `Stages`, commutateur des `3 Styles Visuels` et bouton `Vue Éclatée`.
  3. Action principale à droite (`Demander un indice` ouvrant le compagnon Mécano Léo).
- **Zéro Occlusion de la Scène 3D** : Aucun panneau flottant sur les flancs gauche ou droit ne vient masquer l'objet 3D. Le tiroir de pièces détachées et les contrôles caméra sont regroupés dans un **dock inférieur rétractable** centré en bas de l'écran, laissant le centre 100 % libre pour manipuler le véhicule.
- **Audio Mécanique 100 % Procédural (Web Audio API)** : Bruitages synthétisés sans fichiers externes (clic boisé mat en mode Bois, « clac » plastique franc en mode Blocs, cliquetis métallique de clé à cliquet en mode Maquette, plus petit carillon harmonique de réussite). Fonction muet accessible en un clic.

---

## 3. Décisions Produit & Arbitrages Techniques

- **Décision 1 : Modélisation 3D 100 % Procédurale Multi-Composants + Bibliothèque PBR Triple Mode**
  - *Approche retenue* : Chaque véhicule est construit comme un assemblage hiérarchique (`THREE.Group`) de 4 à 12 pièces distinctes sculptées par géométries paramétriques (`ExtrudeGeometry` avec biseaux doux, `LatheGeometry` pour hélices/coques/roues, `TubeGeometry` pour arceaux/échappements), habillées dynamiquement par l'un des 3 profils de matériaux physiques.
  - *Pourquoi* : Zéro fichier `.glb` ou texture externe susceptible d'échouer au chargement (zéro erreur 404), démarrage instantané sur n'importe quelle connexion scolaire ou domestique, et changement immédiat entre les 3 styles visuels sans recharger la scène.
  - *Alternative écartée* : Modèles 3D externes pré-téléchargés (lourds, figés dans un seul style artistique et difficiles à découper proprement pièce par pièce).

- **Décision 2 : Glisser-Déposer 3D Assisté par Projection Intelligente et Magnétisme Adaptatif**
  - *Approche retenue* : Lorsqu'un enfant fait glisser une pièce depuis le dock ou dans la scène, le pointeur est projeté sur un plan de travail face à la caméra et attiré par interpolation exponentielle douce (`THREE.MathUtils.damp`) dès qu'il entre dans le rayon de capture du point d'ancrage cible.
  - *Pourquoi* : Le déplacement libre sur 3 axes (X, Y, Z simultanés) est souvent frustrant pour un enfant de 6 à 10 ans sur un écran 2D. Le magnétisme guidé sur silhouettes offre la satisfaction tactile du vrai montage 3D tout en éliminant les erreurs de profondeur de caméra.
  - *Alternative écartée* : Gizmos de transformation CAO à 3 flèches (trop techniques pour des enfants de 6 ans).

- **Décision 3 : Accès Web Instantané sans Compte + Sauvegarde Locale & Proxy Serveur IA**
  - *Approche retenue* : Progression des stages, étoiles et préférence de mode visuel enregistrées automatiquement dans le navigateur (`localStorage`), couplées à un serveur Express léger gérant exclusivement les appels `@google/genai` (Mascotte & Google Search).
  - *Pourquoi* : Respecte l'objectif d'une page web immédiatement jouable sans barrière d'inscription pour les enfants, tout en protégeant strictement la clé API Gemini côté serveur.

---

## 4. Architecture Technique & Stratégie de Données

### Schéma d'Architecture Système & Hiérarchie des Composants

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        INTERFACE WEB CLIENT (Navigateur)                     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Barre Supérieure (3 Zones) : Marque │ Stages · 3 Styles · Éclaté │ IA  │  │
│  └───────────────────────────────────┬────────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────▼────────────────────────────────────┐  │
│  │                   MOTEUR SCÈNE 3D (Three.js / WebGL)                   │  │
│  │  ┌─────────────────────┐  ┌────────────────────┐  ┌─────────────────┐  │  │
│  │  │ Générateur Pièces   │  │ Système Raycaster  │  │ Studio Lumière  │  │  │
│  │  │ Procédurales (4–12) │  │ & Magnétisme 3D    │  │ + 3 Modes PBR   │  │  │
│  │  └─────────────────────┘  └────────────────────┘  └─────────────────┘  │  │
│  └───────────────────────────────────┬────────────────────────────────────┘  │
│                                      │                                       │
│  ┌───────────────────────────────────▼────────────────────────────────────┐  │
│  │     Dock Inférieur Rétractable : Tiroir de Pièces 3D & Caméra/Audio    │  │
│  └──────────────────┬──────────────────────────────────┬──────────────────┘  │
│                     │                                  │                     │
│  ┌──────────────────▼─────────────────┐  ┌─────────────▼──────────────────┐  │
│  │ Tiroir Mascotte « Mécano Léo »     │  │ Modale Fin de Stage & Fiche    │  │
│  │ (Fil de discussion multi-tours)    │  │ Découverte (Faits + Sources)   │  │
│  └──────────────────┬─────────────────┘  └─────────────┬──────────────────┘  │
└─────────────────────┼──────────────────────────────────┼─────────────────────┘
                      │ POST /api/mascot/chat            │ POST /api/discovery
                      ▼                                  ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     SERVEUR D'APPLICATION (Express API)                      │
│                                                                              │
│  ┌────────────────────────────────────┐  ┌────────────────────────────────┐  │
│  │ Contrôleur Chat Multi-Tours        │  │ Contrôleur Fiche Découverte    │  │
│  │ • Indices rapides (3.1-flash-lite) │  │ • Modèle : gemini-3.8-flash    │  │
│  │ • Dialogue atelier (3.8-flash)     │  │ • Outil : googleSearch activé  │  │
│  │ • Garde-fous sécurité enfant       │  │ • Extraction groundingChunks   │  │
│  └────────────────────────────────────┘  └────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Modèle de Données & État du Jeu

- **Catalogue de Modèles (`Blueprint`)** : Identifiant, catégorie (`voiture`, `bateau`, `avion`), niveau de difficulté (1 à 3), titre français, description mécanique courte, et liste ordonnée de **Pièces (`PartSpec`)**.
- **Spécification d'une Pièce (`PartSpec`)** : Identifiant, nom pédagogique (ex. *Châssis porteur*, *Essieu avant*, *Coque centrale*, *Aile principale*, *Hélice tripale*), générateur géométrique, position/rotation cible d'ancrage, liste des prérequis (`dependsOn` : pièces devant être montées avant celle-ci), rayon de tolérance magnétique et type d'animation finale (rotation continue, oscillation, éclairage).
- **État de Partie & Persistance (`GameState`)** :
  - Stage actif, liste des pièces déjà assemblées, pièce actuellement saisie, mode visuel actif (`wood` | `blocks` | `realistic`), angle d'éclatement d'inspection (`0` à `1`), état audio.
  - Progression persistée dans `localStorage` : stages débloqués, meilleur score/étoiles par véhicule, collection de fiches découvertes déjà déverrouillées.

### Cartographie des Interactions & Transitions d'État

| Composant / Zone | Action de l'Enfant | Transition d'État & Comportement Système |
| :--- | :--- | :--- |
| **Sélecteur de Stages** | Clic sur un véhicule débloqué | Réinitialise le plateau 3D, génère les pièces détachées du nouveau plan, centre la caméra avec amortissement fluide et met à jour le contexte de la mascotte. |
| **Commutateur des 3 Modes** | Bascule `Bois` / `Blocs` / `Maquette` | Remplace instantanément les matériaux PBR, textures procédurales et ornements (tenons/rivets) sur toutes les pièces posées et restantes sans perdre l'avancement du montage. |
| **Tiroir de Pièces & Scène 3D** | Glisser-déposer d'une pièce vers le modèle | Désactive `OrbitControls` pendant le glissement ; projette la pièce en 3D ; si les prérequis sont remplis et la distance `< rayon d'aimantation`, aimante et verrouille la pièce avec son + animation ressort ; sinon retour souple au tiroir avec explication visuelle. |
| **Curseur Vue Éclatée** | Glissement du curseur (une fois construit ou en aide) | Écarte ou rapproche progressivement les pièces le long de leurs vecteurs normaux d'assemblage via amortissement exponentiel pour comprendre l'intérieur du mécanisme. |
| **Mascotte Mécano Léo** | Clic sur « Indice » ou envoi d'une question | Envoie l'historique de conversation + l'état exact du montage (pièces posées vs restantes) au serveur ; affiche la réponse adaptée aux 6–10 ans dans un fil déroulant et met en surbrillance la zone utile. |
| **Victoire de Stage** | Pose de la toute dernière pièce | Déclenche l'animation mécanique complète du véhicule, sauvegarde le déblocage du stage suivant et charge en arrière-plan la Fiche Découverte Google Search avec liens sources cliquables. |

### Séquences Techniques Clés & Performance 3D

1. **Rendu 3D Fluide & Compatibilité Tous Écrans** : Initialisation unique du canevas WebGL dans un conteneur dédié avec environnement de reflets studio procédural (`RoomEnvironment` + `PMREMGenerator`), détection automatique du rendu logiciel (`isSoftwareGl`) pour ajuster la densité de pixels et cadencer proprement les rafraîchissements sans jamais altérer la richesse des modèles.
2. **Sécurité & Pertinence Enfants côté IA** : Instruction système stricte sur le serveur Express imposant un ton enthousiaste, bienveillant, en français clair adapté aux 6–10 ans, centré exclusivement sur la mécanique, la physique amusante, l'histoire des transports et l'aide au montage.
3. **Ancrage Factuel Google Search (`googleSearch`)** : À la complétion d'un véhicule, le serveur interroge `gemini-3.8-flash` avec l'outil `googleSearch` pour récupérer des faits réels vérifiés sur l'engin assemblé, extrait systématiquement les URLs de `groundingMetadata.groundingChunks` et les affiche proprement au bas de la fiche éducative pour les parents et jeunes curieux.
