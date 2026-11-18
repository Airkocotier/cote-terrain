# Côté Terrain

Le site de **Côté Terrain**, l'appli gratuite des entraîneurs de volley : fiches d'exercices, séances, mode direct au gymnase, rotations 5-1 et suivi de match. Sans compte, sans publicité, sans collecte de données.

- Site : https://airkocotier.github.io/cote-terrain/
- Politique de confidentialité : https://airkocotier.github.io/cote-terrain/confidentialite.html
- Contact : coteterrain@tutamail.com

## Contenu du dépôt

Ce dépôt est un site « statique » : de simples fichiers, sans base de données ni programme sur le serveur. GitHub Pages le publie automatiquement (branche `main`, dossier racine) à chaque modification.

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'accueil : présentation, fonctions, téléchargement, contact. Le HTML, c'est le **contenu** (textes, images, liens). |
| `confidentialite.html` | La politique de confidentialité. C'est l'adresse donnée au Play Store et au Microsoft Store. |
| `style.css` | La **mise en forme** des deux pages : couleurs, polices, tailles, disposition. Les couleurs sont en haut du fichier : changer `--bleu` change le bleu partout. |
| `img/` | Les captures d'écran de l'appli et l'icône. |
| `polices/` | Les deux polices du site, hébergées avec lui (rien n'est chargé chez Google). Licences libres (OFL) dans le dossier. |
| `telechargements/` | Le programme d'installation Windows. |

## Mettre à jour pour une nouvelle version

1. Déposer le nouveau `CoteTerrain-Setup-x.y.z.exe` dans `telechargements/`.
2. Dans `index.html`, chercher l'ancien numéro de version (Ctrl+F) : il apparaît 3 fois (version, nom du fichier, lien). Le remplacer.


