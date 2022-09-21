# Contextualizing a survey

## What for?

Contextualizing a survey allows you to save additional information
additional information to the classic simulation: each respondent is asked a few questions before
questions before accessing their test.

Thus, an organization can send a single survey link and receive information that
information that differentiates users (questions that are not related to the
related to the Our Climate Action test: for example, their age, occupation, etc., or a
or a subgroup).

For the moment, the context elements are available in the downloaded CSV
(no filtering possible on the visualization screen).

> ⚠️ The questions must not allow users to be identified! We
> will not ask for the identity of the people or even their email address! You must
> You should also remember that the answers are accessible to all people
> The answers are accessible to all the people who have the link to the survey, so it is important to respect the
> RGPD rules.

![Example context](/images/example-context.png)

## How do I add this feature to my survey?

The survey "contexts" are published via the Our Climate Action server, in the
the folder
[/survey-contexts](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage).

The questions are written in the [publicodes](https://publi.codes/)
in 'yaml' format.

**We have chosen to keep control of the published survey contexts, so the Datagir
the Datagir team plays the role of administrator and helps you create and publish your
to create your context and publish it for your survey.

A
[template](https://github.com/datagir/nosgestesclimat-server/tree/master/contextes-sondage/template%20de%20contexte.yaml)
allows you to write your own context form. You can also
the [publicodes sandbox](https://vu.fr/szYP). Do not hesitate to
contact us with a first draft to contextualize your survey!
Attention, **the name of the file created must be different from the name of the name envisaged
for the survey** (see next point).

## And from a tech point of view?

The survey rules are loaded from the server when the user accesses a
the user accesses a survey with a context. In order to avoid
make all poll URLs with context public, the name of the context file is
context file name is different from the survey name. The file name is assigned via
the database administration directly. Only surveys that have a context attached
only surveys that have a context attached have additional questions, nothing changes for
nothing changes for the other surveys.
