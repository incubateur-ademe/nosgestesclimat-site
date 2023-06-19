import { reformateDataFromDB } from '@/components/utils/formatDataForDB'
import { emailSimulationURL } from '@/sites/publicodes/conference/useDatabase'
import { Simulation } from '@/types/simulation'
import * as Sentry from '@sentry/react'
import { useEffect, useState } from 'react'

type DataSimulationObject = { data: Simulation }

export const useLoadSimulationFromURL = () => {
	const [simulation, setSimulation] = useState<
		DataSimulationObject | undefined
	>(undefined)

	// Get search params from URL
	const searchParams = new URL(window.location.toString()).searchParams

	const idSimulation = searchParams.get('sid')

	const idSimulationDecoded = decodeURIComponent(idSimulation || '')

	useEffect(() => {
		const loadSimulation = async (id: string) => {
			try {
				const response = await fetch(`${emailSimulationURL}${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const simulation: DataSimulationObject = await response.json()
				const simulationReformatted = { ...simulation }
				simulationReformatted.data.situation = reformateDataFromDB(
					simulationReformatted.data
				)

				return simulationReformatted
			} catch (e) {
				Sentry.captureException(e)
			}
		}

		if (idSimulationDecoded && !simulation) {
			loadSimulation(idSimulationDecoded)
				.then((simulation: DataSimulationObject | undefined) => {
					setSimulation(simulation)
				})
				.catch((e) => {
					Sentry.captureException(e)
				})
		}
	}, [idSimulationDecoded, simulation])

	return simulation?.data
}
