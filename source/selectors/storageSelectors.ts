import { DottedName } from '@/components/publicodesUtils'
import { Lang } from '@/locales/translation'
import { AppState } from '@/reducers/rootReducer'

export type Enquête = {
	userID: string
	date: string
}

import { Group } from '@/types/groups'
import { Rating } from '@/types/rating'
import { Simulation, SimulationConfig } from '@/types/simulation'

export type SavedSimulation = {
	situation: Simulation['situation']
	foldedSteps?: Array<DottedName>
	actionChoices: Object
	persona?: string
	storedTrajets: Object
	storedAmortissementAvion: { [key: string]: number }
	conference: { room: string } | null
	survey: { room: string } | null
	enquête: Enquête | null
	ratings: { learned: Rating; action: Rating }
	url?: string
	date?: Date
	id?: string
	config: SimulationConfig
	hiddenNotifications: Array<string>
	targetUnit: string
}

// This type is used to describe the old format of the simulation stored in users' local storage.
export type OldSavedSimulation = SavedSimulation & {
	tutorials: Object
	currentLang: Lang
	localisation: Object | undefined
}

export type SavedSimulationList = SavedSimulation[]

// This type describes the object stored in local storage.
// We store the list of simulations and a pointer
// that will allow us to initialize the store with the last used simulation.
export type User = {
	simulations: SavedSimulationList
	currentSimulationId: string | undefined
	tutorials: Object
	currentLang: Lang
	localisation: Object | undefined
	hasSubscribedToNewsletter: boolean
	groups: Group[]
	userId: string | null
	groupToRedirectTo: Group | null
}

// In the end, this selector will allow to retrieve the simulation from the list
export const currentSimulationSelector = (state: AppState) => {
	return state.simulations.filter(
		(simulation) => simulation.id === state.currentSimulationId
	)[0]
}

export const createStateFromSavedSimulation = (
	state: AppState
): Partial<AppState> => {
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
