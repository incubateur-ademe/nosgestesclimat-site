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
import { answersURL } from './useDatabase'
import { defaultThreshold } from './utils'

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
				<Results room={survey.room} cachedSurveyId={cachedSurveyId} />
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
					{emoji('💾')} Télécharger les données
				</a>
			) : (
				<p className="ui__ card content">
					Le fichier télécharger a l'extension .csv.
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
				</p>
			)}
		</div>
	)
}

const Results = ({ cachedSurveyId }) => {
	const survey = useSelector((state) => state.survey)
	const [threshold, setThreshold] = useState(defaultThreshold)
	const answerMap = survey.answers
	if (!answerMap || !Object.values(answerMap)) return null

	return (
		<Stats
			elements={Object.values(answerMap).map((el) => ({
				...el.data,
				username: el.id,
			}))}
			username={cachedSurveyId}
			threshold={threshold}
			setThreshold={setThreshold}
		/>
	)
}
