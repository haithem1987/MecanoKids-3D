# Plan d'Implémentation Fonctionnel, Technique & FinOps — MécanoKids 3D

Ce document détaille le plan d'exécution complet des **4 Lots de commercialisation** définis dans `COMMERCIALISATION.md`. Pour chaque lot, il précise :
1. Le **périmètre fonctionnel** et les parcours utilisateurs (Enfant, Parent, Enseignant),
2. L'**architecture logicielle**, les modèles de données et les choix technologiques,
3. Les **bonnes pratiques d'ingénierie, de sécurité et de conformité jeunesse (RGPD-K / COPPA)**,
4. Les **infrastructures requises, coûts d'exploitation (FinOps) et coûts de support client**.

---

## Statut d'Avancement de l'Implémentation

- [x] **Lot A — Confiance Parentale, Sas Adulte, Bulletin STEM & Diplômes Imprimables** *(Implémenté & Vérifié — v1.1)*
- [ ] **Lot B — Segmentation Freemium Éthique & Licences Hors-Ligne (Ed25519)** *(À suivre)*
- [ ] **Lot C — Vitrine d'Acquisition, SEO Trilingue & Boucles Virales** *(Planifié)*
- [ ] **Lot D — Synchronisation Cloud Parentale, Paiements & Publication Mobile** *(Planifié)*

---

## 1. Architecture Cible Globale & Principes Directeurs

### 1.1 Quatre invariants d'architecture
1. **Offline-First intégral pour l'enfant** : La boucle de jeu 3D (Three.js, audio synthétique, synthèse vocale, sauvegarde locale) ne dépend jamais du réseau. Une coupure Wi-Fi ne bloque ni une partie ni une classe d'école.
2. **Séparation stricte Enfant / Adulte (*Zero-PII Kids*)** : Aucune donnée nominative, adresse e-mail, identifiant publicitaire ou télémétrie tierce n'est collectée côté enfant. Seul le parent (ou le référent école), derrière un **Sas Parental**, interagit avec le paiement ou la sauvegarde Cloud.
3. **Codebase Unique Multi-Plateformes** : Une seule base React 19 + TypeScript + Three.js + Tailwind CSS + VitePWA alimente le **Web/PWA**, **iOS/iPadOS** et **Android** (via encapsulation Capacitor).
4. **Fusion de données monotone sans perte (*Conflict-Free Merge*)** : Toute synchronisation entre stockage local et Cloud opère par union mathématique croissante (meilleur score, meilleur temps, union des badges), éliminant les conflits d'écrasement.

### 1.2 Topologie Système Cible (Lots A à D assemblés)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     CLIENT UNIFIÉ (Web PWA · iOS · Android)                  │
│                                                                              │
│  ┌─────────────────────────┐        ┌─────────────────────────────────────┐  │
│  │   ZONE ENFANT (60 FPS)  │        │     ZONE ADULTE (Sas Parental)      │  │
│  │ • Établi 3D Three.js    │        │ • Bulletin de compétences STEM      │  │
│  │ • Modes Diagnostic/Quiz │        │ • Minuteur de session bienveillant  │  │
│  │ • Studio Carte Postale  │        │ • Diplômes imprimables HD (Canvas)  │  │
│  │ • Synthèse vocale (TTS) │        │ • Activation Pass Famille / École   │  │
│  └───────────┬─────────────┘        └──────────────────┬──────────────────┘  │
│              │                                         │                     │
│              ▼                                         ▼                     │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │          MOTEUR DOMAINE & DROITS LOCAUX (100 % Hors-Ligne)             │  │
│  │  • Store Multi-Profils (localStorage / IndexedDB)                      │  │
│  │  • Moteur d'Entitlements (Découverte vs Famille vs École)              │  │
│  │  • Vérificateur cryptographique Ed25519 (WebCrypto) des clés Écoles    │  │
│  └───────────────────────────────────┬────────────────────────────────────┘  │
└──────────────────────────────────────┼───────────────────────────────────────┘
                                       │ (Optionnel · Uniquement en ligne côté Parent)
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE CLOUD LÉGÈRE & PAIEMENTS                    │
│                                                                              │
│  ┌──────────────────────┐  ┌───────────────────────┐  ┌───────────────────┐  │
│  │ Firebase Auth +      │  │ API Backend Express   │  │ Passerelles Achat │  │
│  │ Firestore            │  │ (Cloud Run stateless) │  │ • Stripe Checkout │  │
│  │ • Compte Parent      │  │ • Webhooks Stripe     │  │ • Apple StoreKit2 │  │
│  │ • Sync Profils JSON  │  │ • Signature Clés      │  │ • Google Billing  │  │
│  │ • Statut Licence     │  │   Écoles Ed25519      │  │   (via RevenueCat)│  │
│  └──────────────────────┘  └───────────────────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. LOT A — Confiance Parentale, Sas Adulte, Bulletin STEM & Diplômes

