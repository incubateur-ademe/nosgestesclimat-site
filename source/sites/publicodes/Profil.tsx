import { Link } from 'react-router-dom'
import {
	deletePreviousSimulation,
	resetActionChoices,
	resetSimulation,
	resetTutorials,
	resetStoredTrajets,
} from 'Actions/actions'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import AnswerList from '../../components/conversation/AnswerList'
import Title from '../../components/Title'
import IllustratedMessage from '../../components/ui/IllustratedMessage'
import Meta from '../../components/utils/Meta'
import { ScrollToTop } from '../../components/utils/Scroll'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'
import { skipTutorial } from '../../actions/actions'
import { useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

export const useProfileData = () => {
	const answeredQuestionsLength = useSelector(answeredQuestionsSelector).length
	const tutorials = useSelector((state) => state.tutorials)

	const hasData =
		answeredQuestionsLength > 0 ||
		Object.entries(tutorials).find(([_, v]) => v != null)

	return { hasData, tutorials, answeredQuestionsLength }
}

export default ({}) => {
	const dispatch = useDispatch()
	const persona = useSelector((state) => state.simulation?.persona)
	const { hasData, answeredQuestionsLength, tutorials } = useProfileData()
	const navigate = useNavigate()
	const actionChoicesLength = Object.keys(
		useSelector((state) => state.actionChoices)
	).length

	const { t } = useTranslation()

	return (
		<div>
			<Meta
				title={t('Mon profil')}
				description={t(
					'Explorez et modifiez les informations que vous avez saisies dans le parcours nosgestesclimat.'
				)}
			/>
			<Title>Mon profil</Title>
			<div className="ui__ container" css="padding-top: 1rem">
				<ScrollToTop />
				{persona && (
					<p>
						<em>
							{emoji('👤')}&nbsp;{' '}
							<Trans>Vous utilisez actuellement le persona</Trans>{' '}
							<code>{persona}</code>
						</em>
					</p>
				)}
				{hasData ? (
					<div>
						{tutorials.testIntro && (
							<div>
								<button
									className="ui__ dashed-button"
									onClick={() => {
										dispatch(skipTutorial('testIntro', true))
										navigate('/tutoriel')
									}}
								>
									{emoji('🧑‍🏫')} <Trans>Revoir le tutoriel</Trans>
								</button>
							</div>
						)}
						{answeredQuestionsLength > 0 && (
							<p>
								<Trans i18nKey={`publicodes.Profil.recap`}>
									Vous avez répondu à {{ answeredQuestionsLength }} questions et
									choisi {{ actionChoicesLength }} actions.
								</Trans>{' '}
							</p>
						)}
						<details>
							<Trans i18nKey={`publicodes.Profil.locationDonnées`}>
								<summary>Où sont mes données ? </summary>
								Vos données sont stockées dans votre navigateur, vous avez donc
								le contrôle total sur elles. <br />
							</Trans>
							<Link to="/vie-privée">
								<Trans>En savoir plus</Trans>
							</Link>
						</details>
						<button
							className="ui__ button plain"
							css="margin: 1rem 0"
							onClick={() => {
								dispatch(resetSimulation())
								dispatch(resetActionChoices())
								dispatch(deletePreviousSimulation())
								dispatch(resetTutorials())
								dispatch(resetStoredTrajets())
							}}
						>
							{emoji('♻️ ')} <Trans>Recommencer</Trans>
						</button>
					</div>
				) : (
					<IllustratedMessage
						emoji="🕳️"
						message={
							<p>
								<Trans>Vous n'avez pas encore fait le test.</Trans>
							</p>
						}
					></IllustratedMessage>
				)}
				<AnswerList />
			</div>
		</div>
	)
}
