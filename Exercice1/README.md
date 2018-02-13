# Exercice #1

## Notes pour la remise

Cet exercice est dû pour le **30 janvier 2018**.

La remise électronique se fait via la plateforme Moodle.

N'oubliez pas d'inscrire le nom de vos coéquipiers dans un fichier texte à la racine du projet!

## Objectif

À l'aide de ce projet, implémenter le contenu des classes `Vector` et `Matrix` afin de réussir les tests unitaires.

Ces tests peuvent être déclenchés en ouvrant la page *index.html* dans un navigateur Web, en console en exécutant `npm run test` depuis le dossier du projet, ou lancés via le déboggueur de [Visual Studio Code](https://code.visualstudio.com/).

## Notes

* Le langage utilisé est [TypeScript](https://www.typescriptlang.org/), qui est un dialecte de JavaScript ajoutant le concept de "types" au langage afin de limiter les erreurs. Ce langage doit être compilé afin d'être utilisable.
* Pour des raisons de sécurité, plusieurs navigateurs vont refuser de charger des fichiers de façon asynchrone lorsque le protocole de fichiers locaux est utilisé (adresses de type `file://`). Pour pallier à ça, il peut être plus simple d'installer un serveur Web (voir dernière section). Les tests devraient tout de même fonctionner, mais les piles d'appels pourraient être plus difficiles à interpréter.
* Utilisez la console JavaScript de votre navigateur  ([Firefox](https://developer.mozilla.org/fr/docs/Outils/Console_Web), [Chrome](https://developers.google.com/web/tools/chrome-devtools/debug/console/console-ui), [Safari](https://developer.apple.com/safari/tools/), [IE](https://msdn.microsoft.com/en-us/library/dn255006%28v=vs.85%29.aspx), [Edge](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/f12-devtools-guide/console/)) et les méthodes de l’objet [console](https://developer.mozilla.org/fr/docs/Web/API/Console) pour débogger votre code!
* Je suggère d'utiliser l'environnement de développement [Visual Studio Code](https://code.visualstudio.com/), en suivant [la procédure d'installation de TypeScript](https://code.visualstudio.com/docs/languages/typescript).

## Installation d'un serveur Web simple
Afin d'éviter les problèmes liés aux requêtes inter-origines lors de l'utilisation du protocole `file://`, il peut être pratique d'installer un serveur Web.

Je vous suggère d'installer [Node.js](https://nodejs.org/en/), en version courante.

Lorsqu'installé, depuis l'invite de commande du système d'exploitation, installer le serveur [http-server](https://github.com/indexzero/http-server) via la commande:

    npm install -g http-server

Vous devrez probablement exécuter la commande avec des droits d'administrateur afin que l'installation fonctionne correctement.

Finalement, depuis le dossier de projet, vous pourrez exécuter le serveur, en spécifiant le port d'écoute:

    http-server -c-1 -p 8080

Dans cet exemple, on spécifie le port d'écoute *8080* (les fichiers seront donc disponibles via l'URL [http://localhost:8080/](http://localhost:8080/)), et l'option *-c-1* indique de ne pas conserver les fichiers en cache, ce qui est utile pour le développement.
