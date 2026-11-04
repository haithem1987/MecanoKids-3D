# Publication Play Store — TWA (Trusted Web Activity)

## Prérequis

- Node.js ≥ 18 et Java JDK 17+ installés
- Android SDK (via Android Studio ou `sdkmanager`)
- Compte Google Play Console (25 $ unique)
- Domaine de production configuré avec HTTPS

```bash
npm install -g @bubblewrap/cli
```

## Étapes une seule fois

### 1. Configurer le domaine dans `twa-manifest.json`

Remplacer toutes les occurrences de `REMPLACER_PAR_DOMAINE_PROD` par le domaine réel (ex. `app.octogears.com`).

### 2. Générer le projet Android

```bash
bubblewrap init --manifest https://app.octogears.com/manifest.webmanifest
```

Cela crée un dossier `android/` avec le projet TWA. Répondre aux questions :
- Package ID : `com.octogears.app`
- Nom d'affichage : `Octo Gears`
- Keystore : créer un nouveau (garder le `.jks` **hors du dépôt git**)

### 3. Récupérer la signature SHA-256

```bash
keytool -list -v -keystore android/signing/keystore.jks -alias octogears
```

Copier l'empreinte SHA-256 dans `public/.well-known/assetlinks.json` :

```json
"sha256_cert_fingerprints": ["AA:BB:CC:..."]
```

Déployer le site pour que le fichier soit accessible via :
`https://app.octogears.com/.well-known/assetlinks.json`

### 4. Vérifier le Digital Asset Link

```bash
bubblewrap validate --url https://app.octogears.com
```

### 5. Ajouter les captures d'écran

Déposer dans `public/assets/` :
- `screenshot-workshop.png` (1280×800, paysage)
- `screenshot-workshop-mobile.png` (750×1334, portrait)

Ces fichiers sont référencés dans le manifest PWA (`vite.config.ts`) et affichés dans la fiche Play Store.

### 6. Builder l'APK / AAB

```bash
bubblewrap build
```

Produit `app-release-signed.apk` et `app-release-bundle.aab`. Utiliser l'AAB pour le Play Store.

## Publication

1. Play Console → Créer une application → Production
2. Uploader `app-release-bundle.aab`
3. Remplir la fiche : description, captures (`screenshot-workshop*.png`), politique de confidentialité (`/privacy.html`)
4. Cible d'âge : 6-12 ans → activer la section "Contenu destiné aux enfants" (COPPA/RGPD)
5. Passer en revue "Accès à l'application" : pas de compte requis ✓

## Mises à jour

Le TWA se met à jour automatiquement côté web (le site est la source de vérité). Une mise à jour Play Store n'est nécessaire que si :
- le `versionCode` dans `twa-manifest.json` change (Breaking change Android) ;
- les icônes ou le nom de l'appli changent.

```bash
bubblewrap update   # re-génère à partir de twa-manifest.json
bubblewrap build
```

## Checklist avant soumission Play Store

- [ ] `assetlinks.json` accessible en HTTPS et validé par `bubblewrap validate`
- [ ] `twa-manifest.json` : domaine réel, `appVersionCode` incrémenté
- [ ] Captures d'écran déposées dans `public/assets/`
- [ ] Fiche Play Store : politique de confidentialité pointant vers `/privacy.html`
- [ ] Test sur appareil Android réel (Chrome ≥ 72) : lancement en plein écran sans barre d'adresse
- [ ] Vérifier l'absence de lien externe dans le parcours enfant (règle produit #1)
