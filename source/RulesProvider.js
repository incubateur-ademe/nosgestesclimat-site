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
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { constantFolding, getRawNodes } from 'publiopti'
import useRules from './components/useRules'

export default ({ children }) => {
	return <EngineWrapper>{children}</EngineWrapper>
}

const EngineWrapper = ({ children }) => {
	const rules = useRules({ optimized: true })
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
				console.timeEnd('⚙️ folding rules')
				console.time('⚙️ re-parsing rules')
				const sourceFoldedRules = getRawNodes(foldedRules)
				const engineFromFolded = new Engine(sourceFoldedRules)
				console.timeEnd('⚙️ re-parsing rules')
				console.log(
					`⚙️ removed ${
						Object.keys(rules).length -
						Object.keys(engine.getParsedRules()).length
					} rules`
				)
				return engineFromFolded
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
