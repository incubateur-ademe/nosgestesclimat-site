import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { openmojiURL } from '../../../components/SessionBar'
import ConferenceBarLazy from './ConferenceBarLazy'
import { backgroundConferenceAnimation } from './conferenceStyle'
import SurveyBarLazy from './SurveyBarLazy'

export default () => {
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
				${backgroundConferenceAnimation}
				color: white;
				border-radius: 0.4rem;
				margin-right: 0.6rem;
			`}
		>
			<Button
				className="simple small"
				css={`
					padding: 0.4rem;
					color: white;
					img {
						filter: invert(1);
						background: none;
						margin: 0 0.6rem 0 0 !important;
					}
					@media (max-width: 800px) {
						img {
							margin: 0 !important;
						}
					}
				`}
			>
				<img
					src={icon}
					css="width: 2rem"
					aria-hidden="true"
					width="1"
					height="1"
				/>
				{title}
			</Button>
			<div css={``}>{children}</div>
		</div>
	)
}
