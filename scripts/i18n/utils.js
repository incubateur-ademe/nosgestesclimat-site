require('dotenv').config()
require('isomorphic-fetch')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const querystring = require('querystring')
const { readRules } = require('../rules')
const yaml = require('yaml')

const paths = {
	localesDir: path.resolve('source/locales'),
	rulesTranslation: path.resolve('source/locales/rules-en.yaml'),
	i18nextParserConfig: path.resolve('scripts/i18n/parser.config.js'),
	staticAnalysisFrRes: path.resolve('source/locales/static-analysis-fr.json'),
	uiTranslationResource: {
		fr: path.resolve('source/locales/ui-fr.yaml'),
		en: path.resolve('source/locales/ui-en.yaml'),
	},
}

let attributesToTranslate = [
	'titre',
	'description',
	'question',
	'résumé',
	'suggestions',
	'note',
]

function getRulesMissingTranslations() {
	let rules = readRules()

	let currentExternalization = yaml.parse(
		fs.readFileSync(rulesTranslationPath, 'utf-8')
	)

	let missingTranslations = []
	let resolved = Object.entries(rules)
		.map(([dottedName, rule]) => [
			dottedName,
			!rule || !rule.titre // && utils.ruleWithDedicatedDocumentationPage(rule))
				? { ...rule, titre: dottedName.split(' . ').slice(-1)[0] }
				: rule,
		])
		.map(([dottedName, rule]) => ({
			[dottedName]: R.mergeAll(
				Object.entries(rule)
					.filter(([, v]) => !!v)
					.map(([k, v]) => {
						let attrToTranslate = attributesToTranslate.find(R.equals(k))
						if (!attrToTranslate) return {}
						let enTrad = attrToTranslate + '.en',
							frTrad = attrToTranslate + '.fr'

						let currentTranslation = currentExternalization[dottedName]

						if ('suggestions' === attrToTranslate) {
							return Object.keys(v).reduce((acc, suggestion) => {
								const enTrad = `suggestions.${suggestion}.en`
								const frTrad = `suggestions.${suggestion}.fr`
								if (
									currentTranslation &&
									currentTranslation[enTrad] &&
									currentTranslation[frTrad] === suggestion
								) {
									return {
										...acc,
										[frTrad]: currentTranslation[frTrad],
										[enTrad]: currentTranslation[enTrad],
									}
								}
								missingTranslations.push([dottedName, enTrad, suggestion])
								return {
									...acc,
									[frTrad]: suggestion,
								}
							}, {})
						}

						// Check if a human traduction exists already for this attribute and if
						// it does need to be updated
						if (
							currentTranslation &&
							currentTranslation[enTrad] &&
							currentTranslation[frTrad] === v
						)
							return {
								[enTrad]: currentTranslation[enTrad],
								[frTrad]: v,
							}

						missingTranslations.push([dottedName, enTrad, v])
						return {
							[frTrad]: v,
						}
					})
			),
		}))
	resolved = R.mergeAll(resolved)
	return [missingTranslations, resolved]
}

const getUiMissingTranslations = (pathToCompareWith) => {
	const staticKeys = require(path.resolve(
		'source/locales/static-analysis-fr.json'
	))
	const translatedKeys = yaml.parse(fs.readFileSync(pathToCompareWith, 'utf-8'))

	const missingTranslations = Object.keys(staticKeys).filter((key) => {
		if (key.match(/^\{.*\}$/)) {
			return false
		}
		const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
		return !R.path(keys, translatedKeys)
	}, staticKeys)
	return R.pick(missingTranslations, staticKeys)
}

const fetchTranslation = async (text) => {
	console.log(`Fetch translation for:\n\t${text}`)
	const req = `https://api-free.deepl.com/v2/translate?${querystring.stringify({
		text,
		auth_key: `ed64c4b2-ff0c-9c45-a304-8086f0c2baf2:fx`,
		tag_handling: 'xml',
		source_lang: 'FR',
		target_lang: 'EN',
	})}`
	console.log(`Fetching: ${req}`)
	const response = await fetch(req)
	const { translations } = await response.json()
	return translations[0].text
}

// Source: https://www.thiscodeworks.com/convert-javascript-dot-notation-object-to-nested-object-javascript/60e47841a2dbdc00144e9446
const dotNotationToNestedObject = (obj) => {
	const result = {}

	for (const objectPath in obj) {
		const parts = objectPath.split('.')

		let target = result
		while (parts.length > 1) {
			const part = parts.shift()
			target = target[part] = target[part] || {}
		}

		target[parts[0]] = obj[objectPath]
	}

	return result
}

module.exports = {
	fetchTranslation,
	getRulesMissingTranslations,
	getUiMissingTranslations,
	dotNotationToNestedObject,
	paths,
}
