import { AppState } from '@/reducers/rootReducer'
import { useSelector } from 'react-redux'

export const useGetCurrentSimulation = () => {
	const currentSimulationId = useSelector(
		(state: AppState) => state.currentSimulationId
	)

	const simulationList = useSelector((state: AppState) => state.simulations)

	const currentSimulation = simulationList.find(
		(simulation) => simulation.id === currentSimulationId
	)

	return currentSimulation
}
