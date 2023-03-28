import { Action } from 'Actions/actions'
import { createStateFromSavedSimulation } from 'Selectors/storageSelectors'
import { RootState } from './rootReducer'

export default (state: RootState, action: Action): RootState => {
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
