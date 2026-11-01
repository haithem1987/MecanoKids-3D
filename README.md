# MécanoKids 3D — Guide d'Installation & Lancement Local (Windows)

Jeu web éducatif **100 % autonome (aucune clé API ni dépendance IA requise)** d'assemblage mécanique 3D pour enfants (voitures, bateaux, avions et hélicoptères), disponible en **Français (`FR`)** et en **Arabe (`العربية` RTL)**, avec **sauvegarde locale automatique (`localStorage`)** qui reprend exactement sur le même niveau et les mêmes pièces montées après redémarrage.

---

## 1. Prérequis sur un PC Windows

1. **Node.js (version 20 LTS ou 22 LTS recommandée)** :
   - Télécharger depuis [https://nodejs.org/](https://nodejs.org/) (cocher l'option *Add to PATH* lors de l'installation).
   - Vérifier dans **PowerShell** ou **Invite de commandes (CMD)** :
     ```powershell
     node -v
     npm -v
     ```

*(Aucune clé API n'est nécessaire : les indices mécaniques et les fiches découvertes encyclopédiques fonctionnent directement hors-ligne en français et en arabe.)*

---

## 2. Lancement Rapide en 1 Clic sous Windows

Une fois le projet téléchargé ou cloné depuis GitHub :

1. Double-cliquez sur **`start-windows.bat`** :
   - Il vérifie la présence de Node.js,
   - Lance `npm install` automatiquement au premier démarrage,
   - Ouvre votre navigateur sur **`http://localhost:3000`** et démarre le jeu.

---

## 3. Commandes Manuelles (PowerShell ou CMD Windows)

### Avec PowerShell
```powershell
# 1. Mettre à jour ou cloner le dépôt GitHub
git pull

# 2. Installer toutes les dépendances
npm install

# 3. Lancer le jeu en mode développement
npm run dev
```

### Avec l'Invite de commandes classique (`cmd.exe`)
```bat
git pull
npm install
npm run dev
```

Puis ouvrez **`http://localhost:3000`** dans Chrome, Edge ou Firefox.

---

## 4. Fonctionnalités Clés

- **100 objets mécaniques en 3D** répartis en 5 paliers progressifs (Découverte, Atelier, Ingénieur, Expert, Maître Constructeur) + **Défi Mécanique du Jour** (7 pièces rares Or 24K).
- **Immersion 3D avancée** :
  - **Essai Dynamique 3D** après assemblage (roues et phares sur piste défilante, houle marine 3D, sustentation aérienne et propulseurs spatiaux).
  - **Coupe Technique Rayons X** pour observer les organes mécaniques internes à travers la carrosserie ou la coque.
  - **Environnements d'établi thématiques** adaptés à chaque famille (circuit bitumé, bassin portuaire, tarmac d'aérodrome, chantier balisé, pas de tir orbital) commutables avec le plateau Studio.
- **Créativité & Atelier** :
  - **Cabine de Peinture** (8 livrées d'atelier mémorisées par véhicule) et **Studio Carte Postale 3D** téléchargeable en `.png` (`1200×820`).
  - **Garage Personnel (« Ma Vitrine 3D »)** exposant tous les véhicules construits, leurs distinctions et le coffre des pièces rares Or 24K.
- **Défis Pédagogiques** :
  - **Mode Maître Sans Silhouette** (assemblage par pure déduction mécanique).
  - **Mini-Quiz Mécanique Express (3 questions)** décernant un **Brevet d'Ingénieur** par véhicule.
  - **Mode Diagnostic & Réparation** (détection et démontage des pièces mal fixées en 3D puis remise en état).
- **Trilingue Français / Anglais / Arabe (`FR` / `EN` / `العربية`)** avec bascule instantanée, mise en page RTL complète et **synthèse vocale hors-ligne (Web Speech API)**.
- **Multi-Profils locaux & PWA 100 % hors-ligne** : jusqu'à 8 profils indépendants (`localStorage` + import/export `.json`), 15 badges de réussite, mode Chronomètre et installation hors-ligne Windows / Android / iOS.
- **Feuille de route complète** : consultez [`AMELIORATIONS.md`](./AMELIORATIONS.md).

---

## 5. Toutes les Commandes `npm` Disponibles (Compatibles Windows)

| Commande | Rôle |
| :--- | :--- |
| `npm run dev` | Démarre le serveur Express + Vite en développement sur `http://localhost:3000` |
| `npm run build` | Compile l'application 3D optimisée dans le dossier `dist/` |
| `npm run start:local-prod` | Lance la version compilée (`dist/`) avec le serveur Express local sous Windows |
| `npm run lint` | Vérifie le typage TypeScript complet du projet sans erreur |
| `npm run clean` | Supprime proprement le dossier `dist/` (compatible CMD & PowerShell Windows) |
