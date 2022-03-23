import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'
import Meta from 'Components/utils/Meta'
import { AnimatePresence, motion } from 'framer-motion'
import { default as React, useContext } from 'react'
import emoji from 'react-easy-emoji'
import Chart from '../chart'
import DefaultFootprint from '../DefaultFootprint'
import BallonGES from './ballonGES.svg'
import { ActionButton } from './Buttons'

export default ({ headlessMode }) => {
	const shareImage =
		'https://aejkrqosjq.cloudimg.io/v7/' +
		window.location.origin +
		'/.netlify/functions/ending-screenshot?pageToScreenshot=' +
		window.location

	const value = Math.random() * 800 + 250,
		roundedValue = Math.round(value),
		pleinVolume = 50,
		formattedValue = (value / pleinVolume).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		})

	return (
		<div>
			<Meta
				title="Mon empreinte climat"
				description={`Mon empreinte climat est de ${roundedValue} tonnes de CO2e. Mesure la tienne !`}
				image={shareImage}
				url={window.location}
			/>
			<motion.div
				animate={{ scale: [0.9, 1] }}
				transition={{ duration: headlessMode ? 0 : 0.6 }}
				className=""
				id="fin"
				css={`
					background: var(--darkColor);
					background: linear-gradient(
						180deg,
						var(--darkColor) 0%,
						var(--darkestColor) 100%
					);
					color: white;
					margin: 0 auto;
					border-radius: 0.6rem;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
				`}
			>
				<div id="shareImage" css="padding: 2rem 0 0">
					<div css="display: flex; align-items: center; justify-content: center">
						<img
							src="/images/pompe-essence.svg"
							css="height: 10rem; margin-right: .4rem"
							alt="Icône représentant une pompe à pétrole"
						/>
						<div
							css={`
								flex-direction: column;
								display: flex;
								justify-content: space-evenly;
								height: 10rem;
							`}
						>
							<div css="font-weight: bold; font-size: 280%;">
								<span css="width: 4rem; text-align: right; display: inline-block">
									{formattedValue}
								</span>{' '}
								pleins
							</div>
							de pétrole brut par an.
							<small css="color: var(--lightColor)">
								Soit {roundedValue} litres.
							</small>
						</div>
					</div>
					<div css="padding: 1rem; max-width: 30rem; margin: 0 auto; font-size: 90%">
						<p>
							C'est une estimation <em>a minima</em> de votre consommation
							d'essence à l'année.
						</p>

						<p>
							Elle est estimée via vos éventuels trajets en voiture, en avion,
							en bus, et consommation de fioul pour chauffage.
						</p>
						<p>
							Elle ne prend pas (encore) en compte le pétrole utilisé pour
							acheminer vos achats, et l'énergie grise de vos diverses
							possessions.
						</p>
					</div>
				</div>
				<ActionButton
					text="Réduire ma conso"
					imgSrc="/images/1F1FA-1F1E6.svg"
					invertImage={false}
				/>
				<div css="display: flex; flex-direction: column; margin: 1rem 0">
					<ShareButton
						text="Voilà mon empreinte pétrole. Mesure la tienne !"
						url={window.location}
						title={'Nos Gestes Climat'}
						color="white"
						label="Partager mes résultats"
					/>
				</div>
			</motion.div>
		</div>
	)
}
