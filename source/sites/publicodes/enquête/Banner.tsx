import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ScrollToTop } from '../../../components/utils/Scroll'
import { WithEngine } from '../../../RulesProvider'
import {
	useSimulationData,
	useTestCompleted,
} from '../../../selectors/simulationSelectors'
import { simulationURL } from '../conference/useDatabase'
import ReturnToEnquêteButton from './ReturnToEnquêteButton'

export default () => {
	return (
		<WithEngine options={{ parsed: true, optimized: true }}>
			<BannerWithEngine />
		</WithEngine>
	)
}

const minutes = 3

const BannerWithEngine = () => {
	const enquête = useSelector((state) => state.enquête)
	const [message, setMessage] = useState(null)
	const [timeMessage, setTimeMessage] = useState(false)

	const data = useSimulationData()
	const dispatch = useDispatch()

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
				await sleep(1000)
				const json = await response.json()
				setMessage({ text: '✔️  Sauvegardée' })
			} catch (e) {
				setMessage({ text: '❌ Erreur' })
				console.log(e)
			}
		}
		const postDaemon = setInterval(() => {
			setMessage({ text: '⌛️ Sauvegarde..' })
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
	const testCompleted = useTestCompleted()
	const shouldDisplayTimeMessage = testCompleted && timeMessage

	const animationVariants = {
		mini: { height: '2rem' },
		large: { height: '56vh' },
	}
	return (
		<motion.div
			animate={shouldDisplayTimeMessage ? 'large' : 'mini'}
			variants={animationVariants}
			transition={{ delay: 0, duration: 1 }}
			css={`
				width: 100vw;
				height: 2rem;
				text-align: center;
			`}
		>
			<div
				css={`
					background: yellow;
					display: flex;
					justify-content: space-evenly;
					align-items: center;
				`}
			>
				<Link to={`/enquête/${userID}`}>
					<div>Vous participez à l'enquête </div>
				</Link>

				{message && <div>{message.text}</div>}
			</div>
			{shouldDisplayTimeMessage && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ delay: 0.4 }}
					css={`
						background: #ffff0040; /*J'étais pas très inspiré là */
						height: 55vh;
						padding: 0 0.6rem;
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
								le test
							</Link>{' '}
							terminé, explorez le{' '}
							<Link to="/actions" onClick={() => setTimeMessage(false)}>
								parcours&nbsp;action
							</Link>
							, qui vous propose diverses façons concrètes pour réduire votre
							empreinte climat.
						</p>
						<p>
							Vous pourrez les mettre dans votre panier et visualiser la
							réduction d'empreinte ainsi gagnée.
						</p>
						<p>
							<strong>N'oubliez pas</strong>, une fois le parcours action
							terminé, de retourner sur le questionnaire d'enquête OpinionWay
							avec le deuxième bouton ci-dessous. Nous vous le rappelerons dans{' '}
							{minutes} minutes.
						</p>
						<button
							className="ui__ button "
							onClick={() => setTimeMessage(false)}
						>
							⏳️ Je n'ai pas terminé
						</button>
						<ReturnToEnquêteButton />
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
