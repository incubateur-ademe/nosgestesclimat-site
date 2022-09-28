require('dotenv').config()
require('isomorphic-fetch')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const { readRules } = require('../rules')
const yaml = require('yaml')
const deepl = require('deepl-node')

const availableLanguages = ['fr', 'en-us', 'es', 'it']
const defaultLang = availableLanguages[0]

const paths = {
	localesDir: path.resolve('source/locales'),
	rulesTranslation: path.resolve('source/locales/rules-en.yaml'),
	i18nextParserConfig: path.resolve('scripts/i18n/parser.config.js'),
	staticAnalysisFrRes: path.resolve('source/locales/static-analysis-fr.json'),
	uiTranslationResource: {
		fr: path.resolve('source/locales/ui/ui-fr.json'),
		'en-us': path.resolve('source/locales/ui/ui-en.json'),
		it: path.resolve('source/locales/ui/ui-it.json'),
		es: path.resolve('source/locales/ui/ui-es.json'),
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

const getUiMissingTranslations = (sourcePath, targetPath, override = false) => {
	if (!fs.existsSync(targetPath) || override) {
		console.log(`Creating ${targetPath}`)
		fs.writeFileSync(targetPath, '{}')
	}
	const staticKeys = nestedObjectToDotNotation(
		require(path.resolve(sourcePath))
	)
	const translatedKeys = JSON.parse(fs.readFileSync(targetPath, 'utf-8'))
	const missingTranslations = Object.keys(staticKeys).filter((key) => {
		if (key.match(/^\{.*\}$/)) {
			// Skip keys of the form '{<str>}' as they are not meant to be translated
			return false
		}
		const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
		return !R.path(keys, translatedKeys)
	}, staticKeys)
	return R.pick(missingTranslations, staticKeys)
}

const translator = new deepl.Translator(process.env.DEEPL_API_KEY)

const fetchTranslation = async (text, sourceLang, targetLang) => {
	const resp = await translator
		.translateText(text, sourceLang, targetLang, {
			tagHandling: 'html',
			ignoreTags: ['a'],
			preserveFormatting: true,
		})
		.catch((err) => {
			printErr(`Error: while fetching the request: ${err}`)
			process.exit(-1)
		})

	return resp instanceof Array
		? resp.map((translation) => translation.text)
		: resp.text
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

// TODO: could be optimized?
const nestedObjectToDotNotation = (obj) => {
	const result = {}

	const flatten = (prefix, obj) => {
		for (const key in obj) {
			const value = obj[key]
			const newKey = prefix ? prefix + '.' + key : key

			if (typeof value === 'object') {
				flatten(newKey, value)
			} else {
				result[newKey] = value
			}
		}
	}

	flatten('', obj)

	return result
}

module.exports = {
	fetchTranslation,
	getRulesMissingTranslations,
	getUiMissingTranslations,
	dotNotationToNestedObject,
	nestedObjectToDotNotation,
	paths,
	defaultLang,
	availableLanguages,
}
