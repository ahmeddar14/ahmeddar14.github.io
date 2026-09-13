# متعة التعلم — Metaat Ata'alom

Site statique et interactif pour apprendre l'alphabet arabe aux enfants.
Publié avec GitHub Pages : **https://ahmeddar14.github.io**

Chaque écran reprend exactement un visuel d'origine : l'image sert de fond et
les zones cliquables (boutons, tuiles) sont posées par-dessus en pourcentages,
donc tout reste aligné quelle que soit la taille de l'écran.

## Les 15 leçons

L'écran **المحتوى** (`assets/ui/lessons.jpg`) reprend le sommaire
« الحروف والمقاطع » : 15 leçons réparties en trois colonnes. Deux ont du
contenu aujourd'hui :

| N° | Leçon | Écrans |
|---|---|---|
| 1 | **الحروف المجردة** — les 28 lettres nues | `assets/alphabet/` |
| 5 | **الحروف مع الفتحة** — les 28 lettres avec la fatha, chacune illustrée par un mot | `assets/fatha/` |

Les 13 autres apparaissent voilées avec un cadenas et annoncent « bientôt »
au clic. Pour en ouvrir une, il suffit de déposer ses visuels et d'ajouter
`go:` sur son entrée dans le tableau `LESSONS` de `js/app.js`.

Le sommaire signale un doublon présent dans la maquette : les leçons 1 et 4
portent le même intitulé, **الحروف المجردة**.

Ces deux leçons utilisent les mêmes enregistrements (`assets/fatha/audio/`) : une
vraie voix, la même partout, qui fonctionne sur tous les appareils et hors
connexion. La synthèse vocale du navigateur a été abandonnée — elle restait
muette sur la plupart des téléphones, faute de voix arabe installée.

Depuis l'accueil, **أكتشف معانا** et **المحتوى** ouvrent le sommaire ;
**الرئيسية** revient à l'accueil depuis n'importe quel écran.

## Navigation dans une fiche

- clic sur la lettre ou sur le haut-parleur → prononce la lettre
- flèches gauche / droite (souris, clavier) ou balayage tactile → lettre précédente / suivante
- `Échap` ou le bouton en haut à gauche → retour à la grille
- `Espace` → réécouter
- le bouton ▶ de la grille enchaîne les 28 lettres

L'adresse suit l'écran affiché (`#fatha/12`), donc le bouton « retour » du
navigateur ou du téléphone recule d'un écran au lieu de quitter le site, et
un lien vers une lettre précise peut être partagé.

## Téléphone tenu à la verticale

Les visuels sont horizontaux. Affichés tels quels sur un écran de téléphone
en portrait, ils n'occupaient qu'un tiers de la hauteur. La scène pivote donc
d'un quart de tour pour remplir l'écran ; dès que l'appareil est tourné, la
règle CSS ne s'applique plus et l'affichage redevient normal.

## Structure du dépôt

```
index.html                 les 6 écrans (accueil, sommaire, 2 grilles, 2 fiches)
css/styles.css             mise en page, zones cliquables, animations
js/app.js                  les 15 leçons, les 28 lettres, navigation, son
assets/
  favicon.png
  ui/
    home.jpg               accueil (16:9, maquette Figma)
    lessons.jpg            sommaire des 15 leçons (16:9)
  alphabet/                visuels du parcours « lettres nues »
    grid.jpg               grille des 28 lettres
    alef.jpg … shin.jpg    fiches fournies
    plate-*.jpg            plaques vierges : la lettre est dessinée en SVG par-dessus
  fatha/                   visuels du parcours « avec fatha »
    grid.jpg               grille des 28 lettres
    alef.jpg … ya.jpg      une fiche par lettre
    audio/
      alef.mp3 … ya.mp3    prononciation de chaque lettre
.nojekyll                  GitHub Pages sert les fichiers tels quels
```

Les fichiers d'une même lettre portent tous le même identifiant latin
(`alef`, `ba`, `ta`, … `ya`), défini dans le tableau `LETTERS` de `js/app.js` :
ajouter une lettre ou un parcours revient à déposer les fichiers et à
compléter ce tableau.

## Développement

Aucune dépendance ni étape de build. Pour prévisualiser en local :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

Toute modification poussée sur la branche par défaut est publiée
automatiquement par GitHub Pages.

## Deux formats d'écran

Les visuels du sommaire et de l'accueil sont en 16:9, ceux des leçons en 3:2.
Plutôt que de déformer les uns ou les autres, la scène change de ratio en
même temps que l'écran : `js/app.js` pose `--arw` / `--arh` sur `.stage`, et
la largeur suit. Ajouter un écran d'un troisième format ne demande qu'une
entrée dans `RATIO`.
