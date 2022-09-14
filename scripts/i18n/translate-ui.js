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

const progressBar = new cliProgress.SingleBar(
	{ format: '{value}/{total} | {bar} | Fetching {key}... ' },
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
		)} missing translations.`
	)

	let translatedKeys = JSON.parse(fs.readFileSync(targetPath, 'utf-8'))

	if (missingTranslations.length > 0) {
		console.log(`Fetching translations:`)
		progressBar.start(missingTranslations.length, 0)
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

					progressBar.update(progressBar.value + 1, { key: key })
					if (progressBar.value === progressBar.getTotal()) {
						progressBar.stop()
						console.log(`Done!`)
					}
				} catch (err) {
					progressBar.stop()
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
		console.log(
			`Collecting missing translations for the language: '${lang}'...`
		)
		translateTo(lang, path)
	}
})
