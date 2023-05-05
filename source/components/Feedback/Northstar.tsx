import { useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { setRatings } from '../../actions/actions'

export default ({
	type,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
}) => {
	const [selectedRating, setSelectedRating] = useState(false)
	const dispatch = useDispatch()
	const submitFeedback = (rating: number) => {
		setSelectedRating(true)
		setTimeout(() => {
			dispatch(setRatings(type, rating))
		}, 3000)
	}
	if (selectedRating) {
		return (
			<p
				css={`
					margin: 10px;
				`}
			>
				<Trans i18nKey={`publicodes.northstar.thankyou`}>
					Merci pour votre retour !
				</Trans>
			</p>
		)
	}
	return (
		<RatingContainer role="list">
			<FeedbackButton rating={1} onClick={() => submitFeedback(1)} />
			<FeedbackButton rating={2} onClick={() => submitFeedback(2)} />
			<FeedbackButton rating={3} onClick={() => submitFeedback(3)} />
			<FeedbackButton rating={4} onClick={() => submitFeedback(4)} />
		</RatingContainer>
	)
}

const FeedbackButton = ({ rating, onClick }) => {
	return (
		<div role="listitem">
			<EmojiButton onClick={onClick} aria-label={`Satisfaction ${rating}`}>
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
