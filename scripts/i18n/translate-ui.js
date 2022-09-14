const stringify = require('json-stable-stringify')
const R = require('ramda')
const fs = require('fs')
const utils = require('./utils')
const paths = utils.paths
const cliProgress = require('cli-progress')

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

console.log(`Collecting missing translations...`)
const missingTranslations = Object.entries(
	utils.getUiMissingTranslations(
		paths.uiTranslationResource.fr,
		paths.uiTranslationResource.en
	)
)
console.log(
	`Found ${utils.withStyle(
		utils.colors.fgGreen,
		missingTranslations.length
	)} missing translations.`
)

let translatedKeys = JSON.parse(
	fs.readFileSync(paths.uiTranslationResource.en, 'utf-8')
)

if (missingTranslations.length > 0) {
	console.log(`Fetching translations:`)
	progressBar.start(missingTranslations.length, 0)
	missingTranslations
		.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
		.forEach(async ([key, value]) => {
			try {
				const translation = await utils.fetchTranslation(value)
				translatedKeys = R.assocPath(
					key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/),
					translation,
					translatedKeys
				)
				// TODO: add a way to write all the translations at once
				fs.writeFileSync(
					paths.uiTranslationResource.en,
					stringify(translatedKeys, { sortMapEntries: true })
				)

				progressBar.update(progressBar.value + 1, { key: key })
				if (progressBar.value === progressBar.getTotal()) {
					progressBar.stop()
					console.log(`Done!`)
				}
			} catch (err) {
				progressBar.stop()
				console.error('ERROR: an error occured while writting!')
				console.error(err.message)
			}
		})
}
