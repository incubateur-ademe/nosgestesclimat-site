import { Simulation } from '@/types/simulation'

export const getIsSimulationValid = (simulation: Simulation): boolean => {
	return !!simulation?.id
}
