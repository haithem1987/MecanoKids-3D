# Stratégie de Commercialisation & Feuille de Route Produit — MécanoKids 3D

Ce document formalise l'audit de l'existant, le positionnement marché, le modèle économique, les leviers d'acquisition et la feuille de route technique permettant de commercialiser **MécanoKids 3D** auprès des **familles (B2C)** et des **établissements éducatifs (B2B)**.

---

## 1. Résumé Exécutif & Proposition de Valeur Unique

**MécanoKids 3D** est un atelier éducatif interactif en 3D destiné aux enfants de **5 à 12 ans**, dédié à l'apprentissage de la logique mécanique, du repérage spatial et du vocabulaire technique en **trois langues (`Français` · `English` · `العربية` RTL)**.

### Proposition de Valeur Unique (UVP)
> *« L'atelier d'ingénierie 3D trilingue, 100 % sans publicité et utilisable hors-ligne, où les enfants de 5 à 12 ans assemblent, diagnostiquent, personnalisent et pilotent 100 véhicules tout en développant de vraies compétences STEM. »*

### Économie unitaire (Unit Economics) exceptionnelle
Contrairement aux applications éducatives reposant sur du streaming vidéo lourd ou des appels IA facturés à l'usage :
- **Moteur 3D 100 % procédural (Three.js)** : aucun hébergement de fichiers 3D volumineux.
- **Audio synthétique (Web Audio API) & Narration vocale native (Web Speech API)** : zéro coût de bande passante ou d'API vocale externe.
- **Architecture PWA hors-ligne** : coût serveur marginal par utilisateur actif quasi nul, permettant une **marge brute logicielle supérieure à 90–95 %** (hors commissions des boutiques d'applications ou frais de paiement).

---

## 2. Étude de l'Existant : Forces & Freins à Lever

### 2.1 Actifs commerciaux déjà en place
| Domaine | Existant dans l'application | Valeur commerciale directe |
| :--- | :--- | :--- |
| **Profondeur du catalogue** | **100 véhicules** répartis en 5 paliers de difficulté et 5 familles (*Route & Rail*, *Mer*, *Air*, *Chantier*, *Espace*). | Justifie pleinement un achat Premium ou une licence scolaire annuelle. |
| **Diversité pédagogique** | Assemblage séquentiel, Coupe Rayons X, Mode *Maître sans silhouette*, Mode *Diagnostic & Réparation*, Quiz *Brevet d'Ingénieur*, Essai dynamique 3D. | Couvre une large tranche d'âge (**5–7 ans** en mode guidé vocal, **8–12 ans** en diagnostic/chrono/sans silhouette), allongeant la durée de vie client (LTV). |
| **Internationalisation native** | Interface, fiches éducatives, quiz et synthèse vocale en **Français, Anglais et Arabe (RTL complet)**. | Ouvre simultanément l'Europe francophone, la région MENA (Maghreb + Golfe, à fort pouvoir d'achat familial et scolaire privé) et le marché international. |
| **Rétention & Habitude** | Série quotidienne (*Daily Streak* avec icône flamme et jalons 3/7/14/30j), Défi du Jour (7 pièces Or 24K), 17 badges, Chronomètre local. | Favorise le retour quotidien naturel sans mécaniques addictives prédatrices. |
| **Usage familial & classe** | Multi-profils locaux indépendants, PWA installable 100 % hors-ligne, zéro collecte de données enfants. | Conformité native aux exigences RGPD mineurs / COPPA et usage immédiat sur tablettes scolaires sans Wi-Fi permanent. |

### 2.2 Angles morts actuels freinant la monétisation
1. **Absence de segmentation Gratuite / Payante** : Les 100 véhicules, tous les modes experts et le multi-profil illimité sont intégralement ouverts dès le premier lancement.
2. **Absence de Vitrine d'Acquisition (Landing Page)** : L'ouverture directe sur le canevas 3D ne présente pas les arguments clés à l'acheteur adulte (parent ou enseignant) et limite le référencement naturel (SEO).
3. **Absence d'Espace Parents & de Sas Parental (*Parental Gate*)** : Aucun tableau de bord ne traduit le temps de jeu en progrès pédagogiques mesurables pour le parent, et aucun sas adulte ne sécurise les futures actions d'achat (requis par Apple App Store *Kids* et Google Play *Familles*).
4. **Sauvegarde exclusivement locale au navigateur (`localStorage`)** : Un changement d'appareil ou une réinitialisation de tablette fait perdre l'avancement si le parent n'a pas exporté manuellement un fichier `.json`.
5. **Partage social sous-exploité** : La Carte Postale 3D téléchargeable ne comporte pas encore de signature de marque avec QR code d'invitation ni de certificat officiel imprimable.

