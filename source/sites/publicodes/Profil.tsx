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
import Localisation from 'Components/localisation/Localisation'

export const useProfileData = () => {
	const answeredQuestionsLength = useSelector(answeredQuestionsSelector).length
	const tutorials = useSelector((state) => state.tutorials)

	const hasData = answeredQuestionsLength > 0
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
	return (
		<div>
			<Meta
				title="Mon profil"
				description="Explorez et modifiez les informations que vous avez saisies dans le parcours nosgestesclimat."
			/>
			<Title>Mon profil</Title>
			<div className="ui__ container" css="padding-top: 1rem">
				<ScrollToTop />
				{persona && (
					<p>
						<em>
							{emoji('👤')}&nbsp; Vous utilisez actuellement le persona{' '}
							<code>{persona}</code>
						</em>
					</p>
				)}
				{tutorials.testIntro && (
					<div
						css={`
							margin-bottom: 2rem;
						`}
					>
						<button
							className="ui__ dashed-button"
							onClick={() => {
								dispatch(skipTutorial('testIntro', true))
								dispatch(resetTutorials())
								navigate('/tutoriel')
							}}
						>
							{emoji('🧑‍🏫')} Revoir le tutoriel
						</button>
					</div>
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
									Vous avez répondu à {answeredQuestionsLength} questions et
									choisi {actionChoicesLength} actions.{' '}
								</p>
							)}
							<details>
								<summary>Où sont mes données ? </summary>
								Vos données sont stockées dans votre navigateur, vous avez donc
								le contrôle total sur elles. <br />
								<Link to="/vie-privée">En savoir plus</Link>
							</details>
						</div>
						<div>
							<button
								className="ui__ button plain"
								css="margin: 1rem 0"
								onClick={() => {
								dispatch(resetSimulation())
								dispatch(resetActionChoices())
								dispatch(deletePreviousSimulation())
								dispatch(resetStoredTrajets())
								navigate('/simulateur/bilan')
							}}
							>
								{emoji('♻️ ')} Recommencer
							</button>
							{tutorials.testIntro && (
								<div>
									<button
										className="ui__ dashed-button"
										onClick={() => {
											dispatch(skipTutorial('testIntro', true))
											navigate('/tutoriel')
										}}
									>
										{emoji('🧑‍🏫')} Revoir le tutoriel
									</button>
								</div>
							)}
						</div>
					</div>
				) : (
					<IllustratedMessage
						emoji="🕳️"
						message={<p>Vous n'avez pas encore fait le test.</p>}
					></IllustratedMessage>
				)}
				<Localisation />
				<AnswerList />
			</div>
		</div>
	)
}
