const paths = require('./paths')
const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const { srcLang, destLangs, markdown } = cli.getArgs(
	`Check missing translations for FAQs.`,
	{ source: true, target: true, markdown: true }
)

const srcYAML = utils.readYAML(paths.FAQ[srcLang].withLock)

const getIndexOfId = (id, targetEntries) => {
	return targetEntries.findIndex((entry) => {
		const res = entry.id === id
		return res
	})
}

const targetEntryIsUpToDate = (src, target) =>
	target !== undefined &&
	Object.entries(src).every(
		([key, val]) => key === 'id' || val === target[key + utils.LOCK_KEY_EXT]
	)

cli.printChecksResultTableHeader(markdown)

destLangs.forEach((targetLang) => {
	const targetEntries = utils.readYAML(paths.FAQ[targetLang].withLock)

	const nbMissingTranslations = srcYAML.reduce((nbMissing, refEntry) => {
		const isUpToDate = targetEntryIsUpToDate(
			refEntry,
			targetEntries[getIndexOfId(refEntry.id, targetEntries)]
		)
		return nbMissing + (isUpToDate ? 0 : 1)
	}, 0)

	cli.printChecksResult(
		nbMissingTranslations,
		"FAQ's questions",
		targetLang,
		markdown
	)
})
