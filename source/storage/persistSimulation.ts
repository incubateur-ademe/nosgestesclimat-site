import { Action } from 'Actions/actions'
import { RootState } from 'Reducers/rootReducer'
import { Store } from 'redux'
import { v4 as uuidv4 } from 'uuid'
import {
	OldSavedSimulation,
	SavedSimulation,
	SavedSimulationList,
	User,
} from '../selectors/storageSelectors'
import { debounce } from '../utils'
import safeLocalStorage from './safeLocalStorage'

const VERSION = 2

const LOCAL_STORAGE_KEY = 'ecolab-climat::persisted-simulation::v' + VERSION

// This function is called after creating the store.
// It allows to save user data on every state change with a 1-second "delay".
export function persistUser(store: Store<RootState, Action>): void {
	const listener = () => {
		const state = store.getState()

		if (
			!state.simulation ||
			(!state.simulation?.foldedSteps?.length &&
				!Object.keys(state.actionChoices).length &&
				!Object.values(state.tutorials) &&
				!Object.keys(state.storedTrajets).length &&
				!state.localisation)
		) {
			return
		}

		// Ideally, the 'simulations' list should be up to date in the state
		// and contain the current simulation.
		// This will be the subject of a future update.
		// TODO: Remove 'updateSimulationList' when possible.
		const userData: User = {
			simulations: updateSimulationList(state.simulations, {
				...state.simulation,
				actionChoices: state.actionChoices,
				storedTrajets: state.storedTrajets,
				storedAmortissementAvion: state.storedAmortissementAvion,
				survey: state.survey && { room: state.survey.room },
				conference: state.conference && { room: state.conference.room },
			}),
			currentSimulationId: state.currentSimulationId || state.simulation.id,
			currentLang: state.currentLang,
			tutorials: state.tutorials,
			localisation: state.localisation,
		}
		safeLocalStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData))
	}
	store.subscribe(debounce(1000, listener))
}

function updateSimulationList(
	list: SavedSimulationList,
	simulation: SavedSimulation
): SavedSimulationList {
	const index = findIndexSimulationByName(list, simulation.id)

	list[index] = simulation

	return list
}

function findIndexSimulationByName(
	simulationList: SavedSimulationList,
	id?: string
) {
	return simulationList.findIndex((simulation) => simulation.id === id)
}

export function generateSimulationId(): string {
	return uuidv4()
}

// Function that allows to retrieve one or more simulations.
// It should be able to handle both the new and old format.
export function fetchUser(): User {
	const serializedUser = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	const deserializedUser: User | OldSavedSimulation = serializedUser
		? JSON.parse(serializedUser)
		: {
				simulations: [],
		  }

	// Case of the new format.
	if (deserializedUser.hasOwnProperty('simulations')) {
		return deserializedUser as User
	}
	// Case where the user has the old simulation format in their local storage.
	// We transform this simulation to give it the new format.
	const deserializedSimulation = deserializedUser as OldSavedSimulation
	deserializedSimulation.date = new Date()
	deserializedSimulation.id = generateSimulationId()

	return {
		simulations: [deserializedSimulation],
		currentSimulationId: deserializedSimulation.id,
		currentLang: deserializedSimulation.currentLang,
		tutorials: deserializedSimulation.tutorials,
		localisation: deserializedSimulation.localisation,
	}
}
