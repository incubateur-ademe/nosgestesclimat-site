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
		choices: utils.availableLangs,
		description: `The source language to translate from.`,
	})
	.option('target', {
		// TODO: to manage
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

const progressBar = new cliProgress.SingleBar({
	hideCursor: true,
	stopOnComplete: true,
	clearOnComplete: true,
	forceRedraw: true,
	format: '{msg} | {value}/{total} | {bar} | {lang} ',
})
cliProgress.Presets.shades_grey

const translateTo = async (src, destPath, destLang) => {
	const translation = await utils.fetchTranslation(
		src,
		srcLang.toUpperCase(),
		destLang.toUpperCase()
	)
	progressBar.increment({
		msg: `Writting translation to '${destPath}'...`,
		lang: destLang,
	})
	fs.writeFileSync(destPath, translation, 'utf8', { flag: 'w' })
}

console.log(
	`Translating Markdown files from 'source/locales/pages/${srcLang}'...`
)
glob(`source/locales/pages/${srcLang}/about.md`, (err, files) => {
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
	progressBar.start(files.length * utils.availableLanguages.length - 1, 0)
	files.forEach((file) => {
		const srcContent = fs.readFileSync(file, 'utf8')
		utils.availableLanguages
			.filter((lang) => lang !== srcLang)
			.forEach((destLang) => {
				console.log(`Translating '${file}' to '${destLang}'...`)
				translateTo(srcContent, file.replace(srcLang, destLang), destLang)
			})
	})
})