> **Objectif métier** : Créer la brique de valeur destinée à l'acheteur adulte (parent/enseignant) et assurer la conformité réglementaire « Catégorie Enfants » avant d'activer la monétisation.

### 2.1 Spécifications Fonctionnelles
1. **Sas Parental (*Parental Gate*)**
   - Déclenché systématiquement avant l'ouverture de l'*Espace Parents*, des paramètres d'export/réinitialisation ou d'une offre commerciale.
   - Défi cognitif réservé aux adultes : opération arithmétique combinée formulée **en toutes lettres** dans la langue active (ex. *« Combien font sept fois huit moins quatre ? »*) pour empêcher la résolution par simple reconnaissance visuelle des chiffres chez les 5–7 ans.
   - Déverrouillage temporisé en mémoire vive uniquement (session adulte de 5 minutes, révoquée dès le retour sur l'établi enfant).
2. **Tableau de Bord « Espace Parents & Enseignants »**
   - Sélecteur de profil enfant en haut de fenêtre.
   - **4 jauges de compétences STEM** calculées dynamiquement à partir de l'historique réel du profil :
     - *Logique séquentielle & structurelle* : progression sur les paliers 1 à 5 et respect des dépendances mécaniques.
     - *Repérage visuo-spatial 3D* : ratio de constructions 3 étoiles (0 erreur) et stages réussis en mode *Maître sans silhouette*.
     - *Esprit d'analyse & diagnostic* : nombre de pannes identifiées et réparées en mode *Diagnostic & Réparation*.
     - *Culture & lexique mécanique trilingue* : nombre de brevets de quiz obtenus et diversité des familles explorées (*Route, Mer, Air, Chantier, Espace*).
3. **Minuteur d'Atelier Bienveillant (*Gentle Screen-Time Limiter*)**
   - Réglable par le parent : *Illimité*, *15 min*, *20 min*, *30 min* ou *45 min* par jour.
   - **Règle d'or UX (« Grâce de fin d'assemblage »)** : si le temps expire alors qu'un véhicule est assemblé à plus de 50 %, le minuteur attend la pose de la dernière pièce (dans une limite maximale de 3 minutes) pour éviter toute frustration ou colère chez l'enfant, puis affiche un rideau apaisant de fermeture de l'atelier. Prolongation possible uniquement via le Sas Parental.
4. **Générateur de Diplôme Officiel Imprimable**
   - Paliers de certification : *Apprenti Mécanicien (10 véhicules)*, *Constructeur Confirmé (25)*, *Ingénieur Chef d'Atelier (50)*, *Grand Maître des 100 Machines (100)*.
   - Génération d'un certificat haute définition personnalisable avec le prénom du profil, la date, le nombre de brevets obtenus et la langue choisie (`FR` / `EN` / `AR` RTL), téléchargeable en `.png` A4 paysage ou imprimable directement.

### 2.2 Implémentation Technique & Technologies
- **Stack** : 100 % TypeScript + React 19 + HTML5 Canvas 2D API (zéro librairie PDF lourde type `jspdf` qui alourdirait le bundle de +300 Ko).
- **Évolution du modèle `ProfilesStoreV2`** :
  - Ajout d'un objet `parentalSettings` au niveau racine du store local (`dailyLimitMinutes: number | null`, `consumedTodaySeconds: number`, `consumedDateKey: string`, `soundLockedMaxVolume?: number`).
- **Moteur d'analyse STEM (`stemAnalytics.ts`)** :
  - Fonctions pures calculant des scores normalisés `0..100` avec `tabular-nums`, entièrement testables unitairement hors navigateur.
