import { Action } from 'Actions/actions'
import { RootState } from 'Reducers/rootReducer'
import { Store } from 'redux'
import { currentSimulationSelector } from 'Selectors/storageSelectors'
import { v4 as uuidv4 } from 'uuid'
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

	return findIndexSimulationByName(simulationList, savedSimulation.name) >= 0
		? updateSimulationInList(savedSimulation, simulationList)
		: addSimulationToList(savedSimulation, simulationList)
}

function findIndexSimulationByName(
	simulationList: SavedSimulationList,
	name?: string
) {
	return simulationList.findIndex((simulation) => simulation.name === name)
}

function updateSimulationInList(
	savedSimulation: SavedSimulation,
	simulationList: SavedSimulationList
): SavedSimulationList {
	const index = findIndexSimulationByName(simulationList, savedSimulation.name)
	simulationList[index] = savedSimulation

	return simulationList
}

function addSimulationToList(
	savedSimulation: SavedSimulation,
	simulationList: SavedSimulationList
): SavedSimulationList {
	savedSimulation.date = savedSimulation.date || new Date()
	savedSimulation.name = savedSimulation.name || generateSimulationName()
	simulationList.push(savedSimulation)

	return simulationList
}

export function generateSimulationName(): string {
	return uuidv4()
}

function persistSimulationList(savedSimulationList: SavedSimulationList): void {
	safeLocalStorage.setItem(
		LOCAL_STORAGE_KEY,
		JSON.stringify(savedSimulationList)
	)
}

export function retrievePersistedSimulations(): SavedSimulationList {
	const simulations = fetchSimulation()
	simulations.sort((a, b) => {
		const dateA = a.date ? new Date(a.date) : new Date()
		const dateB = b.date ? new Date(b.date) : new Date()
		return dateB.getTime() - dateA.getTime()
	})

	return simulations
}

function fetchSimulation(): SavedSimulationList {
	const serializedState = safeLocalStorage.getItem(LOCAL_STORAGE_KEY)
	const deserializedState = serializedState ? JSON.parse(serializedState) : []
	if (Array.isArray(deserializedState)) {
		return deserializedState
	}
	// cas ou l'utilisateur a l'ancienne simulation dans son local storage
	deserializedState.date = new Date()
	deserializedState.name = generateSimulationName()
	// je sauvegarde la nouvelle liste pour éviter les prochains conflits.
	persistSimulationList([deserializedState])

	return [deserializedState]
}

export function retrieveLastPersistedSimulation(): SavedSimulation {
	const simulationlist = retrievePersistedSimulations()

	return simulationlist[0]
}

export function deletePersistedSimulation(): void {
	safeLocalStorage.removeItem(LOCAL_STORAGE_KEY)
}

export function deleteSimulation(name: string): void {
	const simulationList = retrievePersistedSimulations()
	const newList = simulationList.filter(
		(simulation) => simulation.name !== name
	)
	persistSimulationList(newList)
}
