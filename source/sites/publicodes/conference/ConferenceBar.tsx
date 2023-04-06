import { correctValue, extractCategories } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import * as Y from 'yjs'
import { minimalCategoryData } from '../../../components/publicodesUtils'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { conferenceElementsAdapter } from './Conference'
import { GroupModeMenuEntryContent } from './GroupModeSessionVignette'
import { computeHumanMean } from './Stats'
import useYjs from './useYjs'
import { defaultProgressMin, defaultThreshold, getElements } from './utils'

export default () => {
	const translation = useTranslation(),
		t = translation.t

	const situation = useSelector(situationSelector),
		engine = useEngine(),
		evaluation = engine.evaluate('bilan'),
		{ nodeValue: rawNodeValue, unit } = evaluation
	const rules = useSelector((state) => state.rules)

	const progress = useSimulationProgress()
	const { elements, users, username, conference } = useYjs(null)

	const byCategory = minimalCategoryData(extractCategories(rules, engine))

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	useEffect(() => {
		if (!conference?.ydoc) return

		const simulations = conference.ydoc.get('simulations', Y.Map)

		simulations.set(username, {
			total: Math.round(nodeValue),
			progress,
			byCategory,
		})
	}, [situation])

	if (!conference?.ydoc)
		return <Link to="/conférence">Lancer une conférence</Link>

	const statElements = conferenceElementsAdapter(elements)
	const rawUserNumber = getElements(
		statElements,
		defaultThreshold,
		null,
		0
	).length

	const completedTests = getElements(
		statElements,
		defaultThreshold,
		null,
		defaultProgressMin
	)

	const completedTestsNumber = completedTests.length

	const simulationArray = completedTests && Object.values(completedTests),
		result = computeHumanMean(
			translation,
			simulationArray.map((el) => el.total)
		)

	return (
		<GroupModeMenuEntryContent
			{...{
				groupMode: 'conférence',
				room: conference.room,
				rawUserNumber,
				completedTestsNumber,
				result,
			}}
		/>
	)
}
