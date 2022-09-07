const fs = require('fs')
const path = require('path')
const ramda = require('ramda')
const yaml = require('yaml')
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
console.log(`OK`)

const analysedFrResources = utils.dotNotationToNestedObject(
	require(utils.paths.staticAnalysisFrRes)
)

Object.entries(analysedFrResources)
	.map(([key, value]) => [key, value === 'NO_TRANSLATION' ? key : value])
	.forEach(([key, value]) => {
		let keys = key.split('.')
		if (1 === keys.length) {
			analysedFrResources[keys[0]] = value
		} else {
			analysedFrResources = ramda.assocPath(
				key.split('.'),
				value,
				analysedFrResources
			)
		}
	})

console.log(`Writting resources in ${utils.paths.uiTranslationResource.fr}...`)
try {
	fs.writeFileSync(
		utils.paths.uiTranslationResource.fr,
		yaml.stringify(analysedFrResources, {
			sortMapEntries: true,
		})
	)
} catch (err) {
	console.error('ERROR: an error occured while writting!')
	console.error(err.message)
	return
}
console.log(`OK`)

// const translatedKeys = parse(fs.readFileSync(UiTranslationPath, 'utf-8'))
//
// const missingTranslations = Object.keys(staticKeys).filter((key) => {
// 	if (key.match(/^\{.*\}$/)) {
// 		return false
// 	}
// 	const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
// 	return !R.path(keys, translatedKeys)
// }, staticKeys)
// return R.pick(missingTranslations, staticKeys)
