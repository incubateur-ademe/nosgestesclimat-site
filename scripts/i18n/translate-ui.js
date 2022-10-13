/*
	Calls the DeepL API to translate the UI content.

	Command: npm run translate:ui -- [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')

const paths = require('./paths')
const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const deepl = require('./../../nosgestesclimat/scripts/i18n/deepl')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const { srcLang, destLangs, force } = cli.getArgs(
	`Calls the DeepL API to translate the UI from the French one.`,
	{ source: true, force: true, target: true }
)

const srcPath = paths.uiTranslationResource[srcLang]

if (!fs.existsSync(srcPath)) {
	cli.printErr(
		`ERROR: ${srcPath} does not exist.\nPlease run: 'npm run generate:ui' first.`
	)
	process.exit(-1)
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

const consecutiveEmojiRegexp =
	/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g

const interpolatedValueRegexp = /\{\{(.*)\}\}/g

const ignoredValueRegexp = /<ignore>(.*)<\/ignore>/g

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

	let translatedEntries = utils.readYAML(targetPath).entries
	if (missingTranslations.length > 0) {
		let bar = progressBars.create(missingTranslations.length, 0)

		missingTranslations
			.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
			.forEach(async ([key, value]) => {
				try {
					value = value.replace(interpolatedValueRegexp, '<ignore>$1</ignore>')
					const translation = await deepl.fetchTranslation(
						value,
						srcLang,
						targetLang
					)
					const translationWithCombinedEmojis = translation
						.replace(consecutiveEmojiRegexp, (_, p1, p2) => `${p1}‍${p2}`)
						.replace(ignoredValueRegexp, '{{$1}}')

					translatedEntries[key] = translationWithCombinedEmojis
					if (utils.isI18nKey(key)) {
						// we need to store the lock value.
						translatedEntries[key + utils.LOCK_KEY_EXT] = value
					}
					//	TODO: add a way to write all the translations at once
					utils.writeYAML(targetPath, { entries: translatedEntries })
					bar.increment({
						msg: `Translating '${value}'...`,
						lang: targetLang,
					})
				} catch (err) {
					bar.stop()
					progressBars.remove(bar)
					console.log(`{key: ${key}, value: `, value)
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
