import { RootState } from '../../../reducers/rootReducer'

export default (state: RootState) => state.enquête

/* Should be changed to 
export const enquêteSelector = createSelector(
	[currentSimulationSelector],
	(simulation) => {
		return simulation.enquête
	}
)
*/
