/*
	Analyses the source code and extracts the corresponding i18next resource file.

	Command: npm run generate:ui
*/

const fs = require('fs')
const ramda = require('ramda')
const child_process = require('child_process')
const utils = require('./utils')
const stringify = require('json-stable-stringify')

const red = (str) => utils.withStyle(utils.colors.fgRed, str)
const green = (str) => utils.withStyle(utils.colors.fgGreen, str)
const yellow = (str) => utils.withStyle(utils.colors.fgYellow, str)

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
	if (fs.existsSync(utils.paths.staticAnalysisFrRes)) {
		fs.unlinkSync(utils.paths.staticAnalysisFrRes)
	}
	child_process.execSync(`i18next -c ${utils.paths.i18nextParserConfig}`)
} catch (err) {
	console.error('ERROR: an error occured during the analysis!')
	console.error(err.message)
	return
}

const analysedFrResourceInDotNotation = require(utils.paths.staticAnalysisFrRes)
var oldFrResource
try {
	oldFrResource = require(utils.paths.uiTranslationResource.fr)
} catch {
	oldFrResource = '{}'
}

console.log('Adding missing entries...')

const splitRegexp = /(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/
const translationIsTheKey = (key) => 1 === key.split(splitRegexp).length

let result = {
	addedTranslations: [],
	missingTranslations: [],
	updatedTranslations: [],
}

Object.entries(analysedFrResourceInDotNotation)
	.map(([key, value]) => [
		key,
		value === 'NO_TRANSLATION' && translationIsTheKey(key) ? key : value,
	])
	.filter(
		([key, value]) =>
			!ramda.pathEq(key.split(splitRegexp), value, oldFrResource)
	)
	.forEach(([key, value]) => {
		const keys = key.split(splitRegexp)

		if (!ramda.hasPath(keys, oldFrResource) || value !== 'NO_TRANSLATION') {
			if (value === 'NO_TRANSLATION') {
				result.missingTranslations.push(key)
			} else if (ramda.hasPath(keys, oldFrResource)) {
				result.updatedTranslations.push(key)
			} else {
				result.addedTranslations.push(key)
			}
			oldFrResource = ramda.assocPath(keys, value, oldFrResource)
		}
	})

printResult(green('+') + ' Added', result.addedTranslations, green)
printResult(yellow('~') + ' Updated', result.updatedTranslations, yellow)
printResult(red('-') + ' Missing', result.missingTranslations, red)

console.log(`Writting resources in ${utils.paths.uiTranslationResource.fr}...`)
try {
	fs.writeFileSync(
		utils.paths.uiTranslationResource.fr,

		stringify(oldFrResource, {
			cmp: (a, b) => a.key.localeCompare(b.key),
			space: 2,
		})
	)
} catch (err) {
	console.error('ERROR: an error occured while writting!')
	console.error(err.message)
	return
}
