import {
	EngineProvider,
	SituationProvider,
} from 'Components/utils/EngineContext'
import {
	configSituationSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'

import useBranchData from 'Components/useBranchData'
import Engine from 'publicodes'
import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { constantFolding } from 'publiopti'
import { addTranslationToBaseRules } from '../nosgestesclimat/scripts/i18n/addTranslationToBaseRules'
import { getCurrentLangAbrv } from './locales/translation'

/* This component gets the publicode rules from the good URL,
 * then gives them
 * to the engine to parse, and hence makes it available to the whole component tree
 * through the state (state.rules) as unparsed, or through the useEngine hook as parsed, but only for component that are enclosed in WithEngine 
 * to trigger the parsing only for components that need this heavy operation.
 *
 * This component triggers loading rules as soon as possible, BUT the components that use
 * the engine should wait for it to be available. Hence the use of the WithRules
 * component that returns null if rules are not ready in the state.
 *
 * This logic is a handmade and basic implementation of react 18's Suspense for data loading
 * principles. Switching to this experimental feature could be great if we had concurrent
 * loading problems. Here, we only have one block of data (co2.json) at a time.
 * */

export default ({ children }) => {
	const { i18n } = useTranslation()
	const currLangAbrv = getCurrentLangAbrv(i18n)
	const branchData = useBranchData()
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const setRules = (rules) => dispatch({ type: 'SET_RULES', rules })

	useEffect(() => {
		if (!branchData.loaded) return
		//This NODE_ENV condition has to be repeated here, for webpack when compiling. It can't interpret shouldUseLocalFiles even if it contains the same variable
		if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
			// TODO: find a way to use compressed models in dev mode
			console.log(
				'===== DEV MODE : the model is on your hard drive on ./nosgestesclimat ======='
			)
			// Rules are stored in nested yaml files
			const req = require.context('../nosgestesclimat/data/', true, /\.(yaml)$/)

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
					require(`../nosgestesclimat/data/translated-rules-${currentLang}.yaml`).default
				rules = addTranslationToBaseRules(baseRules, translatedRulesAttrs)
				if (!rules) {
					console.error(
						'Error occured while recompiling translated rules for:',
						currentLang
					)
				}
			}

			setRules(rules, branchData.deployURL)
		} else {
			const url =
				branchData.deployURL +
				// TODO: find a better way to manage 'en'
				`/co2-${i18n.language === 'en' ? 'en-us' : currLangAbrv}-opti.json`
			console.log('fetching:', url)
			fetch(url, { mode: 'cors' })
				.then((response) => response.json())
				.then((json) => {
					setRules(json, branchData.deployURL)
				})
		}
	}, [
		branchData.deployURL,
		branchData.loaded,
		branchData.shouldUseLocalFiles,
		i18n.language,
	])

	return <EngineWrapper rules={rules}>{children}</EngineWrapper>
}

const EngineWrapper = ({ rules, children }) => {
	const engineState = useSelector((state) => state.engineState)
	const dispatch = useDispatch()
	const branchData = useBranchData()

	const engineRequested = engineState !== null

	const engine = useMemo(() => {
		const shouldParse = engineRequested && rules
		if (shouldParse) {
			console.log(
				`⚙️ will parse ${Object.keys(rules).length} rules,  expensive operation`
			)
			console.time('⚙️ parsing rules')
			const engine = new Engine(rules)
			console.timeEnd('⚙️ parsing rules')

			if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
				// Optimizing the rules by applying a constant folding optimization pass
				console.time('⚙️ folding rules')
				const foldedRules = constantFolding(engine)
				console.time('⚙️ folding rules')
				engine.setSituation(foldedRules)
				console.log(
					`⚙️ removed ${
						Object.keys(rules).length -
						Object.keys(engine.getParsedRules()).length
					} rules`
				)
			}
			return engine
		}
		return false
	}, [engineRequested, branchData.deployURL, rules])

	useEffect(() => {
		if (engine) dispatch({ type: 'SET_ENGINE', to: 'ready' })
		return
	}, [engine])

	const userSituation = useSelector(situationSelector),
		configSituation = useSelector(configSituationSelector),
		situation = useMemo(
			() => ({
				...configSituation,
				...userSituation,
			}),
			[configSituation, userSituation]
		)

	return (
		<EngineProvider value={engine}>
			<SituationProvider situation={situation}>{children}</SituationProvider>
		</EngineProvider>
	)
}

export const WithEngine = ({
	children,
	fallback = (
		<div>
			<Trans>Chargement du modèle de calcul...</Trans>
		</div>
	),
}) => {
	const dispatch = useDispatch()
	const engineState = useSelector((state) => state.engineState)

	useEffect(() => {
		if (!engineState) dispatch({ type: 'SET_ENGINE', to: 'requested' })
		return
	}, [])

	if (engineState !== 'ready') return fallback
	return children
}
