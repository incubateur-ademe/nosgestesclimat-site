/*
	Calls the DeepL API to translate the JSON release files.

	Command: yarn translate:release [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const stringify = require('json-stable-stringify')

const utils = require('../../nosgestesclimat/scripts/i18n/utils')
const cli = require('../../nosgestesclimat/scripts/i18n/cli')
const deepl = require('../../nosgestesclimat/scripts/i18n/deepl')

const { srcLang, destLangs } = cli.getArgs(
	'Calls the DeepL API to translate the JSON release files.',
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

const translateTo = async (srcJSON, tradJSON, destPath, destLang) => {
	const alreadyTranslatedReleases = tradJSON.map((release) => {
		return release.name
	})
	await Promise.all(
		srcJSON.map(async (release) => {
			if (alreadyTranslatedReleases.includes(release.name)) {
				return
			}
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

destLangs.forEach((destLang) => {
	const destPath = `source/locales/releases/releases-${destLang}.json`
	const tradJSON = JSON.parse(fs.readFileSync(destPath, 'utf8')) ?? []
	const numberOfMissingTranslation = srcJSON.length - tradJSON.length
	if (numberOfMissingTranslation === 0) {
		console.log(`✅ Releases correctly translated`)
	} else {
		progressBar.start(srcJSON.length - tradJSON.length, 0)
		translateTo(srcJSON, tradJSON, destPath, destLang)
	}
})
