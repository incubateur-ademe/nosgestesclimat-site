import { AppState } from '@/reducers/rootReducer'
import { useSelector } from 'react-redux'

export const useCurrentSimulation = () =>
	useSelector((state: AppState) => state.simulation)
