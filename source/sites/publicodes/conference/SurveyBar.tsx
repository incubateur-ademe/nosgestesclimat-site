import {
	correctValue,
	DottedName,
	extractCategories,
	splitName,
} from '@/components/publicodesUtils'
import Engine from 'publicodes'

import { minimalCategoryData } from '@/components/publicodesUtils'
import { useEngine } from '@/components/utils/EngineContext'
import { useSimulationProgress } from '@/hooks/useNextQuestion'
import { usePersistingState } from '@/hooks/usePersistState'
import { AppState } from '@/reducers/rootReducer'
import { situationSelector } from '@/selectors/simulationSelectors'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { GroupModeMenuEntryContent } from './GroupModeSessionVignette'
import { computeHumanMean } from './GroupStats'
import { surveyElementsAdapter } from './Survey'
import useDatabase, { answersURL } from './useDatabase'
import { getAllParticipants, getCompletedTests } from './utils'

export default () => {
	const situation = useSelector(situationSelector)

	const engine: Engine<DottedName> = useEngine()

	const evaluation = engine.evaluate('bilan')
	const { nodeValue: rawNodeValue, unit } = evaluation

	const rules = useSelector((state: AppState) => state.rules)

	const progress = useSimulationProgress()

	const byCategory = minimalCategoryData(extractCategories(rules, engine))

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const socket = useDatabase()

	const survey = useSelector((state) => state.survey)
	const dispatch = useDispatch()
	const [DBError, setDBError] = useState(null)

	const [surveyIds, setSurveyIds] = usePersistingState('surveyIds', {})

	const cachedSurveyId = surveyIds[survey.room]

	const [surveyContext] = usePersistingState('surveyContext', {})

	const context =
		surveyContext[survey.room] &&
		Object.keys(surveyContext[survey.room]).reduce(
			(acc, key) => ({
				...acc,
				...{ [splitName(key)[1]]: surveyContext[survey.room][key] },
			}),
			{}
		)

	const data = {
		total: Math.round(nodeValue),
		progress: +progress.toFixed(4),
		byCategory,
		context,
	}

	useEffect(() => {
		if (!survey || !survey.room) return null
		fetch(answersURL + survey.room)
			.catch((e) => {
				setDBError('🚧 Le serveur ne répond pas 😥')
				console.log('erreur', e)
			})
			.then((res) => res && res.json())
			.then(
				(json) =>
					json &&
					dispatch({
						type: 'ADD_SURVEY_ANSWERS',
						answers: json,
						room: survey.room,
					})
			)

		if (!cachedSurveyId) {
			setSurveyIds({ ...surveyIds, [survey.room]: uuidv4() })
		}
	}, [survey.room])

	useEffect(() => {
		if (!survey || !survey.room || !cachedSurveyId) return

		const answer = {
			survey: survey.room,
			data,
			id: cachedSurveyId,
		}
		socket.emit('answer', { room: survey.room, answer })

		// This should not be necessary, but for a reason I don't understand the server doesn't emit to A A's response
		dispatch({
			type: 'ADD_SURVEY_ANSWERS',
			answers: [answer],
			room: survey.room,
		})
	}, [situation, surveyContext, survey.room, cachedSurveyId])

	useEffect(() => {
		const onReceived = (data) => {
			dispatch({
				type: 'ADD_SURVEY_ANSWERS',
				answers: [data.answer],
				room: survey.room,
			})
		}
		socket.on('received', onReceived)

		// On cleanup, remove the attached listener
		return () => socket.off('received', onReceived)
	}, [])

	const existContext = survey ? !(survey.contextFile == null) : false
	const contextRules = existContext && survey.contextRules

	const elements = surveyElementsAdapter(survey.answers)
	const rawUsers = getAllParticipants(elements)
	const rawUsersNumber = rawUsers.length
	const completedTests = getCompletedTests(elements, contextRules)
	const completedTestsNumber = completedTests.length

	const simulationArray = rawUsers && Object.values(rawUsers),
		result = computeHumanMean(
			translation,
			simulationArray.map((el) => el.total)
		)
	if (DBError) return <div className="ui__ card plain">{DBError}</div>

	return (
		<GroupModeMenuEntryContent
			{...{
				room: survey.room,
				rawUsersNumber,
				completedTestsNumber,
				result,
				groupMode: 'sondage',
			}}
		/>
	)
}
