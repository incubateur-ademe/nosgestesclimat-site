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
import RavijenChart from '../chart/RavijenChart'
import DefaultFootprint from '../DefaultFootprint'
import BallonGES from './ballonGES.svg'
import { ActionButton, IntegratorActionButton } from './Buttons'
import FinShareButton from './FinShareButton'
const { encodeRuleName } = utils

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

		true || headlessMode ? setValue(score) : valueSpring.set(score)

		return () => unsubscribe()
	}, [])

	const backgroundColor = 'var(--lightColor)',
		backgroundColor2 = 'var(--lighterColor)',
		textColor = 'var(--darkerColor)',
		roundedValue = (value / 1000).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		}),
		integerValue = roundedValue.split(',')[0],
		decimalValue = roundedValue.split(',')[1],
		shareImage = generateImageLink(window.location)

	return (
		<div>
			<Meta
				title="Mon empreinte climat"
				description={`Mon empreinte climat est de ${roundedValue} tonnes de CO₂ₑ. Mesure la tienne !`}
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
						${backgroundColor} -50%,
						${backgroundColor2} 60%
					);
					color: ${textColor};
					margin: 0 auto;
					border-radius: 0.6rem;
					display: flex;
					flex-direction: column;
					justify-content: space-evenly;

					text-align: center;
					font-size: 110%;
					h1 {
						font-size: 130%;
						margin: 0.6rem;
					}
				`}
			>
				<h1>De quoi est faite mon empreinte ?</h1>
				<div
					id="shareImage"
					css="padding: 0"
					title="Représentation visuelle en mosaïque de cubes. Chaque cube représente une part fixe de l'empreinte, et une sous-catégories (par exemple, voiture, moto, ou boisson. Sur cette mosaïque vient se placer une zone verte représentant le budget climat de 2 tonnes. "
				>
					<div css="padding: 0 1rem">
						<RavijenChart
							noAnimation
							details={details}
							linkTo="documentation"
							color={textColor}
							noText
							noCompletion
							valueColor={textColor}
						/>
					</div>
				</div>
				<FinShareButton textColor={textColor} />

				<DocumentationEndButton ruleName={'bilan'} color={textColor} />
			</motion.div>
		</div>
	)
}