---

## 3. Cibles Marché & Personas (Utilisateur vs Payeur)

En EdTech jeunesse, la règle fondamentale est la dissociation entre **l'utilisateur (l'enfant)** et **le prescripteur/payeur (le parent ou l'école)** :

1. **B2C — Parents « Écran Utile » (Enfants 5–12 ans)**
   - *Motivation* : Remplacer le temps d'écran passif (vidéos, jeux publicitaires) par une activité calme, constructive, bilingue/trilingue et sécurisée.
   - *Déclencheurs d'achat* : Zéro publicité, pas d'achats intégrés répétitifs, minuteur de session intégré, bulletin de compétences STEM et diplômes valorisants.
2. **B2C International & Diaspora / MENA (Trilingue FR · EN · AR)**
   - *Motivation* : Familles bilingues/trilingues et écoles internationales recherchant des supports scientifiques modernes disponibles en arabe soigné aussi bien qu'en français et en anglais.
3. **B2B — Écoles Primaires, Centres de Loisirs, Clubs STEM & Médiathèques**
   - *Motivation* : Ateliers numériques clés en main sur tablettes (iPad, Android, Chromebooks) fonctionnant hors-ligne, avec profils élèves multiples et zéro création de compte nominatif élève (conformité RGPD scolaire immédiate).

---

## 4. Modèle Économique : « Freemium Éthique » à 3 Paliers

Sur le marché jeunesse, la publicité dégrade fortement la confiance parentale et bloque l'accès aux labels *Approuvé par les enseignants*. Le modèle optimal combine **essai immédiat généreux + achat unique familial (ou pass annuel doux) + licence établissement** :

### Offre 1 — Atelier Découverte *(Gratuit — Acquisition sans friction)*
- **Accès immédiat sans création de compte ni carte bancaire**.
- **20 véhicules gratuits** : les 15 premiers véhicules du Palier 1 (*Apprenti*) + 1 véhicule emblématique dans chacune des 5 familles mécaniques (*Route, Mer, Air, Chantier, Espace*).
- Accès au **Défi Mécanique du Jour** et à la synthèse vocale trilingue.
- Limité à **1 profil joueur** et aux finitions de peinture de base.

### Offre 2 — Pass Maître Ingénieur · Famille *(B2C — Monétisation cœur)*
- **Tarification recommandée** :
  - **Achat unique « À vie » : 12,99 €** *(prix psychologique d'un petit coffret de construction physique, très apprécié des parents allergiques aux abonnements)*,
  - **Ou Pass Annuel Famille : 4,99 € / an** *(pour tester à très bas seuil)*.
- **Contenu débloqué** :
  - Accès intégral aux **100 véhicules** et aux 5 paliers de difficulté.
  - Déblocage complet des modes **Diagnostic & Réparation**, **Maître sans silhouette** et **Atelier Libre**.
  - **Cabine de Peinture intégrale** et Studio Carte Postale HD.
  - Jusqu'à **5 profils fratrie** avec **Synchronisation Cloud Parentale** multi-appareils.
  - Accès à l'**Espace Parents complet** (rapports STEM + **Diplômes de Jeune Ingénieur imprimables** + Minuteur d'écran bienveillant).

### Offre 3 — Édition Classe & École *(B2B — Paniers moyens élevés)*
- **Tarification recommandée** :
  - **Pack Classe (jusqu'à 35 élèves / 15 tablettes) : 119 € TTC / an**,
  - **Licence Établissement (tablettes et classes illimitées sur site) : 249 € TTC / an**.
- **Contenu & Outils Enseignant** :
  - **Profils élèves illimités** sur chaque tablette partagée.
  - Activation instantanée hors-ligne par **Clé de Licence École** (ou QR Code enseignant) — aucun compte e-mail élève requis.
  - **Tableau de bord Enseignant** : vue synthétique des véhicules validés et des *Brevets d'Ingénieur* obtenus par élève, exportable en CSV/PDF, et verrouillage pédagogique d'une famille thématique pour une séance de cours (ex. *Semaine de l'Espace*).

---

## 5. Leviers Produit de Conversion (Product-Led Growth)

### 5.1 Sas Parental (*Parental Gate*) réglementaire
Avant tout accès à la page d'offre, aux réglages de compte, à l'export ou aux liens externes, afficher une vérification réservée aux adultes (ex. opération arithmétique aléatoire en toutes lettres : *« Combien font sept fois huit ? »*).
- **Bénéfice** : Indispensable pour l'homologation Apple App Store (*Catégorie Enfants*) et Google Play (*Programme Familles*), et rassurant pour les parents.

### 5.2 Espace Parents & Bulletin de Compétences STEM
Transformer les données déjà enregistrées localement en un **tableau de bord valorisant pour le parent** :
- **Compétences cognitives exercées** :
  - *Logique séquentielle* (assemblage dans l'ordre structurel châssis → motorisation → habillage),
  - *Repérage spatial 3D* (taux de précision sans erreur et réussites en mode *Sans silhouette*),
  - *Diagnostic technique* (anomalies identifiées et réparées),
  - *Lexique mécanique trilingue* (nombre de pièces techniques découvertes et quiz *Brevet* réussis en FR / EN / AR).
- **Minuteur d'Atelier Bienveillant** : Le parent choisit une durée maximale (15, 20, 30 ou 45 min). Lorsque le temps est écoulé, l'application laisse l'enfant terminer le véhicule en cours puis affiche un écran calme de fermeture de l'atelier (*« L'atelier ferme ses portes pour aujourd'hui, bravo jeune ingénieur ! »*).
- **Diplômes Officiels Imprimables (PNG/PDF)** : Génération hors-ligne de certificats personnalisés au prénom de l'enfant aux paliers 10, 25, 50 et 100 véhicules — déclencheur émotionnel majeur d'achat et de bouche-à-oreille.

---

## 6. Stratégie d'Acquisition, SEO & Boucles Virales

### 6.1 Page Vitrine intégrée orientée conversion
- Pour un nouveau visiteur arrivant depuis un moteur de recherche ou un lien partagé : proposer une vitrine claire en 3 langues mettant en avant :
  1. Un CTA principal **« Essayer gratuitement (sans inscription) »** ouvrant directement le 1er véhicule en 1 clic,
  2. Les **garanties parents** (*0 % Pub · 100 % Hors-ligne · 5–12 ans · FR/EN/AR*),
  3. Un onglet **« Pour les Écoles »** permettant une demande de devis ou l'essai d'une clé classe.
- Pour un joueur récurrent : reprise directe sur son établi ou son profil habituel sans friction.

### 6.2 Référencement Naturel (SEO) Trilingue & Données Structurées
- Enrichir les balises Meta, OpenGraph et Twitter Cards en français, anglais et arabe.
- Intégrer le balisage **Schema.org `SoftwareApplication` / `EducationalApplication`** (`educationalUse`, `typicalAgeRange: "5-12"`, `inLanguage: ["fr", "en", "ar"]`, `offers`).
- Créer des pages d'entrée indexables par thématique recherchée par les parents et enseignants : *jeu éducatif mécanique enfant sans pub*, *3D STEM engineering game for kids*, *لعبة تعليمية تركيب سيارات ثلاثية الأبعاد للأطفال*.

### 6.3 Trois Boucles Virales Organiques (Coût d'acquisition = 0 €)
1. **Carte Postale 3D enrichie d'un QR Code d'atelier** : Ajouter un bandeau discret et soigné au bas des cartes postales générées dans le Studio Photo (*« Assemblé par [Prénom] dans MécanoKids 3D — Essaie gratuitement »* + QR code).
2. **Partage des Diplômes de Brevet d'Ingénieur** : Format vertical/paysage prêt à être envoyé aux grands-parents sur WhatsApp ou imprimé en classe.
3. **Défi Chrono entre Camarades** : Générer un court code ou lien partageable sur un véhicule gratuit (*« Peux-tu battre mon temps de 31,2s sur l'Hydravion ? »*) qui lance directement ce modèle en mode Chronomètre.

---

## 7. Architecture Technique de Monétisation & Distribution

### 7.1 Architecture hybride « Offline-First + Cloud Sync Parental »
- **Jeu 100 % local en temps réel** : Aucune latence réseau pendant la manipulation 3D ; l'application reste utilisable en avion, en voiture ou dans une classe non connectée.
- **Compte Parent optionnel (Firebase Authentication + Firestore)** :
  - Authentification uniquement côté Espace Parents (Google ou E-mail).
  - Sauvegarde chiffrée/structurée des profils enfants du foyer (`PlayerProgress`) et du statut de licence (`free` | `family_lifetime` | `school_license`).
- **Paiement & Licences** :
  - **Web / PWA** : Paiement Stripe Checkout (carte bancaire, Apple Pay, Google Pay) associé au compte parent, et bons de commande / codes d'activation pour les écoles.
  - **Boutiques Mobiles** : Achats intégrés natifs (StoreKit iOS / Google Play Billing) pour respecter les règles des magasins d'applications.

### 7.2 Distribution Multi-Plateformes à partir du même code source
Grâce à l'architecture React + Three.js + VitePWA autonome actuelle, un seul code source permet 4 canaux de vente :
1. **Web & PWA installable** (vente directe à marge maximale ~97 % via Stripe, idéale pour les familles via SEO et pour les flottes Chromebooks/PC d'écoles).
2. **Apple App Store (iPadOS & iOS)** via encapsulation **Capacitor** (cœur du marché payant éducatif enfant sur iPad).
3. **Google Play Store (Tablettes Android)** via **Capacitor / TWA** avec candidature au badge **« Approuvé par les enseignants » (*Teacher Approved*)**.
4. **Distribution Écoles / Collectivités** via clés de licence annuelles activables hors-ligne.

---

## 8. Feuille de Route d'Implémentation Priorisée & KPIs

> **Document d'ingénierie associé** : Le détail fonctionnel, l'architecture technique, les bonnes pratiques de sécurité/conformité jeunesse, la topologie d'infrastructure et le chiffrage FinOps / coûts de support de chaque lot sont documentés dans [`PLAN_IMPLEMENTATION.md`](./PLAN_IMPLEMENTATION.md).

### Découpage opérationnel en 4 Lots
- **Lot A — Confiance Parentale & Valeur Perçue *(Implémenté — v1.1)***
  - Sas Parental (*Parental Gate*) arithmétique en toutes lettres (`FR` / `EN` / `AR`).
  - Espace Parents & Enseignants avec **Bulletin de Compétences STEM** par profil.
  - **Minuteur de session bienveillant** paramétrable par l'adulte (avec grâce de fin d'assemblage).
  - Générateur de **Diplôme Officiel de Jeune Ingénieur** téléchargeable en PNG A4 haute définition et imprimable.
- **Lot B — Structuration Freemium & Mode Licence École**
  - Définition du périmètre gratuit généreux (20 véhicules Découverte + Défi du Jour + 1 profil) et verrouillage élégant des paliers Maître/Famille/École.
  - Modale de présentation claire des offres *Pass Famille* et *Activation Code École* derrière le Sas Parental.
- **Lot C — Acquisition, Vitrine Commerciale, SEO & Viralité**
  - Écran d'accueil vitrine trilingue (avec bouton « Jouer immédiatement » et reprise directe pour les profils existants).
  - Mise à jour SEO complète (`FR` / `EN` / `AR` + JSON-LD `EducationalApplication`).
  - Ajout du sceau de marque et QR code sur les exports du Studio Carte Postale 3D.
- **Lot D — Cloud Sync Parental & Paiement en Production**
  - Intégration Firebase (Auth Parent + sauvegarde multi-appareils Firestore des profils enfants et licences).
  - Connexion de la passerelle d'achat Web / gestion des clés établissements et préparation du packaging Capacitor iOS/Android.

### Indicateurs Clés de Performance (KPIs) à suivre
| Étape du tunnel | Indicateur clé | Objectif cible de référence |
| :--- | :--- | :--- |
| **Activation** | % de nouveaux visiteurs terminant leur 1er véhicule en moins de 3 minutes | **> 70 %** |
| **Rétention J+1 / J+7** | % de joueurs revenant grâce à la *Série Quotidienne* et au *Défi du Jour* | **J+1 > 35 % · J+7 > 18 %** |
| **Engagement Parent** | % de profils atteignant 5 véhicules construits qui ouvrent l'*Espace Parents* ou téléchargent un *Diplôme / Carte Postale* | **> 25 %** |
| **Conversion B2C** | Taux de conversion *Atelier Découverte* → *Pass Maître Ingénieur Famille* après 10–20 véhicules construits | **3 % à 6 %** |
| **Renouvellement B2B** | Taux de reconduction annuelle des licences *Édition Classe & École* | **> 80 %** |
