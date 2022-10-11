/*
	Calls the DeepL API to translate the FAQ Yaml files.

	Command: yarn translate:faq -- [options]
*/

const path = require('path')
const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const yellow = (str) => cli.withStyle(cli.colors.fgYellow, str)

const { destLangs, force } = cli.getArgs(
	`Calls the DeepL API to translate the FAQ Yaml files.`,
	{ source: false, file: false, remove: false }
)

const srcLang = utils.defaultLang
const srcPath = path.resolve(`source/locales/faq/FAQ-${srcLang}.yaml`)

console.log('srcPAth:', srcPath)

const translateTo = async (srcYAML, destPath, destLang) => {
	let targetEntries = utils.readYAML(destPath)

	const getIndexOfId = (id) => {
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

	const updateTargetEntries = (newTargetEntry, refId) => {
		const oldTargetEntryIdx = getIndexOfId(refId)
		if (-1 === oldTargetEntryIdx) {
			targetEntries.push(newTargetEntry)
		} else {
			targetEntries[oldTargetEntryIdx] = newTargetEntry
		}
	}

	const missingEntries = srcYAML.filter((refEntry) => {
		const isUpToDate = targetEntryIsUpToDate(
			refEntry,
			targetEntries[getIndexOfId(refEntry.id)]
		)

		if (isUpToDate && force) {
			cli.printWarn(
				`Overriding the translation of the question with id: ${refEntry.id}`
			)
			return true
		}
		return !isUpToDate
	})

	if (0 < missingEntries.length) {
		console.log(
			`Found ${yellow(missingEntries.length)} missing translations...`
		)
		await Promise.all(
			missingEntries.map(async (refEntry) => {
				const [question, catégorie] = await utils.fetchTranslation(
					[refEntry.question, refEntry['catégorie']],
					srcLang,
					destLang
				)
				const réponse = await utils.fetchTranslationMarkdown(
					refEntry['réponse'],
					srcLang,
					destLang
				)
				const targetEntry = {
					id: refEntry.id,
					question,
					catégorie,
					réponse,
				}
				Object.entries(refEntry).forEach(([key, val]) => {
					if (key !== 'id') {
						targetEntry[key + utils.LOCK_KEY_EXT] = val
					}
				})
				updateTargetEntries(targetEntry, refEntry.id)
			})
		)

		utils.writeYAML(destPath, targetEntries)
		console.log(
			`All missing translations succefully written in ${yellow(destPath)}`
		)
	} else {
		console.log('Nothing to be done, all translations are up to date!')
	}
}

const srcYAML = utils.readYAML(srcPath)

const run = async () => {
	for (targetLang of destLangs) {
		console.log(
			`Translating the FAQ files from ${yellow(srcLang)} to ${yellow(
				targetLang
			)}...`
		)
		const destPath = path.resolve(`source/locales/faq/FAQ-${targetLang}.yaml`)
		await translateTo(srcYAML, destPath, targetLang)
	}
}

run()
