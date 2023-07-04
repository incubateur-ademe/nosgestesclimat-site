import {
	DottedName,
	extractCategories,
	minimalCategoryData,
} from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { useNextQuestions } from '@/hooks/useNextQuestion'
import { AppState, SimulationConfig, Situation } from '@/reducers/rootReducer'
import useActions from '@/sites/publicodes/useActions'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { currentSimulationSelector } from './storageSelectors'

export const configSelector = (state: AppState): Partial<SimulationConfig> =>
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

export const situationSelector = (state: AppState) =>
	state.simulation?.situation ?? emptySituation

export const configSituationSelector = (state: AppState) =>
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

export const targetUnitSelector = (state: AppState) =>
	state.simulation?.targetUnit ?? '€/mois'

export const currentQuestionSelector = (state: AppState) =>
	state.simulation?.unfoldedStep ?? null

export const answeredQuestionsSelector = (state: AppState) =>
	state.simulation?.foldedSteps ?? []

export const useTestCompleted = () => {
	const nextQuestions = useNextQuestions(),
		objectives = useSelector(objectifsSelector)

	const testCompleted = objectives.length > 0 && nextQuestions.length === 0
	return testCompleted
}

// Designed to store simulation data in a DB, for the purpose of the survey
export const useSimulationData = () => {
	const situation = useSelector(situationSelector)

	const ratings = useSelector((state: AppState) => state.ratings)

	const actionChoices = useSelector((state: AppState) => state.actionChoices)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const rules = useSelector((state: AppState) => state.rules),
		engine = useEngine()
	const categoriesRaw = extractCategories(rules, engine),
		categories = minimalCategoryData(categoriesRaw)
	const storedTrajets = useSelector((state: AppState) => state.storedTrajets)
	const storedAmortissementAvion = useSelector(
		(state: AppState) => state.storedAmortissementAvion
	)
	const { interestingActions: actionResultsRaw } = useActions({
			focusedAction: null,
			rules,
			radical: true,
			engine,
			metric: null,
		}),
		actionResults = minimalCategoryData(actionResultsRaw)

	const totalRule = engine.evaluate('bilan')
	const total = totalRule && Math.round(totalRule.nodeValue || -1)

	const data = {
		// The situation is a key, value object, keys being the ids of the publicode variables that are questions, called "dottedNames".
		// Questions are all listed and detailed here at the URL /questions. Their possible values and units are also given.
		// For each key in situation, the value can be either a string, for binary questions, and multiple answer questions,
		// or an object for numerical values, containing the property {valeur: 999, unité: 'km / an'}, since numerical values are bound to a unit, e.g. for time, year -> month implies a division by 12.
		// This object only contains explicit user inputs : when the user selects "I don't know", the "mean" value won't be included. See below, answeredQuestions
		situation,
		// This property holds user inputs that are not handled by publicode rules.
		extraSituation: {
			// It's the case for the input km in the advanced helper of the "transport . voiture . km" question. They should be handled by publicodes, as a list, but aren't yet.
			storedTrajets,
			// Action choices are the user's boolean choice on actions, an object with the key being a dottedName, and the value true | false
			// Ignored actions are not listed here
			actionChoices,
			storedAmortissementAvion,
		},
		// This is a simple list of answered questions.
		// What's the use, given the situation object above ? It lets you know which questions were viewed and answered by the user, answered being either an explicit answer, or a click on "I don't know".
		answeredQuestions,
		//This property holds the result of the evaluation of the nosgestesclimat model on the inputs above.
		results: {
			//A key value object for the main categories of nosgestesclimat. There are 5 of them in march 2023. The value is a figure in kgCO2e.
			categories,
			//The total value. Can be viewed as a control check of the sum of `categories`
			total,
			// The value of each of the actions available in nosgestesclimat. Either a value in kgCO2e, or null if not applicable.
			// Beware, it doesn't mean the user saw all of these actions.
			actionResults,
		},
		ratings,
	}
	return data
}
export const isPersonaSelector = createSelector(
	[currentSimulationSelector],
	(simulation) => simulation?.persona != null
)

export const hasSubscribedToNewsletterSelector = (state: AppState) => {
	return state.hasSubscribedToNewsletter ?? ''
}
