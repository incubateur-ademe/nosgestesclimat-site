/*
	Calls the DeepL API to translate the FAQ Yaml files.

	Command: yarn translate:faq -- [options]
*/

const paths = require('./paths')
const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const deepl = require('./../../nosgestesclimat/scripts/i18n/deepl')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const { srcLang, destLangs, force } = cli.getArgs(
	'Calls the DeepL API to translate the FAQ Yaml files.',
	{ source: true, target: true, force: true }
)

const srcPath = paths.FAQ[srcLang].withLock

const translateTo = async (srcYAML, destPath, destLang) => {
	let targetEntries = utils.readYAML(destPath) ?? []

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
		const i = getIndexOfId(refEntry.id)
		const isUpToDate = targetEntryIsUpToDate(refEntry, targetEntries[i])

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
			`Found ${cli.yellow(missingEntries.length)} missing translations...`
		)
		await Promise.all(
			missingEntries.map(async (refEntry) => {
				const [question, catégorie] = await deepl.fetchTranslation(
					[refEntry.question, refEntry['catégorie']],
					srcLang,
					destLang
				)
				const réponse = await deepl.fetchTranslationMarkdown(
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
			`All missing translations succefully written in ${cli.yellow(destPath)}`
		)
	} else {
		console.log('Nothing to be done, all translations are up to date!')
	}
}

const srcYAML = utils.readYAML(srcPath)

const run = async () => {
	for (let destLang of destLangs) {
		console.log(
			`Translating the FAQ files from ${cli.yellow(srcLang)} to ${cli.yellow(
				destLang
			)}...`
		)
		const destPath = paths.FAQ[destLang].withLock
		await translateTo(srcYAML, destPath, destLang)
	}
}

run()
