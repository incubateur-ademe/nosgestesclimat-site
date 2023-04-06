import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { openmojiURL } from '../../../components/SessionBar'
import ConferenceBarLazy from './ConferenceBarLazy'
import { backgroundConferenceAnimation } from './conferenceStyle'
import SurveyBarLazy from './SurveyBarLazy'

export default () => {
	const location = useLocation()
	if (
		!['/simulateur/bilan', '/groupe', '/profil', '/sondage'].some((el) =>
			location.pathname.includes(el)
		)
	)
		return null
	const conference = useSelector((state) => state.conference)
	const survey = useSelector((state) => state.survey)

	return (
		<>
			{conference?.room && (
				<GroupModeMenuEntry groupMode="conférence" room={conference.room}>
					<ConferenceBarLazy />
				</GroupModeMenuEntry>
			)}
			{survey?.room && (
				<GroupModeMenuEntry groupMode="sondage" room={survey.room}>
					<SurveyBarLazy />
				</GroupModeMenuEntry>
			)}
		</>
	)
}

const Button = styled.button``

const GroupModeMenuEntry = ({ groupMode, room, children }) => {
	const showBackButton = !useLocation().pathname.includes('/sondage/')
	return (
		<div
			css={`
				margin-bottom: 1rem;
			`}
		>
			<Link to={`/${groupMode}/${room}`} css="text-decoration: none;">
				{showBackButton && (
					<Button
						className="simple small"
						css={`
							display: flex;
							align-items: center;
							justify-content: center;
							width: 100%;
							font-style: italic;
							margin-bottom: 0.2rem;
						`}
					>
						⟵ revenir aux résultats{' '}
						{groupMode === 'sondage' ? 'du sondage' : 'de la conf.'}
					</Button>
				)}
				<div
					css={`
						${backgroundConferenceAnimation}
						border-radius: 0.4rem;
						margin-right: 0.6rem;
					`}
				>
					{children}
				</div>
			</Link>
		</div>
	)
}

export const GroupModeMenuEntryContent = ({
	room,
	result,
	rawUserNumber,
	completedTestsNumber,
}) => {
	const { t } = useTranslation()
	return (
		<div
			css={`
				color: white;
				padding: 0.3rem;
				display: flex;
				flex-direction: column;
				@media (min-width: 800px) {
					flex-direction: row;
					padding: 0.3rem 3rem;
				}

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
			`}
		>
			<div
				css={`
					display: flex;
				`}
			>
				<img
					src={openmojiURL('conference')}
					css={`
						width: 1.8rem;
						height: auto;
						margin: 0 0.6rem;
					`}
					aria-hidden="true"
					width="1"
					height="1"
				/>
				<span css="">«&nbsp;{room}&nbsp;»</span>
			</div>
			<div
				css={`
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					width: 100%;
				`}
			>
				{result && (
					<span>
						<EmojiStyle>🧮</EmojiStyle>
						{result.replace(/tonnes?/, 't')}
					</span>
				)}
				<CountSection>
					{rawUserNumber != null && (
						<span title={t('Nombre total de participants')}>
							<EmojiStyle>👥</EmojiStyle>
							<CountDisc color="#55acee">{rawUserNumber}</CountDisc>
						</span>
					)}
					{completedTestsNumber != null && (
						<span title={t('Nombre de tests terminés')}>
							<EmojiStyle>✅</EmojiStyle>
							<CountDisc color="#78b159">{completedTestsNumber}</CountDisc>
						</span>
					)}
				</CountSection>
			</div>
		</div>
	)
}

export const EmojiStyle = styled.span`
	font-size: 130%;
	margin-right: 0.4rem;
`

export const CountSection = styled.div`
	display: flex;
	> * {
		margin: 0 0.6rem;
	}
`

export const CountDisc = styled.span`
	background: ${(props) => props.color};
	width: 1.3rem;
	height: 1.3rem;
	border-radius: 2rem;
	display: inline-block;
	line-height: 1.3rem;
	text-align: center;
	color: var(--darkerColor);
`
