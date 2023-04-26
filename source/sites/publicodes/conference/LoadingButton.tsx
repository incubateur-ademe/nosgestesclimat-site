import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { TrackerContext } from '../../../contexts/TrackerContext'
import { surveysURL } from './useDatabase'

export default ({ mode, URLPath, room }) => {
	const tracker = useContext(TrackerContext)

	const [clicked, setClicked] = useState(false)
	const [text, setText] = useState(null)

	const navigate = useNavigate()

	const actionImg = '/images/2714.svg'

	const { t } = useTranslation()

	return (
		<div>
			<button
				type="submit"
				className="ui__ button plain cta"
				data-cypress-id="group-start-button"
				onClick={async () => {
					setClicked(true)

					if (mode === 'conférence') {
						tracker.push(['trackEvent', 'Mode Groupe', 'Création salle', mode])
						return setTimeout(() => navigate(URLPath), 3000)
					}
					const request = await fetch(surveysURL, {
						method: 'POST',
						body: JSON.stringify({ room }),
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
					}).catch((e) => {
						console.log('erreur', e)
						setText(t('Notre serveur semble indisponible') + ' 😥')
						setClicked(false)
					})
					if (!request) return null
					if (!request.ok) {
						if (request.status === 409) {
							setText('Ce sondage existe déjà')
							return setTimeout(() => {
								navigate(URLPath)
							}, 3000)
						} else {
							setText(t('Erreur inconnue côté serveur') + ' 😥')
							setClicked(false)
							console.log('Erreur', request)
						}
					}

					setText(t('Sondage créé'))

					tracker.push(['trackEvent', 'Mode Groupe', 'Création salle', mode])

					return setTimeout(() => {
						navigate(URLPath)
					}, 3000)
				}}
				css={`
					display: flex !important;
					align-items: center;
				`}
			>
				{clicked && (
					<motion.img
						animate={{
							rotate: [0, 15, -15, 0],
							y: [0, 0, 0, -3, 8, 3],
							filter: ['grayscale(1)', 'grayscale(1)', 'grayscale(0)'],
						}}
						transition={{ duration: 2, delay: 0 }}
						css="width: 3rem; margin-right: .6rem"
						src={actionImg}
					/>
				)}
				<span>
					{text || (clicked ? t(`Initialisation...`) : t(`C'est parti !`))}
				</span>
			</button>
		</div>
	)
}
