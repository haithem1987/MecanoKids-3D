# Cahier des Charges & Spécifications — MécanoKids 3D

**MécanoKids 3D** est un jeu web éducatif accessible instantanément dans le navigateur où les enfants de **6 à 10 ans** assemblent pièce par pièce des véhicules mécaniques en 3D (**voitures, bateaux, avions et engins spéciaux**) à travers des stages de difficulté progressive, accompagnés d'une mascotte mécanicienne intelligente et de fiches découvertes sur les vrais véhicules du monde réel.

---

## 1. Objectifs & Principes Fondamentaux

- **Accessibilité Web Immédiate** : Jouable instantanément sur ordinateur et tablette tactile sans création de compte requise ; sauvegarde automatique de la progression dans le navigateur (`localStorage`).
- **Assemblage Pièce par Pièce** : Chaque véhicule est décomposé en sous-ensembles mécaniques logiques (châssis/coque/fuselage, propulsion, direction, cabine, équipements).
- **Mécanique Glisser-Déposer Aimantée** : L'enfant sélectionne et fait glisser une pièce vers le plateau 3D ; des silhouettes guides translucides indiquent les emplacements disponibles et attirent doucement la pièce lorsqu'elle est proche et que ses prérequis structurels sont remplis.
- **Courbe de Progression Graduelle (9 Stages, 3 Paliers)** :
  - **Palier 1 — Découverte (4 à 5 pièces)** : Citadine Solaire, Voilier d'Exploration, Monomoteur d'Aéroclub.
  - **Palier 2 — Atelier (7 à 8 pièces)** : Camion de Pompiers, Remorqueur Portuaire, Biplan Acrobatique.
  - **Palier 3 — Ingénieur (10 à 11 pièces)** : Bolide Formule Course, Navire Océanographique, Hélicoptère de Secours.

---

## 2. Les 3 Modes Visuels 3D Interchangeables en Temps Réel

L'enfant peut basculer à tout moment entre 3 univers esthétiques sans perdre son avancement :

1. **Jouet en Bois & Métal Peint (`wood`)** : Hêtre et érable à grain de bois procédural satiné, garde-boues et ailes en métal laqué coloré, ambiance d'établi d'artisan chaleureux.
2. **Blocs Modulaires (`blocks`)** : Briques de construction emboîtables à finition brillante (`clearcoat`), tenons cylindriques sur les surfaces supérieures et plateau à picots.
3. **Maquette Mécanique Réaliste (`realistic`)** : Aluminium brossé anisotrope, pneumatiques en gomme rainurée, verrières optiques translucides et éclairage studio technique à trois points.

---

## 3. Compagnon IA & Fiches Découvertes Vérifiées

- **Mascotte « Mécano Léo » (Chatbot Multi-Tours Gemini)** :
  - Propulsé côté serveur via `@google/genai` sans exposer de clé API au navigateur.
  - Connaît en temps réel le véhicule en cours, les pièces déjà montées et la prochaine pièce logique à poser.
  - Routage intelligent des modèles :
    - `gemini-3.1-flash-lite` pour les indices instantanés en un clic.
    - `gemini-3.8-flash` pour le dialogue pédagogique multi-tours (« Comment un bateau aussi lourd flotte-t-il ? », « À quoi sert l'aileron arrière ? »).
    - `gemini-4-argon` disponible en option pour les questions d'ingénierie approfondies.
- **Fiche Découverte Finale (Ancrage Google Search)** :
  - À la fin de chaque assemblage, le serveur interroge `gemini-3.8-flash` avec l'outil `googleSearch` pour présenter des faits réels, records et explications scientifiques vérifiées sur le véritable véhicule correspondant, accompagnés des liens sources web (`groundingChunks`).

---

## 4. Architecture Technique

- **Frontend** : React 19 + TypeScript + Tailwind CSS v4 + Three.js (modélisation 100 % procédurale multi-composants `THREE.Group`, `RoomEnvironment` PBR, détection `isSoftwareGl`, audio mécanique synthétisé via Web Audio API).
- **Ergonomie Spatiale** : Barre supérieure épurée en 3 zones, scène 3D centrale 100 % dégagée sans panneaux latéraux intrusifs, et dock inférieur rétractable regroupant le tiroir de pièces, la vue éclatée et les contrôles caméra.
- **Backend** : Serveur Express (`server.ts`) exposant `/api/mascot/chat` et `/api/discovery` et servant l'application Vite sur le port `3000`.
