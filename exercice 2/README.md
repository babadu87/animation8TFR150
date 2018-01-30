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
