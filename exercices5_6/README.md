# Exercices

## Installation d'un serveur Web simple
Afin d'éviter les problèmes liés aux requêtes inter-origines lors de l'utilisation du protocole `file://`, il peut être pratique d'installer un serveur Web.

Je suggère d'installer [Node.js](https://nodejs.org/en/), en version courante.

Lorsqu'installé, depuis l'invite de commande du système d'exploitation, installer le serveur [http-server](https://github.com/indexzero/http-server) via la commande:

    npm install -g http-server

Il faut probablement exécuter la commande avec des droits d'administrateur afin que l'installation fonctionne correctement.

Finalement, depuis le dossier de projet, on peut exécuter le serveur, en spécifiant le port d'écoute:

    http-server -c-1 -p 8080

Dans cet exemple, on spécifie le port d'écoute *8080* (les fichiers seront donc disponibles via l'URL [http://localhost:8080/](http://localhost:8080/)), et l'option *-c-1* indique de ne pas conserver les fichiers en cache, ce qui est utile pour le développement.

## Exercice 2.1

*Objectif:* Utilisation des tampons de vertex et d'indices

En plus du triangle rouge qui tourne, dessiner un carré bleu qui effectue une douce translation à l'écran.

## Exercice 2.2

*Objectif:* Configuration du vertex array object et transfert de données aux shaders

Ajouter les données nécessaires au tampon de vertex (vertexBuffer) du triangle pour colorer ses pointes de couleurs différentes (rouge, vert et bleu), et ainsi le remplir d'un dégradé coloré.

## Exercice 2.3

*Objectif:* Se familiariser avec la création dynamique de maillages

À l'aide de son équation mathématique, dessiner une parabole jaune remplie.

## Exercice 2.4

*Objectif:* Utilisation de paramètres uniformes dans le câdre d'un vertex shader

Faire osciller verticalement (sinus) la parabole jaune en manipulant sa position depuis le vertex shader, selon le temps.

## Exercice 3.1

*Objectif:* Appliquer une texture et comprendre les coordonnées de texture et leur utilisation dans un fragment shader

Remplacer la couleur bleue du carré de l'exercice 2.1 par la texture d'arbre.

## Exercice 3.2

*Objectif:* Pouvoir configurer la fonction de mélange

Corriger la fonction de mélange du carré de l'exercice 3.1 afin de considérer correctement la transparence. Le contour de l'arbre ne devrait pas être blanc mais bien affiché...

## Exercice 3.3

*Objectif:* Paramétrer une texture et y appliquer une transformation

En utilisant une variable uniforme représentant le temps, faire défiler la texture sur le carré de l'exercice 3.2.

## Exercice 3.4

*Objectif:* Appliquer un effet faisant intervenir plusieurs textures

En utilisant la texture de déformation et une variable uniforme représentant le temps, appliquer une déformation dynamique sur la texture du carré de l'exercice 3.2.

## Exercice 3.5

*Objectif:* Utiliser une texture dans un vertex shader

En utilisant la texture de terrain et la texture d'altitude, créer un maillage utilisant une carte de hauteur (heightmap). Vous devrez créer un maillage horizontal contenant plusieurs sommets déformés à l'aide du vertex shader, y appliquer la texture d'altitude par le fragment shader, et le faire pivoter autour de l'axe vertical en mettant à jour sa matrice de transformation.

## Exercice 4.1

*Objectif:* Interpréter des méta-données générées depuis un outil

En modifiant la méthode `Sprite.tick()` du fichier `spriteAnim.ts`, ajuster les coordonnées UV des sprites afin qu'elles utilisent les bonnes parties de la feuille de sprite. La zone à afficher, en nombre de pixels, est spécifiée dans la propriété `frame` de la variable `frameDesc`. Vous aurez sans doute besoin de la taille de la texture au complet afin de normaliser les valeurs entre 0 et 1. La taille de cette texture est spécifiée dans la section de méta-données du fichier de description.

## Exercice 4.2

*Objectif:* Interpréter d'autres méta-données générées depuis un outil

Les dimensions des sprites ne semble pas correctes. En utilisant la propriété `sourceSize` de la variable `frameDesc`, et en utilisant les informations du pivot stockées dans la propriété du même nom, ajuster la sprite afin qu'elle ait la bonne taille et qu'elle soit centrée correctement selon le pivot.

## Exercice 4.3

*Objectif:* Implémenter une animation de sprite

Afin d'ajouter un peu de vie au démo, implémenter le changement de sprite selon le temps. Lorsqu'une sprite est affichée pour plus de temps que ce qui est précisé par la variable `frameLength`, passer à un autre frame. Assurez-vous de vérifier si ce frame existe effectivement. Autrement, revenir au premier frame.

## Exercice 5.1

*Objectif:* Appliquer une transformation de maillage depuis un squelette

Rechercher dans les fichiers de code (`vecAnim.ts`, `debugSkin.vert` et `skinned.vert`) le commentaire ```// SKINNING``` et implémenter les déformation de maillage à l'aide du vertex shader. Le gros du travail est fait, il ne reste qu'à appliquer les matrices de transformation pondérées au modèle. Vous devrez évidemment décommenter les sections identifiées afin de transférer correctement les paramètres. Vous pourrez vérifier la déformation du modèle à l'aide des barres de contrôles (*sliders*) de la page web.

Le modèle et son squelette est fait de façon très brute et certaines zones de transitions peuvent former des pointes, ignorer ce détail.

## Exercice 5.2

*Objectif:* Animer le squelette à l'aide d'une animation cinématique

Créer une animation par *key frames* du maillage en définissant votre propre structure de données, et l'exécuter.

## Exercice 5.3

*Objectif:* Implémenter une stratégie de cinématique inverse

Faire suivre le curseur par l'extrémité du modèle, en complétant la méthode `Skeleton.onMouseMove`. Bonne chance!

Il est important de se limiter aux stratégies fonctionnant en 2D afin de simplifier le problème.

## Exercice 6

*Objectif:* Faire un système masse-ressort

Créer un carré composé d'un maillage de 20x20 sommets, et y appliquer une texture.
Lier chaque sommet à ses voisins et définir une distance désirée. À chaque itération de la boucle, vérifier sa distance réelle par rapport à sa distance désirée, et tenter de l'en rapprocher, en s'inspirant des équations d'un ressort.
Fixer les sommets d'un côté du carré afin qu'ils ne bougent pas. Ajouter une manière quelconque d'appliquer une déformation (bouton, souris, fonction appelée à un temps aléatoire, etc.).
