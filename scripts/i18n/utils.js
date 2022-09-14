require('dotenv').config()
require('isomorphic-fetch')
const fs = require('fs')
const path = require('path')
const R = require('ramda')
const querystring = require('querystring')
const { readRules } = require('../rules')
const yaml = require('yaml')
const diff = require('deep-diff')

const colors = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',
	fgBlack: '\x1b[30m',
	fgRed: '\x1b[31m',
	fgGreen: '\x1b[32m',
	fgYellow: '\x1b[33m',
	fgBlue: '\x1b[34m',
	fgMagenta: '\x1b[35m',
	fgCyan: '\x1b[36m',
	fgWhite: '\x1b[37m',
	bgBlack: '\x1b[40m',
	bgRed: '\x1b[41m',
	bgGreen: '\x1b[42m',
	bgYellow: '\x1b[43m',
	bgBlue: '\x1b[44m',
	bgMagenta: '\x1b[45m',
	bgCyan: '\x1b[46m',
	bgWhite: '\x1b[47m',
}

const withStyle = (color, text) => `${color}${text}${colors.reset}`

const paths = {
	localesDir: path.resolve('source/locales'),
	rulesTranslation: path.resolve('source/locales/rules-en.yaml'),
	i18nextParserConfig: path.resolve('scripts/i18n/parser.config.js'),
	staticAnalysisFrRes: path.resolve('source/locales/static-analysis-fr.json'),
	uiTranslationResource: {
		fr: path.resolve('source/locales/ui-fr.json'),
		en: path.resolve('source/locales/ui-en.json'),
		es: path.resolve('source/locales/ui-es.json'),
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

// TODO:
// - [ ] Catch missing file error
const getUiMissingTranslations = (sourcePath, targetPath) => {
	// const collectMissingTranslations = (src, target, missingTrans) => {
	// 	// console.log('collectMissingTranslations', src, target, missingTrans)
	// 	if (!src) {
	// 		return missingTrans
	// 	}
	// 	// const nonNullTarget = target || {}
	// 	//
	// 	console.log(`missingTrans`, missingTrans)
	// 	console.log(`diff ${src} ${target}:`, diff(src, target))
	//
	// 	return (
	// 		diff(src, target)
	// 			.filter(({ kind }) => 'D' === kind)
	// 			// .forEach((o) => console.log(o))
	// 			.map(({ path, lhs }) => {
	// 				const missKeys = Object.keys(lhs)
	// 				// console.log(`path:`, path)
	// 				// console.log(`lhs:`, lhs)
	// 				// path.concat(missKeys)
	// 				const pathOrEmpty = path || []
	//
	// 				return missKeys
	// 					.map((key) => {
	// 						console.log(`${pathOrEmpty}.push(${key}):`)
	// 						if (typeof lhs[key] === 'object') {
	// 							return collectMissingTranslations(
	// 								lhs[key],
	// 								target[key],
	// 								pathOrEmpty
	// 							)
	// 						}
	// 						return R.append(key, pathOrEmpty)
	// 					})
	// 					.reduce((acc, curr) => {
	// 						console.log(`reduce(${acc}, ${curr}):`)
	// 						return R.append(curr, acc)
	// 					}, missingTrans)
	// 			})[0]
	// 	)
	// }
	const staticKeys = nestedObjectToDotNotation(
		require(path.resolve(sourcePath))
	)
	const translatedKeys = JSON.parse(fs.readFileSync(targetPath, 'utf-8'))
	const missingTranslations = Object.keys(staticKeys).filter((key) => {
		if (key.match(/^\{.*\}$/)) {
			return false
		}
		const keys = key.split(/(?<=[A-zÀ-ü0-9])\.(?=[A-zÀ-ü0-9])/)
		return !R.path(keys, translatedKeys)
	}, staticKeys)
	return R.pick(missingTranslations, staticKeys)
	// return collectMissingTranslations(staticKeys, translatedKeys, [])
}

const fetchTranslation = async (text, sourceLang, targetLang) => {
	const req = `https://api.deepl.com/v2/translate?${querystring.stringify({
		text,
		auth_key: process.env.DEEPL_API_KEY,
		tag_handling: 'xml',
		source_lang: sourceLang,
		target_lang: targetLang,
	})}`
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
	paths,
	colors,
	withStyle,
}
