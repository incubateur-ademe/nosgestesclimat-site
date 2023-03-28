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

// cette fonction est appelée après la création du strore
// elle permet de sauvegarder les données utilisateur à chaque modification du state
// avec une "latence" de 1 seconde
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

		// idéalement la liste simulations devrait être à jour dans le state
		// et contenir la simulation courante
		// ce sera l'objet d'une prochaine évolution
		// TODO : supprimer updateSimulationList quand ce sera possible.
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

// fonction qui permet de récupérer la ou les simulations
// elle doit pouvoir gérer le nouveau et l'ancien format
export function fetchUser(): User {
	const serializedUser = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	const deserializedUser: User | OldSavedSimulation = serializedUser
		? JSON.parse(serializedUser)
		: {
				simulations: [],
		  }

	// cas du nouveau format
	if (deserializedUser.hasOwnProperty('simulations')) {
		return deserializedUser as User
	}
	// cas ou l'utilisateur a l'ancienne simulation dans son local storage
	// on transforme cette simulation pour lui donner le nouveau format
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
