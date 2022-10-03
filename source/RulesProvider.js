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
import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEngine } from './components/utils/EngineContext'

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
	const branchData = useBranchData()
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const setRules = (rules) => dispatch({ type: 'SET_RULES', rules })

	useEffect(() => {
		if (!branchData.loaded) return
		//This NODE_ENV condition has to be repeated here, for webpack when compiling. It can't interpret shouldUseLocalFiles even if it contains the same variable
		if (NODE_ENV === 'development' && branchData.shouldUseLocalFiles) {
			console.log(
				'=====DEV MODE : the model is on your hard drive on ../nosgestesclimat ======='
			)
			// Rules are stored in nested yaml files
			const req = require.context(
				'../../nosgestesclimat/data/',
				true,
				/\.(yaml)$/
			)

			const rules = req.keys().reduce((memo, key) => {
				const jsonRuleSet = req(key).default || {}
				return { ...memo, ...jsonRuleSet }
			}, {})

			setRules(rules, branchData.deployURL)
		} else {
			fetch(branchData.deployURL + '/co2.json', { mode: 'cors' })
				.then((response) => response.json())
				.then((json) => {
					setRules(json, branchData.deployURL)
				})
		}
	}, [branchData.deployURL, branchData.loaded, branchData.shouldUseLocalFiles])

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

export const WithEngine = ({
	children,
	fallback = <div>Chargement du modèle de calcul</div>,
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
