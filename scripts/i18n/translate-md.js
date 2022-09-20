/*
	Calls the DeepL API to translate the Markdown files.

	Command: npm run translate:md -- [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')

const utils = require('./utils')

const argv = yargs
	.usage(
		`Calls the DeepL API to translate the Markdown files.

		Usage: node $0 [options]`
	)
	.option('source', {
		alias: 's',
		type: 'string',
		default: utils.defaultLang,
		choices: utils.availableLanguages,
		description: `The source language to translate from.`,
	})
	.option('target', {
		alias: 't',
		type: 'string',
		array: true,
		default: utils.availableLanguages.filter((l) => l !== utils.defaultLang),
		choices: utils.availableLanguages,
		description: 'The target language to translate to.',
	})
	.help()
	.alias('help', 'h').argv

const srcLang = argv.source || utils.defaultLang
const targetLangs = argv.target || utils.availableLanguages

if (!utils.availableLanguages.includes(srcLang)) {
	utils.printErr(`ERROR: the language '${srcLang}' is not supported.`)
	process.exit(-1)
}

const progressBar = new cliProgress.SingleBar({
	stopOnComplete: true,
	clearOnComplete: true,
	forceRedraw: true,
	format: '{lang} | {value}/{total} | {bar} | {msg} ',
})
cliProgress.Presets.shades_grey

const translateTo = async (src, destPath, destLang) => {
	progressBar.update(progressBar.value, {
		msg: `Translating to '${destPath}'...`,
		lang: destLang,
	})
	const translation = await utils.fetchTranslation(
		src,
		srcLang.toUpperCase(),
		destLang.toUpperCase()
	)
	fs.writeFileSync(destPath, translation, 'utf8', { flag: 'w' })
	progressBar.increment()
}

console.log(
	`Translating Markdown files from 'source/locales/pages/${srcLang}'...`
)
glob(`source/locales/pages/${srcLang}/*.md`, (err, files) => {
	if (err) {
		utils.printErr(`ERROR: an error occured while fetching the files:`)
		utils.printErr(err)
		process.exit(-1)
	}

	console.log(
		`Found ${utils.withStyle(
			utils.colors.fgGreen,
			files.length
		)} files to translate.`
	)
	utils.printWarn(`WARN: internal links should be translated manually.`)
	const destLangs = targetLangs.filter(
		(l) => utils.availableLanguages.includes(l) && l !== srcLang
	)
	progressBar.start(files.length * destLangs.length, 0)
	files.forEach((file) => {
		const srcContent = fs.readFileSync(file, 'utf8')
		destLangs.forEach((destLang) => {
			translateTo(srcContent, file.replace(srcLang, destLang), destLang)
		})
	})
})
