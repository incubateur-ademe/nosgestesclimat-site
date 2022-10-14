<h1 align="center">Translation of the UI</h1>


<p align="center">This file contains all the information about the translation of the UI of <a href="https://nosgestesclimat.fr/">nosgestesclimat.fr</a>.</p>

<p align="center">The website UI is automatically translated in different natural languages -- this is achieved with
<a href="https://react.i18next.com/"><code>react-i18next</code></a>.</p>

> For the model (test's questions) translation, please refer to this [file](https:/github.com/datagir/nosgestesclimat/blob/master/docs/translation.md).

---

<!-- vim-markdown-toc GitLab -->

* [Workflows](#workflows)
    * [Editing the source code](#editing-the-source-code)
    * [Adding a new language](#adding-a-new-language)
* [Architecture](#architecture)
* [Available scripts](#available-scripts)
    * [`generate-ui.js`](#generate-uijs)
    * [`translate-ui.js`](#translate-uijs)
    * [`translate-md.js`](#translate-mdjs)
    * [`translate-faq.js`](#translate-faqjs)
    * [`translate-releases.js`](#translate-releasesjs)

<!-- vim-markdown-toc -->

---

## Workflows

### Editing the source code

When adding a new string containing a content which need to be translated,
you need to wrap it inside a [`Trans`](https://react.i18next.com/latest/trans-component) React component
or inside a function call to [`t`](https://react.i18next.com/latest/usetranslation-hook).

Once the content modified,

1. you can update the resource files with the [`generate-ui.js`](#generate-ui.js) script.
    <details>
    <summary>Script output example</summary>

    ```
    > yarn run generate:ui

    > nosgestesclimat-site@2.1.0 generate:ui
    > node scripts/i18n/generate-ui.js

    Static analysis of the source code...
    Adding missing entries...
    + Added 2 translations:
        Cacher l'objectif
        catégorie complétée
    ~ Updated 1 translations:
        components.stats.StatsContent.enSavoirPlus
    - Missing 2 translations:
        components.conversation.select.NumberedMosaic.choixAFaire
        components.conversation.select.NumberedMosaic.choixEnTrop
    Writting resources in /home/emile/Projects/datagir/nosgestesclimat-site/source/locales/ui/ui-fr.json...

    ```
    </details>

    For _added_ and _updated_ entries, their translation are automatically
    retrieved from the source code. However, for missing entries, you need
    to replace the `'NO_TRANSLATION'` string by the adequate one.

2. then, you need to translate the generated resource file into the other supported languages.
This can be done automatically by using [`translate-ui.js`](#translate-ui.js).

For non _hardcoded_ content such as the FAQ or Markdown pages.
You need to modify the corresponding file inside `.source/locales/pages/` (resp. `.source/locales/faq`)
and then run the script [`translate-md.js`](#translate-md.js) (resp. [`translate-faq.js`](#translate-faq.js))
to translate it in the remaining languages.

> **Important**:
>
> - you need to manually retranslate into french the internal page url.
> - the automatic translation rely on the Deepl API. Consequently, you need
>   to set the environment variable `DEEPL_API_KEY` before running
>   `translate-*.js` scripts.

### Adding a new language

To support a new language you need to modify the [`./source/locales/translations.ts`]()
file, by adding:

* a new enum value to `Lang`,
* complete all related switch statements,
* add corresponding import statements for [`faq`](#) and [`releases`](#),
* runs all needed scripts as described [here](#edit-the-source-code).

## Architecture

Files related to the translation are available in the folder
[`source/locales`](https://github.com/datagir/nosgestesclimat-site/tree/master/source/locales).

In particular:

- `ui/ui-<lang>.yaml` are the resource files used by [`react-i18next`](https://react.i18next.com/).
    It associates the translated text to the corresponding id.
- `pages/<lang>/*.md` are the Markdown files used for pages with static contents.
- `faq/FAQ-<lang>.yaml` contains the FAQ questions.
  > They are stored in the YAML format to be easily exported as metadata for Google.
- `faq/releases-<lang>.yaml` contains the fetched releases content.

## Available scripts

Scripts related to the translation are stored in the folder
[`scripts/i18n`](https://github.com/datagir/nosgestesclimat-site/tree/master/scripts/i18n).

For each scripts you can specify different options -- e.g. source language,
target languages, etc....
All available options can be shown by providing the `(-h | --help)` flag.

### `generate-ui.js`

This script allows to analyse the source code to generate the reference
resource file -- `source/locales/ui/ui-fr.yaml`.

>   To run with `yarn`:
>
>   ```
>   yarn generate:ui -- [options]
>   ```

### `translate-ui.js`

This script allows to translate generated `i18next` resource files into
targeted languages.

>   To run with `yarn`:
>
>   ```
>   yarn translate:ui -- [options]
>   ```

### `translate-md.js`

This script allows to translate Markdown files into targeted languages.

Note: you will need to have [`pandoc`](https://pandoc.org) installed in your
machine to be able to run this script.

>   To run with `yarn`:
>
>   ```
>   yarn translate:md -- [options]
>   ```

### `translate-faq.js`

This script allows to translate FAQ files into targeted languages.

>   To run with `yarn`:
>
>   ```
>   yarn translate:faq -- [options]
>   ```


### `translate-releases.js`

This script allows to translate releases files into targeted languages.
Note: you will need to have [`pandoc`](https://pandoc.org) installed in your
machine to be able to run this script.

>   To run with `yarn`:
>
>   ```
>   yarn translate:releases -- [options]
>   ```
