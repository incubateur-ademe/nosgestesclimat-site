import { Action } from 'Actions/actions'
import { RootState } from 'Reducers/rootReducer'
import { Store } from 'redux'
import { currentSimulationSelector } from 'Selectors/storageSelectors'
import {
	SavedSimulation,
	SavedSimulationList,
} from '../selectors/storageSelectors'
import { debounce } from '../utils'
import safeLocalStorage from './safeLocalStorage'

const VERSION = 2

const LOCAL_STORAGE_KEY = 'ecolab-climat::persisted-simulation::v' + VERSION

export function persistSimulation(store: Store<RootState, Action>): void {
	const listener = () => {
		const state = store.getState()
		if (
			!state.simulation?.foldedSteps?.length &&
			!Object.keys(state.actionChoices).length &&
			!Object.values(state.tutorials) &&
			!Object.keys(state.storedTrajets).length &&
			!state.localisation
		) {
			return
		}

		const simulationList = setSimulationList(currentSimulationSelector(state))
		persistSimulationList(simulationList)
	}
	store.subscribe(debounce(1000, listener))
}

function setSimulationList(
	savedSimulation: SavedSimulation | null
): SavedSimulationList {
	const simulationList = retrievePersistedSimulations()

	if (savedSimulation === null) return simulationList

	if (
		simulationList.find(
			(simulation) => simulation.name === savedSimulation.name
		)
	) {
		return updateSimulationInList(savedSimulation, simulationList)
	} else {
		return addSimulationToList(savedSimulation, simulationList)
	}
}

function updateSimulationInList(
	savedSimulation: SavedSimulation,
	simulationList: SavedSimulationList
): SavedSimulationList {
	const index = simulationList.findIndex(
		(simulation) => simulation.name === savedSimulation.name
	)
	savedSimulation.date = new Date()
	simulationList[index] = savedSimulation

	return simulationList
}

function addSimulationToList(
	savedSimulation: SavedSimulation,
	simulationList: SavedSimulationList
): SavedSimulationList {
	savedSimulation.date = savedSimulation.date || new Date()
	savedSimulation.name =
		savedSimulation.name || generateSimulationName(savedSimulation.date)
	simulationList.push(savedSimulation)

	return simulationList
}

export function generateSimulationName(date: Date): string {
	return date.toISOString().substring(0, 10).replaceAll('-', '')
}

function persistSimulationList(savedSimulationList: SavedSimulationList): void {
	safeLocalStorage.setItem(
		LOCAL_STORAGE_KEY,
		JSON.stringify(savedSimulationList)
	)
}

export function retrievePersistedSimulations(): SavedSimulationList {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	const deserializedState = serializedState ? JSON.parse(serializedState) : []

	if (Array.isArray(deserializedState)) {
		return deserializedState
	}
	// cas ou l'utilisateur a l'ancienne simulation dans son local storage
	deserializedState.date = new Date()
	deserializedState.name = generateSimulationName(deserializedState.date)

	return [deserializedState]
}

export function retrieveLastPersistedSimulation(): SavedSimulation {
	const simulationlist = retrievePersistedSimulations()

	// on prends la simulation la plus récente
	simulationlist.sort((a, b) => {
		const dateA = a.date ? new Date(a.date) : new Date()
		const dateB = b.date ? new Date(b.date) : new Date()
		return dateA.getTime() - dateB.getTime() ? 1 : -1
	})

	return simulationlist[0]
}

export function deletePersistedSimulation(): void {
	safeLocalStorage.removeItem(LOCAL_STORAGE_KEY)
}
