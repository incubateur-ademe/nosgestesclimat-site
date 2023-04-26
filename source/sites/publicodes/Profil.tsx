import {
	resetActionChoices,
	resetIntroTutorial,
	resetSimulation,
	resetStoredTrajets,
} from 'Actions/actions'
import Localisation from 'Components/localisation/Localisation'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import {
	resetCategoryTutorials,
	resetStoredAmortissementAvion,
	skipTutorial,
} from '../../actions/actions'
import AnswerList from '../../components/conversation/AnswerList'
import Title from '../../components/Title'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import { useEngine } from '../../components/utils/EngineContext'
import Meta from '../../components/utils/Meta'
import { ScrollToTop } from '../../components/utils/Scroll'
import { TrackerContext } from '../../contexts/TrackerContext'
import { getNextQuestions } from '../../hooks/useNextQuestion'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../selectors/simulationSelectors'
import SimulationList from './SimulationList'

export const useProfileData = () => {
	const answeredQuestions = useSelector(answeredQuestionsSelector),
		answeredQuestionsLength = answeredQuestions.length
	const tutorials = useSelector((state) => state.tutorials)

	const hasData = answeredQuestionsLength > 0
	return { hasData, tutorials, answeredQuestionsLength, answeredQuestions }
}

export default () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const persona = useSelector((state) => state.simulation?.persona)
	const currentSimulationId = useSelector((state) => state.currentSimulationId)

	const simulationList = useSelector((state) => state.simulations)

	const { hasData, answeredQuestionsLength, tutorials, answeredQuestions } =
		useProfileData()
	const navigate = useNavigate()
	const { resetEventState } = useContext(TrackerContext)
	const actionChoicesLength = Object.keys(
			useSelector((state) => state.actionChoices)
		).length,
		situation = useSelector(situationSelector)
	const engine = useEngine(),
		bilan = engine.evaluate('bilan')
	const engineNextQuestions = getNextQuestions(
			[bilan.missingVariables],
			{},
			[],
			situation,
			engine
		),
		nextQuestions = engineNextQuestions.filter(
			(q) => !answeredQuestions.includes(q)
		),
		nextQuestionsLength = nextQuestions.length

	const percentFinished = Math.round(
		100 *
			(answeredQuestionsLength /
				(answeredQuestionsLength + nextQuestionsLength))
	)
	const simulationStarted =
		answeredQuestionsLength &&
		answeredQuestionsLength > 0 &&
		percentFinished < 100
	return (
		<div>
			<Meta
				title={t('Mon profil')}
				description={t(
					'Explorez et modifiez les informations que vous avez saisies dans le parcours nosgestesclimat.'
				)}
			/>
			<Title>
				<Trans>Mon profil</Trans>
			</Title>
			<div className="ui__ container" css="padding-top: 1rem">
				<ScrollToTop />
				{persona && (
					<p>
						<em>
							<Trans>👤 Vous utilisez actuellement le persona</Trans>{' '}
							<code>{persona}</code>
						</em>
					</p>
				)}
				{hasData ? (
					<div
						css={`
							display: flex;
							align-items: center;
							flex-wrap: wrap;
						`}
					>
						<div
							className="ui__ card content"
							css="width: 20rem; margin-right: 2rem"
						>
							{answeredQuestionsLength > 0 && (
								<p>
									<Trans i18nKey={`publicodes.Profil.recap`}>
										Vous avez terminé le test à {{ percentFinished }} % (
										{{ answeredQuestionsLength }} questions) et choisi{' '}
										{{ actionChoicesLength }} actions.
									</Trans>{' '}
								</p>
							)}
							<details>
								<Trans i18nKey={`publicodes.Profil.locationDonnées`}>
									<summary>Où sont mes données ? </summary>
									Vos données sont stockées dans votre navigateur, vous avez
									donc le contrôle total sur elles. <br />
								</Trans>
								<Link to="/vie-privée">
									<Trans>En savoir plus</Trans>
								</Link>
							</details>
						</div>
						<div
							css={`
								display: flex;
								flex-direction: column;
								margin-top: 1rem;
							`}
						>
							{simulationStarted && (
								<Link
									to="/simulateur/bilan"
									className="ui__ button plain"
									css="margin: 0"
								>
									<Trans>▶️ Finir mon test</Trans>
								</Link>
							)}
							<button
								className={`ui__ button ${!simulationStarted ? 'plain' : ''}`}
								css="margin: 1rem 0"
								onClick={() => {
									dispatch(resetSimulation())
									dispatch(resetActionChoices())
									dispatch(resetStoredTrajets())
									dispatch(resetStoredAmortissementAvion())
									dispatch(resetCategoryTutorials())
									dispatch(skipTutorial('scoreAnimation', true))
									dispatch(skipTutorial('scoreExplanation', true))
									resetEventState()
									navigate('/simulateur/bilan')
								}}
							>
								<Trans>♻️ Recommencer</Trans>
							</button>
							<TutorialLink {...{ dispatch, tutorials }} />
						</div>
					</div>
				) : (
					<div>
						<TutorialLink {...{ dispatch, tutorials }} />
						<IllustratedMessage
							emoji="🕳️"
							message={
								<p>
									<Trans>Vous n'avez pas encore fait le test.</Trans>
								</p>
							}
						/>
					</div>
				)}
				<Localisation />
				<AnswerList />
				{simulationList && (
					<div css="margin-top: 2rem">
						<h2>
							💾 <Trans>Mon historique des simulations</Trans>
						</h2>
						<p>
							<Trans i18nKey={`publicodes.Profil.simulations`}>
								Chaque simulation que vous faite est sauvegardée dans votre
								navigateur Web. Vous êtes le seul à y avoir accès.
							</Trans>
						</p>
						<SimulationList
							{...{ dispatch, list: simulationList, currentSimulationId }}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

const TutorialLink = ({ tutorials, dispatch }) =>
	tutorials.testIntro && (
		<div>
			<Link
				css="text-decoration: none"
				to="/tutoriel"
				className="ui__ dashed-button"
				onClick={() => {
					dispatch(resetIntroTutorial())
				}}
			>
				<Trans i18nKey={'sites.publicodes.Profile.TutorialLink.text'}>
					🧑‍🏫 Revoir le tutoriel
				</Trans>
			</Link>
		</div>
	)
