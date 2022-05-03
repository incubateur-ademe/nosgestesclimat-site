import { usePersistingState } from 'Components/utils/persistState'
import { useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect, useHistory, useParams } from 'react-router'
import { conferenceImg } from '../../../components/SessionBar'
import Beta from './Beta'
import { ConferenceTitle } from './Conference'
import DataWarning from './DataWarning'
import Instructions from './Instructions'
import Stats from './Stats'
import { answersURL, surveysURL } from './useDatabase'
import { defaultThreshold } from './utils'
import ContextConversation from './ContextConversation'
import { useProfileData } from '../Profil'
import NoTestMessage from './NoTestMessage'

export default () => {
	const [surveyIds] = usePersistingState('surveyIds', {})
	const [surveyContext, setSurveyContext] = usePersistingState(
		'surveyContext',
		{}
	)

	const dispatch = useDispatch()

	const { room } = useParams()

	const cachedSurveyId = surveyIds[room]

	const { hasData } = useProfileData()
	const [hasDataState, setHasDataState] = useState(hasData)

	useEffect(() => {
		if (cachedSurveyId) dispatch({ type: 'SET_SURVEY', room })
	}, [cachedSurveyId])

	useEffect(() => {
		fetch(surveysURL + room)
			.then((response) => response.json())
			.then((json) => (json ? json[0]?.contextFile : null))
			.then((contextFile) => {
				if (!surveyContext[room])
					setSurveyContext({ ...surveyContext, [room]: {} })
				dispatch({ type: 'ADD_SURVEY_CONTEXT', contextFile })
			})
			.catch((error) => console.log('error:', error))
	}, [])

	const survey = useSelector((state) => state.survey)
	const existContext = survey ? !(survey['contextFile'] == null) : false

	const history = useHistory()

	if (!room || room === '') {
		return <Redirect to="/groupe?mode=sondage" />
	}
	return (
		<div>
			<h1>
				Sondage
				<Beta />
			</h1>
			<ConferenceTitle>
				<img src={conferenceImg} />
				<span css="text-transform: uppercase">«&nbsp;{room}&nbsp;»</span>
			</ConferenceTitle>
			{!survey || survey.room !== room ? (
				<DataWarning room={room} />
			) : (
				<div
					css={`
						display: flex;
						flex-direction: column;
					`}
				>
					{existContext && (
						<ContextConversation
							survey={survey}
							surveyContext={surveyContext}
							setSurveyContext={setSurveyContext}
						/>
					)}
					{!hasDataState ? (
						<NoTestMessage setHasDataState={setHasDataState}></NoTestMessage>
					) : (
						<Results room={survey.room} />
					)}
				</div>
			)}
			{survey && (
				<>
					<Instructions {...{ room, mode: 'sondage', started: true }} />
					<div>
						<button
							className="ui__ link-button"
							onClick={() => {
								history.push('/')

								dispatch({ type: 'UNSET_SURVEY' })
							}}
						>
							{emoji('🚪')} Quitter le sondage
						</button>
					</div>
					<DownloadInteractiveButton
						url={answersURL + survey.room + '?format=csv'}
					/>
				</>
			)}
		</div>
	)
}

const DownloadInteractiveButton = ({ url }) => {
	const [clicked, click] = useState(false)

	return (
		<div>
			{!clicked ? (
				<a
					href="#"
					onClick={(e) => {
						click(true)
						e.preventDefault()
					}}
				>
					{emoji('💾')} Télécharger les résultats
				</a>
			) : (
				<div className="ui__ card content">
					<p>
						Vous pouvez récupérer les résultats du sondage dans le format .csv.
					</p>
					<ul>
						<li>
							Pour l'ouvrir avec{' '}
							<a href="https://fr.libreoffice.org" target="_blank">
								LibreOffice
							</a>
							, c'est automatique.
						</li>
						<li>
							Pour l'ouvrir avec Microsoft Excel, ouvrez un tableur vide, puis
							Données {'>'} À partir d'un fichier texte / CSV. Sélectionnez
							"Origine : Unicode UTF-8" et "Délimiteur : virgule".
						</li>
					</ul>
					<a href={url} className="ui__ link-button">
						{emoji('💾')} Lancer le téléchargement.
					</a>
				</div>
			)}
		</div>
	)
}

const Results = ({}) => {
	const [cachedSurveyIds] = usePersistingState('surveyIds', {})
	const survey = useSelector((state) => state.survey)
	const [threshold, setThreshold] = useState(defaultThreshold)
	const answerMap = survey.answers
	const username = cachedSurveyIds[survey.room]
	if (!answerMap || !Object.values(answerMap) || !username) return null

	return (
		<Stats
			elements={Object.values(answerMap).map((el) => ({
				...el.data,
				username: el.id,
			}))}
			username={username}
			threshold={threshold}
			setThreshold={setThreshold}
		/>
	)
}
