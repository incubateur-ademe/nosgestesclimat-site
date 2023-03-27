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

		const userData: User = {
			simulations: updateSimulationList(state.simulations, state.simulation),
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

export function retrievePersistedSimulations(): SavedSimulationList {
	const simulations = fetchUser().simulations
	simulations.sort((a, b) => {
		const dateA = a.date ? new Date(a.date) : new Date()
		const dateB = b.date ? new Date(b.date) : new Date()
		return dateB.getTime() - dateA.getTime()
	})

	return simulations
}

export function fetchUser(): User {
	const serializedUser = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	const deserializedUser: User | OldSavedSimulation = serializedUser
		? JSON.parse(serializedUser)
		: {
				simulations: [],
		  }
	if (deserializedUser.hasOwnProperty('simulations')) {
		return deserializedUser as User
	}
	// cas ou l'utilisateur a l'ancienne simulation dans son local storage
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

export function retrieveLastPersistedSimulation(): SavedSimulation {
	const simulationlist = retrievePersistedSimulations()

	return simulationlist[0]
}
