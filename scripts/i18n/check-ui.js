const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const paths = require('./paths')

const { srcLang, destLangs, markdown } = cli.getArgs(
	`Check missing translations for UI texts.`,
	{ source: true, target: true, markdown: true }
)

cli.printChecksResultTableHeader(markdown)

destLangs.forEach((destLang) => {
	const nbMissingTranslations = utils.getUiMissingTranslations(
		paths.UI[srcLang].withLock,
		paths.UI[destLang].withLock
	).length

	cli.printChecksResult(nbMissingTranslations, 'UI texts', destLang, markdown)
})
