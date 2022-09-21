/*
	Calls the DeepL API to translate the FAQ Yaml files.

	Command: npm run translate:faq -- [options]

	TODO:
	- [ ] Add a flag to only translate the missing entries -- currently it translates everything each time
*/

const cliProgress = require('cli-progress')
const fs = require('fs')
const glob = require('glob')
const yargs = require('yargs')
const yaml = require('yaml')
const prettier = require('prettier')
const R = require('ramda')

const utils = require('./utils')

// TODO: argv could be factorized in a common file?
const argv = yargs
	.usage(
		`Calls the DeepL API to translate the FAQ Yaml files.

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

const srcPath = `source/locales/faq/FAQ-${srcLang}.yaml`

if (!utils.availableLanguages.includes(srcLang)) {
	utils.printErr(`ERROR: the language '${srcLang}' is not supported.`)
	process.exit(-1)
}

const translateTo = async (srcYAML, destPath, destLang) => {
	const destYAML = []
	await Promise.all(
		srcYAML.map(async (faqEntry) => {
			const trans = await utils.fetchTranslation(
				[faqEntry.question, faqEntry['catégorie'], faqEntry['réponse']],
				srcLang.toUpperCase(),
				destLang.toUpperCase()
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
utils.printWarn(`WARN: internal links must be translated manually.`)
targetLangs
	.filter((l) => utils.availableLanguages.includes(l) && l !== srcLang)
	.forEach(async (targetLang) => {
		console.log(
			`Translating the FAQ files from '${srcLang}' to '${targetLang}'...`
		)
		translateTo(
			srcYAML,
			`source/locales/faq/FAQ-${targetLang}.yaml`,
			targetLang
		)
	})
