/*
	Simple module containing all paths implicated to the translation.
*/

const path = require('path')

const localesDir = path.resolve('source/locales')
const rulesTranslation = path.resolve('source/locales/rules-en.yaml')
const i18nextParserConfig = path.resolve('scripts/i18n/parser.config.js')
const staticAnalysisFrRes = path.resolve(
	'source/locales/static-analysis-fr.json'
)
const uiTranslationResource = {
	fr: path.resolve('source/locales/ui/ui-fr.yaml'),
	'en-us': path.resolve('source/locales/ui/ui-en.yaml'),
	it: path.resolve('source/locales/ui/ui-it.yaml'),
	es: path.resolve('source/locales/ui/ui-es.yaml'),
}

module.exports = {
	localesDir,
	rulesTranslation,
	i18nextParserConfig,
	staticAnalysisFrRes,
	uiTranslationResource,
}
