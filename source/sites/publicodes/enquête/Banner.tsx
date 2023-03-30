import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import animate from '../../../components/ui/animate'
import { ScrollToTop } from '../../../components/utils/Scroll'
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

const minutes = 1

const BannerWithEngine = () => {
	const enquête = useSelector((state) => state.enquête)
	const [message, setMessage] = useState(null)
	const [timeMessage, setTimeMessage] = useState(false)

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
		}, 5 * 1000)

		return () => clearInterval(postDaemon)
	}, [data, enquête])

	useEffect(() => {
		if (!enquête) return
		const endEnquêteDaemon = setInterval(() => {
			setTimeMessage(true)
		}, minutes * 60 * 1000)

		return () => clearInterval(endEnquêteDaemon)
	}, [enquête, minutes, setTimeMessage])

	if (!enquête) return null
	const { userID } = enquête
	return (
		<div
			css={`
				width: 100vw;
				height: 1.8rem;
				${timeMessage && `height: 90vh;`}
				text-align: center;
			`}
		>
			<div
				css={`
					background: yellow;
				`}
			>
				<Link to={`/enquête/${userID}`}>
					<div>Vous participez à l'enquête </div>
				</Link>
			</div>
			{message && <div>{message.text}</div>}
			{timeMessage && (
				<animate.fromTop duration=".6">
					<div
						css={`
							background: #ffff0040; /*J'étais pas très inspiré là */
							height: 80vh;
						`}
					>
						<ScrollToTop />

						<div
							css={`
								padding-top: 4vh;
								max-width: 650px;
								margin: 0 auto;
								p {
									margin-bottom: 1rem;
								}
								button {
									margin: 1rem;
								}
							`}
						>
							<p>
								Une fois{' '}
								<Link
									to="/simulateur/bilan"
									onClick={() => setTimeMessage(false)}
								>
									le test Nos Gestes Climat
								</Link>{' '}
								terminé, explorez le{' '}
								<Link to="/actions" onClick={() => setTimeMessage(false)}>
									parcours action
								</Link>
								, qui vous propose diverses propositions concrètes pour réduire
								votre empreinte climat.
							</p>
							<p>
								Vous pourrez les mettre dans votre panier et visualiser la
								réduction d'empreinte ainsi gagnée.
							</p>
							<p>
								<strong>N'oubliez pas</strong>, une fois le parcours action
								terminé, de retourner sur le questionnaire d'enquête OpinionWay
								avec le deuxième bouton ci-dessous. Nous vous le rappelerons
								dans {minutes} minutes.
							</p>
							<button
								className="ui__ button "
								onClick={() => setTimeMessage(false)}
							>
								⏳️ Je n'ai pas terminé
							</button>
							<a href="https://opinion-way.fr">
								<button className="ui__ button ">
									✅ Revenir au questionnaire d'enquête
								</button>
							</a>
						</div>
					</div>
				</animate.fromTop>
			)}
		</div>
	)
}
