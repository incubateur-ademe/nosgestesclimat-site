import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { setRatings } from '../../actions/actions'
import { RootState } from '../../reducers/rootReducer'
import { useSimulationData } from '../../selectors/simulationSelectors'
import { simulationURL } from '../../sites/publicodes/conference/useDatabase'

const ratingKeys = {
	SET_RATING_ACTION: 'action',
	SET_RATING_LEARNED: 'learned',
}

const setRating = (ratings, reduxKey, value, text) => {
	const key = ratingKeys[reduxKey]
	return { ...ratings, [key]: value, [key + '_text']: text }
}
export default ({
	type,
	animationComplete,
	text,
}: {
	type: 'SET_RATING_LEARNED' | 'SET_RATING_ACTION'
	animationComplete: boolean
	text: string
}) => {
	const { t, i18n } = useTranslation()
	const [selectedRating, setSelectedRating] = useState(false)
	const dispatch = useDispatch()

	const ratings = useSelector((state: RootState) => state.ratings)

	const data = useSimulationData()
	const simulationId = useSelector(
		(state: RootState) => state.currentSimulationId
	)

	const submitFeedback = (rating: 0 | 1 | 2 | 3) => {
		setSelectedRating(true)
		// TODO ici on devrait inverser la logique : informer l'utilisateur de la prise en compte après que le serveur a répondu Oui
		// ou à défaut gérer avec une logique optimiste mais un message d'erreur à posteriori en cas de problème

		setTimeout(() => {
			dispatch(setRatings(type, rating))
			const newRatings = setRating(ratings, type, rating, text)
			postData(data, simulationId, newRatings)
		}, 1000)
	}
	useEffect(() => {
		console.log('ratings', ratings)
		if (!animationComplete) return
		if (ratings[ratingKeys[type]] != null) return
		const newRatings = setRating(ratings, type, 'display', text)
		if (
			[0, 1, 2, 3].includes(ratings.learned) ||
			[0, 1, 2, 3].includes(ratings.action)
		) {
			// cas ou l'utilisateur a déjà envoyé une note, pour ne pas écraser les résultats en base
			postData(data, simulationId, newRatings)
		} else {
			postData(null, simulationId, newRatings)
		}
	}, [ratings, type, simulationId, animationComplete, text, data])

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
					onClick={() => submitFeedback(0)}
					aria-label={t('Pas vraiment, envoyer cette réponse')}
					title={t('Pas vraiment, envoyer cette réponse')}
					aria-hidden={false}
				>
					🙁
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(1)}
					aria-label={t('Moyennement, envoyer cette réponse')}
					title={t('Moyennement, envoyer cette réponse')}
					aria-hidden={false}
				>
					😐
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(2)}
					aria-label={t('Oui plutôt, envoyer cette réponse')}
					title={t('Oui plutôt, envoyer cette réponse')}
					aria-hidden={false}
				>
					🙂
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton
					onClick={() => submitFeedback(3)}
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
	console.log('post data called', data, id, ratings)
	const selectedData = {
		results: data?.results && {
			categories: data.results.categories,
			total: data.results.total,
		},
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
