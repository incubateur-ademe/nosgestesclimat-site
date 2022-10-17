const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const paths = require('./paths')

const { srcLang, destLangs, markdown } = cli.getArgs(
	`Check missing translations for UI texts.`,
	{ source: true, target: true, markdown: true }
)

const srcPath = paths.uiTranslationResource[srcLang]

cli.printChecksResultTableHeader(markdown)

destLangs.forEach((destLang) => {
	const nbMissingTranslations = utils.getUiMissingTranslations(
		srcPath,
		paths.uiTranslationResource[destLang]
	).length

	cli.printChecksResult(nbMissingTranslations, 'UI texts', destLang, markdown)
})
