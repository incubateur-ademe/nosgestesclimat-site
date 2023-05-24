import { skipTutorial } from '@/actions/actions'
import { getMatomoEventParcoursTestTutorialProgress } from '@/analytics/matomo-events'
import { MODEL_ROOT_RULE_NAME } from '@/components/publicodesUtils'
import SlidesLayout from '@/components/SlidesLayout'
import Meta from '@/components/utils/Meta'
import { MatomoContext } from '@/contexts/MatomoContext'
import useKeypress from '@/hooks/useKeyPress'
import { AppState } from '@/reducers/rootReducer'
import { enquêteSelector } from 'Enquête/enquêteSelector'
import { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { generateImageLink } from '../fin'
import HorizontalSwipe from '../HorizontalSwipe'
import Categories from './Categories'
import ClimateWarming from './ClimateWarming'
import Instructions from './Instructions'
import Target from './Target'
import Slide from './TutorialSlide'
import WarmingMeasure from './WarmingMeasure'

export default ({}) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const urlParams = new URLSearchParams(window.location.search)

	const fromRuleURLParam = urlParams.get('fromRuleURL')
	const targetUrl = fromRuleURLParam
		? fromRuleURLParam
		: `/simulateur/${MODEL_ROOT_RULE_NAME}`

	if (fromRuleURLParam) {
		// The tutorial is skipped when redirected from a specific rule URL
		// (e.g. /simulateur/bilan/logement/chauffage)
		// [tutorials.fromRule = 'skip']
		dispatch(skipTutorial('testIntro', false, 'skip'))
		return <Navigate to={targetUrl} replace />
	}

	const tutorials = useSelector((state: AppState) => state.tutorials)
	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const enquête = useSelector(enquêteSelector)
	const slides = createSlides(enquête)
	const index = tutos.length

	const { trackEvent } = useContext(MatomoContext)

	const skip = (name: string, unskip = false) =>
		dispatch(
			skipTutorial(
				name,
				unskip,
				tutorials.fromRule == 'skip'
					? // Returning to 'simulateur/bilan' after skipping the tutorial from a
					  // specific rule URL
					  'done'
					: tutorials.fromRule
			)
		)

	const last = index === slides.length - 1
	const next = () => {
		trackEvent(getMatomoEventParcoursTestTutorialProgress(last, index + 1))
		skip(last ? 'testIntro' : 'testIntro' + index)
		if (last) {
			navigate(targetUrl, { replace: true })
		}
	}
	const previous = () => skip('testIntro' + (index - 1), true)

	useKeypress('Escape', false, () => skip('testIntro'), 'keyup', [])

	const Component = slides[index]

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we correct the bug in the user's cache
	useEffect(() => {
		if (Object.keys(tutorials).includes('testIntro5')) {
			skip('testIntro')
		}
	}, [tutorials])

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we avoid an error
	if (null === slides[index]) {
		return null
	}

	// FIXME: cannot use useTranslation here...
	// const { t } = useTranslation()

	const title = 'Tutorial'
	const description =
		'Parcourez le tutoriel Nos Gestes Climat avant de débuter votre simulation.'

	return (
		<>
			<Meta
				title={title}
				description={description}
				image={generateImageLink(window.location)}
			/>
			<SlidesLayout length={slides.length} active={index}>
				<HorizontalSwipe {...{ next, previous }}>
					<Slide
						{...{
							last,
							skip,
							targetUrl,
						}}
					>
						<Component />
					</Slide>
				</HorizontalSwipe>
			</SlidesLayout>
		</>
	)
}

const createSlides = (noBias) => {
	if (noBias) {
		return [ClimateWarming, WarmingMeasure, Instructions]
	}
	return [ClimateWarming, WarmingMeasure, Target, Categories, Instructions]
}
