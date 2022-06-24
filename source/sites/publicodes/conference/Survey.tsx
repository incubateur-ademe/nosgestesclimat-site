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
import { defaultThreshold, defaultProgressMin } from './utils'
import ContextConversation from './ContextConversation'
import { useProfileData } from '../Profil'
import NoTestMessage from './NoTestMessage'
import Meta from '../../../components/utils/Meta'
import { configSelector } from '../../../selectors/simulationSelectors'

export default () => {
	const [surveyIds] = usePersistingState('surveyIds', {})
	const [surveyContext, setSurveyContext] = usePersistingState(
		'surveyContext',
		{}
	)
	const [isRegisteredSurvey, setIsRegisteredSurvey] = useState(false)
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

	useEffect(() => {
		fetch(surveysURL + room)
			.then((response) => response.json())
			.then((json) => {
				setIsRegisteredSurvey(json?.length != 0)
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
			<Meta
				title={'Sondage ' + room}
				description={
					'Participez au sondage ' +
					room +
					' et visualisez les résultats du groupe'
				}
			/>
			<h1>
				Sondage
				<Beta />
			</h1>
			<ConferenceTitle>
				<img src={conferenceImg} alt="" />
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
						<Results room={survey.room} existContext={existContext} />
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
						url={answersURL + room + '?format=csv'}
						isRegisteredSurvey={isRegisteredSurvey}
					/>
				</>
			)}
		</div>
	)
}

const DownloadInteractiveButton = ({ url, isRegisteredSurvey }) => {
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
			) : isRegisteredSurvey ? (
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
						<li>
							Les résultats de la page de visualisation ne prennent en compte
							que les participants ayant rempli <b>au moins 10% du test</b>. En
							revanche le CSV contient les simulations de toutes les personnes
							ayant participé au sondage en cliquant sur le lien. La colonne
							"progress" vous permet de filtrer les simulations à votre tour.
						</li>
					</ul>
					<a href={url} className="ui__ link-button">
						{emoji('💾')} Lancer le téléchargement.
					</a>
				</div>
			) : (
				<div>
					{' '}
					Le téléchargement pour ce sondage est indisponible. Ce problème vient
					sans doute du fait que le sondage n'a pas été créé via la page dédiée.
					N'hésitez pas à créer une salle au nom du sondage via{' '}
					<a href="https://nosgestesclimat.fr/groupe" target="_blank">
						ce formulaire d'instruction
					</a>{' '}
					(les réponses ne seront pas supprimées). Si le problème persiste,{' '}
					<a
						href="mailto:contact@nosgestesclimat.fr?subject=Problème téléchargement sondage"
						target="_blank"
					>
						contactez-nous
					</a>
					!
				</div>
			)}
		</div>
	)
}

const Results = ({ room, existContext }) => {
	const [cachedSurveyIds] = usePersistingState('surveyIds', {})
	const survey = useSelector((state) => state.survey)
	const [threshold, setThreshold] = useState(defaultThreshold)
	const answerMap = survey.answers
	const username = cachedSurveyIds[survey.room]
	if (!answerMap || !Object.values(answerMap) || !username) return null

	return (
		<Stats
			elements={getElements(
				answerMap,
				threshold,
				existContext,
				defaultProgressMin
			)}
			username={username}
			threshold={threshold}
			setThreshold={setThreshold}
		/>
	)
}

// Simulations with less than 10% progress are excluded, in order to avoid a perturbation of the mean group value by people
// that did connect to the conference, but did not seriously start the test, hence resulting in multiple default value simulations.
// In case of survey with context, we only display result with context filled in.

export const getElements = (
	answerMap,
	threshold,
	existContext,
	progressMin
) => {
	const rawElements = Object.values(answerMap).map((el) => ({
		...el.data,
		username: el.id,
	}))
	const elementsWithinThreshold = rawElements.filter(
		(el) => el.total > 0 && el.total < threshold && el.progress > progressMin
	)
	const elements = existContext
		? elementsWithinThreshold.filter(
				(el) => Object.keys(el.context).length !== 0
		  )
		: elementsWithinThreshold

	return elements
}
