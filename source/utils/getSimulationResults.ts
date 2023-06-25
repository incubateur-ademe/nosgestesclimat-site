import { correctValue, extractCategories } from '@/components/publicodesUtils'
import { SavedSimulation } from '@/selectors/storageSelectors'
import { ResultsObject } from '@/types/groups'
import Engine from 'publicodes'

export const getSimulationResults = ({
	simulation,
	engine,
}: {
	simulation: SavedSimulation | undefined
	engine: Engine
}): ResultsObject => {
	let resultsObject

	if (simulation) {
		resultsObject = {}

		// setSituationForValidKeys({ engine, situation: simulation.situation })

		const rules = engine.getParsedRules()

		const categories = extractCategories(rules, engine)

		categories.forEach((category) => {
			resultsObject[
				category.name === 'transport . empreinte' ? 'transports' : category.name
			] = (
				Math.round(((category.nodeValue as number) ?? 0) / 10) / 100
			).toFixed(2)
		})

		const evaluation = engine.evaluate('bilan')
		const { nodeValue: rawNodeValue, unit } = evaluation
		const valueTotal = correctValue({ nodeValue: rawNodeValue, unit })

		resultsObject.total = ((valueTotal as number) / 10 / 100).toFixed(2)
	}

	return resultsObject
}
