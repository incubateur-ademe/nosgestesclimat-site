# Contextualizing a survey

## What is the purpose of contextualizing a survey?

Contextualizing a survey allows you to save additional information to
the classic simulation: each respondent is asked a few questions before
accessing their test.

Thus, an organization can send a single survey link and receive
information that differentiates users (questions that are not related to
the Our Climate Action test: for example, their age, their job, etc. or
a subgroup).

For the moment the context elements are available in the downloaded CSV
(no filtering possible on the viewing screen).

> ⚠️ Questions should not identify users! We won't ask for people's
> identity or even their email address! It is also important to remember
> that the answers are accessible to everyone who has the survey link,
> so be sure to comply with RGPD rules.

![Exemple contexte](/images/exemple-contexte.png)

## How do I add this feature to my survey?

The survey "contexts" are published via the Our Climate Action server,
in the
[/contexts-survey](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage)
folder.

The questions are written in the [publicodes](https://publi.codes/)
language in 'yaml' format.

**We have chosen to keep control of the published survey contexts, so
the Datagir team plays the role of administrator and helps you create
your context and publish it for your survey.**

A
[template](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte.yaml)
allows you to write your own context form. You can also use the
[publicodes sandbox](https://vu.fr/szYP). Don't hesitate to contact us
with a first draft to contextualize your survey! Be careful, **the name
of the file created must be different from the name of the survey** (see
next point).

## And from a technical point of view?

The survey rules are loaded from the server when the user accesses a
survey with a context. In order to avoid making all the survey URLs with
context public, the name of the context file is different from the
survey name. The file name is assigned via the database administration
directly. Only surveys with a context attached have additional
questions, nothing changes for other surveys.
