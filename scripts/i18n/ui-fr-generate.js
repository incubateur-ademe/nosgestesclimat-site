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
Object.entries(analysedFrResourceInDotNotation)
	.map(([key, value]) => [
		key,
		value === 'NO_TRANSLATION' && key.split('.').length === 1 ? key : value,
	])
	.filter(([key, _]) => !ramda.hasPath(key.split('.'), oldFrResource))
	.forEach(([key, value]) => {
		let keys = key.split('.')
		console.log(` + new entry: '${key}'`)
		if (1 === keys.length) {
			oldFrResource[keys[0]] = value
		} else if (!ramda.hasPath(keys, oldFrResource)) {
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
