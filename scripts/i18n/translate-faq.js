/*
	Calls the DeepL API to translate the FAQ Yaml files.

	Command: yarn translate:faq -- [options]
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')
const yaml = require('yaml')
const prettier = require('prettier')
const R = require('ramda')

const utils = require('./utils')
const cli = require('./cli')

const { srcLang, destLangs } = cli.getArgs(
	`Calls the DeepL API to translate the FAQ Yaml files.`
)

const srcPath = `source/locales/faq/FAQ-${srcLang}.yaml`

const translateTo = async (srcYAML, destPath, destLang) => {
	const destYAML = []
	await Promise.all(
		srcYAML.map(async (faqEntry) => {
			const trans = await utils.fetchTranslation(
				[faqEntry.question, faqEntry['catégorie'], faqEntry['réponse']],
				srcLang,
				destLang
			)
			faqEntry.question = trans[0]
			faqEntry['catégorie'] = trans[1]
			faqEntry['réponse'] = trans[2]
			destYAML.push(faqEntry)
		})
	)

	const formattedYaml = prettier.format(
		yaml.stringify(destYAML, { sortMapEntries: false }),
		{
			parser: 'yaml',
		}
	)
	fs.writeFileSync(destPath, formattedYaml, { flag: 'w' })
}

const srcYAML = yaml.parse(fs.readFileSync(srcPath, 'utf8'))

const run = async () => {
	for (targetLang of destLangs) {
		console.log(
			`Translating the FAQ files from '${srcLang}' to '${targetLang}'...`
		)
		const destPath = `source/locales/faq/FAQ-${targetLang}.yaml`
		await translateTo(srcYAML, destPath, targetLang)
	}
}

cli.printWarn(`WARN: internal links must be translated manually.`)
run()
