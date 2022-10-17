/*
	Simple module containing all paths implicated to the translation.
*/

const path = require('path')

const utils = require('./../../nosgestesclimat/scripts/i18n/utils')

const localesDir = path.resolve('source/locales')
const rulesTranslation = path.resolve('source/locales/rules-en.yaml')
const i18nextParserConfig = path.resolve('scripts/i18n/parser.config.js')
const staticAnalysisFrRes = path.resolve(
	'source/locales/static-analysis-fr.json'
)
const UI = Object.fromEntries(
	utils.availableLanguages.map((lang) => [
		lang,
		path.resolve(`source/locales/ui/ui-${lang}.yaml`),
	])
)

const FAQ = Object.fromEntries(
	utils.availableLanguages.map((lang) => [
		lang,
		{
			withLock: path.resolve(`source/locales/faq/FAQ-${lang}.yaml`),
			withoutLock: path.resolve(`source/locales/faq/FAQ-${lang}-min.yaml`),
		},
	])
)

module.exports = {
	localesDir,
	rulesTranslation,
	i18nextParserConfig,
	staticAnalysisFrRes,
	UI,
	FAQ,
}
