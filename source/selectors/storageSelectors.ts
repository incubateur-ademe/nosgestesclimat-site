import { RootState, Simulation } from 'Reducers/rootReducer'
import { DottedName } from 'Rules'
import { Lang } from '../locales/translation'

export type SavedSimulation = {
	situation: Simulation['situation']
	foldedSteps: Array<DottedName> | undefined
	actionChoices: Object
	persona?: string
	tutorials: Object
	storedTrajets: Object
	url?: string
	// Current language used for the UI translation -- not the model.
	currentLang: Lang
	localisation: Object | undefined
<<<<<<< HEAD
	conference: { room: string } | null
	survey: { room: string } | null
=======
>>>>>>> 960f2c789 (store array of objects simulation instead of one)
	date?: Date
	name?: string
}

export type SavedSimulationList = SavedSimulation[]

export const currentSimulationSelector = (state: RootState) => {
	return {
		situation: state.simulation?.situation ?? {},
		foldedSteps: state.simulation?.foldedSteps,
		actionChoices: state.actionChoices,
		persona: state.simulation?.persona,
		tutorials: state.tutorials,
		storedTrajets: state.storedTrajets,
		url: state.simulation?.url,
		currentLang: state.currentLang,
		localisation: state.localisation,
		conference: state.conference && { room: state.conference.room },
		survey: state.survey && { room: state.survey.room },
		date: state.simulation?.date,
		name: state.simulation?.name,
	}
}

export const createStateFromSavedSimulation = (
	state: RootState
): Partial<RootState> => {
	if (!state.previousSimulation) return {}

	return {
		simulation: {
			...state.simulation,
			situation: state.previousSimulation.situation || {},
			foldedSteps: state.previousSimulation.foldedSteps || [],
			persona: state.previousSimulation.persona,
			name: state.previousSimulation.name,
		} as Simulation,
		previousSimulation: null,
	}
}
