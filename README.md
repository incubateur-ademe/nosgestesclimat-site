## Le site Web nosgestesclimat.fr

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/datagir/nosgestesclimat-site/edit/essai-gitpod/README.md)

## C'est quoi ?

Un simulateur d'empreinte climat individuelle de consommation à l'année, utilisant le modèle [nosgestesclimat](https://github.com/datagir/nosgestesclimat).

Pour contribuer au modèle et données sous-jacentes (calculs, textes, questions, suggestions de saisie), rendez-vous [ici](https://github.com/datagir/nosgestesclimat/blob/master/CONTRIBUTING.md).

Pour tout ce qui touche à l'interface (style d'un bouton, graphique de résultat, code javascript, etc.) c'est ici dans les [_issues_](https://github.com/datagir/nosgestesclimat-site/issues).

> 🇬🇧 Most of the documentation (including issues and the wiki) is written in french, please raise an [issue](https://github.com/datagir/nosgestesclimat-site/issues/new) if you are interested and do not speak French.

## Et techniquement ?

C'est un un _fork_ d'un outil de vulgarisation de l'empreinte climat [futur.eco](https://futur.eco), lui-même forké d'un simulateur public de cotisations sociales [mon-entreprise.fr](https://mon-entreprise.fr), qui permet de coder en français des règles de calculs, dans le langage [publi.codes](https://publi.codes). De ces règles de calcul, des simulateurs (pour l'utilisateur lambda) et des pages de documentation qui expliquent le calcul (pour l'expert ou le curieux) sont générés automatiquement.

Le code est en Javascript / Typescript / React / styled-components / Webpack, Yjs, entre autres.

### 🇬🇧 Installation

You need to clone another repo, https://github.com/datagir/nosgestesclimat, in the same directory than this one. The model YAML files will then be loaded locally (no installation needed, they are loaded by webpack), and your changes to these files will refresh the UI instantly.

> The production version fetches the JSON compiled YAML rules deployed by datagir/nosgestesclimat.

Then run this command in this repo :

`yarn && yarn start`

## Réutilisations de ce code

-   [L'Empreinte Carbone de vos activités à Centrale Nantes](https://github.com/SustainabilityCN/nosgestesclimat-site-ECN)
-   [Mon Match Carbone](https://github.com/pascalbes/monmatchcarbone-site)
-   [Mon Empreinte Pro](https://github.com/WeCount-io/nosgestesclimat-WC-site)

Attention, même si la licence MIT vous permet de réutiliser ce code à votre guise, vous ne pouvez pas réutiliser la marque Nos Gestes Climat. [Veuillez lire notre guide de personnalisation](https://github.com/datagir/nosgestesclimat-site/blob/master/PERSONNALISATION.md)
