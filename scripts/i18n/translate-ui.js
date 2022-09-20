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
const paths = utils.paths

const argv = yargs
	.usage(
		`Calls the DeepL API to translate the UI from the French one.

		Usage: node $0 [options]`
	)
	.option('force', {
		alias: 'f',
		type: 'boolean',
		description:
			'Force translation of all the keys. Its overwrites the existing translations.',
	})
	.option('source', {
		alias: 's',
		type: 'string',
		default: utils.defaultLang,
		choices: utils.availableLangs,
		description: `The source language to translate from.`,
	})
	.option('target', {
		alias: 't',
		type: 'string',
		choices: utils.availableLangs,
		description: 'The target language to translate to.',
	})
	.help()
	.alias('help', 'h').argv

const srcLang = argv.source || utils.defaultLang

if (!utils.availableLanguages.includes(srcLang)) {
	utils.printErr(`ERROR: the language '${srcLang}' is not supported.`)
	process.exit(-1)
}

const defaultLangPath = paths.uiTranslationResource[srcLang]

if (!fs.existsSync(defaultLangPath)) {
	utils.printErr(
		`ERROR: ${defaultLangPath} does not exist.\nPlease run: 'npm run generate:ui' first.`
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
		utils.getUiMissingTranslations(defaultLangPath, targetPath, argv.force)
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
						srcLang,
						targetLang.toUpperCase()
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
					utils.printErr(
						`ERROR: an error occured while fetching the '${key}' translations:`
					)
					utils.printErr(err)
					process.exit(-1)
				}
			})
	}
}

if (argv.target) {
	if (!utils.availableLanguages.includes(argv.target)) {
		utils.printErr(`ERROR: '${argv.target}' is not a valid language.`)
		process.exit(-1)
	}
	translateTo(argv.target, paths.uiTranslationResource[argv.target])
} else {
	Object.entries(paths.uiTranslationResource).forEach(([lang, path]) => {
		if (path !== defaultLangPath) {
			translateTo(lang, path)
		}
	})
}
