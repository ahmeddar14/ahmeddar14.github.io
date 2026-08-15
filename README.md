# متعة التعلم — Metaat Ata'alom

Site statique et interactif pour apprendre l'alphabet arabe aux enfants.
Publié avec GitHub Pages : **https://ahmeddar14.github.io**

Chaque écran reprend exactement un visuel d'origine : l'image sert de fond et
les zones cliquables (boutons, tuiles) sont posées par-dessus en pourcentages,
donc tout reste aligné quelle que soit la taille de l'écran.

## Les deux parcours

| Parcours | Écrans |
|---|---|
| **الحروف الأبجدية** — les 28 lettres nues | `assets/alphabet/` |
| **الحروف مع الفتحة** — les 28 lettres avec la fatha, chacune illustrée par un mot | `assets/fatha/` |

Les deux utilisent les mêmes enregistrements (`assets/fatha/audio/`) : une
vraie voix, la même partout, qui fonctionne sur tous les appareils et hors
connexion. La synthèse vocale du navigateur a été abandonnée — elle restait
muette sur la plupart des téléphones, faute de voix arabe installée.

Depuis l'accueil : **اكتشف معانا** ouvre le premier parcours, **انضم إلينا**
ouvre le second. Sur n'importe quel écran, **المحتوى** ouvre le menu des
parcours et **الرئيسية** revient à l'accueil.

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

Les visuels sont au format 3:2. Affichés tels quels sur un écran de
téléphone en portrait, ils n'occupaient qu'un tiers de la hauteur. La scène
pivote donc d'un quart de tour pour remplir l'écran ; dès que l'appareil est
tourné, la règle CSS ne s'applique plus et l'affichage redevient normal.

## Structure du dépôt

```
index.html                 les 5 écrans (accueil, 2 grilles, 2 fiches)
css/styles.css             mise en page, zones cliquables, animations
js/app.js                  données des 28 lettres, navigation, son
assets/
  favicon.png
  alphabet/                visuels du parcours « lettres nues »
    home.jpg  grid.jpg     accueil et grille
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
