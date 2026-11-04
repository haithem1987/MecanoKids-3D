# ROADMAP V2 — Octo Gears · Nouveau cycle

> **Statut** : étude préparatoire — aucune tâche validée pour implémentation.
> Chaque tâche est à valider avant de démarrer. Cf. méthode de travail dans `CLAUDE.md`.

---

## Contexte

Toutes les tâches de `docs/ROADMAP.md` (P0 → Phase 4) sont cochées.
Ce document prépare le cycle suivant : **4 nouveaux univers** et **2 axes visuels** à explorer.

---

## Axe A — Nouveaux univers de jeu

Chaque univers suit la même structure que les univers existants :
- Fichier `src/data/fleet<Univers>.ts` avec `BlueprintSeed[]`
- Pièces (`PartShapeKind`) dans `src/types/game.ts`
- Géométries dans `src/three/`
- Contenu discovery trilingue FR/EN/AR

---

### A1 · Univers Électronique

**Concept** : assembler des circuits sur une platine d'essai. Les pièces sont des composants électroniques stylisés. Quand le circuit est complet, une LED s'allume ou un moteur tourne.

**Véhicules / modèles (exemples de seeds)**

| ID | Nom FR | Concept pédagogique |
|---|---|---|
| `elec-led-circuit` | Circuit LED | Courant, résistance, tension |
| `elec-motor-fan` | Ventilateur à moteur | Conversion électrique → mécanique |
| `elec-alarm-buzzer` | Alarme sonore | Capteur, interrupteur, buzzer |
| `elec-solar-toy` | Jouet solaire | Énergie photovoltaïque |
| `elec-radio-receiver` | Récepteur radio AM | Ondes, antenne, démodulation (tier 4-5) |

**Nouvelles formes de pièces à ajouter**

```ts
// src/types/game.ts — PartShapeKind
BREADBOARD       = 'breadboard',
RESISTOR         = 'resistor',
LED_COMPONENT    = 'led_component',
BATTERY_CELL     = 'battery_cell',
CAPACITOR        = 'capacitor',
WIRE_JUMPER      = 'wire_jumper',
MICRO_MOTOR      = 'micro_motor',
SOLAR_PANEL      = 'solar_panel',
```

**Spécificité mécanique** : validation par continuité de circuit (graphe de connexions), pas uniquement par position snap. À implémenter dans `src/hooks/useCircuitValidator.ts`.

**Couleurs de référence**

```
primaryColor:   #22c55e  (vert PCB)
secondaryColor: #1e3a2f  (fond platine)
accentColor:    #facc15  (LED jaune/or)
```

**Critères d'acceptation**
- [x] 5 seeds dans `src/data/fleetElectronique.ts` (LED, ventilateur, alarme, solaire, radio AM)
- [x] 8 `PartShapeKind` ajoutés (BREADBOARD…SOLAR_PANEL) — default branch les rend comme boîtes
- [x] Validation circuit dans `src/hooks/useCircuitValidator.ts` (graphe de dépendances, 4 tests)
- [x] Discovery trilingue FR/EN/AR avec explication du courant électrique
- [x] `npm run lint` et `npm test` passent (101 tests)

---

### A2 · Univers Aérospatiale

**Concept** : assembler des engins spatiaux — fusées, satellites, rovers. Accent sur les étages, l'orbite, la gravité.

**Véhicules / modèles**

| ID | Nom FR | Concept pédagogique |
|---|---|---|
| `space-sounding-rocket` | Fusée-sonde | Poussée, carburant solide, étages |
| `space-satellite-leo` | Satellite LEO | Orbite, panneaux solaires, antenne |
| `space-mars-rover` | Rover martien | Roues, bras articulé, énergie |
| `space-iss-module` | Module ISS | Arrimage, microgravité, habitabilité |
| `space-reentry-capsule` | Capsule de rentrée | Friction, bouclier thermique (tier 4) |

**Nouvelles formes de pièces**

```ts
ROCKET_BODY      = 'rocket_body',
ROCKET_NOZZLE    = 'rocket_nozzle',
FAIRING          = 'fairing',
SOLAR_WING       = 'solar_wing',
ANTENNA_DISH     = 'antenna_dish',
DOCKING_PORT     = 'docking_port',
HEAT_SHIELD      = 'heat_shield',
THRUSTER_POD     = 'thruster_pod',
```

**Couleurs de référence**

```
primaryColor:   #0ea5e9  (bleu ciel profond)
secondaryColor: #0f172a  (nuit spatiale)
accentColor:    #f97316  (flamme propulseur)
```

