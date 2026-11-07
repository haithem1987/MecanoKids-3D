> La proposition initiale de dock et de zones réservées a été retirée après retour utilisateur. Le fonctionnement actuel est décrit dans [Palettes flottantes](2026-11-07-palettes-flottantes.md). Les validations et données des ateliers ci-dessous restent utiles.

# Établi réservé et premiers ateliers Histoire — 7 novembre 2026

## Réponse au retour enfant

- La scène, la colonne des pièces et les missions scientifiques occupent des zones distinctes du même établi. Le dock est dans le flux de la page, sous la scène, au lieu de la recouvrir.
- Sur téléphone, les pièces restent en bas ; les réglages de style et de position sont repliés. La liste suit la prochaine pièce disponible.
- Les pièces disponibles passent en premier. Le filtre initial masque les pièces encore verrouillées ; « Toutes les pièces » les révèle avec leurs dépendances. Les pièces posées restent identifiables et désactivées.
- Suppression du bouton flottant de progression, redondant avec celui du dock, et de la pastille de sélection qui recouvrait les commandes.

## Ajouts au catalogue

Tous utilisent `WorkshopCanvas`, les mêmes gestes de sélection/pose, les sauvegardes, les fiches et les quiz ordinaires. Aucun espace de jeu supplémentaire.

| Atelier | Univers | Pièces | But de construction |
|---|---|---:|---|
| Portique de chantier | Chantier | 45 | Deux tours, contreventements, traverse, chariot, treuil et charge |
| Château des quatre tours | Histoire | 61 | Fondations, tours à étages, courtines, passage de porte et merlons |
| Yourte des steppes | Histoire | 41 | Plancher, montants, couronne, perches, feutre et encadrement de porte |
| Viaduc à treillis | Chantier | 56 | Appuis, tablier et deux treillis triangulés |
| Temple antique à colonnes | Histoire | 49 | Tambours, chapiteaux, poutres et toiture |
| Roue à eau du moulin | Histoire | 59 | Charpente, paliers, arbre, 25 éléments de roue et canal |
| Mon premier donjon | Histoire | 24 | Introduction guidée 6–8 ans : murs, linteau, plateforme et merlons |
| Tour solaire à double alimentation | Électronique | 59 | Tour, quatre panneaux, batterie, sélecteur, LED et 15 fils ; huit configurations d’alimentation |
| Dôme à charpente triangulée | Physique | 58 | Socle, 17 nœuds et 40 barres ; assemblage triangulé en deux couronnes |

Sources pour les fiches historiques :
- [Metropolitan Museum — The Mongolian Tent](https://www.metmuseum.org/essays/the-mongolian-tent-in-the-ilkhanid-period) : structure en bois, feutre, forme circulaire et toit conique. Le modèle pédagogique simplifie explicitement le treillis.
- [English Heritage — Middleham Castle](https://www.english-heritage.org.uk/visit/places/middleham-castle/history/description/) : enceinte et porte. Le château proposé est imaginaire ; il ne prétend pas reproduire ce monument.

- [Acropolis Museum — Empolia and polos](https://www.theacropolismuseum.gr/en/node/23902) : assemblage de tambours de colonnes. Le temple proposé est une évocation simplifiée.
- [Historic England — Watermills](https://historicengland.org.uk/listing/the-list/list-entry/1004571?section=official-list-entry) : eau, palettes et arbre. La fiche explique que la transmission vers les meules n’est pas représentée.

## Validation

- `npm run lint` passe ; 566 tests passent à ce stade.
- Les huit premiers ajouts ont été assemblés intégralement en FR/EN/AR ; tap/tap réel simulé sur téléphone pour EN, clavier et clic pour FR/AR.
- Tour solaire : 59 poses dans chaque langue, huit configurations source/jour/charge et changement de source par clic sur le sélecteur dans la scène 3D. Les fils rejoignent les composants ; la résistance comporte des pattes de connexion.
- Les neuf défis scientifiques d’origine sont joués dans les trois langues au pointeur/toucher puis rejoués au clavier. La projection de test attend le redimensionnement de la scène après repli des consignes.
- Moulin : rotation avec débit et arrêt stable vérifiés sur les pixels du canvas, sans réduction des animations ; commandes 0/1/2 et géométrie rigide de la roue vérifiées.
- Pont levant : 48 poses, ouverture, passage du bateau et fermeture dans les trois langues. Les commandes occupent la colonne de mission, hors de la scène.
- Rectangles de scène/pièces/mission/dock vérifiés sans intersection à 1280×800 FR, 768×1024 FR, 430×900 EN et 1024×768 AR ; trois positions de tiroir aux largeurs compatibles. Sur écran étroit (moins de 900 px, ou hauteur réduite), le tiroir reste en bas ; après la dernière pose il se replie avant affichage et reste réouvrable.
- Tests catalogue : identifiants, localisation, dépendances réalisables et géométries dans quatre styles.
- Tests de raccords : étages des tours, jambages/linteau, extrémités réelles des perches inclinées de la yourte, câble entre treuil et charge.
- `scripts/test-heritage-workshops.mjs` : ouverture depuis le catalogue, assemblage de chaque pièce dans un ordre alternatif respectant les dépendances, contrôle de la séparation canvas/dock ; trois langues et téléphone tactile simulé en anglais.
- Les 13 laboratoires existants ont été réassemblés et leurs essais réussis en français après réagencement. Les mêmes 13 essais passent également en EN et AR.

## Note de test tablette

Selon `TABLET_TEST_PROTOCOL.md`, les simulations navigateur ne remplacent pas le passage sur appareils réels. À faire lors du prochain retour pilote : sélection au doigt, lecture des réglages repliables, distinction des pièces disponibles/verrouillées et accès à la mission sans masquer la scène, sur iPad et Android. Le serveur local reste sur `http://127.0.0.1:7302/?admin=1` ; aucun déploiement de cette série.

## Build de vérification

Le build isolé `build/qa-etabli-histoire` a été produit sans déployer et sans modifier `dist/`. Au premier passage : 678 entrées précachées, environ 76,5 Mio. Le JS initial mesuré à 578 Ko gzip dépasse encore le budget de 400 Ko de CLAUDE.md ; la découpe des dépendances et du catalogue reste à traiter avant une optimisation de diffusion. Les pistes locales des ajouts sont régénérées par append, sans dépendance réseau pendant le jeu.
