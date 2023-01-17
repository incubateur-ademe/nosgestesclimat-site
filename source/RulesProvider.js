import {
	engineOptions,
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
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { addTranslationToBaseRules } from '../nosgestesclimat/scripts/i18n/addTranslationToBaseRules'
import { getCurrentLangAbrv } from './locales/translation'

/* This component gets the publicode rules from the good URL,
 * then gives them
 * to the engine to parse, and hence makes it available to the whole component tree
 * through the state (state.rules) as unparsed, or through the useEngine hook as parsed.
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
				`/co2-${i18n.language === 'en' ? 'en-us' : currLangAbrv}.json`
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
			console.log('⚙️ will parse the rules,  expensive operation')
		}
		const engine = shouldParse && new Engine(rules, engineOptions)

		return engine
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

const AnimatedLoader = () => (
	<div
		css={`
			margin-top: 10vh;
			text-align: center;
			.lds-ripple {
				display: inline-block;
				position: relative;
				width: 80px;
				height: 80px;
			}
			.lds-ripple div {
				position: absolute;
				border: 4px solid #fff;
				opacity: 1;
				border-radius: 50%;
				animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;

				background: radial-gradient(
					#30c691 20%,
					#538cf7 50%,
					#9255c2 60%,
					#ff3831 80%
				);
			}
			.lds-ripple div:nth-child(2) {
				animation-delay: -0.5s;
			}

			@keyframes lds-ripple {
				0% {
					top: 36px;
					left: 36px;
					width: 0;
					height: 0;
					opacity: 0;
				}
				4.9% {
					top: 36px;
					left: 36px;
					width: 0;
					height: 0;
					opacity: 0;
				}
				5% {
					top: 36px;
					left: 36px;
					width: 0;
					height: 0;
					opacity: 1;
				}
				100% {
					top: 0px;
					left: 0px;
					width: 72px;
					height: 72px;
					opacity: 0;
				}
			}
		`}
	>
		<div className="lds-ripple">
			<div></div>
			<div></div>
		</div>
	</div>
)

export const WithEngine = ({ children, fallback = <AnimatedLoader /> }) => {
	const dispatch = useDispatch()
	const engineState = useSelector((state) => state.engineState)

	useEffect(() => {
		if (!engineState) dispatch({ type: 'SET_ENGINE', to: 'requested' })
		return
	}, [])

	if (engineState !== 'ready') return fallback
	return children
}
