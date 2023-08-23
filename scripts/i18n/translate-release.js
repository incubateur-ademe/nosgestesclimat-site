/*
	Calls the DeepL API to translate the JSON release files.

	Command: yarn translate:release [options]
*/

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
const getDestPath = (destLang) =>
	`source/locales/releases/releases-${destLang}.json`

const translateTo = async (srcJSON, tradJSON, destPath, destLang) => {
	const alreadyTranslatedReleases = tradJSON.map((release) => {
		return release.name
	})

	await Promise.all(
		srcJSON
			.filter((release) => !alreadyTranslatedReleases.includes(release.name))
			.map(async (release) => {
				const translation = await deepl.fetchTranslationMarkdown(
					release.body,
					srcLang.toUpperCase(),
					destLang.toUpperCase()
				)
				console.log(
					`🌍 Translated release ${cli.magenta(release.name)} to ${cli.yellow(
						destLang
					)}`
				)
				release.body = translation
				tradJSON.push(release)
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
	const destPath = getDestPath(destLang)
	const tradJSON = JSON.parse(fs.readFileSync(destPath, 'utf8')) ?? []
	const numberOfMissingTranslation = srcJSON.length - tradJSON.length

	if (numberOfMissingTranslation === 0) {
		console.log(`🌍 ${cli.yellow(destLang)} is already up to date`)
	} else {
		translateTo(srcJSON, tradJSON, destPath, destLang)
	}
})
