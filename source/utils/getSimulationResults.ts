import { correctValue, extractCategories } from '@/components/publicodesUtils'
import { setSituationForValidKeys } from '@/components/utils/EngineContext'
import Engine from 'publicodes'

export const getSimulationResults = ({ simulation }) => {
	let resultsObject = undefined

	if (simulation) {
		resultsObject = {}

		const engine = new Engine({})

		setSituationForValidKeys({ engine, situation: simulation.situation })

		const rules = engine.getParsedRules()

		const categories = extractCategories(rules, engine)

		categories.forEach((category) => {
			resultsObject[category.name] = (
				Math.round(((category.nodeValue as number) ?? 0) / 10) / 100
			).toFixed(2)
		})

		const evaluation = engine.evaluate('bilan')
		const { nodeValue: rawNodeValue, unit } = evaluation
		const valueTotal = correctValue({ nodeValue: rawNodeValue, unit })

		resultsObject.total = valueTotal
	}

	return resultsObject
}
