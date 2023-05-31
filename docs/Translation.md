<h1 align="center">Translation of the UI</h1>

<p align="center">This file contains all the information on translating the <a href="https://nosgestesclimat.fr/">nosgestesclimat.fr</a> web interface.</p>

<p align="center">The website UI is automatically translated in different natural languages -- this is achieved with
<a href="https://react.i18next.com/"><code>react-i18next</code></a>.</p>

> For the model translation (e.g. test's questions, categories' names, etc...)
> , please refer to this
> [file](https:/github.com/datagir/nosgestesclimat/blob/master/docs/translation.md).

---

<details open=true>

<summary>Table of content</summary>
<!-- vim-markdown-toc GitLab -->

- [Configuration](#configuration)
  - [DeepL API key](#deepl-api-key)
  - [Dev dependencies](#dev-dependencies)
- [Available languages](#available-languages)
- [Workflows](#workflows)
  - [Editing the source code](#editing-the-source-code)
    - [Adding content](#adding-content)
    - [Adding units translation](#adding-units-translation)
    - [Updating the translation](#updating-the-translation)
      - [For non-tech users](#for-non-tech-users)
  - [Improving an existing translation](#improving-an-existing-translation)
    - [Contribution guide for translation from GitHub](#contribution-guide-for-translation-from-github)
  - [Adding a new language](#adding-a-new-language)
- [Architecture](#architecture)
- [Available scripts](#available-scripts)
  - [`generate-ui.js`](#generate-uijs)
  - [`translate-ui.js`](#translate-uijs)
  - [`check-ui.js`](#check-uijs)
  - [`translate-pages.js`](#translate-pagesjs)
  - [`translate-faq.js`](#translate-faqjs)
  - [`check-faq.js`](#check-faqjs)
  - [`translate-releases.js`](#translate-releasesjs)

<!-- vim-markdown-toc -->

</details>

---

## Configuration

### DeepL API key

To be able to run all available scripts you need to have defined the _env_
variable `DEEPL_API_KEY` with a valid [DeepL API
key](https://www.deepl.com/fr/docs-api/introduction/).

> You can specify it when running the command:
>
> ```
> DEEPL_API_KEY=<your-api-key> yarn <cmd>
> ```
>
> or saving it in your `.bashrc` file -- or other terminal config file.

### Dev dependencies

Before running any scripts, make sure that you have all the dependencies installed by
running:

```
yarn install
```

## Available languages

Currently, the model and the website UI are available in:

* `fr` -- is the reference language.
* `en-us` -- has been review by hand.
* `es` -- automatically generated.
* `it` -- automatically generated.

## Workflows

### Editing the source code

#### Adding content

When adding a new string containing a content which needs to be translated,
you need to wrap it inside a [`Trans`](https://react.i18next.com/latest/trans-component) React component
or inside a function call to [`t`](https://react.i18next.com/latest/usetranslation-hook).

If the text fragment doesn't depend on the context, e.g the string _"Cliquez ici"_,
you can use both variants:

```jsx
// Calling the [t] hook
<p>{t('Cliquez ici')}</p>

// or using the [Trans] component
<p><Trans>Cliquez ici</Trans></p>
```

However, if the text fragment is **context dependant**, e.g. the word _"de"_ in
french which can be translated both into either "from" or "of", you need to
specify an unique i18n key. You can use both variants:

> i18n keys follow the form: `<path>.<to>.<file>.<content description>`

```jsx
// Calling the [t] hook
<span>{value} {t('tonnes')} {t('humanWeight.unitSuffix')} CO2e</span>

// or using the [Trans] component
<Trans i18nKey="humanWeight.unitSuffix">de</Trans> CO2e</span>

```

<details>

<summary> <b>Important</b>: if you choose the first version (by calling <code>t</code>)...</summary>

> you will need to provide by hand the default value after executing the
> command `yarn generate:ui` (see the section [Updating the
> translations](#updating-the-translation)):
>
> ```
> ...
> Adding missing entries...
> - Missing 1 translations:
>   humanWeight.unitSuffix
> ```
>
> you need to replace in [`ui/ui-fr.yaml`]():
> ```yaml
>   humanWeight.unitSuffix: NO_TRANSLATION
> ```
> by
> ```yaml
>   humanWeight.unitSuffix: de
> ```

</details>

Then you can specify the wanted translation in the corresponding
`source/locales/ui/ui-<lang>.yaml` file:

```yaml
# example in source/locales/ui/ui-en-us.yaml:
humanWeight.unitSuffix: of # The wanted translated value
humanWeight.unitSuffix.lock: de # The reference value
```

#### Adding units translation

When using units such as _heures_ or _km / an_, you needs to specify the name
space `units` to the configuration of the `t` function call:

```jsx
<p>{t('heures', {ns: 'units'})}</p>

// if the content is stored in a string
<p>{t(uniVariable as string, {ns: 'units'})}</p>
```

Translations are stored in a separated file: `./source/locales/units.yaml`.

There is a root attribute for each available languages. The units to translate
is the key and the value is the corresponding translation:

```yaml
en:
  heure: hour
  km / an: km / year
```

> **Important:** they need to be translated by hand in the
> `./source/locales/units.yaml`.

#### Updating the translation

Once the content modified,

1. you can update the reference translation file (`ui/ui-fr.yaml`) with the
   [`generate-ui.js`](#generate-ui.js) script.
   The command will print a brief report about added entries:

    ```
    + Added 2 translations:
        Cacher l'objectif
        catégorie complétée
    ~ Updated 1 translations:
        components.stats.StatsContent.enSavoirPlus
    - Missing 2 translations:
        components.conversation.select.NumberedMosaic.choixAFaire
        components.conversation.select.NumberedMosaic.choixEnTrop
    ```

    **+ Added** translations correspond to new entries which has been added to
    the translation file. Their values has been retrieved from the source code:
    here, the key _"Cacher l'objectif"_ is the value itself -- it corresponds to
    a `<Trans>Cacher l'objectif</Trans>`.

    **\~ Updated** translations correspond to existing entries that have been
    modified. Their values has been retrieved from the source code: here, the
    key _"components.stats.StatsContent.enSavoirPlus"_ corresponds to a `<Trans
    i18nKey="components.stats.StatsContent.enSavoirPlus">...</Trans>`.

    **- Missing** translations correspond to new entries that don't have a
    corresponding default value. It corresponds to a `t` call with a i18n key,
    for example here,
    `t('components.conversation.select.NumberedMosaic.choixAFaire')`.
    Consequently, the saved value will be `NO_TRANSLATION` and you need to
    modify it by hand in the `ui/ui-fr.yaml` file by the wanted value.

2. Once the reference translation file (`ui/ui-fr.yaml`) updated, you need to
   translate the generated resource file into the other supported languages.
   This can be done automatically by using
   [`translate-ui.js`](#translate-ui.js).

    For non _hardcoded_ content such as the FAQ or Markdown pages. You need to
    modify the corresponding file inside `.source/locales/pages/` (resp.
    `.source/locales/faq`) and then run the script
    [`translate-pages.js`](#translate-pages.js) (resp.
    [`translate-faq.js`](#translate-faq.js)) to translate it in the remaining
    languages.

> **Important**: the automatic translation rely on the Deepl API. Consequently,
> you need to set the environment variable `DEEPL_API_KEY` before running
> `translate-*.js` scripts. See the [Configuration section](#configuration).

##### For non-tech users

If you can't or don't want to run any scripts, a report with missing
translations will be added in a comment when opening a new [Pull
Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

If there is missing translations or if you have a question, don't hesitate to
ping one of the maintainers of `nosgestesclimat-site`.

### Improving an existing translation

If you found a translation incorrect or imprecise, you can modify it directly
from the
[`./source/locales`](https://github.com/datagir/nosgestesclimat-site/tree/master/source/locales)
folder.

If you are ready to create a [Pull
Request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request)
to push your suggestion directly to the project, please refer to the
contribution guide below. Otherwise, you can simply send your suggestion in a
mail to: contact@nosgestesclimat.fr.

#### Contribution guide for translation from GitHub

1. The first step consists of finding the file where is stored the targeted
   translation. You can refer to the [dedicated section](#architecture) or
   search for it from with the GitHub search bar:
    1. Press `/` and paste the searched text.
    2. Choose the `In this repository` choice.
    3. Look at `code results` and click on the corresponding file name.
2. Once you've found the file, you need to edit it.
    1. Select the `master` branch on the button -- at the left of the file
       path.
    2. Then, press `E` to edit the file -- or click in the pencil button.
    3. Click on the text, and press `Ctrl-F` to search for the specific
       translation.
    4. Now, you can edit the translation text.
    5. When all changes have been made, go to the bottom of the page under the `Commit
       changes` section. Enter in the first text field:
        ```
        fix(t9n): update translation in the <edited_filename>.
        ```
3. Finally, select the `Create a new branch for this commit and start a pull
   request.` option. You can add more information if you want about your
   translation before clicking on the `Create pull request` button to open the
   pull request.

Well done! We will look at your proposition before [updating the
translations](#updating-the-translation) and integrating the changes to the
project.

### Adding a new language

To support a new language you need to modify the
[`./source/locales/translations.ts`]() file, by:

- adding a new value to `Lang` enumeration,
- completing all related switch statements,
- adding corresponding import statements for FAQ, releases and UI files,
- extending all `source/sites/publicodes/pages/*.tsx` to load translated Markdown pages,
- updating the `availableLanguages` variable of the `./nosgestesclimat/scripts/i18n/utils.js` file,
- runs all needed scripts as described in the [Updating the translation section](#updating-the-translation).
(If there is some errors during the scripts execution, you will need to add
empty folders/files in the `source/locales` corresponding the abbreviation added
to the `availableLanguages`).

## Architecture

Files related to the translation are available in the folder
[`source/locales`](https://github.com/datagir/nosgestesclimat-site/tree/master/source/locales).

In particular:

-   `ui/ui-<lang>.yaml` are the resource files used by [`react-i18next`](https://react.i18next.com/).
    It associates the translated text to the corresponding id.
-   `pages/<lang>/*.md` are the Markdown files used for pages with static contents.
-   `faq/FAQ-<lang>.yaml` contains the FAQ questions.
-   `releases/releases-<lang>.yaml` contains the fetched releases content.

## Available scripts

Scripts related to the translation are stored in the folder
[`scripts/i18n`](https://github.com/datagir/nosgestesclimat-site/tree/master/scripts/i18n).

For each scripts you can specify different options -- e.g. source language,
target languages, etc....
All available options can be shown by providing the `--help` (`-h`) flag.

As translation scripts of the website have lot in commons with those of the
model, commons functions and variables are stored in
[`nosgestesclimat/scripts/i18n`](), in particular `utils.js` and `cli.js`.

### `generate-ui.js`

This script allows to analyse the source code to generate the reference
resource file -- `source/locales/ui/ui-fr.yaml`. It uses the
[`i18next-parser`](https://github.com/i18next/i18next-parser) to analyse the
source code and find missing or not up to date translations.

If the `--remove` (`-r`) flag is specified, unused keys stored in the reference
resource file will be removed.

> To run with `yarn`:
>
> ```
> yarn generate:ui [options]
> ```

### `translate-ui.js`

This script allows to translate generated `i18next` resource files into
targeted languages.

You can specify following flags:

- `--force` (`-f`) to force the translation of all the entries. By default,
    only missing or not up to date entries are translated.
- `--target` (`-t`) to choose the language(s) translate into.
- `--remove` (`-r`) to remove unused entries.

> To run with `yarn`:
>
> ```
> yarn translate:ui [options]
> ```

### `check-ui.js`

This scripts allows to verify if all translations are up to date.

You can specify following flags:

- `--target` (`-t`) to choose the language(s) translate into.
- `--markdown` (`-m`) to print the result in a Mardown table format. (It's
    designed to print report in PRs via GitHub Actions)

> To run with `yarn`:
>
> ```
> yarn check:ui [options]
> ```

### `translate-pages.js`

This script allows to translate Markdown files into targeted languages.

You can specify following flags:

- `--target` (`-t`) to choose the language(s) translate into.
- `--file` (`-p`) to select a specific Markdown file to translate from the
    `locales/pages/<src_lang>` folder. (By default, all the files in
    `locales/pages/<src_lang>` will be translated).

> To run with `yarn`:
>
> ```
> yarn translate:pages [options]
> ```

### `translate-faq.js`

This script allows to translate FAQ files into targeted languages.

- `--force` (`-f`) to force the translation of all the entries. By default,
    only missing or not up to date entries are translated.
- `--target` (`-t`) to choose the language(s) translate into.

> To run with `yarn`:
>
> ```
> yarn translate:faq [options]
> ```

### `check-faq.js`

This scripts allows to verify if all FAQ translations are up to date.

You can specify following flags:

- `--target` (`-t`) to choose the language(s) translate into.
- `--markdown` (`-m`) to print the result in a Mardown table format. (It's
    designed to print report in PRs via GitHub Actions)

> To run with `yarn`:
>
> ```
> yarn check:faq [options]
> ```

### `translate-releases.js`

This script allows to translate releases files into targeted languages.

You can specify following flag:

- `--target` (`-t`) to choose the language(s) translate into.

> To run with `yarn`:
>
> ```
> yarn translate:releases [options]
> ```
