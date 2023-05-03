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
		<RatingContainer role="list">
			<FeedbackButton rating={1} />
			<FeedbackButton rating={2} />
			<FeedbackButton rating={3} />
			<FeedbackButton rating={4} />
		</RatingContainer>
	)
}

const EmojiButton = styled.button`
	font-size: 1.5em;
	margin: 0;
	padding: 0.2em;
	transition: transform 0.05s;
	will-change: transform;
	:hover {
		transform: scale(1.3);
	}
`
const RatingContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	& > * {
		filter: grayscale(0);
	}
	& > *:hover ~ * {
		filter: grayscale(1);
	}
`
