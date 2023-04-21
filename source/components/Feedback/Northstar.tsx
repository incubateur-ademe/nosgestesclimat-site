import { setRatings } from 'Actions/actions'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

export default ({
	type,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
}) => {
	const dispatch = useDispatch()

	const FeedbackButton = ({ rating }) => {
		const submitFeedback = () => {
			dispatch(setRatings(type, rating))
		}

		return (
			<div role="listitem">
				<EmojiButton
					onClick={submitFeedback}
					aria-label={`Satisfaction ${rating}`}
				>
					⭐
				</EmojiButton>
			</div>
		)
	}

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
			}}
			role="list"
		>
			<FeedbackButton rating={1} />
			<FeedbackButton rating={2} />
			<FeedbackButton rating={3} />
			<FeedbackButton rating={4} />
		</div>
	)
}

const EmojiButton = styled.button`
	font-size: 1.5em;
	padding: 0.2em;
	transition: transform 0.05s;
	will-change: transform;
	:hover {
		transform: scale(1.3);
	}
`
