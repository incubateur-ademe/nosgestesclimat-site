/*
	Calls the DeepL API to translate the JSON release files.

	Command: yarn translate:release [options]

	FIXME: there is still some errors with the pandoc translation.
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const stringify = require('json-stable-stringify')

const utils = require('../../nosgestesclimat/scripts/i18n/utils')
const cli = require('../../nosgestesclimat/scripts/i18n/cli')
const deepl = require('../../nosgestesclimat/scripts/i18n/deepl')

const { srcLang, destLangs } = cli.getArgs(
	`Calls the DeepL API to translate the JSON release files.

	Important: this script requires the 'pandoc' executable to be installed.`,
	{ source: true, target: true }
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
			const translation = await deepl.fetchTranslationMarkdown(
				release.body,
				srcLang.toUpperCase(),
				destLang.toUpperCase()
			)
			release.body = translation
			tradJSON.push(release)
			progressBar.increment()
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
