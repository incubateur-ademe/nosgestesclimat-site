# UI translation

The website UI is automatically translated in [available languages](TODO: link
to translation.ts). This is achieved with
[`react-i18next`](https://react.i18next.com/).

## Architecture

Files related to the translation are available in the folder
[`source/locales`](https://github.com/datagir/nosgestesclimat-site/tree/master/source/locales).

In particular:

- `ui-<lang>.yaml` are the resource files used by [`react-i18next`](https://react.i18next.com/).
    Its associates the translated text to the corresponding id.

## Available scripts

Scripts related to the translation are stored in the folder
[`scripts/i18n`](https://github.com/datagir/nosgestesclimat-site/tree/master/scripts/i18n).

In particular:

`utils.js`

: Contains all utility functions used in the other scripts.

`ui-fr-generate.js`

: allows to analyse the source code to generate the reference resource file --
 `source/locales/ui-fr.yaml`.
To run this script:

```
npm run translate:ui:fr:gen
```

## Workflow

Les traductions se trouvent dans le répertoire `source/locales`.

La librairie utilisée pour la traduction de l'UI est
[react-i18next](https://react.i18next.com/).

Lorsque l'on introduit une nouvelle chaîne de caractère dans l'UI il faut
systématiquement penser à gérer sa traduction, via un composant `<Trans>`, ou
via la fonction `t`

Le circle-ci fait une analyse statique du code pour repérer les chaînes non
traduites, dans le moteur et l'UI :

```sh
$ yarn run i18n:rules:check
$ yarn run i18n:ui:check
```

Pour traduire automatiquement les chaînes manquantes via l'api Deepl :

```sh
$ yarn run i18n:rules:translate
$ yarn run i18n:ui:translate
```

N'oubliez pas de vérifier sur le diff que rien n'est choquant.
