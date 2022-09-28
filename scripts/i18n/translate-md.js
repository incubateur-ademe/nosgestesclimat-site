/*
	Calls the DeepL API to translate the Markdown files.

	NOTE: In order to avoid to translate internal links, we use pandoc to
	convert the Markdown to HTML and then back to Markdown.

	Command: yarn run translate:md [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')
const pandoc = require('node-pandoc')

const utils = require('./utils')
const cli = require('./cli')

const { srcLang, destLangs, srcFile } = cli.getArgs(
	`Calls the DeepL API to translate the Markdown files.

	Important: this script requires the 'pandoc' executable to be installed.`
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
		destLang.toUpperCase(),
		'html'
	)
	pandoc(
		translation,
		'-f html -t markdown_strict --atx-headers',
		(err, result) => {
			if (err) {
				utils.printErr(err)
				progressBar.stop()
				process.exit(-1)
			}
			fs.writeFileSync(destPath, result, 'utf8', { flag: 'w' })
			progressBar.increment()
		}
	)
}

console.log(
	`Translating Markdown files from 'source/locales/pages/${srcLang}'...`
)
glob(`source/locales/pages/${srcLang}/${srcFile}`, (err, files) => {
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
	progressBar.start(files.length * destLangs.length, 0)

	files.forEach((file) => {
		const src = fs.readFileSync(file, 'utf8')
		pandoc(src, ['-f', 'markdown_strict', '-t', 'html'], (err, srcContent) => {
			if (err) {
				cli.printErr(
					`ERROR: an error occured while converting '${file}' to HTML:`
				)
				cli.printErr(err)
				progressBar.stop()
				process.exit(-1)
			}
			destLangs.forEach((destLang) => {
				translateTo(srcContent, file.replace(srcLang, destLang), destLang)
			})
		})
	})
})
