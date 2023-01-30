import { useEffect } from 'react'

import useBranchData from 'Components/useBranchData'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import Engine from 'publicodes'
import { constantFolding, getRawNodes } from 'publiopti'
import { addTranslationToBaseRules } from '../../nosgestesclimat/scripts/i18n/addTranslationToBaseRules'
import { getCurrentLangAbrv } from '../locales/translation'
import { defaultRulesOptions, RulesOptions } from '../reducers/rootReducer'

/* This hook gets the publicode rules from the good URL,
 * and then makes it available to the whole component tree
 * through the state (state.rules) as unparsed, or through the useEngine hook as parsed, but only for component that are enclosed in WithEngine to trigger the parsing only for components that need this (heavy) operation.
 *
 * Loading rules implies choosing one out of many options for 4 dimensions
 * - language
 * - i18n (localised footprint rules)
 * - optimized (with publiopti) or the complete set
 * - which model git branch to be able to show demos on an online netlify URL
 *
 *
 * This logic is a handmade and basic implementation of react 18's Suspense for data loading
 * principles. Switching to this experimental feature could be great if we had concurrent
 * loading problems. Here, we only have one block of data (co2.json) at a time.
 * */
export default (options) => {
	const currentOptions = useSelector((state) => state.rulesOptions)
	const { optimized }: RulesOptions = options || defaultRulesOptions
	if (optimized) console.log('🗜️  Optimized rules requested')
	else console.log('💯 Complete rules requested')
	const { i18n } = useTranslation()
	const currLangAbrv = getCurrentLangAbrv(i18n)
	const branchData = useBranchData()
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const newOptions = optimized !== currentOptions.optimized

	useEffect(() => {
		let active = true

		const fetchAndSetRules = () => {
			if (!branchData.loaded) return
			// This is not optimized. We don't really need to reload the opti rules if the current rules are complete. See RulesProvider.
			// But whereas reparsing the rules is a problem, redownloading some data while navigating, without reparsing, is a secondary problem
			console.log('will test rules', rules, !newOptions)
			if (rules && !newOptions) return
			console.log('passed rules test, !newOptions', rules, !newOptions)
			//This NODE_ENV condition has to be repeated here, for webpack when compiling. It can't interpret shouldUseLocalFiles even if it contains the same variable
			if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
				// TODO: find a way to use compressed models in dev mode
				console.log(
					'===== DEV MODE : the model is on your hard drive on ./nosgestesclimat ======='
				)
				// Rules are stored in nested yaml files
				const req = require.context(
					'../../nosgestesclimat/data/',
					true,
					/\.(yaml)$/
				)

				const baseRules = req.keys().reduce((acc, key) => {
					if (key.match(/translated-rules-.*yaml/)) {
						// ignoring translating files.
						return acc
					}
					const jsonRuleSet = req(key).default || {}
					return { ...acc, ...jsonRuleSet }
				}, {})

				var rules = baseRules

				const currentLang = i18n.language === 'en' ? 'en-us' : i18n.language
				if (currentLang !== 'fr') {
					const translatedRulesAttrs =
						require(`../../nosgestesclimat/data/translated-rules-${currentLang}.yaml`).default
					rules = addTranslationToBaseRules(baseRules, translatedRulesAttrs)
					if (!rules) {
						console.error(
							'Error occured while recompiling translated rules for:',
							currentLang
						)
					}
				}

				if (optimized) {
					console.time('⚙️ folding rules locally')
					const engine = new Engine(rules)
					const foldedRules = constantFolding(engine)
					console.timeEnd('⚙️ folding rules locally')
					console.time('⚙️ re-parsing folded rules')
					const sourceFoldedRules = getRawNodes(foldedRules)
					if (active) {
						dispatch({ type: 'SET_RULES', rules: sourceFoldedRules, options })
					}
				} else {
					console.log('will set rules though', rules == null)
					if (active) dispatch({ type: 'SET_RULES', rules, options })
				}
			} else {
				const url =
					branchData.deployURL +
					// TODO: find a better way to manage 'en'
					`/co2-${i18n.language === 'en' ? 'en-us' : currLangAbrv}${
						optimized ? '-opti' : ''
					}.json`
				console.log('fetching:', url)
				fetch(url, { mode: 'cors' })
					.then((response) => response.json())
					.then((json) => {
						if (active) dispatch({ type: 'SET_RULES', rules: json, options })
					})
			}
		}
		fetchAndSetRules()
		return () => {
			active = false
		}
	}, [
		dispatch,
		branchData.deployURL,
		branchData.loaded,
		branchData.shouldUseLocalFiles,
		i18n.language,
		newOptions,
		rules,
	])

	return rules
}
