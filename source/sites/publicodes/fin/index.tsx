import Meta from '@/components/utils/Meta'
import animate from 'Components/ui/animate'
import { utils } from 'publicodes'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { answeredQuestionsSelector } from 'Selectors/simulationSelectors'
import { matomoEventSwipeEndPage } from '../../../analytics/matomo-events'
import { NewsletterForm } from '../../../components/emailing/NewsletterForm'
import NorthstarBanner from '../../../components/Feedback/NorthstarBanner'
import SlidesLayout from '../../../components/SlidesLayout'
import { MatomoContext } from '../../../contexts/MatomoContext'
import { useNextQuestions } from '../../../hooks/useNextQuestion'
import { arrayLoopIteration } from '../../../utils'
import EnqueteBannerContent from '../enquête/BannerContent'
import { enquêteSelector } from '../enquête/enquêteSelector'
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

const EnqueteReminder = () => <EnqueteBannerContent noFirstButton={true} />
export default ({}) => {
	const [searchParams, setSearchParams] = useSearchParams()
	const encodedDetails = searchParams.get('details')
	const slideName = searchParams.get('diapo') || 'bilan'

	const rehydratedDetails = rehydrateDetails(encodedDetails)

	const score = sumFromDetails(rehydratedDetails)
	const headlessMode =
		!window || window.navigator.userAgent.includes('HeadlessChrome')

	const answeredQuestions = useSelector(answeredQuestionsSelector)

	const { trackEvent } = useContext(MatomoContext)

	const enquête = useSelector(enquêteSelector)

	const componentCorrespondenceBasis = {
		bilan: Budget,
		categories: Catégories,
		action: ActionSlide,
		petrogaz: Petrogaz,
	}
	const componentCorrespondence = enquête
		? { ...componentCorrespondenceBasis, enquete: EnqueteReminder }
		: componentCorrespondenceBasis

	const componentKeys = Object.keys(componentCorrespondence)
	const Component = componentCorrespondence[slideName] || Budget

	const next = () => {
		setSearchParams({
			diapo: arrayLoopIteration(componentKeys, slideName),
			details: encodedDetails,
		}),
			trackEvent(matomoEventSwipeEndPage)
	}

	const previous = () => {
		setSearchParams({
			diapo: arrayLoopIteration(componentKeys.slice().reverse(), slideName),
			details: encodedDetails,
		})

		trackEvent(matomoEventSwipeEndPage)
	}
	const nextQuestions = useNextQuestions()

	const slideProps = {
		score,
		details: Object.fromEntries(rehydratedDetails),
		headlessMode,
		nextSlide: next,
		noQuestionsLeft: !nextQuestions.length,
	}
	const { t } = useTranslation()

	return (
		<div
			css={`
				position: relative;
			`}
		>
			{window.location.href.includes('fin') && (
				<Meta title={t('Mon empreinte carbone')}>
					<link
						rel="canonical"
						href="https://nosgestesclimat.fr/mon-empreinte-carbone"
					/>
				</Meta>
			)}

			<IframeDataShareModal data={rehydratedDetails} />
			<Link
				to="/simulateur/bilan"
				css={`
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 0.5rem;
				`}
			>
				{!answeredQuestions.length ? (
					<button
						className="ui__ button plain small cta"
						css={`
							text-transform: none !important;
							margin: 0 !important;
						`}
					>
						{' '}
						<Trans>Faire mon test</Trans>
					</button>
				) : nextQuestions.length > 1 ? (
					<button className="ui__ button plain">
						{' '}
						← <Trans>Revenir aux questions</Trans>
					</button>
				) : (
					<button
						className="ui__ small cta button"
						css={`
							text-transform: none !important;
							padding: 0 !important;
						`}
					>
						{' '}
						← <Trans>Revenir au test</Trans>
					</button>
				)}
			</Link>
			<NorthstarBanner type="SET_RATING_LEARNED" />
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
			<NewsletterForm />
		</div>
	)
}

export const generateImageLink = (location) =>
	`https://ogimager.osc-fr1.scalingo.io/capture/${encodeURIComponent(
		location
	)}/shareImage?timeout=5000`

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
