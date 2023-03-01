import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { openmojiURL } from '../../../components/SessionBar'
import ConferenceBarLazy from './ConferenceBarLazy'
import { backgroundConferenceAnimation } from './conferenceStyle'
import SurveyBarLazy from './SurveyBarLazy'

export default () => {
	const location = useLocation()
	if (!['/simulateur/bilan', '/groupe', '/profil'].includes(location.pathname))
		return null
	const conference = useSelector((state) => state.conference)
	const survey = useSelector((state) => state.survey)

	return (
		<>
			{conference?.room && (
				<GroupModeMenuEntry
					title="Conférence"
					icon={openmojiURL('conference')}
					url={'/conférence/' + conference.room}
				>
					<ConferenceBarLazy />
				</GroupModeMenuEntry>
			)}
			{survey?.room && (
				<GroupModeMenuEntry
					title="Sondage"
					icon={openmojiURL('sondage')}
					url={'/sondage/' + survey.room}
				>
					<SurveyBarLazy />
				</GroupModeMenuEntry>
			)}
		</>
	)
}

const Button = styled.button``

const GroupModeMenuEntry = ({ title, icon, url, children }) => {
	return (
		<div
			css={`
				margin-bottom: 1rem;
			`}
		>
			<Button
				className="simple small"
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100%;
					font-style: italic;
				`}
			>
				<img
					src={icon}
					css={`
						width: 1.8rem;
						height: auto;
						margin: 0 0.6rem;
					`}
					aria-hidden="true"
					width="1"
					height="1"
				/>
				{title} en cours
			</Button>
			<div
				css={`
					${backgroundConferenceAnimation}
					color: white;
					border-radius: 0.4rem;
					margin-right: 0.6rem;
				`}
			>
				{children}
			</div>
		</div>
	)
}
