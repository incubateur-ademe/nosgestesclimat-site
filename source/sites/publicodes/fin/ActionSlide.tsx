import Meta from 'Components/utils/Meta'
import { motion, useSpring } from 'framer-motion'
import { utils } from 'publicodes'
import { default as React, useEffect, useState } from 'react'
import { DocumentationEndButton, generateImageLink } from '.'
import RavijenChart from '../chart/RavijenChart'
import ActionTeaser from './ActionTeaser'
import { ActionButton } from './Buttons'
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
				title="Nosgestesclimat - le top 3 de mes actions"
				description={`Le top 3 des actions pour réduire mon empreinte climat de ${roundedValue} tonnes de CO₂ₑ.`}
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
						font-size: 120%;
						margin: 0.6rem;
					}
				`}
			>
				<h1>Comment réduire mon empreinte ?</h1>
				<div id="shareImage" css="padding: 0">
					<div css="padding: 0 1rem">
						<ActionTeaser />
					</div>
				</div>

				<ActionButton text="Voir toutes les actions" score={score} />
			</motion.div>
		</div>
	)
}
