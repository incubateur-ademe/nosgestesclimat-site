import { Action } from 'Actions/actions'
import { createStateFromSavedSimulation } from 'Selectors/storageSelectors'
import { RootState } from './rootReducer'

export default (state: RootState, action: Action): RootState => {
	switch (action.type) {
		case 'LOAD_PREVIOUS_SIMULATION': // todo : à supprimer - utilisé dans sessionbar
			return {
				...state,
				...createStateFromSavedSimulation(state),
			}
		case 'DELETE_PREVIOUS_SIMULATION': // todo : à supprimer
			return {
				...state,
				previousSimulation: null,
			}
		default:
			return state
	}
}
