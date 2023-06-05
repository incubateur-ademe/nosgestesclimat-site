# Comment contribuer ?

Merci de prendre le temps de contribuer ! 🎉

> Attention : ce document vous explique comment contribuer au code de l'interface de Nos Gestes Climat. Pour le modèle, les calculs de gaz à effet de serre, les textes des questions, les gestes climat, etc c'est par [ici](https://github.com/datagir/nosgestesclimat/blob/master/CONTRIBUTING.md).

> Si vous créez une PR (Pull Request, proposition de changements) de modification du modèle datagir/nosgestesclimat, ajoutez simplement `?branch=votre-nouvelle-branche` à l'adresse pour tester le site avec vos modifications des modèles.

Pour contribuer au code du site, RDV dans la section _issues_ pour voir les discussions et avancement actuels.

Ci-dessous des informations plus générales sur la contribution.

### Technologies

Nous utilisons :

-   [publicodes](https://publi.codes) pour notre modèle de calcul nouvelle génération
-   [TypeScript](https://www.typescriptlang.org) pour ajouter un système de typage à notre code JavaScript. Le typage n'est pas utilisé partout et il n'est pas obligatoire de le prendre en compte pour contribuer.
-   [Yarn](https://yarnpkg.com/fr) pour la gestion des dépendances (à la place de NPM qui est souvent utilisé dans les applications JavaScript)
-   [React](https://reactjs.org) pour la gestion de l'interface utilisateur
-   [Redux](https://redux.js.org) pour gérer le “state” de l'application côté client
-   [Prettier](https://prettier.io/) pour formater le code source, l'idéal est de configurer votre éditeur de texte pour que les fichiers soit formatés automatiquement quand vous sauvegardez un fichier. Si vous utilisez [VS Code](https://code.visualstudio.com/) cette configuration est automatique.
-   [Webpack](https://webpack.js.org) pour le “bundling”
-   [Eslint](http://eslint.org) qui permet par exemple d'éviter de garder des variables inutilisées
-   [Ramda](https://ramdajs.com) comme libraire d'utilitaires pour manipuler les listes/objects/etc (c'est une alternative à lodash ou underscore), mais nous voulons nous en débarasser.
-   Nous ne testons pour l'instant pas l'application Web (la librairie de calcul publicodes l'est), c'est une amélioration possible de nosgestesclimat-site

### Démarrage

Si l'historique des commits est trop volumineux, vous pouvez utiliser le paramètre `depth` de git pour ne télécharger que les derniers commits.

```
# Clone this repo on your computer
git clone --depth 100 git@github.com:datagir/nosgestesclimat-site.git && cd nosgestesclimat-site

# Install the Javascript dependencies through Yarn
yarn install

# Watch changes in publicodes and run the server for mon-entreprise
yarn start
```

Pour le développement local, il est important de cloner datagir/nosgestesclimat dans le même répertoire que celui-ci : ainsi les modèles sont chargées depuis votre disque, ce qui vous donne accès au rechargement à chaud de l'application si vous modifiez par exemple une question ou un facteur d'émission.

L'application est exécutée sur https://localhost:8080.

### Messages de commit

A mettre sans retenue dans les messages de commit :

https://github.com/atom/atom/blob/master/CONTRIBUTING.md#git-commit-messages

-   🎨 `:art:` when working on the app's visual style
-   🐎 `:racehorse:` when improving performance
-   📝 `:memo:` when writing docs
-   🐛 `:bug:` when fixing a bug
-   🔥 `:fire:` when removing code or files
-   💚 `:green_heart:` when fixing the CI build
-   ✅ `:white_check_mark:` when adding tests
-   ⬆️ `:arrow_up:` when upgrading dependencies
-   :sparkles: `:sparkles:` when formatting, renaming, reorganizing files

Et ceux spécifiques au projet :

-   :gear: `:gear:` pour une contribution au moteur qui traite les YAML
-   :hammer: `:hammer:` pour une contribution à la base de règles
-   :calendar: `:calendar:` pour un changement de règle du à une évolution temporelle (en attendant mieux)
-   :chart_with_upwards_trend: `:chart_with_upwards_trend:` pour une amélioration du tracking
-   :alien: `:alien:` pour ajouter des traductions
-   :wheelchair: `:wheelchair:` pour corriger les problèmes liés à l'accessibilité
-   :fountain_pen: `:fountain_pen:` pour séparer les commits liés à la modification du contenu
-   :mag: `:mag:` pour les modifications liées au référencement naturel

### Serveur

La fonctionnalité principale de Nos Gestes Climat, le parcours test-action se fait totalement côté client, sans serveur. Nous utilisons par contre un serveur sur les modes groupe, ainsi que pour la fonctionnalité de partage de simulation. Le code du serveur [sera rendu public bientôt](https://github.com/datagir/nosgestesclimat-site/issues/1100).

Le sondage fonctionne avec un serveur qui héberge une base de données Mongo. Quand on lance une branche de démo, c'est une branche qui peut avoir des problèmes, par définition. Donc on ne la branche pas sur la base de données de production.

Nos branches de démo n'ont pas été configurées pour se brancher sur une base de données de dev automatiquement. Les instructions sont côté serveur pour le faire manuellement. 

Le plus simple pourrait être de les brancher sur une *unique* base de données de test, qui ne contiendrait rien d'important : elle pourrait être corrompue, fuitées, etc. En effet, la base n'étant pas nécessaire au fonctionnement de NGC, le sondage n'étant qu'un dixième du parcours, ça me semble inutile de faire naitre une BDD toute neuve à chaque branche de dev. 


### Tests

Nous mettons en place des tests progressivement dans ce dépôt : 
- nous avons introduit des tests de score de notre dizaine de personas pour suivre l'évolution des résultats calculés du modèle à chaque PR côté modèle
- nous avons introduit des tests bout-à-bout (E2E) qui simulent des utilisateurs sur un certain nombre de parcours (exemple : trouver un bouton contenant "Faire le test" sur la page d'accueil)

Cela dit, la bibliothèque publicodes sur laquelle notre calcul est basée est bien testée.

Nous privilégions pour l'instant une écoute attentive des retours utilisateurs : nous en avons eu et traité plus de 500 dans les 6 premiers mois du développement, et des milliers depuis. 

### Traduction 👽

Les informations sur la traductions sont disponible [ici](./docs/translating.md).

### CI/CD

-   [Netlify](https://www.netlify.com/), s'occupe de l’hébergement du site sur Internet sur internet avec gestion des DNS et diffusion du code sur un réseau de CDN. Le site est donc théoriquement fourni depuis des serveurs fonctionnant à l'électricité bas carbone française.

### Analyse des bundles

La commande `yarn stats` gènere une visualisation interactive du contenu packagé, à visualiser avec [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)

### Publicodes

Un tutoriel sur publicode est disponible sur https://publi.codes.
