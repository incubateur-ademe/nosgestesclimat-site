import { useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setRatings } from '../../actions/actions'
import { RootState } from '../../reducers/rootReducer'
import { useSimulationData } from '../../selectors/simulationSelectors'
import { simulationURL } from '../../sites/publicodes/conference/useDatabase'

export default ({
	type,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
}) => {
	const [selectedRating, setSelectedRating] = useState(false)
	const dispatch = useDispatch()

	const ratings = useSelector((state: RootState) => state.ratings)

	const data = useSimulationData()
	const simulationId = useSelector(
		(state: RootState) => state.currentSimulationId
	)

	const submitFeedback = (rating: number) => {
		setSelectedRating(true)
		setTimeout(() => {
			dispatch(setRatings(type, rating))
			let newRatings
			if (type === 'SET_RATING_LEARNED')
				newRatings = { ...ratings, learned: rating }
			else newRatings = { ...ratings, action: rating }

			postData(data, simulationId, newRatings)
		}, 1000)
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

const postData = async (data, id, ratings) => {
	data.situation = {}
	data.extraSituation = {
		storedTrajets: {},
		actionChoices: {},
		storedAmortissementAvion: {},
	}
	data.answeredQuestions = {}
	data.ratings = ratings

	const body = { data, id }
	console.log(body)
	try {
		const response = await fetch(simulationURL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
	} catch (e) {
		console.log(e)
	}
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
