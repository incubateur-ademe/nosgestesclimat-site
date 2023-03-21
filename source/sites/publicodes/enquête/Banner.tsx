import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { WithEngine } from '../../../RulesProvider'
import { useSimulationData } from '../../../selectors/simulationSelectors'
import { simulationURL } from '../conference/useDatabase'

export default () => {
	return (
		<WithEngine options={{ parsed: true, optimized: true }}>
			<BannerWithEngine />
		</WithEngine>
	)
}

const BannerWithEngine = () => {
	const enquête = useSelector((state) => state.enquête)
	const [message, setMessage] = useState(null)

	const data = useSimulationData()

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