- **Rendu Diplôme HD (`diplomaRenderer.ts`)** :
  - Canevas hors-écran `2480 × 1754 px` (~210 DPI A4). Attente explicite de `document.fonts.ready` (notamment la police `Cairo` pour l'arabe RTL et `Outfit` pour les titres) avant tracé vectoriel des bordures guillochées, sceau doré et export `canvas.toBlob('image/png')`.

### 2.3 Best Practices, Infrastructure & Coûts (Lot A)
- **Best Practices** :
  - *Anti-Brute-Force Enfant* : Après 3 réponses erronées au Sas Parental, imposer un délai d'attente de 30 secondes avec régénération de l'énoncé.
  - *Accessibilité* : Impression CSS `@media print` propre en complément du téléchargement PNG.
- **Coût d'infrastructure** : **0 € / mois** (traitement et rendu 100 % côté client).
- **Coût de support client** : **Quasi nul** ; réduit même les plaintes parentales liées au temps d'écran grâce au minuteur bienveillant intégré.

---

## 3. LOT B — Segmentation Freemium Éthique & Licences Hors-Ligne (Famille / École)

> **Objectif métier** : Introduire la frontière entre l'offre gratuite d'appel et les offres payantes (*Pass Famille* et *Édition École*) sans jamais dégrader la fluidité du jeu ni nécessiter de connexion permanente pour les écoles.

### 3.1 Spécifications Fonctionnelles
1. **Périmètre exact des droits (*Entitlements Matrix*)** :

| Fonctionnalité | Atelier Découverte (Gratuit) | Pass Famille (Payant B2C) | Édition École (Licence B2B) |
| :--- | :---: | :---: | :---: |
| Véhicules jouables | **20 véhicules** *(15 Palier 1 + 1 vedette par famille)* | **100 véhicules** | **100 véhicules** |
| Défi Mécanique du Jour | Oui *(même si véhicule > 20)* | Oui | Oui |
| Profils enfants sur l'appareil | **1 profil** | **Jusqu'à 5 profils** | **Illimité (classe entière)** |
| Modes *Diagnostic* & *Sans Silhouette* | Aperçu sur les 20 véhicules gratuits | **100 véhicules** | **100 véhicules** |
| Cabine de peinture | 3 finitions de base + *Flamme d'Or (7j)* | **Toutes les finitions** | **Toutes les finitions** |
| Outils Enseignant (Export CSV classe, Filtre séance) | Non | Non | **Oui** |

2. **Parcours d'achat sans piège (*Ethical Kid UX*)** :
   - Dans le catalogue, les véhicules 21 à 100 affichent un badge discret *« Pass Atelier Complet »* (et non un message d'erreur frustrant).
   - Un clic enfant sur un élément verrouillé ouvre une fiche explicative illustrée invitant calmement à *« Demander à un parent »*, dont le bouton d'action traverse obligatoirement le **Sas Parental**.
   - **Rétrocompatibilité bienveillante** : Tout véhicule déjà terminé par un joueur historique avant la mise à jour reste acquis et jouable dans son Garage.
3. **Système de Clé de Licence École 100 % Hors-Ligne** :
   - L'enseignant saisit une clé compacte (ex. `MK3D-EDU1-...`) ou scanne un QR code fourni sur la facture de l'école pour débloquer instantanément une flotte de 15 à 30 tablettes sans aucun accès Internet requis dans la salle de classe.
4. **Mode Enseignant (inclus dans l'Édition École)** :
   - Vue synthétique multi-élèves dans l'Espace Adulte avec export `.csv` (Prénom/Pseudo local, véhicules validés, étoiles, brevets obtenus) et sélecteur de « Consigne de séance » (ex. épingler uniquement la famille *Espace* pour un atelier de 45 min).

### 3.2 Implémentation Technique & Cryptographie des Licences
- **Moteur centralisé de droits (`entitlements.ts`)** :
  - Une seule source de vérité `resolveEntitlements(licenseState, legacyProgress): EntitlementSet`. Aucun composant UI ne code de règle `if (stageIndex >= 20)` en dur ; tout passe par `canPlayStage(stageId)`, `canCreateProfile(currentCount)`, `canUseLivery(liveryId)`.
- **Vérification cryptographique asymétrique hors-ligne (Ed25519 via Web Crypto API)** :
  - Format de clé : `MK3D1.<payload_base32_ou_base64url>.<signature_ed25519>`.
  - Le `payload` JSON minimal contient `{ t: "school" | "family", org: "Ecole Jules Verne", exp: "2027-09-30", v: 1 }`.
  - L'application embarque uniquement la **clé publique Ed25519** (32 octets, non secrète) et vérifie la signature via `window.crypto.subtle.verify('Ed25519', publicKey, sig, data)` (avec repli ECDSA P-256 pour compatibilité Safari plus anciens).
  - **Avantage décisif** : **Zéro base de données requise au moment de la vérification sur les tablettes scolaires**, tout en rendant mathématiquement impossible la génération de fausses clés par un tiers.

### 3.3 Best Practices, Infrastructure & Coûts (Lot B)
- **Best Practices** :
  - *Période de grâce scolaire* : Si une licence annuelle école expire en pleine semaine de classe, accorder 14 jours de tolérance (*grace period*) avec bannière d'alerte uniquement dans l'Espace Enseignant (jamais devant les élèves).
  - *Protection de l'horloge locale* : Comparer `exp` à `Math.max(Date.now(), lastRecordedActivityTimestamp)` pour éviter le contournement trivial par recul de la date système.
- **Coût d'infrastructure** : **0 € / mois** en vérification locale ; un simple script CLI administrateur (ou route serveur protégée) signe les clés écoles lors d'une commande B2B.
- **Coût de support client** : **Très faible (< 1 ticket / 50 écoles)** grâce à un validateur visuel immédiat indiquant clairement le nom de l'établissement et la date de validité dès la saisie du code.

---

## 4. LOT C — Vitrine d'Acquisition, SEO Trilingue & Boucles Virales

> **Objectif métier** : Maximiser le trafic organique qualifié (parents & enseignants en `FR` / `EN` / `AR`) et transformer chaque création d'enfant partagée par un parent en vecteur d'acquisition gratuit.

### 4.1 Spécifications Fonctionnelles
1. **Routage d'entrée intelligent (Vitrine vs Reprise Directe)** :
   - **Nouveau visiteur** (`hasVisitedWorkshop === false` et aucune sauvegarde existante) : affichage d'une **Vitrine d'Accueil rapide et éditoriale** en 3 langues comprenant :
     - Aperçu visuel interactif léger et bouton primaire **« Essayer gratuitement (sans compte) »** lançant l'établi en 1 clic,
     - Présentation des 5 univers et des 4 modes pédagogiques par tranche d'âge (5–7 ans / 8–12 ans),
     - Bandeau de réassurance parentale (*0 % Publicité · 100 % Hors-ligne · Synthèse vocale FR/EN/AR*),
     - Section dédiée **« Tarifs Famille & Licences Écoles »**.
   - **Joueur récurrent** : accès direct à l'établi 3D sur son dernier véhicule en cours, avec lien discret vers la vitrine depuis l'Espace Parents.
2. **SEO International & Rich Snippets Schema.org** :
   - Métadonnées complètes (`<title>`, `description`, `og:title`, `og:description`, `og:image` `1200×630`, `hreflang` pour `?lang=fr`, `?lang=en`, `?lang=ar`).
   - Données structurées JSON-LD `@type: ["SoftwareApplication", "LearningResource"]` renseignant la tranche d'âge (`5-12`), le prix de départ (`0`), la note/catégorie éducative (`STEM / Mechanical Engineering`) et une `FAQPage` répondant aux questions fréquentes des parents et enseignants.
3. **Boucles Virales Natives (Coût d'acquisition nul)** :
   - **Signature QR Code sur Cartes Postales 3D & Diplômes** : intégration dans le pied de page du PNG exporté d'un QR Code vectoriel net pointant vers l'URL publique de l'application (`?utm_source=postcard`).
   - **Liens de Défi Chronométré partageables** : depuis le classement Chrono d'un des 20 véhicules gratuits, génération d'un lien de défi (`/?challenge=road-city-compact&targetMs=29400&challenger=Leo`) affichant une bannière *« Défi amical : Bats le chrono de 29,4s de Léo ! »*.

### 4.2 Implémentation Technique & Architecture
- **Découpage du Bundle (*Code-Splitting*) pour les Core Web Vitals** :
  - Séparer la Vitrine d'Accueil (React + Tailwind léger < 45 Ko gzip) du moteur 3D Three.js (`React.lazy(() => import('./WorkshopApp'))`) avec préchargement en arrière-plan (`requestIdleCallback`) dès l'affichage de la vitrine :
    - **Score Lighthouse Performance / SEO > 95/100**,
    - Chargement instantané du canevas 3D lorsque l'utilisateur clique sur *« Essayer gratuitement »*.
- **Injection Métadonnées Dynamiques sur `server.ts`** :
  - Dans `server.ts` (en production), inspecter `?lang=fr|en|ar` (ou l'en-tête `Accept-Language`) avant de servir `index.html` afin d'injecter les balises `<title>`, `<meta property="og:*">` et `dir="rtl|ltr"` dans la bonne langue pour les aperçus WhatsApp, iMessage, Facebook et Googlebot.
- **Générateur QR Code 100 % Local** :
  - Utilisation d'un encodeur matriciel léger sans appel réseau (`qrcode` en rendu Canvas local < 10 Ko) pour dessiner le QR code directement sur la Carte Postale 3D et le Diplôme, même hors-ligne.
- **Sanitisation stricte des paramètres d'URL (`challenge`, `challenger`)** :
  - Whitelist alphanumérique stricte (`max 16 caractères`, échappement complet, aucun stockage permanent sans action utilisateur) pour empêcher toute injection de texte inapproprié via un lien forgé.

### 4.3 Best Practices, Infrastructure & Coûts (Lot C)
- **Best Practices** :
  - *Conformité Partage Enfant* : Le bouton de téléchargement/partage de Carte Postale n'expose jamais de nom de famille, géolocalisation ou photo réelle de l'enfant — uniquement le véhicule 3D et le pseudo/prénom local choisi.
- **Coût d'infrastructure** : **0 € à ~5 € / mois** (mise en cache CDN Cloudflare ou Cloud Run des fichiers statiques compilés).
- **Coût de support client** : **Nul** ; la section FAQ intégrée sur la vitrine désamorce en amont 80 % des questions pré-achat (compatibilité tablettes, fonctionnement hors-ligne, facturation écoles).

---

## 5. LOT D — Synchronisation Cloud Parentale, Paiements & Publication Boutiques (iOS / Android)

> **Objectif métier** : Encaisser les paiements en production (Web Stripe + Apple App Store + Google Play), pérenniser les sauvegardes familiales multi-appareils et publier sur les magasins d'applications tablettes.

### 5.1 Spécifications Fonctionnelles
1. **Compte Parent Cloud Optionnel (100 % derrière Sas Parental)**
   - Connexion en 1 clic via **Google Sign-In** ou **Lien Magique / E-mail** (Firebase Authentication).
   - Synchronisation automatique en arrière-plan des profils enfants du foyer et du statut *Pass Famille* entre l'iPad du salon, le téléphone du parent et l'ordinateur familial.
2. **Tunnel de Paiement Unifié selon la Plateforme**
   - **Sur le Web / PWA** : ouverture de **Stripe Checkout** (Carte bancaire, Apple Pay, Google Pay, virement/facture proforma automatique pour les écoles). Dès confirmation du paiement, déblocage immédiat du *Pass Famille* ou émission automatique par e-mail de la *Clé École Ed25519*.
   - **Sur iOS (App Store) et Android (Google Play)** : utilisation obligatoire des achats intégrés natifs (**StoreKit 2** et **Google Play Billing**) conformément aux règles Apple/Google, avec bouton explicite **« Restaurer mes achats »**.
3. **Encapsulation Mobile Native (iPadOS / iOS / Android)**
   - Distribution native via **Capacitor** conservant le rendu WebGL 60 FPS plein écran, le verrouillage d'orientation paysage/adaptatif sur tablette, l'audio natif et les retours haptiques légers lors de l'emboîtement des pièces.

### 5.2 Implémentation Technique & Réconciliation des Données
- **Base de données & Authentification : Firebase Auth + Cloud Firestore**
  - Structure documentaire ultra-économe en lectures/écritures (1 seul document résumé par profil synchronisé à la fin d'une étape ou toutes les 60s d'activité, jamais à chaque mouvement 3D !) :
    - `/parents/{parentUid}` : `{ tier: 'free' | 'family' | 'school', stripeCustomerId?, purchasePlatform, updatedAt }`
    - `/parents/{parentUid}/profiles/{profileId}` : `{ name, progressJson, schemaVersion: 2, updatedAt }`
    - `/schoolOrders/{orderId}` : historique des clés établissements émises.
- **Algorithme de Fusion Monotone (*Deterministic Monotonic Merge*)** :
  - Lorsqu'une tablette ayant joué 15 jours en vacances hors-ligne se reconnecte au compte parent :
    - `completedStages[id].stars = Math.max(local.stars, cloud.stars)`
    - `completedStages[id].bestTimeMs = minDefined(local.bestTimeMs, cloud.bestTimeMs)`
    - `unlockedBadges = union(local.unlockedBadges, cloud.unlockedBadges)`
    - `dailyStreak.activeDates = sortedUnion(local.activeDates, cloud.activeDates)` avec recalcul propre de `bestStreak`
    - **Garantie d'ingénierie** : Zéro boîte de dialogue complexe *« Voulez-vous écraser la sauvegarde locale ou Cloud ? »* et zéro perte de progression.
- **Backend Paiement (`server.ts` sur Cloud Run)** :
  - Route `POST /api/billing/checkout-session` (vérifie le jeton Firebase ID Token du parent et crée la session Stripe).
  - Route `POST /api/billing/webhook` (vérifie la signature cryptographique `Stripe-Signature`, garantit l'**idempotence** via l'`event.id` dans Firestore, met à jour `/parents/{uid}.tier = 'family'` ou génère et envoie la clé école signée Ed25519).
- **Pont Mobile Unifié : Capacitor + RevenueCat SDK** :
  - Sur iOS/Android, RevenueCat synchronise les reçus StoreKit 2 / Google Play vers un webhook unique mettant à jour le même champ `/parents/{uid}.tier` dans Firestore, permettant à une famille ayant acheté sur iPad de retrouver son Pass sur le Web si elle lie son compte parent.

### 5.3 Best Practices Réglementaires Boutiques Jeunesse (Critique)
- **Apple App Store Guideline 1.3 (*Kids Category*) & Google Play *Teacher Approved*** :
  1. **Zéro SDK publicitaire ou analytics tiers** (pas de Google Analytics standard, Meta Pixel ou Crashlytics non configuré enfant).
  2. **Sas Parental obligatoire** devant : la connexion Firebase Parent, l'achat In-App, le bouton « Restaurer mes achats » et tout lien vers la politique de confidentialité ou le portail de facturation.
  3. **Suppression de compte en 2 clics** disponible directement dans l'Espace Parents (exigence Apple obligatoire dès qu'une création de compte existe) purgant `/parents/{uid}` et ses sous-collections Firestore.

---

## 6. Étude FinOps : Coûts d'Infrastructure & Coûts de Support Client

Grâce au choix d'un rendu 3D procédural côté client et d'une synchronisation Firestore uniquement par événements d'étape (et non temps réel continu), la structure de coûts reste remarquablement basse même à grande échelle.

### 6.1 Coûts Fixes Annuels (Indépendants du trafic)
| Poste fixe | Coût annuel estimé | Rôle |
| :--- | :---: | :--- |
| Nom de domaine `.com` / `.fr` + DNS Cloudflare | **~25 € / an** | Domaine de marque, SSL et cache CDN mondial gratuit |
| Programme Apple Developer | **99 $ (~92 €) / an** | Publication App Store iOS / iPadOS |
| Compte Google Play Console | **25 $ (~23 €) une seule fois** | Publication Google Play Android & Chromebooks |
| **Total Coûts Fixes** | **~120 € / an (~10 € / mois)** | Seuil de rentabilité atteint dès **1 seule licence école** ou **10 Pass Famille par an** |

### 6.2 Coûts Variables d'Infrastructure par Palier de Croissance
*Hypothèses réalistes : 85 % des joueurs en offre gratuite purement locale (0 écriture Cloud), 15 % de comptes parents synchronisés (moyenne 20 écritures et 10 lectures Firestore par mois et par famille).*

| Poste d'infrastructure | Lancement (1 000 MAU) | Croissance (10 000 MAU) | Échelle (100 000 MAU) |
| :--- | :---: | :---: | :---: |
| **Hébergement Cloud Run + CDN** *(statique mis en cache à 98 % + API webhooks)* | **0 € – 2 € / mois** *(Tier gratuit)* | **~8 € / mois** | **~45 € / mois** |
| **Firebase Auth** *(comptes parents uniquement)* | **0 € / mois** *(Gratuit < 50 000 MAU Auth)* | **0 € / mois** | **0 € – 15 € / mois** |
| **Cloud Firestore** *(sauvegardes JSON compactes < 15 Ko)* | **0 € / mois** *(Quota Spark/Blaze gratuit)* | **~2 € / mois** | **~20 € / mois** |
| **E-mails transactionnels** *(factures / clés écoles via Resend ou Postmark)* | **0 € / mois** *(Tier gratuit 3 000/mois)* | **0 € – 10 € / mois** | **~20 € / mois** |
| **RevenueCat (Mobile IAP)** | **0 € / mois** *(Gratuit jusqu'à 2 500 $ de CA mensuel)* | **0 € – 25 € / mois** *(1 % au-delà de 2 500 $)* | **1 % du CA mobile** |
| **Total Infrastructure Serveur** | **< 2 € / mois** | **~15 € à 45 € / mois** | **~100 € / mois** *(hors % stores)* |

*Note sur les commissions de paiement (uniquement prélevées en cas de vente encaissée) :*
- **Vente directe Web / Écoles (Stripe)** : `1,5 % + 0,25 €` (cartes européennes) — marge nette ~96 %.
- **App Store / Google Play (*Small Business Program* < 1 M$/an)** : commission réduite à **15 %** (au lieu de 30 %) après inscription gratuite aux programmes *Apple Small Business* et *Google Play 15% Tier*.

### 6.3 Modélisation & Réduction du Coût de Support Client

Dans les applications grand public, le support client est souvent le premier coût caché (mot de passe oublié, achat non débloqué sur un second iPad, facture réclamée par une mairie/école). L'architecture prévoit **5 mécanismes « Zero-Touch Support »** dès la conception :

1. **Portail Client Stripe en libre-service** : Un bouton *« Télécharger ma facture / Gérer mon reçu »* dans l'Espace Parents ouvre le portail Stripe officiel sans intervention humaine.
2. **Restauration d'achat unifiée en 1 clic** : Bouton visible dans l'Espace Parents resynchronisant instantanément Firestore + StoreKit/Play Billing.
3. **Clés Écoles auto-descriptives** : En cas d'erreur de frappe d'un enseignant, l'interface distingue *« Faute de frappe (somme de contrôle invalide) »* de *« Licence expirée le JJ/MM/AAAA »*, supprimant les allers-retours par e-mail.
4. **Connexion Parent sans mot de passe (Google Sign-In / Magic Link)** : Élimine 100 % des tickets de réinitialisation de mot de passe.
5. **Code de Diagnostic Anonyme dans l'Espace Parents** : Affichage en bas de modale de la version de l'application, du statut PWA hors-ligne et du type de licence active (`v1.x · Offline Ready · Tier: Family`).

| Indicateur Support | 1 000 MAU | 10 000 MAU + 30 Écoles | 100 000 MAU + 300 Écoles |
| :--- | :---: | :---: | :---: |
| Volume estimé de tickets | **2 à 5 / mois** | **15 à 30 / mois** | **120 à 200 / mois** |
| Temps de gestion humain estimé | **< 30 min / mois** *(Fondateur)* | **~3 h / mois** *(Fondateur + modèles de réponses)* | **~15–20 h / mois** *(Helpdesk léger type Crisp/HelpScout à ~25 €/mois + support temps partiel ~300–400 €/mois)* |

---

## 7. Chronogramme d'Exécution Recommandé

L'ordre d'implémentation suivant permet de livrer de la valeur testable à chaque étape sans dette technique ni refonte :

1. **Étape 1 — Implémentation du Lot A (100 % local, zéro dépendance externe)** *(Terminé)*
   - Sas Parental trilingue → Tableau de bord STEM → Minuteur bienveillant → Générateur de Diplômes HD imprimables.
2. **Étape 2 — Implémentation du Lot B (Moteur Freemium & Clés Écoles Ed25519)** *(Prochaine étape)*
   - Matrice d'accès 20 véhicules gratuits / 100 véhicules complets → Modale d'offre Famille & École → Vérificateur cryptographique hors-ligne + Outils CSV Enseignant.
3. **Étape 3 — Implémentation du Lot C (Vitrine, SEO Schema.org & Viralité)**
   - Landing page intégrée avec découpage de bundle (`React.lazy`) → Métadonnées dynamiques `FR/EN/AR` sur `server.ts` → QR Code local sur Cartes Postales & Liens de Défi Chrono.
4. **Étape 4 — Implémentation du Lot D (Cloud Sync, Paiements & Stores)**
   - Provisionnement Firebase (Auth Parent + Firestore avec règles de sécurité strictes et fusion monotone) → Intégration Stripe Checkout + Webhooks → Configuration Capacitor iOS/Android.

---

## 8. Journal d'Avancement & Ajustements d'Architecture (Suivi Continu)

### Lot A — Livré & Vérifié (v1.1)
1. **Schéma de stockage (`MultiProfileStore`)** :
   - Extension rétrocompatible de `MultiProfileStore` avec `parentalSettings: ParentalSettings` (`dailyLimitMinutes: 15 | 20 | 30 | 45 | null`, `consumedTodaySeconds`, `consumedDateKey`, `extraGrantedMinutesToday`).
   - Remise à zéro automatique du compteur quotidien lors du changement de date calendaire (`YYYY-MM-DD`) dans `sanitizeParentalSettings`.
   - Correction préventive des gestionnaires multi-profils (`handleCreateProfile`, `handleDeleteProfile`) pour préserver systématiquement `parentalSettings` lors de l'ajout ou de la suppression d'un profil enfant.
2. **Sas Parental (`src/utils/parentalGate.ts` & `src/components/ParentalGateModal.tsx`)** :
   - Défis arithmétiques combinés (`a × b ± c`) rédigés **en toutes lettres** en français, anglais et arabe.
   - *Ajustement d'accessibilité internationale* : prise en charge transparente des chiffres arabes orientaux (`٠-٩`) et persans (`۰-۹`) en plus des chiffres occidentaux (`0-9`) dans `parseAdultNumericAnswer`, indispensable sur les claviers tactiles arabes iPad/Android.
   - Verrouillage anti-brute-force de 30 secondes après 3 essais erronés, et jeton de session adulte uniquement en mémoire vive (`ADULT_SESSION_TTL_MS = 5 min`) révoqué immédiatement dès la fermeture de l'*Espace Parents*.
   - Sécurisation unifiée via `requireAdultVerification` protégeant : l'accès à l'*Espace Parents*, la prolongation du minuteur depuis le rideau de fin de séance, l'activation du mode *Accès libre 100 niveaux*, l'export/import `.json` et la remise à zéro d'un profil.
3. **Moteur Analytique STEM (`src/utils/stemAnalytics.ts`)** :
   - Calcul déterministe hors-ligne des 4 axes de compétences normalisés (`0..100 %`) : *Logique séquentielle & structurelle*, *Repérage visuo-spatial 3D*, *Esprit d'analyse & diagnostic*, et *Culture & lexique mécanique*.
   - *Ajustement produit orienté conversion* : ajout d'un 5e palier initial **`diploma_1` (*Brevet d'Initiation Mécanique*, dès 1 véhicule terminé)** en complément des paliers `10`, `25`, `50` et `100` véhicules, afin qu'un parent découvrant l'application puisse générer et imprimer un premier certificat personnalisé dès la toute première réussite de son enfant.
4. **Rendu & Impression de Diplômes (`src/utils/diplomaRenderer.ts`)** :
   - Canevas HTML5 2D haute définition `2000 × 1414 px` (ratio exact A4 paysage $\sqrt{2}:1$) avec attente de `document.fonts.ready` pour garantir le rendu net des polices `Outfit`, `Plus Jakarta Sans`, `JetBrains Mono` et `Cairo` (RTL arabe).
   - *Ajustement d'architecture d'impression* : implémentation de `printDiplomaImage` via une `<iframe>` cachée `@media print` dans le document courant plutôt que `window.open`, garantissant la compatibilité avec les environnements PWA standalone et les conteneurs embarqués sans blocage de fenêtres pop-up.
5. **Minuteur d'Atelier Bienveillant (`src/utils/sessionTimer.ts` & `src/components/GentleSessionCurtain.tsx`)** :
   - Décompte actif seconde par seconde mis automatiquement en pause lorsque l'onglet est masqué (`document.hidden`) ou lorsque le parent consulte l'*Espace Parents*.
   - Application stricte de la **Grâce de fin d'assemblage** (`ASSEMBLY_GRACE_MIN_COMPLETION_RATIO = 0.5`, `ASSEMBLY_GRACE_MAX_SECONDS = 180`) : aucun véhicule monté à plus de 50 % n'est interrompu brutalement ; un bandeau discret informe du temps restant pour poser les dernières pièces avant l'affichage apaisant du rideau de fermeture.

