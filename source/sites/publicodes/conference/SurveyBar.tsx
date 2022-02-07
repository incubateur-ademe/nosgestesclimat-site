import { correctValue } from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect, useRef, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import { WebrtcProvider } from 'y-webrtc'
import * as Y from 'yjs'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { extractCategories } from 'Components/publicodesUtils'
import { computeHumanMean } from './Stats'
import { filterExtremes } from './utils'
import { backgroundConferenceAnimation } from './conferenceStyle'
import { WebsocketProvider } from 'y-websocket'
import useYjs from './useYjs'
import useDatabase, { answersURL } from './useDatabase'
import { minimalCategoryData } from '../../../components/publicodesUtils'

export default () => {
	const situation = useSelector(situationSelector),
		engine = useEngine(),
		evaluation = engine.evaluate('bilan'),
		{ nodeValue: rawNodeValue, dottedName, unit, rawNode } = evaluation
	const rules = useSelector((state) => state.rules)

	const progress = useSimulationProgress()

	const byCategory = minimalCategoryData(extractCategories(rules, engine))

	const nodeValue = correctValue({ nodeValue: rawNodeValue, unit })

	const socket = useDatabase()

	const survey = useSelector((state) => state.survey)
	const dispatch = useDispatch()

	const [surveyIds, setSurveyIds] = usePersistingState('surveyIds', {})

	const cachedSurveyId = surveyIds[survey.room]

	const data = { total: Math.round(nodeValue), progress, byCategory }

	useEffect(() => {
		if (!survey || !survey.room) return null
		fetch(answersURL + survey.room)
			.then((res) => res.json())
			.then((json) =>
				dispatch({
					type: 'ADD_SURVEY_ANSWERS',
					answers: json,
					room: survey.room,
				})
			)

		if (!cachedSurveyId) {
			setSurveyIds({ ...setSurveyIds, [survey.room]: crypto.randomUUID() })
		}
	}, [survey.room])

	useEffect(async () => {
		if (!survey || !survey.room) return null

		const answer = {
			survey: survey.room,
			data,
			id: cachedSurveyId,
		}
		socket.emit('answer', { room: survey.room, answer })
	}, [situation])

	const answers = useRef(survey.answers)
	console.log('ANSWERS', survey.answers)

	useEffect(async () => {
		socket.on('received', (data) => {
			console.log('received', data)
			dispatch({
				type: 'ADD_SURVEY_ANSWERS',
				answers: [data.answer],
				room: survey.room,
			})
		})
	}, [])

	const simulationArray = [],
		result = null && computeHumanMean(simulationArray.map((el) => el.total))

	const answersCount = null

	return (
		<Link to={'/sondage/' + survey.room} css="text-decoration: none;">
			<div
				css={`
					${backgroundConferenceAnimation}
					color: white;
					padding: 0.3rem 1rem;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					> span {
						display: flex;
						align-items: center;
					}
					img {
						font-size: 150%;
						margin-right: 0.4rem !important;
					}
					@media (min-width: 800px) {
						flex-direction: column;
						align-items: start;
						> * {
							margin: 0.3rem 0;
						}
					}
				`}
			>
				<span css="text-transform: uppercase">«&nbsp;{survey.room}&nbsp;»</span>
				{result && (
					<span>
						{emoji('🧮')} {result}
					</span>
				)}
				{answersCount && (
					<span>
						{emoji('👥')}{' '}
						<span
							css={`
								background: #78b159;
								width: 1.5rem;
								height: 1.5rem;
								border-radius: 2rem;
								display: inline-block;
								line-height: 1.5rem;
								text-align: center;
							`}
						>
							{answersCount}
						</span>
					</span>
				)}
			</div>
		</Link>
	)
}
