/*
	Analyses the source code and extracts the corresponding i18next resource file.

	Command: npm run translate:ui:fr:gen
*/

const stringify = require('json-stable-stringify')
const fs = require('fs')
const ramda = require('ramda')
const child_process = require('child_process')
const utils = require('./utils')

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
		const isMissingTranslation =
			!ramda.hasPath(keys, oldFrResource) && value === 'NO_TRANSLATION'

		if (!ramda.hasPath(keys, oldFrResource) || value !== 'NO_TRANSLATION') {
			console.log(
				`  ${
					isMissingTranslation
						? utils.colors.fgYellow + '~'
						: utils.colors.fgGreen + '+'
				}${utils.colors.reset} '${key}': ${
					isMissingTranslation
						? utils.colors.fgYellow + 'missing translation'
						: utils.colors.fgGreen + 'translation found'
				} ${utils.colors.reset}`
			)
			oldFrResource = ramda.assocPath(keys, value, oldFrResource)
		}
	})

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
