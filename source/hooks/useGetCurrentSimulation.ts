import { AppState } from '@/reducers/rootReducer'
import { getIsSimulationValid } from '@/utils/getIsSimulationValid'
import { useSelector } from 'react-redux'

export const useGetCurrentSimulation = () => {
	const currentSimulation = useSelector((state: AppState) => state.simulation)
	const isCurrentSimulationValid = getIsSimulationValid(currentSimulation)

	return isCurrentSimulationValid ? currentSimulation : null
}
