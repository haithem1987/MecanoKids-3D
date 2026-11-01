# MécanoKids 3D — Guide d'Installation & Lancement Local (Windows)

Jeu web éducatif d'assemblage mécanique 3D pour enfants (voitures, bateaux, avions et engins spéciaux) avec progression par stages, 3 styles visuels en temps réel, compagnon **Mécano Léo** (Gemini) et **Fiches Découvertes** vérifiées via Google Search.

---

## 1. Prérequis sur un PC Windows

1. **Node.js (version 20 LTS ou 22 LTS recommandée)** :
   - Télécharger depuis [https://nodejs.org/](https://nodejs.org/) (cocher l'option *Add to PATH* lors de l'installation).
   - Vérifier dans **PowerShell** ou **Invite de commandes (CMD)** :
     ```powershell
     node -v
     npm -v
     ```
2. **Clé API Gemini** *(optionnelle pour jouer en 3D, requise pour la mascotte Mécano Léo et les fiches découvertes Google Search)* :
   - Récupérer une clé sur [Google AI Studio](https://aistudio.google.com/apikey).

---

## 2. Lancement Rapide en 1 Clic sous Windows

Une fois le projet téléchargé ou cloné depuis GitHub :

1. Ouvrez le fichier `.env` (ou laissez le script le créer au premier lancement) et remplacez `MY_GEMINI_API_KEY` par votre vraie clé :
   ```env
   GEMINI_API_KEY="votre_cle_api_gemini_ici"
   APP_URL="http://localhost:3000"
   ```
2. Double-cliquez sur **`start-windows.bat`** :
   - Il vérifie la présence de Node.js,
   - Crée automatiquement `.env` s'il n'existe pas encore,
   - Lance `npm install` automatiquement au premier démarrage,
   - Ouvre votre navigateur sur **`http://localhost:3000`** et démarre le jeu.

---

## 3. Commandes Manuelles (PowerShell ou CMD Windows)

### Avec PowerShell
```powershell
# 1. Cloner le dépôt GitHub et entrer dans le dossier
git clone <URL_DE_VOTRE_DEPOT_GITHUB>
cd <NOM_DU_DOSSIER>

# 2. Créer le fichier d'environnement local (puis éditer GEMINI_API_KEY dans .env)
Copy-Item .env.example .env

# 3. Installer toutes les dépendances
npm install

# 4. Lancer le jeu en mode développement (avec rechargement à chaud)
npm run dev
```

### Avec l'Invite de commandes classique (`cmd.exe`)
```bat
copy .env.example .env
npm install
npm run dev
```

Puis ouvrez **`http://localhost:3000`** dans Chrome, Edge ou Firefox (ne pas ouvrir `http://0.0.0.0:3000` sur Windows).

---

## 4. Toutes les Commandes `npm` Disponibles (Compatibles Windows)

| Commande | Rôle |
| :--- | :--- |
| `npm run dev` | Démarre le serveur Express + Vite en développement sur `http://localhost:3000` |
| `npm run build` | Compile l'application 3D optimisée dans le dossier `dist/` |
| `npm run start:local-prod` | Lance la version compilée (`dist/`) avec le serveur Express local sous Windows |
| `npm run lint` | Vérifie le typage TypeScript complet du projet sans erreur |
| `npm run clean` | Supprime proprement le dossier `dist/` (compatible CMD & PowerShell Windows) |

---

## 5. Dépannage Rapide sous Windows

- **Erreur PowerShell `L'exécution de scripts est désactivée sur ce système` (`npm.ps1`)** :
  Exécutez cette commande une seule fois dans PowerShell :
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
  *(Ou utilisez `npm.cmd run dev` / `start-windows.bat`).*
- **Le port `3000` est déjà occupé sur votre PC** :
  Sous PowerShell, vous pouvez lancer sur un autre port, par exemple `3001` :
  ```powershell
  $env:PORT=3001; npm run dev
  ```
