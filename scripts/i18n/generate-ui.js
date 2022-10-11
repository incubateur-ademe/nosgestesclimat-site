/*
	Analyses the source code and extracts the corresponding i18next resource file.

	Command: npm run generate:ui
*/

const fs = require('fs')
const ramda = require('ramda')
const child_process = require('child_process')

const utils = require('../../nosgestesclimat/scripts/i18n/utils')
const cli = require('../../nosgestesclimat/scripts/i18n/cli')
const paths = require('./paths')

const { remove } = cli.getArgs(
	'Analyses the source code and extracts the corresponding i18next resource file.',
	{ remove: true }
)

const red = (str) => cli.withStyle(cli.colors.fgRed, str)
const green = (str) => cli.withStyle(cli.colors.fgGreen, str)
const yellow = (str) => cli.withStyle(cli.colors.fgYellow, str)

const printResult = (prefix, array, style) => {
	if (array.length > 0) {
		const entries = array.length > 10 ? array.slice(0, 10) : array

		console.log(prefix, style(array.length), `translations:`)
		entries.sort().forEach((key) => {
			console.log(style(`    ${key}`))
		})
		if (array.length > 10) {
			console.log(style(`    ...`))
		}
	}
}

console.log(`Static analysis of the source code...`)
try {
	if (fs.existsSync(paths.staticAnalysisFrRes)) {
		fs.unlinkSync(paths.staticAnalysisFrRes)
	}
	child_process.execSync(`i18next -c ${paths.i18nextParserConfig}`)
} catch (err) {
	cli.printErr('ERROR: an error occured during the analysis!')
	cli.printErr(err.message)
	return
}

const staticAnalysedFrResource = require(paths.staticAnalysisFrRes)
let oldFrResource
try {
	oldFrResource = utils.readYAML(paths.uiTranslationResource.fr).entries
} catch (err) {
	oldFrResource = {}
}

console.log('Adding missing entries...')
const translationIsTheKey = (key) => !utils.isI18nKey(key)

if (remove) {
	console.log('Removing unused entries...')
	const oldKeys = Object.keys(oldFrResource)
	const currentKeys = Object.keys(
		utils.nestedObjectToDotNotation(staticAnalysedFrResource)
	)
	const unusedKeys = ramda.difference(oldKeys, currentKeys)
	oldFrResource = ramda.omit(unusedKeys, oldFrResource)
	printResult(green('-') + ' Removed', unusedKeys, green)
} else {
	let result = {
		addedTranslations: [],
		missingTranslations: [],
		updatedTranslations: [],
	}
	Object.entries(staticAnalysedFrResource)
		.map(([key, value]) => [
			key,
			value === 'NO_TRANSLATION' && translationIsTheKey(key) ? key : value,
		])
		.filter(([key, value]) => oldFrResource[key] !== value)
		.forEach(([key, value]) => {
			if (!oldFrResource[key] || value !== 'NO_TRANSLATION') {
				if (value === 'NO_TRANSLATION') {
					result.missingTranslations.push(key)
				} else if (oldFrResource[key]) {
					result.updatedTranslations.push(key)
				} else {
					result.addedTranslations.push(key)
				}
				oldFrResource[key] = value
			}
		})
	printResult(green('+') + ' Added', result.addedTranslations, green)
	printResult(yellow('~') + ' Updated', result.updatedTranslations, yellow)
	printResult(red('-') + ' Missing', result.missingTranslations, red)
}

console.log(`Writting resources in ${paths.uiTranslationResource.fr}...`)
try {
	utils.writeYAML(paths.uiTranslationResource.fr, { entries: oldFrResource })
} catch (err) {
	cli.printErr('ERROR: an error occured while writting!')
	cli.printErr(err.message)
	return
}
