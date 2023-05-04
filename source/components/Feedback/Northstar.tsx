import { setRatings } from 'Actions/actions'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

export default ({
	type,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
}) => {
	return (
		<RatingContainer role="list">
			<FeedbackButton rating={1} type={type} />
			<FeedbackButton rating={2} type={type} />
			<FeedbackButton rating={3} type={type} />
			<FeedbackButton rating={4} type={type} />
		</RatingContainer>
	)
}

const FeedbackButton = ({ rating, type }) => {
	const dispatch = useDispatch()
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
