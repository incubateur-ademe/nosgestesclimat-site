/*
	Calls the DeepL API to translate the Markdown files.

	Command: npm run translate:md -- [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')

const utils = require('./utils')
const cli = require('./cli')

const { srcLang, destLangs } = cli.getArgs(
	`Calls the DeepL API to translate the Markdown files.`
)

const progressBar = new cliProgress.SingleBar(
	{
		stopOnComplete: true,
		clearOnComplete: true,
		forceRedraw: true,
		format: '{lang} | {value}/{total} | {bar} | {msg} ',
	},
	cliProgress.Presets.shades_grey
)

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
glob(`source/locales/pages/${srcLang}/landing.md`, (err, files) => {
	if (err) {
		cli.printErr(`ERROR: an error occured while fetching the files:`)
		cli.printErr(err)
		process.exit(-1)
	}

	console.log(
		`Found ${cli.withStyle(
			cli.colors.fgGreen,
			files.length
		)} files to translate.`
	)
	cli.printWarn(`WARN: internal links must be translated manually.`)
	progressBar.start(files.length * destLangs.length, 0)

	files.forEach((file) => {
		const srcContent = fs.readFileSync(file, 'utf8')
		destLangs.forEach((destLang) => {
			translateTo(srcContent, file.replace(srcLang, destLang), destLang)
		})
	})
})
