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
import { ReactNode, useEffect, useMemo } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import useRules from './components/useRules'
import { RulesOptions } from './reducers/rootReducer'

export default ({ children }) => {
	return <EngineWrapper>{children}</EngineWrapper>
}

const EngineWrapper = ({ children }) => {
	const engineState = useSelector((state) => state.engineState)
	const engineRequested = engineState !== null
	const rules = useSelector((state) => state.rules)
	const dispatch = useDispatch()
	const branchData = useBranchData()

	const engine = useMemo(() => {
		const shouldParse = engineRequested && rules
		if (shouldParse) {
			console.log(
				`⚙️ will parse ${Object.keys(rules).length} rules,  expensive operation`
			)
			console.time('⚙️ parsing rules')
			const engine = new Engine(rules)
			console.timeEnd('⚙️ parsing rules')

			return engine
		}
		return false
		// We rely on this useMemo hook to store multiple Engines.
		// Say the test component requests the optimized parsed rules,
		// then the documentation loads the complete rules, then the user
		// goes back to the test component : the Engine shouldn't be parsed again
		// but picked from the hook'e memo.
		// TODO : test this : React says we shouldn't rely on this feature
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
	options,
	children,
	fallback = (
		<div>
			<Trans>Chargement du modèle de calcul...</Trans>
		</div>
	),
}: {
	options?: RulesOptions
	children: ReactNode
	fallback: ReactNode
}) => {
	const dispatch = useDispatch()
	const engineState = useSelector((state) => state.engineState)
	const currentRulesOptions = useSelector((state) => state.rulesOptions)

	useRules(options)

	useEffect(() => {
		if (engineState && currentRulesOptions?.optimized === false) return // if the full set of rules is loaded, don't reload the optimzed set, since the former includes the latter
		dispatch({ type: 'SET_ENGINE', to: 'requested' })
		return
	}, [])

	if (
		engineState !== 'ready' ||
		(options?.optimized === false && currentRulesOptions?.optimized)
	)
		return fallback
	return children
}
