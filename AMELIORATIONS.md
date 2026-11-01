# Feuille de Route & Idées d'Améliorations — MécanoKids 3D

Ce document recense les évolutions conçues et intégrées dans **MécanoKids 3D** tout en préservant son architecture **100 % locale, fluide (60 FPS WebGL), trilingue (FR · EN · العربية) et sans dépendance cloud**.

---

## Statut Global de la Feuille de Route

- [x] **Axe 1** — Immersion & Manipulation 3D Avancée *(Implémenté)*
- [x] **Axe 2** — Créativité & Personnalisation d'Atelier *(Implémenté)*
- [x] **Axe 3** — Nouveaux Défis Pédagogiques & Modes de Jeu *(Implémenté)*
- [x] **Axe 4** — Confort Familial, Accessibilité Vocale & Mode Hors-Ligne PWA *(Implémenté)*

---

## Axe 1 — Immersion & Manipulation 3D Avancée (Implémenté)

1. **Mode « Essai Dynamique 3D » après l'assemblage**
   - Une fois un véhicule terminé à 100 %, l'enfant peut l'animer en temps réel dans son élément :
     - **Route, Rail & Chantier** : mise en rotation des roues/essieux, allumage des faisceaux de phares et gyrophares, défilement dynamique des marquages de piste.
     - **Mer & Abysses** : tangage et roulis réalistes sur une houle 3D animée, hélices en rotation et anneaux de sillage.
     - **Air & Espace** : mise en rotation rapide des rotors/turbines, sustentation et inclinaison de vol stationnaire, panache plasma animé sous les tuyères spatiales.
2. **Mode « Rayons X / Coupe Technique »**
   - Bouton dédié sur l'établi rendant automatiquement la carrosserie, la coque, la cabine ou la coiffe externe semi-transparente (`opacity: 0.22`) tout en conservant le châssis, le moteur, les essieux et les pièces rares Or 24K parfaitement nets et opaques.
3. **Environnements d'Établi Thématiques**
   - Plateau 3D adaptatif selon la famille mécanique active : circuit d'essai bitumé à vibreurs, bassin portuaire à bouées, tarmac d'aérodrome avec manche à air, dalle de chantier balisée de cônes, ou pas de tir orbital avec mâts ombilicaux (commutable à tout moment avec le mode Studio classique).

---

## Axe 2 — Créativité & Personnalisation d'Atelier (Implémenté)

1. **Cabine de Peinture & Finitions Personnalisées**
   - 8 finitions d'atelier (*Série d'Origine*, *Rouge Pompier*, *Bleu Course*, *Jaune Chantier*, *Vert Émeraude*, *Titane Brossé*, *Orange Solaire*, *Indigo Spatial*) mémorisées individuellement par véhicule dans chaque profil tout en préservant l'éclat des pièces rares en Or 24K.
2. **Studio Photo / Carte Postale 3D**
   - Capture synchrone haute résolution du canvas WebGL assemblée hors-ligne sur un canevas `1200×820` en carte postale souvenir (nom du véhicule, prénom du profil constructeur, finition choisie, étoiles, sceau Brevet d'Ingénieur et meilleur chrono), téléchargeable en un clic au format `.png`.
3. **Garage Personnel (« Ma Vitrine 3D »)**
   - Galerie interactive accessible depuis la barre supérieure regroupant tous les véhicules construits (avec aperçu de livrée, distinctions obtenues, chargement direct sur l'établi ou lancement immédiat en Essai 3D) ainsi que le coffre des 7 pièces rares en alliage d'or 24K.

---

## Axe 3 — Nouveaux Défis Pédagogiques & Modes de Jeu (Implémenté)

1. **Mode « Maître Sans Silhouette » (Difficulté Grand Ingénieur)**
   - Option masquant les silhouettes guides translucides pendant la construction : l'enfant déduit l'ordre et la position mécanique des pièces (avec confirmation magnétique uniquement à très courte portée) et décroche la distinction *Maître sans silhouette*.
2. **Mini-Quiz Mécanique Express (3 questions)**
   - Quiz trilingue de 3 questions généré hors-ligne pour chaque véhicule terminé (avec support de lecture vocale Web Speech API), décernant un **« Brevet d'Ingénieur »** permanent dès 2 bonnes réponses sur 3.
3. **Mode « Diagnostic & Réparation »**
   - Mode d'atelier interactif générant 2 à 3 anomalies mécaniques sur le véhicule (pièces mal fixées inclinées et surlignées en orange sur le modèle 3D à inspecter et démonter d'un clic, puis pièces manquantes à remonter dans l'ordre mécanique).

---

## Axe 4 — Confort Familial, Accessibilité & Mode Hors-Ligne (Implémenté)

1. **Multi-Profils Locaux (Fratrie & Salle de Classe)**
   - Création, sélection, renommage et suppression de plusieurs profils d'apprentis mécaniciens sur le même appareil (`localStorage`).
   - Chaque profil conserve indépendamment son niveau actif, ses stages en cours, ses étoiles, ses badges, ses livrées personnalisées, ses brevets d'ingénieur, sa vitrine de pièces rares, ses records chronométrés et sa langue préférée.
   - Migration transparente de la sauvegarde existante vers le premier profil sans aucune perte d'avancement, avec import/export `.json` individuel par profil.
2. **Synthèse Vocale Native Trilingue (Web Speech API — `FR` / `EN` / `العربية`)**
   - Lecture vocale 100 % hors-ligne via l'API native `window.speechSynthesis` du navigateur pour accompagner les plus jeunes lecteurs sur les **Fiches Découverte**, le **Quiz Brevet**, le **Guide Mécanique** et le **Tour du Propriétaire**, ainsi qu'en lecture automatique optionnelle lors de la pose des pièces.
3. **Application Web Progressive (PWA) Installable & 100 % Hors-Ligne**
   - Web App Manifest complet (`standalone`, icônes PNG `192x192`, `512x512`, `maskable 512x512` et `apple-touch-icon` `180x180`) et Service Worker Workbox mettant en cache l'application, les géométries 3D procédurales et les polices pour jouer sans connexion Internet.
