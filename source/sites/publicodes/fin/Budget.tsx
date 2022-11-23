import { findContrastedTextColor } from 'Components/utils/colors'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'
import Meta from 'Components/utils/Meta'
import { motion, useSpring } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import tinygradient from 'tinygradient'
import { DocumentationEndButton, generateImageLink } from '.'
import { ActionButton, IntegratorActionButton } from './Buttons'
import ClimateTargetChart from './ClimateTargetChart'
import FinShareButton from './FinShareButton'
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

export default ({
	score,
	details,
	headlessMode,
	nextSlide,
	noQuestionsLeft,
}) => {
	//	Configuration is try and test, feeling, really
	const { t } = useTranslation()

	const valueSpring = useSpring(0, {
		mass: 15,
		stiffness: 50,
		damping: 50,
	})

	const [value, setValue] = useState(0)

	useEffect(() => {
		const unsubscribe = valueSpring.onChange((v) => {
			setValue(Math.round(v))
		})

		headlessMode ? setValue(score) : valueSpring.set(score)

		return () => unsubscribe()
	}, [score])

	const backgroundColor = getBackgroundColor(value).toHexString(),
		backgroundColor2 = getBackgroundColor(value + 2000).toHexString(),
		textColor = findContrastedTextColor(backgroundColor, true),
		roundedValue = (value / 1000).toLocaleString('fr-FR', {
			maximumSignificantDigits: 2,
			minimumSignificantDigits: 2,
		}),
		shareImage = generateImageLink(window.location)

	const { integratorYoutubeVideo, integratorActionText, integratorActionUrl } =
		useContext(IframeOptionsContext)

	return (
		<div>
			<Meta
				title={t('Mon empreinte climat')}
				description={t('meta.publicodes.fin.Budget.description', {
					roundedValue,
				})}
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
				<div id="shareImage" css="padding: 2rem 0 .6rem ">
					<ClimateTargetChart
						value={value}
						details={details}
						color={textColor}
						noAnimation
						noText
						score={score}
						nextSlide={nextSlide}
					/>
				</div>

				{noQuestionsLeft && <FinShareButton textColor={textColor} />}

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

				{integratorActionText && (
					<ActionButton text={t('Réduire mon empreinte')} />
				)}
				<DocumentationEndButton ruleName={'bilan'} color={textColor} />
			</motion.div>
		</div>
	)
}