**Critères d'acceptation**
- [x] 5 seeds dans `src/data/fleetAerospatiale.ts`
- [~] Animation de lancement — réutilise l'animation SPACE existante (fall-through dans thematicEnvironment.ts)
- [~] Environnement 3D nuit étoilée — réutilise le pad orbital SPACE (fall-through, aucun changement nécessaire)
- [x] Discovery trilingue ; `discoveryAr` pour chaque seed
- [x] Budgets GPU respectés (aucun nouvel archetype = aucun asset supplémentaire)
> Fait : VehicleCategory.AEROSPACE ajouté, fleetAerospatiale.ts (5 seeds paliers 1-5), quizGenerator.ts mis à jour. Lint ✓ tests ✓.

---

### A3 · Univers Chimie

**Concept** : assembler des molécules et des appareils de laboratoire. Pièces = atomes et liaisons. Animation = vibration moléculaire.

> ⚠️ Univers délicat pour 6-10 ans : ne pas représenter de produits dangereux. Rester sur molécules simples (H₂O, CO₂, NaCl, CH₄) et matériel de labo bénin (bécher, pipette, balance).

**Modèles**

| ID | Nom FR | Concept pédagogique |
|---|---|---|
| `chem-water-molecule` | Molécule d'eau | Atomes, liaisons, angle tétraédrique |
| `chem-co2-molecule` | Molécule CO₂ | Liaisons doubles, gaz à effet de serre |
| `chem-salt-crystal` | Cristal de sel NaCl | Réseau ionique, ions |
| `chem-beaker-setup` | Bécher sur pied | Matériel de labo, sécurité |
| `chem-balance-scale` | Balance de précision | Masse, équilibre, unités (tier 3) |

**Nouvelles formes de pièces**

```ts
ATOM_HYDROGEN    = 'atom_hydrogen',
ATOM_OXYGEN      = 'atom_oxygen',
ATOM_CARBON      = 'atom_carbon',
ATOM_CHLORINE    = 'atom_chlorine',
BOND_SINGLE      = 'bond_single',
BOND_DOUBLE      = 'bond_double',
LAB_FLASK        = 'lab_flask',
LAB_STAND        = 'lab_stand',
```

**Spécificité mécanique** : valence de chaque atome contrainte (H=1, O=2, C=4). Validation = règle de valence satisfaite. À implémenter dans `src/hooks/useValenceValidator.ts`.

**Couleurs de référence**

```
primaryColor:   #a855f7  (violet molécule)
secondaryColor: #1e1b4b  (fond labo sombre)
accentColor:    #34d399  (vert sécurité)
```

**Critères d'acceptation**
- [ ] 5 seeds dans `src/data/fleetChimie.ts`
- [ ] Validation valence, pas uniquement snap positionnel
- [ ] Aucune représentation de produit dangereux ou réaction exothermique visible
- [ ] Discovery trilingue avec etymologie des noms d'éléments
- [ ] `npm run lint` et `npm test` passent

---

### A4 · Univers Physique

**Concept** : assembler des dispositifs de physique — pendules, leviers, plans inclinés, aimants, lentilles. Chaque assemblage démontre une loi.

**Modèles**

| ID | Nom FR | Concept pédagogique |
|---|---|---|
| `phys-pendulum` | Pendule de Foucault | Période, gravité, inertie |
| `phys-lever-class1` | Levier classe 1 | Point d'appui, bras de levier, travail |
| `phys-inclined-plane` | Plan incliné + chariot | Force, frottement, composantes |
| `phys-magnet-compass` | Boussole magnétique | Champ magnétique, pôles |
| `phys-prism-light` | Prisme optique | Réfraction, spectre (tier 4) |

**Nouvelles formes de pièces**

```ts
PENDULUM_ROD     = 'pendulum_rod',
PENDULUM_BOB     = 'pendulum_bob',
FULCRUM          = 'fulcrum',
LEVER_ARM        = 'lever_arm',
RAMP_SURFACE     = 'ramp_surface',
MAGNET_BAR       = 'magnet_bar',
COMPASS_NEEDLE   = 'compass_needle',
OPTICAL_PRISM    = 'optical_prism',
```

**Couleurs de référence**

```
primaryColor:   #f59e0b  (ambre physique)
secondaryColor: '#1c1917  (ardoise)
accentColor:    #60a5fa  (bleu onde)
```

**Critères d'acceptation**
- [ ] 5 seeds dans `src/data/fleetPhysique.ts`
- [ ] Animation physique déclenchée au succès (oscillation pendule, rotation levier)
- [ ] Discovery trilingue avec la loi physique associée
- [ ] `npm run lint` et `npm test` passent

---

