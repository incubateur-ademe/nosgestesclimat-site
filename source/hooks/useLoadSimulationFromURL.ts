import { NETLIFY_FUNCTIONS_URL } from '@/constants/urls'
import { Simulation } from '@/reducers/rootReducer'
import { encryptedSimulationURL } from '@/sites/publicodes/conference/useDatabase'
import { useEffect, useState } from 'react'

export const useLoadSimulationFromURL = () => {
	const [simulation, setSimulation] = useState<Simulation | undefined>(
		undefined
	)
	// Get search params from URL
	const searchParams = new URL(window.location).searchParams

	const idSimulation = searchParams.get('sid')

	useEffect(() => {
		const loadSimulation = async (id) => {
			try {
				const response = await fetch(`${encryptedSimulationURL}/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				})

				const encryptedSimulation = await response.json()

				const responseDecryption = await fetch(
					`${NETLIFY_FUNCTIONS_URL}/encrypt-data`,
					{
						method: 'POST',
						body: JSON.stringify(encryptedSimulation),
					}
				)

				const decryptedSimulation = await responseDecryption.text()

				return JSON.parse(decryptedSimulation)
			} catch (e) {
				console.log(e)
			}
		}
		if (idSimulation) {
			loadSimulation(idSimulation)
				.then((simulation: Simulation) => {
					setSimulation(simulation)
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}, [idSimulation])

	window.history.replaceState({}, document.title, window.location.pathname)

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
