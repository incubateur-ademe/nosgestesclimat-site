import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'
import Meta from 'Components/utils/Meta'
import { AnimatePresence, motion, useSpring } from 'framer-motion'
import { utils } from 'publicodes'
import { default as React, useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { DocumentationEndButton, generateImageLink } from '.'
import Chart from '../chart'
import DefaultFootprint from '../DefaultFootprint'
import BallonGES from './ballonGES.svg'
import { ActionButton, IntegratorActionButton } from './Buttons'
import ClimateTargetChart from './ClimateTargetChart'
const { encodeRuleName } = utils
const gradient = tinygradient([
		'#78e08f',
		'#e1d738',
		'#f6b93b',
		'#b71540',
		'#000000',
	]),
	colors = gradient.rgb(20)

const getBackgroundColor = (score) =>
	colors[
		Math.round((score < 2000 ? 0 : score > 20000 ? 19000 : score - 2000) / 1000)
	]

export default ({ score, details, headlessMode }) => {
	//	Configuration is try and test, feeling, really
	const valueSpring = useSpring(0, {
		mass: 10,
		stiffness: 50,
		damping: 60,
	})

	const [value, setValue] = useState(0)

	useEffect(() => {
		const unsubscribe = valueSpring.onChange((v) => {
			setValue(v)
		})

		headlessMode ? setValue(score) : valueSpring.set(score)

		return () => unsubscribe()
	})

	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true),
		roundedValue = (value / 1000).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		}),
		integerValue = roundedValue.split(',')[0],
		decimalValue = roundedValue.split(',')[1],
		shareImage = generateImageLink(window.location)

	const { integratorYoutubeVideo, integratorActionText, integratorActionUrl } =
		useContext(IframeOptionsContext)

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
					background: ${backgroundColor};
					background: linear-gradient(
						180deg,
						${backgroundColor} 0%,
						${backgroundColor2} 100%
					);
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
				`}
			>
				<div id="shareImage" css="padding: 2rem 0 ">
					<ClimateTargetChart
						value={value}
						details={details}
						color={textColor}
						noAnimation
						noText
					/>
				</div>
				<ActionButton text="Passer à l'action" score={score} />
				<div css="display: flex; flex-direction: column; margin: 1rem 0">
					<ShareButton
						text="Voilà mon empreinte 🌍️climat. Mesure la tienne !"
						url={window.location}
						title={'Nos Gestes Climat'}
						color={textColor}
						label="Partager mes résultats"
					/>
				</div>

				{integratorActionText && integratorActionUrl && (
					<IntegratorActionButton />
				)}

				{integratorYoutubeVideo && (
					<div
						class="videoWrapper"
						css={`
							iframe {
								width: 100%;
							}
						`}
					>
						<iframe
							width="560"
							height="315"
							src={integratorYoutubeVideo}
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				)}

				{integratorActionText && <ActionButton text="Réduire mon empreinte" />}
				<DocumentationEndButton ruleName={'bilan'} color={textColor} />
			</motion.div>
		</div>
	)
}
