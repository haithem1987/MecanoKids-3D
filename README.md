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

- **9 véhicules mécaniques en 3D** répartis en 3 paliers progressifs (Découverte, Atelier, Ingénieur).
- **Bilingue Français / Arabe (`FR` / `العربية`)** avec bascule instantanée dans la barre supérieure et mise en page RTL complète.
- **Sauvegarde locale automatique (`localStorage`)** :
  - Mémorise le **niveau en cours**, les **pièces déjà assemblées** sur chaque véhicule, les **étoiles gagnées**, la **langue choisie**, le **style 3D** et l'angle caméra.
  - Permet également d'**exporter / importer un fichier `.json`** de sauvegarde depuis le menu *Stages & Sauvegarde*.
- **3 styles visuels 3D temps réel** : *Bois & Métal*, *Blocs Modulaires*, *Maquette Réaliste*.
- **Guide Mécanique & Fiches Découvertes hors-ligne** intégrés pour chaque véhicule.

---

## 5. Toutes les Commandes `npm` Disponibles (Compatibles Windows)

| Commande | Rôle |
| :--- | :--- |
| `npm run dev` | Démarre le serveur Express + Vite en développement sur `http://localhost:3000` |
| `npm run build` | Compile l'application 3D optimisée dans le dossier `dist/` |
| `npm run start:local-prod` | Lance la version compilée (`dist/`) avec le serveur Express local sous Windows |
| `npm run lint` | Vérifie le typage TypeScript complet du projet sans erreur |
| `npm run clean` | Supprime proprement le dossier `dist/` (compatible CMD & PowerShell Windows) |
