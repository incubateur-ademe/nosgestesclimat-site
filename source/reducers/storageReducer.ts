import { Action } from 'Actions/actions'
import { createStateFromSavedSimulation } from 'Selectors/storageSelectors'
import { retrievePersistedSimulations } from 'Source/storage/persistSimulation'
import { RootState } from './rootReducer'

export default (state: RootState, action: Action): RootState => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION':
			return {
				...state,
				...createStateFromSavedSimulation(state),
			}
		case 'LOAD_SIMULATION_LIST':
			return {
				...state,
				simulationList: retrievePersistedSimulations(),
			}
		case 'DELETE_PREVIOUS_SIMULATION':
			return {
				...state,
				previousSimulation: null,
			}
		default:
			return state
	}
}
