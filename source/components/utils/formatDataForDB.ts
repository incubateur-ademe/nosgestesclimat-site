import { Simulation } from '@/types/simulation'

type SimulationFormatted = {
	[key: string]: any
}

/**
 * Formats the simulation data, removing the ' . ' from the keys
 * @param simulation
 * @returns
 */
export const formatDataForDB = (
	simulation: Simulation
): SimulationFormatted => {
	const simulationFormatted = { ...simulation }

	return Object.entries(
		simulationFormatted.situation as { [key: string]: any }
	).reduce((acc: { [key: string]: any }, [key, value]: [string, any]) => {
		acc[key.replaceAll(' . ', '_').replaceAll(' ', '-')] = value
		return acc
	}, {})
}

export const reformateDataFromDB = (
	simulation: Simulation
): SimulationFormatted => {
	const simulationFormatted = { ...simulation }

	return Object.entries(
		simulationFormatted.situation as { [key: string]: any }
	).reduce((acc: { [key: string]: any }, [key, value]: [string, any]) => {
		acc[key.replaceAll('_', ' . ').replaceAll('-', ' ')] = value
		return acc
	}, {})
}