## Axe B — Nouveaux styles visuels

Les styles visuels étendent `VisualStyleMode` dans `src/types/game.ts` et les matériaux dans `src/three/materials.ts`.

**État actuel de `VisualStyleMode`**

```ts
export enum VisualStyleMode {
  WOOD     = 'wood',       // createWoodGrainTexture()
  BLOCKS   = 'blocks',     // géométries cubifiées
  REALISTIC = 'realistic', // createBrushedMetalTexture()
}
```

---

### B1 · Style Comics / Cel-shading

**Concept** : contours noirs (outline shader), ombrage en aplats (toon ramp), couleurs vives saturées. Inspiré bande dessinée.

**Implémentation technique**

- Shader toon ramp dans `src/three/shaders/toonRamp.glsl` (3 niveaux d'ombre)
- Outline via `BackSide` mesh légèrement agrandi (technique standard three.js)
- Palette : saturation oklch ≥ 0.25, chroma élevée
- `VisualStyleMode.COMICS = 'comics'` à ajouter

**Couleurs de démo**

```
Carrosserie :  oklch(65% 0.28 30)   → rouge vif
Contour :      oklch(10% 0.00 0)    → noir
Ombre aplat :  oklch(45% 0.28 30)   → rouge sombre
```

**Critères d'acceptation**
- [x] `VisualStyleMode.COMICS` ajouté sans casser les guards switch existants
- [x] Au moins 1 seed existant peut être rendu en mode COMICS (`MeshToonMaterial` + outline BackSide dans `buildPartMeshGroup`)
- [ ] 60 i/s sur iPad 9 (toon shader < 0.5 ms GPU) — test manuel tablette requis
- [x] `prefers-reduced-motion` : outline BackSide statique, pas d'animation à désactiver

---

### B2 · Palette Vive (Vivid Color System)

**Concept** : ne pas créer un nouveau style mais enrichir les palettes des seeds existants et nouveaux. Couleurs oklch à chroma ≥ 0.20 et luminosité entre 55 % et 75 %.

**Travail concret**

Passer en revue les seeds dans `fleetLandSeaAir.ts` et `fleetConstructionSpace.ts` : remplacer les hex ternes (#64748b, #94a3b8, #e2e8f0) par des couleurs oklch vives.

Ajouter dans `src/data/colorPalettes.ts` (nouveau fichier, ≤ 60 lignes) :

```ts
export const VIVID_PALETTES = {
  coral:   { primary: 'oklch(65% 0.26 25)',  secondary: 'oklch(30% 0.15 25)',  accent: 'oklch(80% 0.18 85)' },
  teal:    { primary: 'oklch(60% 0.22 185)', secondary: 'oklch(25% 0.12 185)', accent: 'oklch(75% 0.20 55)' },
  violet:  { primary: 'oklch(60% 0.28 300)', secondary: 'oklch(25% 0.15 300)', accent: 'oklch(80% 0.22 90)' },
  lime:    { primary: 'oklch(70% 0.24 130)', secondary: 'oklch(30% 0.12 130)', accent: 'oklch(75% 0.20 60)' },
  amber:   { primary: 'oklch(70% 0.20 65)',  secondary: 'oklch(30% 0.10 65)',  accent: 'oklch(80% 0.22 25)' },
};
```

**Critères d'acceptation**
- [x] `src/data/colorPalettes.ts` créé, exporté, importé dans au moins un seed de chaque nouveau fichier fleet
- [x] Aucune dépendance CSS externe ajoutée (oklch natif dans les matériaux three.js via conversion hex)
- [x] `npm run lint` passe
> Fait : 7 seeds mis à jour (TGV, hydrogen semi, cargo plane, lunar rover, cargo ship, mega crawler, Mars rover). Palettes oklch définies dans colorPalettes.ts pour réutilisation dans les nouveaux fleet files.

---

### B3 · Style Blocs Modulaires (amélioration)

`VisualStyleMode.BLOCKS` existe. Ce ticket en améliore la lisibilité.

**Travail concret**

- Chanfreins (beveled edges) sur toutes les géométries BLOCKS (BoxGeometry → EdgesGeometry + LineSegments)
- Couleurs de face distinctes par axe (top/bottom vs sides), inspiré blocs LEGO
- Grille de snap visuellement plus marquée en mode BLOCKS

**Critères d'acceptation**
- [ ] Les 5 archétypes existants en mode BLOCKS affichent des chanfreins
- [ ] Pas de régression sur WOOD et REALISTIC
- [ ] `npm run lint` et `npm test` passent

---

### B4 · Style Maquette Réaliste (amélioration)

`VisualStyleMode.REALISTIC` existe avec `createBrushedMetalTexture`. Ce ticket ajoute des matériaux complémentaires.

**Travail concret**

Ajouter dans `src/three/materials.ts` :

```ts
// Peinture vernissée (voitures, avions)
export function createGlossyPaintTexture(baseHex: string, maxAnisotropy: number): THREE.MeshPhysicalMaterial

// Caoutchouc (pneus, joints)
export function createRubberTexture(maxAnisotropy: number): THREE.MeshStandardMaterial

// Plastique dépoli (pièces électroniques, intérieurs)
export function createMattePlasticTexture(baseHex: string): THREE.MeshStandardMaterial
```

**Critères d'acceptation**
- [ ] 3 nouvelles fonctions de texture, cachées comme `createWoodGrainTexture`
- [ ] Au moins 1 archétype existant utilise `createGlossyPaintTexture`
- [ ] GPU ≤ 150 Mo par véhicule maintenu
- [ ] `npm run lint` et `npm test` passent

---

## Axe C — Infrastructure catalogue

Pré-requis pour gérer 4 univers supplémentaires sans exploser `App.tsx`.

### C1 · Unification des fichiers blueprints (reprise de la note ROADMAP v1)

Les fichiers `blueprints.ts` et `englishBlueprints.ts` sont en doublon. Les 4 nouveaux fichiers fleet ne doivent pas reproduire ce pattern.

**Travail concret**
- Lire `src/data/blueprints.ts` et `englishBlueprints.ts`
- Migrer vers `BlueprintSeed` + `getLocalizedBlueprint()` (pattern déjà en place pour les seeds v1)
- Supprimer les deux fichiers doublon une fois migration vérifiée

**Critères d'acceptation**
- [ ] `blueprints.ts` et `englishBlueprints.ts` supprimés
- [ ] `getLocalizedBlueprint` couvre tous les véhicules existants
- [ ] Aucune régression sur `npm test`

### C2 · Sélecteur d'univers dans le catalogue

Le `StageCatalogModal` affiche tous les véhicules. Avec 4 univers de plus (~20 seeds), un filtre par univers est nécessaire.

**Travail concret**
- Ajouter un `VehicleCategory` pour chaque nouveau univers dans `src/types/game.ts`
- Filtres par catégorie dans `StageCatalogModal` (chips horizontaux, défilables)
- Mémoriser la catégorie sélectionnée dans le profil (localStorage)

**Critères d'acceptation**
- [x] `VehicleCategory.AEROSPACE` ajoutée (`aerospatiale`) — les 3 autres univers attendent A1/A3/A4
- [x] Chip de filtre Aérospatiale traduit FR/EN/AR dans `StageCatalogModal`
- [ ] Sélection persistée par profil (différé)

---

## Priorité recommandée

| Ordre | Tâche | Raison |
|---|---|---|
| 1 | **C1** (unification blueprints) | Bloque proprement l'ajout des nouveaux univers |
| 2 | **B2** (palette vive) | Rapide, améliore immédiatement tous les univers |
| 3 | **A2** (Aérospatiale) | Continuité naturelle de l'univers Air/Espace existant |
| 4 | **A1** (Électronique) | Fort intérêt pédagogique, nouveau type de validation |
| 5 | **C2** (sélecteur univers) | Nécessaire dès A1 ou A2 en prod |
| 6 | **B1** (Comics) | Différenciateur visuel fort, plus coûteux en shader |
| 7 | **A4** (Physique) | Recoupements avec le contenu existant (leviers, engrenages) |
| 8 | **A3** (Chimie) | Plus complexe (validation valence) |
| 9 | **B3/B4** (améliorations styles) | Polish, après les univers prioritaires |

---

## Contraintes produit rappelées

Toutes les règles de `CLAUDE.md` s'appliquent en particulier :

- Hors-ligne : tous les assets des nouveaux univers précachés dans le Service Worker
- Pas de donnée enfant : les seeds de validation (circuit, valence) restent 100 % côté client
- RTL : les noms arabes (`nameAr`, `subtitleAr`, `discoveryAr`) obligatoires sur chaque seed
- Budgets GPU : ≤ 150 Mo par véhicule, `dispose()` au changement

---

## Notes de test tablette

Pour chaque nouvel univers, ajouter dans `TABLET_TEST_PROTOCOL.md` :
- Snap positionnel à confirmer sur écran ≤ 10" (cibles ≥ 64 px pour tier 1-2)
- Fluidité 60 i/s iPad 9 / 30 i/s Android entrée de gamme
- Geste drag sur petites pièces (atomes, composants électroniques) : snap radius à calibrer
