import { Action } from '@/actions/actions'
import { AppState } from '@/reducers/rootReducer'
import { createStateFromSavedSimulation } from '@/selectors/storageSelectors'

export default (state: AppState, action: Action): AppState => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION': // todo : delete ? - used in sessionbar
			return {
				...state,
				...createStateFromSavedSimulation(state),
			}
		case 'DELETE_PREVIOUS_SIMULATION': // todo : delete
			return {
				...state,
				previousSimulation: null,
			}
		default:
			return state
	}
}
