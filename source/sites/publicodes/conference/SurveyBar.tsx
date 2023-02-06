import {
	correctValue,
	extractCategories,
	splitName,
} from 'Components/publicodesUtils'
import { useEngine } from 'Components/utils/EngineContext'
import { usePersistingState } from 'Components/utils/persistState'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { situationSelector } from 'Selectors/simulationSelectors'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { minimalCategoryData } from '../../../components/publicodesUtils'
import { useSimulationProgress } from '../../../components/utils/useNextQuestion'
import { backgroundConferenceAnimation } from './conferenceStyle'
import { computeHumanMean } from './Stats'
import useDatabase, { answersURL } from './useDatabase'
import { defaultProgressMin, defaultThreshold, getElements } from './utils'

export default () => {
	const translation = useTranslation(),
		t = translation.t
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
			console.log('YOYOOY', survey)
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

	const simulationArray = [],
		result =
			null &&
			computeHumanMean(
				translation,
				simulationArray.map((el) => el.total)
			)

	const existContext = survey ? !(survey['contextFile'] == null) : false

	const rawNumber = getElements(
		survey.answers,
		defaultThreshold,
		existContext,
		0
	).length

	const completedTestNumber = getElements(
		survey.answers,
		defaultThreshold,
		existContext,
		defaultProgressMin
	).length

	if (DBError) return <div className="ui__ card plain">{DBError}</div>

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
				<div
					css={`
						display: flex;
						justify-content: space-between;
						width: 100%;
					`}
				>
					{rawNumber != null && (
						<span title={t('Nombre total de participants')}>
							{emoji('👥')} <CountDisc color="#55acee">{rawNumber}</CountDisc>
						</span>
					)}
					{completedTestNumber != null && (
						<span title={t('Nombre de tests terminés')}>
							{emoji('✅')}
							<CountDisc color="#78b159">{completedTestNumber}</CountDisc>
						</span>
					)}
				</div>
			</div>
		</Link>
	)
}

const CountDisc = styled.span`
	background: ${(props) => props.color};
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 2rem;
	display: inline-block;
	line-height: 1.5rem;
	text-align: center;
	color: var(--darkerColor);
`
