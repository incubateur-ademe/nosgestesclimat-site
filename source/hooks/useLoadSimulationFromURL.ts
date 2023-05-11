import LZString from 'lz-string'

export const useLoadSimulationFromURL = () => {
	// Get search params from URL
	const searchParams = new URL(window.location).searchParams

	const slzc = searchParams.getAll('sc')

	if (!slzc.length) return null

	const decompressedSimulation = LZString.decompressFromUTF16(slzc[0] || '')
	console.log(decompressedSimulation)
	const simulation = JSON.parse(decompressedSimulation || '')
	return {
		currentSimulationId: simulation?.id,
		simulations: [
			{
				...simulation,
				storedAmortissementAvion: {},
				storedTrajets: {},
				survey: null,
				targetUnit: '€/mois',
				unfoldedStep: null,
				url: '/simulateur/bilan',
			},
		],
		tutorial: {
			scoreExplanation: 'skip',
			'testCategory-alimentation': 'skip',
			'testCategory-divers': 'skip',
			'testCategory-logement': 'skip',
			'testCategory-services sociétaux': 'skip',
			'testCategory-transport': 'skip',
			testIntro: 'skip',
		},
		localisation: null,
	}
}
