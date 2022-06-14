import { goToQuestion } from 'Actions/actions'
import ShareButton from 'Components/ShareButton'
import animate from 'Components/ui/animate'
import { findContrastedTextColor } from 'Components/utils/colors'
import { IframeOptionsContext } from 'Components/utils/IframeOptionsProvider'
import Meta from 'Components/utils/Meta'
import { TrackerContext } from 'Components/utils/withTracker'
import { AnimatePresence, motion, useSpring } from 'framer-motion'
import { utils } from 'publicodes'
import { default as React, useContext, useEffect, useState } from 'react'
import emoji from 'Components/emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { answeredQuestionsSelector } from 'Selectors/simulationSelectors'
import { last } from 'Source/utils'
import tinygradient from 'tinygradient'
import SlidesLayout from '../../../components/SlidesLayout'
import { useSearchParams } from '../../../components/utils/useSearchParams'
import Chart from '../chart'
import DefaultFootprint from '../DefaultFootprint'
import HorizontalSwipe from '../HorizontalSwipe'
import BallonGES from './ballonGES.svg'
import { ActionButton, IntegratorActionButton } from './Buttons'
import IframeDataShareModal from './IframeDataShareModal'
import Petrogaz from './Petrogaz'
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

// details=a2.6t2.1s1.3l1.0b0.8f0.2n0.1
const rehydrateDetails = (encodedDetails) =>
	encodedDetails &&
	encodedDetails
		.match(/[a-z][0-9]+\.[0-9][0-9]/g)
		.map(([category, ...rest]) => [category, 1000 * +rest.join('')])
		// Here we convert categories with an old name to the new one
		// 'biens divers' was renamed to 'divers'
		.map(([category, ...rest]) =>
			category === 'b' ? ['d', ...rest] : [category, ...rest]
		)

const sumFromDetails = (details) =>
	details.reduce((memo, [name, value]) => memo + value, 0)

export default ({}) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const encodedDetails = searchParams.get('details')
	const slideName = searchParams.get('diapo') || 'bilan'

	const rehydratedDetails = rehydrateDetails(encodedDetails)

	const score = sumFromDetails(rehydratedDetails)
	const headlessMode =
		!window || window.navigator.userAgent.includes('HeadlessChrome')

	const dispatch = useDispatch(),
		answeredQuestions = useSelector(answeredQuestionsSelector)

	const slideProps = {
		score,
		details: Object.fromEntries(rehydratedDetails),
		headlessMode,
	}

	const Component = {
		bilan: Budget,
		pétrogaz: Petrogaz,
	}[slideName]

	const next = () => {
			const nextSlide = slideName === 'bilan' ? 'pétrogaz' : 'bilan'
			setSearchParams({ diapo: nextSlide, details: encodedDetails })
		},
		previous = next

	const tracker = useContext(TrackerContext)
	useEffect(() => {
		console.log('+1')
		tracker.push(['trackEvent', 'NGC', 'Swipe page de fin'])
	}, [Component])

	return (
		<div>
			<IframeDataShareModal data={rehydratedDetails} />
			<Link
				to="/simulateur/bilan"
				css="display: block; text-align: center"
				onClick={() => {
					dispatch(goToQuestion(last(answeredQuestions)))
				}}
			>
				<button class="ui__ simple small push-left button">
					← Revenir à la simulation
				</button>
			</Link>
			<animate.appear>
				<SlidesLayout>
					<HorizontalSwipe {...{ next, previous }}>
						<Component {...slideProps} />
					</HorizontalSwipe>
				</SlidesLayout>
			</animate.appear>
		</div>
	)
}
const Budget = ({ score, details, headlessMode }) => {
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
				<div id="shareImage" css="padding: 2rem 0 0">
					<div css="display: flex; align-items: center; justify-content: center">
						<BallonGES css="height: 10rem; width: auto" />
						<div
							css={`
								flex-direction: ${headlessMode ? 'column-reverse' : 'column'};
								display: flex;
								justify-content: space-evenly;
								height: 10rem;
							`}
						>
							<div
								role="heading"
								aria-level="1"
								css="font-weight: bold; font-size: 280%;"
							>
								<span css="width: 4rem; text-align: right; display: inline-block">
									{integerValue}
									{score < 10000 && (
										<AnimatePresence>
											{(score - value) / score < 0.01 && (
												<motion.small
													initial={{ opacity: 0, width: 0 }}
													animate={{ opacity: 1, width: 'auto' }}
													css={`
														color: inherit;
														font-size: 60%;
													`}
												>
													,{decimalValue}
												</motion.small>
											)}
										</AnimatePresence>
									)}
								</span>{' '}
								tonnes
							</div>
							<div
								css={`
									background: #ffffff3d;
									border-radius: 0.6rem;
									padding: 0.4rem 1rem;
									> ul {
										padding: 0;
										margin: 0;
									}
									> div,
									li {
										display: flex;
										justify-content: space-between;
										flex-wrap: wrap;
									}
									li {
										padding: 0;
									}
									strong {
										font-weight: bold;
									}
									> img {
										margin: 0 0.6rem !important;
									}
								`}
							>
								<ul>
									<li>
										<span>{emoji('🇫🇷', 'France')} moyenne </span>{' '}
										<strong>
											{' '}
											<DefaultFootprint />{' '}
										</strong>
									</li>
									<li>
										<span>{emoji('🎯')} objectif </span>
										<strong>2 tonnes</strong>
									</li>
								</ul>
								{!headlessMode && (
									<div css="margin-top: .2rem;justify-content: flex-end !important">
										<a
											css="color: inherit"
											href="https://datagir.ademe.fr/blog/budget-empreinte-carbone-c-est-quoi/"
											target="_blank"
										>
											Comment ça ?
										</a>
									</div>
								)}
							</div>
						</div>
					</div>
					{!integratorActionText && (
						<ActionButton text="Passer à l'action" score={score} />
					)}
					<div css="padding: 1rem">
						<Chart
							noAnimation
							details={details}
							links
							color={textColor}
							noText
							noCompletion
							valueColor={textColor}
						/>
					</div>
				</div>
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

export const generateImageLink = (location) =>
	'https://aejkrqosjq.cloudimg.io/v7/' +
	location.origin +
	'/.netlify/functions/ending-screenshot?pageToScreenshot=' +
	encodeURIComponent(location)

export const DocumentationEndButton = ({ ruleName, color }) => (
	<div
		css={`
			margin-bottom: 0.6rem;
			${color && `a {color: ${color}}`}
		`}
	>
		<small>
			<Link to={'/documentation/' + encodeRuleName(ruleName)}>
				Comprendre le calcul{' '}
			</Link>
		</small>
	</div>
)
