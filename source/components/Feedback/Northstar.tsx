import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
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
	const { t, i18n } = useTranslation()
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
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
			}}
			role="list"
		>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(1)}
					aria-label={t('Pas vraiment, envoyer cette réponse')}
					title={t('Pas vraiment, envoyer cette réponse')}
					aria-hidden={false}
				>
					🙁
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(2)}
					aria-label={t('Moyennement, envoyer cette réponse')}
					title={t('Moyennement, envoyer cette réponse')}
					aria-hidden={false}
				>
					😐
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(3)}
					aria-label={t('Oui plutôt, envoyer cette réponse')}
					title={t('Oui plutôt, envoyer cette réponse')}
					aria-hidden={false}
				>
					🙂
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(4)}
					aria-label={t('Tout à fait, envoyer cette réponse')}
					title={t('Tout à fait, envoyer cette réponse')}
					aria-hidden={false}
				>
					😀
				</EmojiButton>
			</div>
		</div>
	)
}

const postData = async (data, id, ratings) => {
	const selectedData = {
		results: { categories: data.results.categories, total: data.results.total },
		ratings,
	}

	const body = { data: selectedData, id }
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
