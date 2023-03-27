import { RootState, Simulation } from 'Reducers/rootReducer'
import { DottedName } from 'Rules'
import { Lang } from '../locales/translation'

export type SavedSimulation = {
	situation: Simulation['situation']
	foldedSteps: Array<DottedName> | undefined
	actionChoices: Object
	persona?: string
	storedTrajets: Object
	conference: { room: string } | null
	survey: { room: string } | null
	url?: string
	date?: Date
	id?: string
}

export type OldSavedSimulation = SavedSimulation & {
	tutorials: Object
	currentLang: Lang
	localisation: Object | undefined
}

export type SavedSimulationList = SavedSimulation[]

export type User = {
	simulations: SavedSimulationList
	currentSimulationId: string | undefined
	tutorials: Object
	currentLang: Lang
	localisation: Object | undefined
}

export const currentSimulationSelector = (state: RootState) => {
	return state.simulations.filter(
		(simulation) => simulation.id === state.currentSimulationId
	)[0]
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
