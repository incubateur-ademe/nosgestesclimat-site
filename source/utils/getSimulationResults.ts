import { correctValue, extractCategories } from '@/components/publicodesUtils'
import { SimulationResults } from '@/types/groups'
import Engine from 'publicodes'

export const getSimulationResults = ({
	engine,
}: {
	engine: Engine | undefined
}): SimulationResults | undefined => {
	if (!engine) {
		return undefined
	}

	const resultsObject = {} as SimulationResults
	const rules = engine.getParsedRules()
	const categories = extractCategories(rules, engine)

	categories.forEach((category) => {
		resultsObject[category.name] = (
			Math.round(((category.nodeValue as number) ?? 0) / 10) / 100
		).toFixed(2)
	})

	const { nodeValue: rawNodeValue, unit } = engine.evaluate('bilan')
	const valueTotal = correctValue({ nodeValue: rawNodeValue, unit })

	resultsObject.total = ((valueTotal as number) / 10 / 100).toFixed(2)

	return resultsObject
}
