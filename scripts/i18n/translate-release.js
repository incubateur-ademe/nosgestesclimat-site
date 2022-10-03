/*
	Calls the DeepL API to translate the JSON release files.

	Command: yarn translate:release [options]

	TODO:
	- [ ] Needs to be tested with pandoc and the DeepL API.
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const yargs = require('yargs')
const stringify = require('json-stable-stringify')
const pandoc = require('node-pandoc')

const utils = require('./utils')
const cli = require('./cli')

const { srcLang, destLangs } = cli.getArgs(
	`Calls the DeepL API to translate the JSON release files.

	Important: this script requires the 'pandoc' executable to be installed.`
)

const srcPath = `source/locales/releases/releases-${srcLang}.json`

const progressBar = new cliProgress.SingleBar(
	{
		stopOnComplete: true,
		clearOnComplete: true,
		forceRedraw: true,
		format: '{lang} | {value}/{total} | {bar} | {msg} ',
	},
	cliProgress.Presets.shades_grey
)

const translateTo = async (srcJSON, destPath, destLang) => {
	const tradJSON = []
	await Promise.all(
		srcJSON.map(async (release) => {
			progressBar.update(progressBar.value, {
				msg: `Translating '${release.name}'...`,
				lang: destLang,
			})
			pandoc(
				release.body,
				['-f', 'markdown_strict', '-t', 'html'],
				async (err, bodyHTML) => {
					cli.exitIfError(err, progressBar)
					console.log('bodyHTML:', bodyHTML)
					const translation = await utils.fetchTranslation(
						bodyHTML,
						srcLang.toUpperCase(),
						destLang.toUpperCase(),
						'html'
					)
					release.body = pandoc(
						translation,
						['-f', 'html', '-t', 'markdown_strict', '--atx-headers'],
						(err, bodyMarkdown) => {
							console.log('bodyMarkdown:', bodyMarkdown)
							cli.exitIfError(err, progressBar)
							tradJSON.push(bodyMarkdown)
							progressBar.increment()
						}
					)
				}
			)
		})
	)
	fs.writeFileSync(
		destPath,
		stringify(tradJSON, {
			cmp: (a, b) => a.key.localeCompare(b.key),
			space: 2,
		}),
		{ flag: 'w' }
	)
}

const srcJSON = JSON.parse(fs.readFileSync(srcPath, 'utf8'))

progressBar.start(destLangs.length * srcJSON.length, 0)
destLangs.forEach((destLang) => {
	const destPath = `source/locales/releases/releases-${destLang}.json`
	translateTo(srcJSON, destPath, destLang)
})
