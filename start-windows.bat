@echo off
chcp 65001 >nul
setlocal

echo ========================================================
echo   MécanoKids 3D — Lancement Local sur Windows
echo ========================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERREUR] Node.js n'est pas installé ou n'est pas dans le PATH Windows.
  echo Téléchargez et installez Node.js LTS depuis : https://nodejs.org/
  echo Puis relancez ce script.
  pause
  exit /b 1
)

if not exist ".env" (
  if exist ".env.example" (
    copy ".env.example" ".env" >nul
    echo [INFO] Fichier .env créé à partir de .env.example.
    echo        Pensez à renseigner GEMINI_API_KEY dans le fichier .env
    echo        pour activer Mécano Léo et les Fiches Découvertes !
    echo.
  )
)

if not exist "node_modules" (
  echo [1/2] Installation des dépendances npm en cours...
  call npm install
  if %ERRORLEVEL% neq 0 (
    echo [ERREUR] Échec de l'installation des dépendances npm.
    pause
    exit /b 1
  )
  echo.
)

echo [2/2] Démarrage du serveur MécanoKids 3D sur http://localhost:3000 ...
echo       Appuyez sur Ctrl+C pour arrêter le serveur.
echo.
start "" "http://localhost:3000"
call npm run dev

endlocal
