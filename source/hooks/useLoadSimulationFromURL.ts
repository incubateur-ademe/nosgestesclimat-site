import { NETLIFY_FUNCTIONS_URL } from '@/constants/urls'
import { Simulation } from '@/reducers/rootReducer'
import { emailSimulationURL } from '@/sites/publicodes/conference/useDatabase'
import { useEffect, useState } from 'react'

export const useLoadSimulationFromURL = () => {
	const [simulation, setSimulation] = useState<Simulation | undefined>(
		undefined
	)
	// Get search params from URL
	const searchParams = new URL(window.location.toString()).searchParams

	const idSimulation = searchParams.get('sid')

	const idSimulationDecoded = decodeURIComponent(idSimulation || '')

	useEffect(() => {
		const loadSimulation = async (id: string) => {
			try {
				const responseDecryption = await fetch(
					`${NETLIFY_FUNCTIONS_URL}/decrypt-data`,
					{
						method: 'POST',
						body: id,
					}
				)

				const decryptedId = await responseDecryption.json()

				const response = await fetch(`${emailSimulationURL}${decryptedId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const simulation = await response.json()

				return simulation
			} catch (e) {
				console.log(e)
			}
		}

		if (idSimulationDecoded) {
			loadSimulation(idSimulationDecoded)
				.then((simulation: Simulation) => {
					setSimulation(simulation)
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [idSimulationDecoded])

	return {
		...simulation,
		storedAmortissementAvion: {},
		storedTrajets: {},
		survey: null,
		targetUnit: '€/mois',
		unfoldedStep: null,
		url: '/simulateur/bilan',
	}
}
