# Revue des raccords mécaniques du 6 novembre 2026

Le relevé initial comptait 50 paires pièce–dépendance sur 40 modèles mécaniques. Vingt paires ont fait l’objet d’un ajustement dans les modèles signalés. Les 30 autres ont au moins un support voisin dont la boîte englobante touche celle de la pièce. Le contrôle a conservé ces placements. Le fichier de mesures garde les distances initiales dans `distance` et liste les supports les plus proches après correction dans `nearest`. [Mesures par modèle et par pièce](mechanical-contact-review.json)

| Famille | Paires initiales traitées | Correction et résultat |
|---|---:|---|
| Hélices d’avion | 9 | Le moyeu rejoint la face du nez ou du moteur radial. Écart AABB initial de 0,051 à 0,081 unité. |
| Paraboles de rovers | 4 | Le pied rejoint le plateau solaire. Écart initial de 0,116 unité. |
| Chariot et crochet de grue à tour | 1 | Le chariot rejoint la flèche et le câble descend sous elle. La rotation autonome du chariot a été retirée. Écart initial de 0,551 unité. |
| Radar du rotor | 1 | Le pied rejoint le moyeu au-dessus des pales. Écart initial de 0,065 unité. |
| Panneau solaire de poupe | 1 | Le moyeu rejoint le toit de la cabine. Écart initial de 0,055 unité. |
| Tuyères d’orbiteur | 4 | La plaque rejoint le fuselage et les sorties pointent vers l’arrière. Écart initial de 0,156 à 0,357 unité. |

Le fuselage en capsule avait une erreur d’axe. Modifier l’épaisseur verticale changeait aussi sa longueur. Le changement d’échelle s’applique maintenant à l’axe local qui devient vertical après rotation. Les 20 paires corrigées ont désormais un écart AABB nul avec leur support déclaré. Les archétypes partagés transmettent aussi les corrections aux variantes hors du relevé initial.

Les 30 autres signaux concernent souvent l’ordre de montage. Le chasse-pierres rejoint le cadre plutôt que le bogie, la tête de moissonneuse rejoint le châssis plutôt que les roues, et le robot sous-marin embarqué peut reposer sur le pont alors que la grue est un préalable. Un chevauchement de boîtes indique une proximité. L’examen visuel doit encore confirmer le contact de surface et la lisibilité des assemblages les plus chargés, notamment les deux robots sous-marins, le radar du biplan polaire et le train arrière de l’avion hybride.

La suite ciblée vérifie 23 raccords en style Blocs avec les maillages du jeu. Elle lance un rayon dans l’axe du point de fixation pour atteindre les triangles du support, contrôle le sens et le dégagement des tuyères et vérifie que l’épaisseur du fuselage peut varier sans modifier sa longueur. `npm test -- src/three/mechanicalContacts.test.ts` donne 24 tests réussis. `npm run lint` passe également.

Pour refaire la mesure sur les mêmes 40 modèles, lancer `npx tsx scripts/review-mechanical-contacts.ts` depuis la racine du dépôt. Pour la recette tablette, ouvrir au minimum le Monomoteur d’Aéroclub, la Grue à Tour, le Rover Planétaire Autonome et la Navette Expédition. Assembler les pièces concernées et inspecter les raccords de profil, de face et de dessus. Faire un essai avec les styles Bois et Blocs. Le geste tactile et les contacts sous animation restent à observer sur appareil physique.
