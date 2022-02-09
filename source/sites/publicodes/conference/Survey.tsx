import { usePersistingState } from 'Components/utils/persistState'
import { useEffect } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import { conferenceImg } from '../../../components/SessionBar'
import { ConferenceTitle } from './Conference'
import DataWarning from './DataWarning'
import Instructions from './Instructions'
import Stats from './Stats'

export default () => {
	const [surveyIds] = usePersistingState('surveyIds', {})
	const dispatch = useDispatch()

	const { room } = useParams()
	const cachedSurveyId = surveyIds[room]

	useEffect(() => {
		if (cachedSurveyId) dispatch({ type: 'SET_SURVEY', room })
	}, [cachedSurveyId])

	const survey = useSelector((state) => state.survey)
	const history = useHistory()

	return (
		<div>
			<h1>Sondage</h1>
			<ConferenceTitle>
				<img src={conferenceImg} />
				<span css="text-transform: uppercase">«&nbsp;{room}&nbsp;»</span>
			</ConferenceTitle>

			{!survey ? (
				<DataWarning room={room} />
			) : (
				<Results room={survey.room} cachedSurveyId={cachedSurveyId} />
			)}
			{survey && (
				<button
					className="ui__ link-button"
					onClick={() => {
						history.push('/')

						dispatch({ type: 'UNSET_SURVEY' })
					}}
				>
					{emoji('🚪')} Quitter le sondage
				</button>
			)}
			<Instructions {...{ room }} />
		</div>
	)
}

const Results = ({ cachedSurveyId }) => {
	const survey = useSelector((state) => state.survey)
	const answerMap = survey.answers
	if (!answerMap || !Object.values(answerMap)) return null

	return (
		<Stats
			elements={Object.values(answerMap).map((el) => ({
				...el.data,
				username: el.id,
			}))}
			username={cachedSurveyId}
		/>
	)
}
