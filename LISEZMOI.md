# Site de Côté Terrain

Créé par Paul-Marie avec l'aide de Claude.

Ce dossier est un site « statique » : de simples fichiers, sans base de données ni programme sur le serveur.
N'importe quel hébergeur peut le servir tel quel (GitHub Pages, ton homelab avec Nginx, OVH…).

## Ce que contient chaque fichier

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'accueil : présentation, fonctions, téléchargement, contact. Le HTML, c'est le **contenu** (les textes, les images, les liens). |
| `confidentialite.html` | La politique de confidentialité. C'est l'adresse de cette page qu'on donne au Play Store. |
| `style.css` | La **mise en forme** des deux pages : couleurs, polices, tailles, disposition. Les couleurs sont en haut du fichier (les « jetons ») : changer `--bleu` change le bleu partout. |
| `img/` | Les captures d'écran de l'appli et l'icône. |
| `polices/` | Les deux polices du site, hébergées avec lui (rien n'est chargé chez Google). Licences libres (OFL) dans le dossier. |
| `telechargements/` | Le programme d'installation Windows. |

## Mettre à jour pour une nouvelle version

1. Remplacer le fichier dans `telechargements/` par le nouveau `CoteTerrain-Setup-x.y.z.exe`.
2. Dans `index.html`, chercher `1.10.9` (Ctrl+F) : il apparaît 3 fois (version, nom du fichier, lien). Remplacer.

## Mettre en ligne sur GitHub Pages (gratuit)

1. Créer un compte sur github.com (avec l'adresse Tuta, pas le Gmail perso).
2. Créer un dépôt (« New repository ») public, par exemple `cote-terrain`.
3. « Add file » > « Upload files » : glisser **le contenu** de ce dossier (pas le dossier lui-même), puis « Commit changes ».
4. Settings > Pages > Source : « Deploy from a branch », branche `main`, dossier `/ (root)` > Save.
5. Après une à deux minutes, le site est en ligne à l'adresse `https://<ton-pseudo>.github.io/cote-terrain/`.
6. L'adresse de la confidentialité pour le Play Store sera alors :
   `https://<ton-pseudo>.github.io/cote-terrain/confidentialite.html`

Plus tard, on pourra ranger les .exe dans les « Releases » de GitHub (fait pour ça) plutôt que dans le site.
