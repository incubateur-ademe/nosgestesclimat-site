import { AppState } from '@/reducers/rootReducer'

export const enquêteSelector = (state: AppState) => state.enquête

/* If we decide that the `enquête` is attached to one of the simulations
 * we should change it for something like this

const simulationEnquêteSelector = createSelector(
	[currentSimulationSelector],
	(simulation) => {
		return simulation?.enquête
	}
)

// This would be an intermediate implementation, it is obviously dirty
// See the TODO s in the file persistSimulation.ts
export const enquêteSelector = createSelector(
	[stateEnquêteSelector, simulationEnquêteSelector],
	(enquête, simulationEnquête) => enquête || simulationEnquête
)
*/
