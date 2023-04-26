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
import { computeHumanMean } from './GroupStats'
import useYjs from './useYjs'
import { getAllParticipants, getCompletedTests } from './utils'

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

	const rawUsers = getAllParticipants(statElements)
	const rawUsersNumber = rawUsers.length

	const completedTests = getCompletedTests(statElements, null)
	const completedTestsNumber = completedTests.length

	const simulationArray = rawUsers && Object.values(rawUsers),
		result = computeHumanMean(
			translation,
			simulationArray.map((el) => el.total)
		)

	return (
		<GroupModeMenuEntryContent
			{...{
				groupMode: 'conférence',
				room: conference.room,
				rawUsersNumber,
				completedTestsNumber,
				result,
			}}
		/>
	)
}
