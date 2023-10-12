## Le site Web nosgestesclimat.fr

## C'est quoi ?

Un simulateur d'empreinte climat individuelle de consommation à l'année, utilisant le modèle [nosgestesclimat](https://github.com/datagir/nosgestesclimat).

Pour contribuer au modèle, données sous-jacentes et textes du questionnaire (calculs, facteurs d'émission, textes, questions, réponses, suggestions de saisie), [suivez le guide de contribution](https://github.com/datagir/nosgestesclimat/blob/master/CONTRIBUTING.md).

Pour tout ce qui touche à l'interface (style d'un bouton, graphique de résultat, code javascript, etc.) c'est ici [sur le dépôt du *site*](https://github.com/datagir/nosgestesclimat-site/issues).

> 🇬🇧 Most of the documentation (including issues and the wiki) is written in french, please raise an [issue](https://github.com/datagir/nosgestesclimat-site/issues/new) if you are interested and do not speak French.

## Et techniquement ?

C'est un _fork_ d'un outil de vulgarisation de l'empreinte climat [futur.eco](https://futur.eco), lui-même forké d'un simulateur public de cotisations sociales [mon-entreprise.fr](https://mon-entreprise.fr), qui permet de coder en français des règles de calculs, dans le langage [publi.codes](https://publi.codes). De ces règles de calcul, des simulateurs (pour l'utilisateur lambda) et des pages de documentation qui expliquent le calcul (pour l'expert ou le curieux) sont générés automatiquement.

Le code est en Javascript / Typescript / React / styled-components / Webpack, Yjs, entre autres.

### 🇬🇧 Installation

The footprint model is stored in the [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules) `nosgestesclimat/` pointing to the corresponding GitHub [repository](https://github.com/datagir/nosgestesclimat).

Consequently, to fetch all the data you need to provide the `--recursive` flag when cloning this repository or if it's already cloned you need to run `git submodule update --init --recursive`.

The model YAML files will then be loaded locally (no installation needed, they are loaded by webpack), and your changes to these files will refresh the UI instantly.

> The production version fetches the JSON compiled YAML rules deployed by datagir/nosgestesclimat.

Then run this command from this repo:

```
yarn && yarn start
```

> Note: recompiling the model in all supported regions and languages could significantly slow down your dev process.
> Therefore, instead of running `yarn start` you can run webpack in dev mode with `yarn serve` and watch the compilation of the model in a specified language and region with `yarn model:rules-watch -t fr -o FR`.

If you want to run the automatic localisation, which depends on a Netlify Edge function, you must run `netlify dev`.

### 🇬🇧 Tests

You can run e2e tests (Cypress) by first starting a local server with `yarn run
serve`, then, run cypress tests with `yarn run test` (or `yarn run e2e` to open
the Cypress GUI) -- it will generate [personas spec
files](https://github.com/datagir/nosgestesclimat-site/wiki/Contributing#tests).

## Réutilisations de ce code

Attention, même si la licence MIT vous permet de réutiliser ce code à votre guise, en citant clairement le fait que vous reprenez nos travaux, vous ne pouvez pas réutiliser la marque Nos Gestes Climat. [Veuillez lire notre guide de personnalisation](https://github.com/datagir/nosgestesclimat-site/blob/master/PERSONNALISATION.md)
