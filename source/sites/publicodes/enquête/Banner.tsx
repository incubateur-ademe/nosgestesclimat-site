import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	answeredQuestionsSelector,
	situationSelector,
} from '../../../selectors/simulationSelectors'
import { simulationURL } from '../conference/useDatabase'

export default () => {
	const enquête = useSelector((state) => state.enquête)
	const situation = useSelector(situationSelector)
	const [message, setMessage] = useState(null)
	const actionChoices = useSelector((state) => state.actionChoices)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const data = { situation, actionChoices, answeredQuestions }
	useEffect(() => {
		if (!enquête) return
		const postData = async () => {
			const body = { data, id: enquête.userID }
			console.log(body)
			try {
				const response = await fetch(simulationURL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body), // body data type must match "Content-Type" header
				})
				const json = await response.json()
				setMessage({ text: '✅ Simulation sauvegardée' })
			} catch (e) {
				setMessage({ text: '❌ Erreur' })
				console.log(e)
			}
		}
		const postDaemon = setInterval(() => {
			setMessage({ text: '⌛️ Sauvegarde en cours...' })
			postData()
		}, 5000)

		return () => clearInterval(postDaemon)
	}, [data, enquête])
	if (!enquête) return null
	const { userID } = enquête
	return (
		<div
			css={`
				width: 100vw;
				height: 1.8rem;
				text-align: center;
				background: yellow;
			`}
		>
			<Link to={`/enquête/${userID}`}>
				<div>Vous participez à l'enquête </div>
			</Link>
			{message && <div>{message.text}</div>}
		</div>
	)
}
