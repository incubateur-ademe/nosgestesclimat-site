<h1 align="center">Contributing to <a href="https://nosgestesclimat.fr/">nosgestesclimat.fr</a></h1>

<p align="center">This file describes different way to contribute to the project.</p>

> This document is only documenting the contribution to the user interface of
> Nos Gestes Climat.
> If you want to contribute to the model, please refer to the corresponding
> [documentation](https://github.com/datagir/nosgestesclimat/blob/master/CONTRIBUTING.md).

---

<details open=true>

<summary>Table of content</summary>
<!-- vim-markdown-toc GitLab -->

* [How to start?](#how-to-start)
* [Installation](#installation)
* [Documentation](#documentation)
* [Translation](#translation)
* [Publicodes](#publicodes)

<!-- vim-markdown-toc -->

</details>

---

## How to start?

The @datagir team thanks you to taking the time to contribute to the project! 🎉

You can start by exploring opened
[issues](https://github.com/datagir/nosgestesclimat-site/issues).
They are used both to track feature implementations or bug corrections.
Moreover, they are used to discuss about topic or to answer questions,
consequently, don't hesitate to browse them to find bits of documentation if
they aren't in the wiki.

## Installation

To start the local development, you'll need:

```
# To clone the repo and its submodule on your computer
git clone --recursive git@github.com:datagir/nosgestesclimat-site.git

# To install the dependencies through Yarn
yarn install

# To run the local server in watch mode.
yarn start
```

The application will be available at https://localhost:8080.

## Documentation

The project's documentation is currently maintained through this wiki. You can
update its content by modifying Markdown files stored in
[./docs](https://github.com/datagir/nosgestesclimat-site/blob/master/docs).

For more information about contributing to the documentation, please refer to
the dedicated [wiki
page](https://github.com/datagir/nosgestesclimat-site/wiki/Documentation).

## Translation

The website is translated in different natural languages using the DeepL API
and the [`react-i18next`](https://react.i18next.com/) package.

All information about the UI translation could be found
[here](https://github.com/datagir/nosgestesclimat-site/wiki/Translation).

## Publicodes

The computational model is built with [publicodes](https://publi.codes/), a
programming language tool chain based on top of the YAML syntax.

You could find more information about it in the
[Publicodes](https://github.com/datagir/nosgestesclimat-site/wiki/Publicodes)
wiki's section.
