import { useSelector } from 'react-redux'
import { RootState, SimulationConfig } from 'Reducers/rootReducer'
import { createSelector } from 'reselect'
import {
	extractCategories,
	minimalCategoryData,
} from '../components/publicodesUtils'
import { useEngine } from '../components/utils/EngineContext'
import { DottedName, Situation } from '../rules/index'
import useActions from '../sites/publicodes/useActions'

export const configSelector = (state: RootState): Partial<SimulationConfig> =>
	state.simulation?.config ?? {}

export const objectifsSelector = createSelector([configSelector], (config) => {
	const primaryObjectifs = (config.objectifs ?? ([] as any))
		.map((obj: DottedName | { objectifs: Array<DottedName> }) =>
			typeof obj === 'string' ? [obj] : obj.objectifs
		)
		.flat()

	const objectifs = [...primaryObjectifs, ...(config['objectifs cachés'] ?? [])]
	return objectifs
})

const emptySituation: Situation = {}

export const situationSelector = (state: RootState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: RootState) =>
	configSelector(state).situation ?? emptySituation

export const firstStepCompletedSelector = createSelector(
	[situationSelector, objectifsSelector],
	(situation, objectifs) => {
		if (!situation) {
			return false
		}
		return objectifs.some((objectif) => {
			return objectif in situation
		})
	}
)

export const targetUnitSelector = (state: RootState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = (state: RootState) =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = (state: RootState) =>
	state.simulation?.foldedSteps ?? []

// Designed to store simulation data in a DB, for the purpose of the survey
export const useSimulationData = () => {
	const situation = useSelector(situationSelector)

	const actionChoices = useSelector((state) => state.actionChoices)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const rules = useSelector((state) => state.rules),
		engine = useEngine()
	const categoriesRaw = extractCategories(rules, engine),
		categories = minimalCategoryData(categoriesRaw)
	const storedTrajets = useSelector((state) => state.storedTrajets)
	const { interestingActions: actionResultsRaw } = useActions({
			focusedAction: null,
			rules,
			radical: true,
			engine,
			metric: null,
		}),
		actionResults = minimalCategoryData(actionResultsRaw)

	const data = {
		situation,
		extraSituation: { storedTrajets, actionChoices },
		answeredQuestions,
		results: { categories, actionResults },
	}
	return data
}
