/*
	Calls the DeepL API to translate the UI content.

	Command: npm run translate:ui -- [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const R = require('ramda')
const stringify = require('json-stable-stringify')
const yargs = require('yargs')

const utils = require('./utils')
const cli = require('./cli')
const paths = utils.paths

const { srcLang, destLangs, force } = cli.getArgs(
	`Calls the DeepL API to translate the UI from the French one.`
)

const srcPath = paths.uiTranslationResource[srcLang]

if (!fs.existsSync(srcPath)) {
	cli.printErr(
		`ERROR: ${srcPath} does not exist.\nPlease run: 'npm run generate:ui' first.`
	)
	return -1
}

const progressBars = new cliProgress.MultiBar(
	{
		stopOnComplete: true,
		clearOnComplete: true,
		forceRedraw: true,
		format: '{lang} | {value}/{total} | {bar} | {msg} ',
	},
	cliProgress.Presets.shades_grey
)

const translateTo = (targetLang, targetPath) => {
	const missingTranslations = Object.entries(
		utils.getUiMissingTranslations(srcPath, targetPath, force)
	)
	console.log(
		`Found ${cli.withStyle(
			cli.colors.fgGreen,
			missingTranslations.length
		)} missing translations for the language ${cli.withStyle(
			cli.colors.fgYellow,
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
						srcLang,
						targetLang
					)
					translatedKeys = R.assocPath(
						key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/),
						translation,
						translatedKeys
					)
					//	TODO: add a way to write all the translations at once
					fs.writeFileSync(
						targetPath,
						stringify(translatedKeys, {
							cmp: (a, b) => a.key.localeCompare(b.key),
							space: 2,
						})
					)
					bar.increment({
						msg: `Translating '${value}'...`,
						lang: targetLang,
					})
				} catch (err) {
					bar.stop()
					progressBars.remove(bar)
					cli.printErr(
						`ERROR: an error occured while fetching the '${key}' translations:`
					)
					cli.printErr(err)
					process.exit(-1)
				}
			})
	}
}
destLangs.forEach((lang) => {
	translateTo(lang, paths.uiTranslationResource[lang])
})
