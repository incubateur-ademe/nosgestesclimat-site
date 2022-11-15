import animate from 'Components/ui/animate'
import { TrackerContext } from 'Components/utils/withTracker'
import { utils } from 'publicodes'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { answeredQuestionsSelector } from 'Selectors/simulationSelectors'
import SlidesLayout from '../../../components/SlidesLayout'
import { useNextQuestions } from '../../../components/utils/useNextQuestion'
import { arrayLoopIteration } from '../../../utils'
import HorizontalSwipe from '../HorizontalSwipe'
import ActionSlide from './ActionSlide'
import Budget from './Budget'
import Catégories from './Catégories'
import IframeDataShareModal from './IframeDataShareModal'
import Petrogaz from './Petrogaz'
const { encodeRuleName } = utils

// details=a2.6t2.1s1.3l1.0b0.8f0.2n0.1
export const rehydrateDetails = (encodedDetails) =>
	encodedDetails &&
	encodedDetails
		.match(/[a-z][0-9]+\.[0-9][0-9]/g)
		.map(([category, ...rest]) => [category, 1000 * +rest.join('')])
		// Here we convert categories with an old name to the new one
		// 'biens divers' was renamed to 'divers'
		.map(([category, ...rest]) =>
			category === 'b' ? ['d', ...rest] : [category, ...rest]
		)

export const sumFromDetails = (details) =>
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

	const tracker = useContext(TrackerContext)

	const componentCorrespondence = {
		bilan: Budget,
		categories: Catégories,
		action: ActionSlide,
		petrogaz: Petrogaz,
	}
	console.log('slideName:', slideName)
	const componentKeys = Object.keys(componentCorrespondence)
	const Component = componentCorrespondence[slideName] || Budget

	const next = () => {
		setSearchParams({
			diapo: arrayLoopIteration(componentKeys, slideName),
			details: encodedDetails,
		}),
			tracker.push(['trackEvent', 'NGC', 'Swipe page de fin'])
	}

	const previous = () => {
		setSearchParams({
			diapo: arrayLoopIteration(componentKeys.slice().reverse(), slideName),
			details: encodedDetails,
		})

		tracker.push(['trackEvent', 'NGC', 'Swipe page de fin'])
	}
	const slideProps = {
		score,
		details: Object.fromEntries(rehydratedDetails),
		headlessMode,
		nextSlide: next,
	}

	const nextQuestions = useNextQuestions()
	console.log(nextQuestions)

	return (
		<div>
			<IframeDataShareModal data={rehydratedDetails} />
			<Link to="/simulateur/bilan" css="display: block; text-align: center">
				{!answeredQuestions.length ? (
					<button class="ui__ button plain cta">
						{' '}
						<Trans>Faire mon test</Trans>
					</button>
				) : nextQuestions.length > 1 ? (
					<button class="ui__ button plain">
						{' '}
						← <Trans>Revenir aux questions</Trans>
					</button>
				) : (
					<button className="ui__ simple small push-left button">
						{' '}
						← <Trans>Revenir au test</Trans>
					</button>
				)}
			</Link>
			<animate.appear>
				<SlidesLayout
					length={componentKeys.length}
					active={componentKeys.indexOf(slideName)}
				>
					<HorizontalSwipe {...{ next, previous }}>
						<Component {...slideProps} />
					</HorizontalSwipe>
				</SlidesLayout>
			</animate.appear>
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
				<Trans>Comprendre le calcul</Trans>{' '}
			</Link>
		</small>
	</div>
)
