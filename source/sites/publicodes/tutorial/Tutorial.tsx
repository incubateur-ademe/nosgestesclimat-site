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
import { useNavigate } from 'react-router-dom'
import HorizontalSwipe from '../HorizontalSwipe'
import Categories from './Categories'
import ClimateWarming from './ClimateWarming'
import Instructions from './Instructions'
import Target from './Target'
import Slide from './TutorialSlide'
import WarmingMeasure from './WarmingMeasure'

export default ({}) => {
	const navigate = useNavigate()
	const tutorials = useSelector((state: AppState) => state.tutorials)

	const tutos = Object.entries(tutorials)
		.map(([k, v]) => v != null && k.split('testIntro')[1])
		.filter(Boolean)

	const enquête = useSelector(enquêteSelector)
	const slides = createSlides(enquête)
	const index = tutos.length

	const { trackEvent } = useContext(MatomoContext)

	const skip = (name, unskip) => dispatch(skipTutorial(name, unskip))

	const last = index === slides.length - 1
	const next = () => {
		trackEvent(getMatomoEventParcoursTestTutorialProgress(last, index + 1))

		skip(last ? 'testIntro' : 'testIntro' + index)
		if (last) {
			navigate(`/simulateur/${MODEL_ROOT_RULE_NAME}`)
		}
	}
	const previous = () => dispatch(skipTutorial('testIntro' + (index - 1), true))

	useKeypress('Escape', false, () => skip('testIntro'), 'keyup', [])

	const Component = slides[index]

	const dispatch = useDispatch()

	// This results from a bug that introduced "slide5" in users' cache :/
	// Here we correct the bug in the user's cache
	useEffect(() => {
		if (Object.keys(tutorials).includes('testIntro5')) {
			dispatch(skipTutorial('testIntro'))
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
