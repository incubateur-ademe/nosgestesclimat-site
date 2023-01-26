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

import { options } from 'yargs'
import useRules, { UseRulesOptions } from './components/useRules'

export default ({ children }) => {
	return <EngineWrapper>{children}</EngineWrapper>
}

const EngineWrapper = ({ children }) => {
	const engineState = useSelector((state) => state.engineState)
	const rules = engineState.parse && useRules(engineState.options)
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

			return engine
		}
		return false
		// We rely on this useMemo hook to store multiple Engines.
		// Say the test component requests the optimized parsed rules,
		// then the documentation loads the complete rules, then the user
		// goes back to the test component : the Engine shouldn't be parsed again
		// but picked from the hook'e memo.
		// TODO : test this : React says we shouldn't rely on this feature
	}, [engineRequested, branchData.deployURL, rules, options.optimized])

	useEffect(() => {
		if (engine) dispatch({ type: 'SET_ENGINE', to: { parse: 'ready' } })
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
	options: UseRulesOptions
	children: ReactNode
	fallback: ReactNode
}) => {
	const dispatch = useDispatch()
	const engineState = useSelector((state) => state.engineState)

	useEffect(() => {
		if (!engineState)
			dispatch({ type: 'SET_ENGINE', to: { parse: 'requested', options } })
		return
	}, [])

	if (engineState.parse !== 'ready') return fallback
	return children
}