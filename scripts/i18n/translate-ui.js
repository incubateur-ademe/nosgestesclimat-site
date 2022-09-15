/*
	Calls DeepL API to translate the UI from the [Lang.Default] one.

	Command: npm run translate:ui
*/

const R = require('ramda')
const fs = require('fs')
const utils = require('./utils')
const paths = utils.paths
const cliProgress = require('cli-progress')
const stringify = require('json-stable-stringify')

const defaultLang = 'FR'
const defaultLangPath = utils.paths.uiTranslationResource.fr

if (!fs.existsSync(paths.uiTranslationResource.fr)) {
	console.error(
		utils.withStyle(
			utils.colors.fgRed,
			`ERROR: ${paths.uiTranslationResource.fr} does not exist.\nPlease run: 'npm run generate:ui' first.`
		)
	)
	return -1
}

const progressBars = new cliProgress.MultiBar(
	{
		hideCursor: true,
		stopOnComplete: true,
		clearOnComplete: true,
		forceRedraw: true,
		format: '{lang} | {value}/{total} | {bar} | {msg} ',
	},
	cliProgress.Presets.shades_grey
)

const translateTo = (targetLang, targetPath) => {
	const missingTranslations = Object.entries(
		utils.getUiMissingTranslations(defaultLangPath, targetPath)
	)
	console.log(
		`Found ${utils.withStyle(
			utils.colors.fgGreen,
			missingTranslations.length
		)} missing translations for the language ${utils.withStyle(
			utils.colors.fgYellow,
			targetLang
		)}.`
	)

	let translatedKeys = JSON.parse(fs.readFileSync(targetPath, 'utf-8'))

	if (missingTranslations.length > 0) {
		let bar = progressBars.create(missingTranslations.length, 0)

		missingTranslations
			.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
			.forEach(async ([key, value]) => {
				try {
					const translation = await utils.fetchTranslation(
						value,
						defaultLang,
						targetLang.toUpperCase()
					)
					translatedKeys = R.assocPath(
						key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/),
						translation,
						translatedKeys
					)
					// TODO: add a way to write all the translations at once
					fs.writeFileSync(
						targetPath,
						stringify(translatedKeys, {
							cmp: (a, b) => a.key.localeCompare(b.key),
							space: 2,
						})
					)
					bar.increment({
						msg: `Translating '${key}'...`,
						lang: targetLang,
					})
				} catch (err) {
					bar.stop()
					progressBars.remove(bar)
					console.error(
						`ERROR: an error occured while fetching the '${key}' translations:`
					)
					console.error(err)
					process.exit(-1)
				}
			})
	}
}

Object.entries(utils.paths.uiTranslationResource).forEach(([lang, path]) => {
	if (path !== defaultLangPath) {
		translateTo(lang, path)
	}
})
