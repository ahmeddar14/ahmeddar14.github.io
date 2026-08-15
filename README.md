# متعة التعلم — Metaat Ata'alom

Site statique et interactif pour apprendre l'alphabet arabe aux enfants.
Publié avec GitHub Pages : **https://ahmeddar14.github.io**

Chaque écran reprend exactement un visuel d'origine : l'image sert de fond et
les zones cliquables (boutons, tuiles) sont posées par-dessus en pourcentages,
donc tout reste aligné quelle que soit la taille de l'écran.

## Les deux parcours

| Parcours | Écrans | Son |
|---|---|---|
| **الحروف الأبجدية** — les 28 lettres nues | `assets/alphabet/` | voix de synthèse du navigateur (`speechSynthesis`, `ar-SA`) |
| **الحروف مع الفتحة** — les 28 lettres avec la fatha, chacune illustrée par un mot | `assets/fatha/` | fichiers MP3 enregistrés (`assets/fatha/audio/`) |

Depuis l'accueil : **اكتشف معانا** ouvre le premier parcours, **انضم إلينا**
ouvre le second. Sur chaque écran, **الرئيسية** revient à l'accueil et
**المحتوى** revient à la grille des lettres.

## Navigation dans une fiche

- clic sur la lettre ou sur le haut-parleur → prononce la lettre
- flèches gauche / droite (souris, clavier) ou balayage tactile → lettre précédente / suivante
- `Échap` ou le bouton en haut à gauche → retour à la grille
- `Espace` → réécouter

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
