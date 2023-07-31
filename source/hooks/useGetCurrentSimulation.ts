import { AppState } from '@/reducers/rootReducer'
import { useSelector } from 'react-redux'

export const useGetCurrentSimulation = () =>
	useSelector((state: AppState) => state.simulation)
